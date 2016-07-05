Soccer.game = function(game) {}

Soccer.game.prototype = {


    preload: function () {
        preloadfunc();
    },

    create: function () {
        createfunc();
    },

    update: function () {
        updatefunc();
    },

}

// var game = new Phaser.Game(1000, 563, Phaser.CANVAS, 'game', {
//     preload: preload,
//     create: create,
//     update: update
// });

var player = [0, 0];
var startx = [100, 900];
var starty = 410;
var facing = ['right', 'left'];
var pad = [0, 0];
var boostcooldown = [0, 0];

var score = [0, 0];
var scoretext = [0, 0];
var goal = [0, 0];

var lastkick = null;

var ballMaterial;
var playerMaterial;
var worldMaterial;
var contactBallWithBounds;

var countDownText = " ";

var emitter = [0, 0];
var boostchargedemitter = [0, 0];
var ballemitter = [0, 0];

// axis(2) (-1)<– –>(1)
// axis(3) (1)v ^(-1)

var ground;
var ball;

var animframerate = 30;
var speed = 700;
var gravity = 2000;
var cursoroffset = 30;
var playerxadjust = 5;
var jumpdelay = 5;
var jumpspeed = 400;
var kickx = 1000;
var kickup = 500;
var kickdown = 1500;
var boostmagnitude = 3;
var maxvelocity = 2000;

var input;
var physics;

var pointscap = 20;

function preloadfunc() {

    // game.load.image('background', 'assets/games/starstruck/background2.png');
    game.load.spritesheet('player1', 'assets/sprites/player1.png', 60, 60, 18);
    game.load.spritesheet('player2', 'assets/sprites/player2.png', 60, 60, 18);
    game.load.image('cursor1', 'assets/sprites/cursor1.png');
    game.load.image('cursor2', 'assets/sprites/cursor2.png');
    game.load.image('background', 'assets/environment/background.jpg');
    game.load.image('ground', 'assets/environment/ground.png');
    game.load.image('ball', 'assets/sprites/ball.png');

    game.load.image('rocketdust10', 'assets/particles/rocketdust10.png');
    game.load.image('rocketdust20', 'assets/particles/rocketdust20.png');
    game.load.image('rocketdust30', 'assets/particles/rocketdust30.png');

    game.load.image('rocketdust11', 'assets/particles/rocketdust11.png');
    game.load.image('rocketdust21', 'assets/particles/rocketdust21.png');
    game.load.image('rocketdust31', 'assets/particles/rocketdust31.png');

    game.load.image('boostcharged1', 'assets/particles/boostcharged1.png');
    game.load.image('boostcharged2', 'assets/particles/boostcharged2.png');

    game.load.image('goal1', 'assets/sprites/goal1.png');
    game.load.image('goal2', 'assets/sprites/goal2.png');

    game.load.image('blueparticles', 'assets/particles/rocketdust20.png');
    game.load.image('redparticles', 'assets/particles/rocketdust11.png');

    game.load.audio('kick', 'assets/sounds/kick.mp3');
    game.load.audio('hitwall', 'assets/sounds/hitwall.wav');
    game.load.audio('score', 'assets/sounds/score.mp3');
    game.load.audio('startcount', 'assets/sounds/startcount.mp3');
    game.load.audio('startstart', 'assets/sounds/startstart.mp3');
    // game.load.audio('boost', 'assets/sounds/boost.wav');
    // game.load.audio('rocket', 'assets/rocket.wav');
}

