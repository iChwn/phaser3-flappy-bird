const RetryScene = new Phaser.Class({

  //The scene is noted.
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'RetryScene' });
  },
  preload: function () {
      //preload media for RetryScene here
  },
  create: function () {
      let restart = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 1.5, 
        'Retry?');

      restart.setInteractive().on('pointerdown', function() {
        this.scene.scene.start('GameScene');
      });
      restart.setOrigin(.5);

      // let mainMenu = this.add.text(400,390, 'Main Menu?');
      // mainMenu.setInteractive().on('pointerdown', function() {
      //   this.scene.scene.start('MenuScene');
      //   gameSceneProp.scene.destroy("GameScene")
      // });
      // mainMenu.setOrigin(.5);
  },
  update:function(){  

  }
});