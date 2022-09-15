let isGameStarted = false;
let bird;
let platform;
let player1;
let player2;
let cursors;
let keys = {};
const paddleSpeed = 1000
let player1Score;
let player2Score;
let gameSceneProp;
let isPressSpace = false;
let tiltPlatform;

let pipePositionX = 300;
let pipePositionY = 470;
let pipeDownSprite;

var typingTimer;
var doneTypingInterval = 500; 

const {difficulty, paddleConfig} = gameSetting

let PipeDownClass = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function PipeDownClass(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "pipe-green");
  }
})

const GameScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    gameSceneProp = this
    Phaser.Scene.call(this, { key: 'GameScene' });
    console.log(this)
  },
  init: function (data) {
    console.log("INIT GAME SCENE")
  },
  preload: function () {
    this.load.image("game-bg", "./src/assets/images/background-day.png")
    this.load.image("platform", "./src/assets/images/base.png")
    this.load.image("bird-mid-flap", "./src/assets/images/yellowbird-midflap.png")
    this.load.image("bird-up-flap", "./src/assets/images/yellowbird-downflap.png")
    this.load.image("bird-down-flap", "./src/assets/images/yellowbird-upflap.png")
    this.load.image("pipe-green", "./src/assets/images/pipe-green.png")
    this.load.image("red", "./src/assets/images/red.png")
  },
  create: function () {
    pauseScreen("GameScene", gameSceneProp)

    pipeDownSprite = this.physics.add.group({
      classType: PipeDownClass,
      runChildrenUpdate: true,
      allowGravity: false
    })

    let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'game-bg')
    let scaleX = this.cameras.main.width / bg.width
    let scaleY = this.cameras.main.height / bg.height
    let scale = Math.max(scaleX, scaleY)
    bg.setScale(scale).setScrollFactor(0)

    platform = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 1.03, "platform")
    platform.displayHeight = 120;
    platform.displayWidth = this.cameras.main.width;
    platform.setCollideWorldBounds(true);
    platform.setImmovable(true)

    console.log(platform)
    tiltPlatform = this.add.tileSprite(this.cameras.main.width / 2, platform.body.y, 450, platform.body.height - 25, "platform");
    tiltPlatform.setDepth(1)
    
    bird = this.physics.add.sprite(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "bird-mid-flap"
    )
    bird.displayHeight = 30
    bird.displayWidth = 40
    // bird.setDepth(2)
    bird.setGravity(0, 500)
    bird.setCollideWorldBounds(true);
    bird.setBounce(1,1);
  
    player1 = this.physics.add.sprite(
      this.physics.world.bounds.width - (bird.body.width / 2 + 1),
      this.physics.world.bounds.height / 2,
      "paddle"
    )
    player1.displayHeight = paddleConfig.paddleLength[gameSetting.difficulty]
    player1.setCollideWorldBounds(true);
    player1.setImmovable(true)

    player1Score = this.add.text(this.physics.world.bounds.width - 130, 20, `Score P1: ${gameScore.player1}`);  
    player2Score = this.add.text(20, 20, `Score P2: ${gameScore.player2}`);
  
    player2 = this.physics.add.sprite(
      bird.body.width / 2 + 1,
      this.physics.world.bounds.height / 2,
      "paddle"
    )
    player2.displayHeight = paddleConfig.paddleLength[gameSetting.difficulty]
    player2.setCollideWorldBounds(true);
    player2.setImmovable(true)
  
    cursors = this.input.keyboard.createCursorKeys();
    keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keys.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
    // this.physics.add.collider(bird, player1, () => console.log("hit"), null, this)
    this.physics.add.collider(bird, platform, null, null, this)
    this.physics.add.collider(bird, pipeDownSprite, () => console.log("TT"), null, this)
    // this.physics.add.collider(bird, player1, colliderP1Callback, null, this)
    // this.physics.add.collider(bird, player2, colliderP2Callback, null, this)
  },
  update: function (time, delta) {
    if(time%9 === 0) {
      if(time%6 === 0) {
        pipeDownSprite.get().setActive(true).setVisible(true).setPosition(pipePositionX, pipePositionY)
      } else {
        pipeDownSprite.get().setActive(true).setVisible(true).setPosition(pipePositionX+100, pipePositionY+40)
      }

      pipeDownSprite.setVelocityX(-100)
      pipePositionX += 100
    }
    

 
    
    tiltPlatform.tilePositionX += 2;
    // if(!isGameStarted) {
    //   const initialVeloY = (Math.random() * 300) + 100;
    //   const initialVeloX = (Math.random() * 300) + 100;
    //   bird.setVelocityX(initialVeloX)
    //   bird.setVelocityY(initialVeloY)
    //   isGameStarted = true
    // }
    
    if(bird.body.y > platform.body.y - 35) {
      // gameScore.player2 = gameScore.player2 + 1
      setWinnerText(this, "Game Over")
    }
    // if(bird.body.x < player2.body.x) {
    //   gameScore.player1 = gameScore.player1 + 1     
    //   setWinnerText(this, "Player 1 Win")
    // }
  
    player1.body.setVelocityY(0)  
    player2.body.setVelocityY(0)
  
    player1.body.setVelocityY(bird.body.velocity.y)
    player2.body.setVelocityY(bird.body.velocity.y)
  
    if(cursors.up.isDown) {
      player1.body.setVelocityY(-paddleSpeed)
    }
    if(cursors.down.isDown) {
      player1.body.setVelocityY(paddleSpeed)
    }
    if(keys.w.isDown) {
      player2.body.setVelocityY(-paddleSpeed)
    }
    if(keys.s.isDown) {
      player2.body.setVelocityY(paddleSpeed)
    }
    if(keys.s.isDown) {
      player2.body.setVelocityY(paddleSpeed)
    }

    // console.log(bird.body.velocity.y) 

    if(!isPressSpace) {
      if(keys.space.isDown) {
        clearTimeout(typingTimer);
        rotateBird({self: this, target: bird, direction: -30}) 
        isPressSpace = true
        bird.setVelocityY(-250)
        bird.setTexture("bird-up-flap")
      }   
    } else {
      if(keys.space.isUp) {
        let self = this
        isPressSpace = false
        bird.setTexture("bird-mid-flap")
        
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          bird.setTexture("bird-down-flap")
          rotateBird({self, target: bird, direction: 60})
        }, doneTypingInterval);
        // console.log("UNHOLD")
      }   
    }
  
    // if(bird.body.velocity.y > paddleSpeed) {
    //   console.log("bird max speed")
    //   bird.body.setVelocityY(-paddleSpeed)
    // }
  },
});