function createfunc() {

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.input.onDown.add(gofull, this);

    // pads
    game.input.gamepad.start();

    pad[0] = game.input.gamepad.pad1;
    pad[1] = game.input.gamepad.pad2;

    input = PSController.startController(PSController.PS3);

    // setup
    game.physics.startSystem(Phaser.Physics.P2JS);
    physics = game.physics.p2;

    game.time.desiredFps = 30;

    ground = game.add.sprite(500, 437 + (126 / 2), 'ground');
    physics.enable(ground, false);
    ground.body.static = true;
    ground.body.collideWorldBounds = true;

    game.add.sprite(0, 0, 'background');

    var x = 0;
    while (x < 2) {
        player[x] = game.add.sprite(startx[x], starty, 'player' + (x + 1));
        physics.enable(player[x], false);
        player[x].body.collideWorldBounds = true;
        player[x].body.fixedRotation = true;
        player[x].body.mass = 5;
        player[x].body.damping = .99;
        player[x].body.clearShapes();
        player[x].body.addCapsule(53 - 16, 8, -3, 0, Math.PI / 2);

        player[x].animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], animframerate, true);
        
        player[x].animations.add('leftstill', [17], animframerate, true);
        player[x].animations.add('rightstill', [16], animframerate, true);

        player[x].animations.play('rightstill', true, false);
        x++;
    }
    player[1].animations.play('leftstill');

    // gravity
    physics.applyGravity = true;
    physics.gravity.y = gravity;

    // ballemitters
    var k = 0;
    while(k<2) {
        ballemitter[k] = game.add.emitter(0, 0, 200);
        if(k==0) ballemitter[k].makeParticles("blueparticles");
        if(k==1) ballemitter[k].makeParticles("redparticles");
        ballemitter[k].gravity = 0;
        ballemitter[k].setXSpeed(0, 0);
        ballemitter[k].setYSpeed(0, 0);
        ballemitter[k].setRotation(0, 0);
        k++;
    }

    // ball
    ball = game.add.sprite(500, game.halfHeight, 'ball');
    physics.enable(ball, false);
    ball.body.collideWorldBounds = true;
    ball.body.mass = 1;
    ball.body.clearShapes();
    ball.body.addCircle(10);

    // rocket emitter
    var i = 0;
    while (i < 2) {
        emitter[i] = game.add.emitter(player[i].body.x, player[i].body.y, 100);
        emitter[i].makeParticles(['rocketdust1' + i, 'rocketdust2' + i, 'rocketdust3' + i]);

        boostchargedemitter[i] = game.add.emitter(player[i].body.x, player[i].body.y, 100);
        boostchargedemitter[i].makeParticles(['boostcharged' + (i+1)]);

        i++;
    }

    // goals
    var j = 0;
    while (j < 2) {
        goal[j] = game.add.sprite(0 + (1000 * j), game.height - 300, 'goal' + (j + 1))
        physics.enable(goal[j], false);
        goal[j].body.collideWorldBounds = false;
        goal[j].body.static = true;
        j++;
    }

    // contact materials
    initContactMaterials();

    // countdowntext
    countDownText = game.add.text(game.width / 2, game.height / 2, countDownText, {fontWeight: "bold", fontSize: 50, fill: 'black'});
    countDownText.anchor.set(.5,.5)
    countDownText.visible = false;

    // scoretext
    scoretext[0] = game.add.text(game.width/2 - 100, 40, score[0], {fontWeight: "bold", fontSize: 40, fill: 'red'})
    scoretext[0].anchor.set(.5,.5);
    scoretext[1] = game.add.text(game.width/2 + 100, 40, score[1], {fontWeight: "bold", fontSize: 40, fill: 'blue'})
    scoretext[1].anchor.set(.5,.5);

    initSounds();

}

var countingDown = true;
var countDownCount = 3;
var countDownTimer = 0;

function updatefunc() {

    if (countingDown) {
        // console.log("Counting Down"); 
        console.log("Count: " + countDownCount);
        processCountDown();
    } else {
        var i = 0;
        while (i < 2) {
            updatePlayerMovement(i);
            updateGoal(i);
            i++;
        }
        if(lastkick != null) {
            // ball emitter stuff
            ballemitter[lastkick].start(true, 500, null, 5);
        }
        
    }
}

var kickradius = 50;

function updatePlayerMovement(x) {

    if (pad[x].buttonValue(0) == 1) {
        jump(x);
    }

    if(pad[x].buttonValue(1) == 1) {
        endGame(x);
    }

    if (pad[x].buttonValue(5) == 1 && Math.abs(player[x].x - ball.x) < kickradius && Math.abs(player[x].y - ball.y) < kickradius) {
        processKick(x);
    }

    if(pad[x].buttonValue(4) == 1 && boostcooldown[x] == 0) {
        boost(x);
    }

    if(boostcooldown[x] > 0) {
        boostcooldown[x]--;
    } else {
        boostcharged(x)
    }

    if (pad[x].axis(PSController.LEFT_JOYSTICK_HORIZONTAL) < 0) {
        if(Math.abs(player[x].body.velocity.x) < speed) player[x].body.velocity.x = -speed * Math.abs(pad[x].axis(PSController.LEFT_JOYSTICK_HORIZONTAL));

        if (facing[x] != 'left') {
            player[x].animations.play('left', true);
            facing[x] = 'left';
        }
    } else if (pad[x].axis(PSController.LEFT_JOYSTICK_HORIZONTAL) > 0) {
        if(Math.abs(player[x].body.velocity.x) < speed) player[x].body.velocity.x = speed * Math.abs(pad[x].axis(PSController.LEFT_JOYSTICK_HORIZONTAL));

        if (facing[x] != 'right') {
            player[x].animations.play('right', true);
            facing[x] = 'right'
        }
    } else {
        if (facing[x] != 'idle') {
            player[x].animations.stop();

            if (facing[x] == 'left') {
                player[x].animations.play('leftstill');
            } else {
                player[x].animations.play('rightstill', true, false);
            }

            facing[x] = 'idle';
        }
    }

    emitter[x].x = player[x].x - 5;
    emitter[x].y = player[x].y + 20;

    boostchargedemitter[x].x = player[x].x - 5;
    boostchargedemitter[x].y = player[x].y + 20;

    ballemitter[x].x = ball.x;
    ballemitter[x].y = ball.y;
}

function jump(x) {
    if(player[x].body.velocity.y < -jumpspeed);
    player[x].body.velocity.y = -jumpspeed;
    shootDust(x);
}

