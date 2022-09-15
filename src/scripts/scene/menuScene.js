const MenuScene = new Phaser.Class({

  //The scene is noted.
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: 'MenuScene' });
  },
  preload: function () {
      //preload media for MenuScene here
  },
  create: function () {
      let txt1 = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 4,
        'Select Difficulty');
      txt1.setOrigin(.5);

      let dif1 = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 3, 
      'Cupu');
      dif1.setInteractive().on('pointerdown', function() {
        gameSetting.difficulty = "cupu"
        this.scene.scene.start('GameScene');
        // console.log("CUPU ASU")
      });
      dif1.setOrigin(.5);

      let dif2 = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2.6, 
        'Ultra Pro X Max');
      dif2.setInteractive().on('pointerdown', function() {
        gameSetting.difficulty = "promax"
        this.scene.scene.start('GameScene');
        // console.log("PRO")
      });
      dif2.setOrigin(.5);

  },
  update:function(){  

  }
});