function rotateBird({self, target, direction}) {
  self.tweens.add({
    targets: target,
    angle: direction,
    ease: "Linear", // 'Cubic', 'Elastic', 'Bounce', 'Back'
    duration: 100,
    repeat: 0,
    yoyo: false
  });
}

function colliderP1Callback() {
  handlebirdSpeed(bird, "p1")
  setParticle(this, bird, "red")
}

function colliderP2Callback() {
  handlebirdSpeed(bird, "p2")
  setParticle(this, bird, "blue")
}

function renderScore() {
  player1Score.setText('Score P1: ' + gameScore.player1);
  player2Score.setText('Score P2: ' + gameScore.player2);
}

function handlebirdSpeed(bird, player) {
  const pSpeed = player === "p1" ? -paddleSpeed : paddleSpeed
  const counterSpeed = player === "p1" ? -70 : 70
  const logic = player === "p1" ? ">" : "<"
  const isValid = eval(bird.body.velocity.x + logic + pSpeed);

  console.log(bird.body.velocity.x)
  if(isValid) {
    bird.setVelocityX(bird.body.velocity.x + counterSpeed)
    bird.setVelocityY(bird.body.velocity.y + counterSpeed)
  }
}

let emitter;
let particles;
function setParticle(self, element, color) {
  if(emitter) {
    emitter.stop()
    // particles.destroy()
  }

  particles = self.add.particles(color);
  emitter = particles.createEmitter({
    speed: 50,
    scale: { start: 1, end: 0 },
    blendMode: "ADD"
  });
  emitter.startFollow(element);
  // emitter.setAlpha(function (p, k, t) {
  //   return 1 - 2 * Math.abs(t - 0.5);
  // });

  self.time.delayedCall(1000, function() {
    emitter.stop()
  });
}

function setWinnerText(self, victoryText) {
  let data = self
  isGameStarted = false
  bird.body.setVelocityX(0)
  bird.body.setVelocityY(0)
  renderScore() 
  
  let playerVictoryTex = data.add.text(
    data.physics.world.bounds.width / 2,
    data.physics.world.bounds.height / 2,
    victoryText
  )
  playerVictoryTex.setOrigin(.5);
  
  pauseScreen("pause")
  gameSceneProp.scene.launch('RetryScene');


  // let retry = data.add.text(
  //   data.physics.world.bounds.width / 2,
  //   data.physics.world.bounds.height / 1.6,
  //   "Retry?"
  // )
  // retry.setOrigin(.5);

  // let mainMenu = data.add.text(
  //   data.physics.world.bounds.width / 2,
  //   data.physics.world.bounds.height / 1.4,
  //   "Main Menu"
  // )
  // mainMenu.setInteractive().on('pointerdown', function() {
  //   console.log(data)
  //   data.scene.scene.start('MenuScene');
  // });
  // mainMenu.setOrigin(.5);

}