function boost(x) {
    player[x].body.velocity.x *= boostmagnitude;
    player[x].body.velocity.y *= boostmagnitude;
    boostchargedemitter[x].start(true, 500, null, 10);
    boostcooldown[x] = 50;
}

function boostcharged(x) {
    boostchargedemitter[x].start(true, 20, null, 5);
}

function shootDust(x) {
    emitter[x].start(true, 300, null, 10);
}

function processKick(x) {
    var distx = player[x].x - ball.x;
    var disty = player[x].y - ball.y;

    ball.body.velocity.x = kickx * -distx/Math.abs(distx);
    ball.body.velocity.y = disty > -player[x].height/2 ? -kickup : kickdown;

    playSound('kick');

    lastkick = x;
}

function updateGoal(x) {
    if (x == 0) {
        if (ball.x <= 15) {
            if (ball.y <= goal[x].y + goal[x].height / 2 && ball.y >= goal[x].y - goal[x].height / 2) Score(x);
        }
    } else if (x == 1) {
        if (ball.x >= 985) {
            if (ball.y <= goal[x].y + goal[x].height / 2 && ball.y >= goal[x].y - goal[x].height / 2) Score(x);
        }
    }
}

function Score(x) {
    if(x == 1) {
        score[0]++;
    } else {
        score[1]++;
    }
    scoretext[0].text = score[0];
    scoretext[1].text = score[1];
    playSound('score');

    if(score[0] >= pointscap) {
        endGame(0);
    } else if(score[1] >= pointscap) {
        endGame(1);
    } else {
        resetGame();
    }   
}

function resetGame() {
    player[0].reset(startx[0],starty);
    player[1].reset(startx[1],starty);
    player[1].animations.play('leftstill');

    ball.reset(500,0);

    countDownCount = 3;
    countDownTimer = 0;

    countDown();
}

function countDown() {
    countingDown = true;
}

var ss = true;

function processCountDown() {
    if(ss) { playSound('startcount'); ss=false }
    countDownText.visible = true;
    updateCountDownDisplay();
    countDownTimer++;
    if (countDownTimer >= 30) {
        countDownCount--;
        countDownTimer = 0;
        playSound('startcount');
    }
    if (countDownCount <= 0) {
        countingDown = false;
        countDownText.visible = false;
        player[0].reset(startx[0],starty);
        player[1].reset(startx[1],starty);
        playSound('startstart');
        ss = true;
    }
}

function updateCountDownDisplay() {
    countDownText.text = countDownCount;
}

function initContactMaterials() {

    ballMaterial = physics.createMaterial('ballMaterial', ball.body);
    playerMaterial = physics.createMaterial('playerMaterial');
    player[0].body.setMaterial(playerMaterial);
    player[1].body.setMaterial(playerMaterial);
    worldMaterial = physics.createMaterial('worldMaterial');
    physics.setWorldMaterial(worldMaterial, true, true, true, true);
    ground.body.setMaterial(worldMaterial);

    contactBallWithBounds = physics.createContactMaterial(ballMaterial, worldMaterial);
    contactBallWithBounds.friction = .3;
    contactBallWithBounds.restitution = .7;
    contactBallWithBounds.stiffness = 1e7;
    contactBallWithBounds.relaxation = .3;
    contactBallWithBounds.frictionStiffness = 1e7;
    contactBallWithBounds.frictionRelaxation = 3;
    contactBallWithBounds.surfaceVelocity = 0;

    // Phaser.Physics.p2.setPostBroadPhaseCallback(postBroadPhaseCallback, this);

}

function postBroadPhaseCallback(body1, body2) {

    if((body1.sprite.name == 'ball' && body2.sprite.name == 'ground') || (body2.sprite.name == 'ball' && body1.sprite.name == 'ground')) {
        playSound('hitwall');
    }

    return true;

}

function gofull() {
    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }
}


var soundkick;
var soundhitwall;
var soundscore;
var soundstartcount;
var soundstartstart;

var sounds;

function initSounds() {

    soundkick = game.add.audio('kick');
    soundhitwall = game.add.audio('hitwall');
    soundscore = game.add.audio('score');
    soundstartcount = game.add.audio('startcount');
    soundstartstart = game.add.audio('startstart');

    sounds = [ soundkick , soundhitwall, soundscore, soundstartcount, soundstartstart ];
    console.log(sounds);
    var l = 0;
    while(l < sounds.length) {
        // sounds[l].allowMultiple = true;
        sounds[l].loop = false;
        l++;
    }
}

function playSound(key) {
    if(key == "kick") {
        sounds[0].play();
    } else if(key == 'hitwall') {
        sounds[1].play();
    } else if(key == 'score') {
        sounds[2].play();
    } else if(key == 'startcount') {
        sounds[3].play();
    } else if(key == 'startstart') {
        sounds[4].play();
    }
}

function stopAllSounds() {
    var l = 0;
    while(l < sounds.length) {
        sounds[l].stop();
        l++;
    }
}

var winner;

function endGame(x) {
    winner = x;
    game.state.start('end');
}