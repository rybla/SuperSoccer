Soccer.endingscreen = function (game) {

};

Soccer.endingscreen.prototype = {

	preload: function() {
		this.load.audio('endingmusic', 'assets/music/endingmusic.mp3');
		this.load.audio('explosionsound', 'assets/sounds/explosionsound.mp3');

		this.load.image('endingpage1', 'assets/backgrounds/endingpage1.png');
		this.load.image('endingpage2', 'assets/backgrounds/endingpage2.png');
		this.load.spritesheet('explosion', 'assets/sprites/explosion.png', 100, 141, 17);

		this.load.image('replayButton', 'assets/sprites/replayButton.png');
		this.load.image('gofullButton', 'assets/sprites/gofullButton.png');

		game.load.spritesheet('player1', 'assets/sprites/player1.png', 60, 60, 18);
    	game.load.spritesheet('player2', 'assets/sprites/player2.png', 60, 60, 18);	
	},

	create: function () {
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		this.music = this.add.audio("endingmusic", true);
		this.music.play();

		this.endingpage1 = this.add.sprite(0, 0, 'endingpage1');
		this.endingpage1.visible = false;
		this.endingpage2 = this.add.sprite(0, 0, 'endingpage2');
		this.endingpage2.visible = false;

		this.player1 = this.add.sprite(0,0,'player1');
		this.player1.anchor.set(.5,.5);
		this.player2 = this.add.sprite(0,0,'player2');
		this.player2.anchor.set(.5,.5);

		// 814,404 - 1st

		// 117,145 - 2nd

		this.firstplace = [830,110,4];
		this.secondplace = [117,418,1];

		this.score2 = this.add.text(474,480," ");

		this.animframerate = 15;

		console.log("Winner: " + winner)

		if(winner+1 == 1) {
			this.endingpage1.visible = true;
			this.player1.x = this.firstplace[0]; this.player1.y = this.firstplace[1];
			this.player1.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], this.animframerate, true);
			this.player1.animations.play('left', true);
			this.player1.height*=this.firstplace[2];
			this.player1.width*=this.firstplace[2];
			
			this.player2.x = this.secondplace[0]; this.player2.y = this.secondplace[1];
			this.player2.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], this.animframerate, true);
			this.player2.animations.play('right',true);
			this.player2.height*=this.secondplace[2];
			this.player2.width*=this.secondplace[2];
			this.score2.text = score[1];
		} else if(winner+1 == 2) {
			this.endingpage2.visible = true;

			this.player1.x = this.secondplace[0]; this.player1.y = this.secondplace[1];
			this.player1.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], this.animframerate, true);
			this.player1.animations.play('right',true);
			this.player1.height*=this.secondplace[2];
			this.player1.width*=this.secondplace[2];

			this.player2.x = this.firstplace[0]; this.player2.y = this.firstplace[1];
			this.player2.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], this.animframerate, true);
			this.player2.animations.play('left', true);
			this.player2.height*=this.firstplace[2];
			this.player2.width*=this.firstplace[2];
			this.score2.text = score[0];
		}

		this.replayButton = this.add.button(500, 380, 'replayButton', this.initStartGame, this);


		
		this.explosion = this.add.sprite(850,100,'explosion');
		this.rate = 7;
		this.explosion.animations.add('explode', [13,10,5,6,15,14,8,4,6,11,2,0,12,3,16,1], this.rate, false);
		this.explosion.visible = false;
		this.explosion.anchor.set(.5,.5);

		this.explosionsound = game.add.audio('explosionsound');

		this.exploding = false;

		this.gofullButton = this.add.button(950,540, 'gofullButton', gofull, this);
		this.gofullButton.anchor.set(.5,.5);
	},

	update: function () {
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
		score[0] = 0;
		score[1] = 0;
		resetGame();
		this.state.start('game');
	}

};