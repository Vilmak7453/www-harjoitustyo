"use strict";
//This game is based on Phaser's official tutorial and uses its assets.
//https://phaser.io/tutorials/making-your-first-phaser-3-game (visited 14.11.2018)

import request from 'superagent';
import metolib from '@fmidev/metolib';

//Set configurations for the game
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "gamecontainer",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 }, //How fast object fall
            debug: false
        }
    },
    scene: {
        preload: preload, //Set functions
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var score = 0;
var scoreText;
var platforms;
var stars;
var bombs;
var player;

function preload() {

    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
   
   this.add.image(400, 300, "sky");

   scoreText = this.add.text(16, 16, "Score: 0", {fontSize: "33px", fill: "#000" });

   platforms = this.physics.add.staticGroup();
   platforms.create(400, 568, "ground").setScale(2).refreshBody();
   platforms.create(600, 400, "ground");
   platforms.create(50, 250, "ground");
   platforms.create(750, 220, "ground");

   stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70}
   });
   stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); //Stars will bounce for a while
   });
   this.physics.add.collider(stars, platforms);

   bombs = this.physics.add.group();
   this.physics.add.collider(bombs, platforms);

   player = this.physics.add.sprite(100, 450, "dude");
   player.setBounce(0.2);
   player.setCollideWorldBounds(true);
   player.body.setGravityY(300);
   this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3}),
    frameRate: 10,
    repeat: -1
   });
   this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
   });
   this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8}),
    frameRate: 10,
    repeat: -1
   });
   this.physics.add.collider(player, platforms);
   this.physics.add.overlap(player, stars, collectStar, null, this);
   this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {

    var cursors = this.input.keyboard.createCursorKeys();

    if(cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play("left", true);
    }
    else if(cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play("right", true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play("turn");
    }

    if(cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-500);
    }

}

function collectStar(player, star) {

    star.disableBody(true, true);
    score += 10;
    scoreText.setText("Score: " + score);

    //When all stars are collected, create/show and drop them again
    if(stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    }
        var x = (player.x < 400) ? 
        Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      
        //Create new bomb other side of the map
        var bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200),20);
        bomb.allowGravity = false;
}

function hitBomb(player, bomb) {

    //Stop game
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");

    //Fetch apikey for ilmatieteenlaitos so that weather data can be fetched
    request
    .get('/apiKey')
    .then((res) => {
      //If there are no apikey, save score without temperature
      if(res.body.apikey === "" || res.body.apikey === undefined) {
        request
        .post("/game/saveScore")
        .type('json')
        .send({ score: score })
        .end();
      }
      else {
        var apiKey = res.body.apikey;
        var wfsParser = new metolib.WfsRequestParser();

        //Find Lappeenranta's temperature's most recent value
        wfsParser.getData({
          url: "https://data.fmi.fi/fmi-apikey/" + apiKey + "/wfs",
          storedQueryId: "fmi::observations::weather::multipointcoverage",
          requestParameter: "temperature",
          sites: "Lappeenranta",
          begin: new Date((new Date()).getTime() - 60*60*1000),
          end: new Date(),
          timestep: 60*60*1000,
          callback: function(data, errors) {

            if(errors === [])
              console.log(errors);
            else {
              var timeValuePairs = data.locations[0].data.temperature.timeValuePairs;
              var temperature;
              var regex = RegExp("^[0-9.\-]+$");

              //Last value is most likely NaN, so take last number
              for(var i = 0; i < timeValuePairs.length; i++) {
                if(regex.test(timeValuePairs[i].value))
                  temperature = timeValuePairs[i].value;
              }

              request
              .post("/game/saveScore")
              .type('json')
              .send({ score: score, temp: temperature })
              .end();
            }
          }
        });
      }
    });
}
