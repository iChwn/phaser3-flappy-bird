let isGameStarted = false;
let bird;
let platform;
let cursors;
let keys = {};
const paddleSpeed = 1000
let player1Score;
let gameSceneProp;
let isPressSpace = false;
let tiltPlatform;

let pipePositionX = 450;
let pipePositionY = 470;
let pipeDownSprite;
let pipeTopSprite;
let initCounter = false;

var typingTimer;
var doneTypingInterval = 500; 

const {difficulty, paddleConfig} = gameSetting

let PipeDownClass = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function PipeDownClass(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "pipe-green-bottom");
  }
})

let PipeTopClass = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function PipeTopClass(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "pipe-green-top");
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
    this.load.image("pipe-green-bottom", "./src/assets/images/pipe-green-bottom.png")
    this.load.image("pipe-green-top", "./src/assets/images/pipe-green-top.png")
    this.load.image("red", "./src/assets/images/red.png")
  },
  create: function () {
    pauseScreen("GameScene", gameSceneProp)

    pipeDownSprite = this.physics.add.group({
      classType: PipeDownClass,
      runChildrenUpdate: true,
      allowGravity: false,
      immovable: true
    })

    pipeTopSprite = this.physics.add.group({
      classType: PipeTopClass,
      runChildrenUpdate: true,
      allowGravity: false,
      immovable: true
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
    platform.setDepth(1)

    tiltPlatform = this.add.tileSprite(this.cameras.main.width / 2, platform.body.y, 450, platform.body.height - 25, "platform");
    tiltPlatform.setDepth(2)
    
    bird = this.physics.add.sprite(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2.2,
      "bird-mid-flap"
    )
    bird.displayHeight = 30
    bird.displayWidth = 40
    bird.setDepth(3)
    bird.setGravity(0, 1000)
    bird.setCollideWorldBounds(true);
    bird.setBounce(1,1);
  
    player1Score = this.add.text(this.physics.world.bounds.width - 130, 20, `Score: 0`);  
    player1Score.setDepth(1)
  
    cursors = this.input.keyboard.createCursorKeys();
    keys.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keys.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keys.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
    // this.physics.add.collider(bird, player1, () => console.log("hit"), null, this)
    this.physics.add.collider(bird, platform, null, null, this)
    this.physics.add.collider(bird, pipeDownSprite, () => setWinnerText(this, "Game Over"), null, this)
    this.physics.add.collider(bird, pipeTopSprite, () => setWinnerText(this, "Game Over"), null, this)
  },
  update: function (time, delta) {
    if(time > 2000) {
      if(time > 3000) {
        player1Score.setText('Score: ' + (msToS(time) - 2));
        player1Score.setDepth(2)
      }
      let randomY = randomNumber(50, 100)

      pipeTopSprite.get().setActive(true).setVisible(true).setPosition(pipePositionX, randomY)
      pipeTopSprite.setVelocityX(-210)

      pipeDownSprite.get().setActive(true).setVisible(true).setPosition(pipePositionX, pipePositionY + randomY)
      pipeDownSprite.setVelocityX(-210)
      pipePositionX += 200
    }
    
    tiltPlatform.tilePositionX += 2;

    if(bird.body.y > platform.body.y - 35) {
      setWinnerText(this, "Game Over")
    }

    if(!isPressSpace) {
      if(keys.space.isDown) {
        clearTimeout(typingTimer);
        rotateBird({self: this, target: bird, direction: -30, duration: 100}) 
        isPressSpace = true
        bird.setVelocityY(-400)
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
          rotateBird({self, target: bird, direction: 60, duration: 100})
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

function rotateBird({self, target, direction, duration}) {
  self.tweens.add({
    targets: target,
    angle: direction,
    ease: "Linear", // 'Cubic', 'Elastic', 'Bounce', 'Back'
    duration: duration,
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
  player1Score.setText('Score: 0');
}

function handlebirdSpeed(bird, player) {
  const pSpeed = player === "p1" ? -paddleSpeed : paddleSpeed
  const counterSpeed = player === "p1" ? -70 : 70
  const logic = player === "p1" ? ">" : "<"
  const isValid = eval(bird.body.velocity.x + logic + pSpeed);

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
  // bird.body.y = 620
  
  pauseScreen("pause")
  // gameSceneProp.scene.launch('RetryScene');
}