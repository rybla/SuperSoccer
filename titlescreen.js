var Soccer = {};

Soccer.titlescreen = function (game) {

};

Soccer.titlescreen.prototype = {

	preload: function() {
		this.load.audio('titlemusic', 'assets/music/titlemusic.mp3');
		this.load.audio('explosionsound', 'assets/sounds/explosionsound.mp3');
		this.load.image('titlepage', 'assets/backgrounds/titlepage.png');
		this.load.image('playButton', 'assets/sprites/playButton.png');
		this.load.image('gofullButton', 'assets/sprites/gofullButton.png');
		this.load.spritesheet('explosion', 'assets/sprites/explosion.png', 100, 141, 17);
	},

	create: function () {
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio("titlemusic", true);
		this.music.play();

		this.add.sprite(0, 0, 'titlepage');

		this.playButton = this.add.button(500, 380, 'playButton', this.initStartGame, this);
		this.playButton.anchor.set(.5,.5);

		this.gofullButton = this.add.button(950,540, 'gofullButton', gofull, this);
		this.gofullButton.anchor.set(.5,.5);

		this.explosion = this.add.sprite(850,100,'explosion');
		this.rate = 7;
		this.explosion.animations.add('explode', [13,10,5,6,15,14,8,4,6,11,2,0,12,3,16,1], this.rate, false);
		this.explosion.visible = false;
		this.explosion.anchor.set(.5,.5);

		this.explosionsound = game.add.audio('explosionsound');

		this.exploding = false;
	},

	update: function () {

		//	Do some nice funky main menu effect here
		if(this.exploding) {
			this.explosion.width += 2;
			this.explosion.height += 2;
		}

	},


	stopMusic: function () {
		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();
	},

	explode: function () {
		// explosion
		this.explosion.visible = true;
		this.exploding = true;
		this.explosion.animations.play('explode', false);
		this.explosion.animations.currentAnim.onComplete.add(this.startGame, this);
		this.explosionsound.play();

	},

	initStartGame: function (pointer) {	

		this.stopMusic();	
		this.explode();

	},

	startGame: function () {
		//	And start the actual game
		this.state.start('game');
	},

};