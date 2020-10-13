import '../scss/index.scss';
import {setCookies, removeCookies, getCookies} from './cookies';
import {detectionDevice, detectionWEBGL, isEven, inArrayObject, inArray, isExists, removeA, randomBetween, randomArray, triggerKeyboardEvent} from './functions';

// for IE11
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};

window.addEventListener('load', function(event) {
    setTimeout(function () {
        document.getElementsByTagName('body')[0].classList.add('during');
    },2000);
    setTimeout(function () {
        document.getElementsByTagName('body')[0].classList.remove('during');
        document.getElementsByTagName('body')[0].classList.add('ready');
    },6000);
});

const tileSize=16,
    proportiesMap=[],
    amountMainLife=3,
    amountLife=3,
    amountBullet=6,
    playerScaleBig = 1.08,
    playerJumpVelocityNormalBig = 520,
    playerJumpVelocityNormalSmall = 440,
    playerJumpVelocityWaterBig = 290,
    playerJumpVelocityWaterSmall = 200,
    playerJumpVelocityStoneBig = 350,
    playerJumpVelocityStoneSmall = 260,
    playerJumpVelocityIntruder = 480,
    buttonsOpacity = 0.9;

let map,
    unlockLevels,
    amountLevels,
    bgMenu,
    levelFile={name:'level1', activeIdLevel:1, readyLoad:false, blockedKeys:false, backgroundLevel:false, backgroundColor:false, backgroundParallax:false},
    layer,
    layerDeep,
    layerObject,
    wspInkub=[],
    facing = 'right',
    cursors,
    jumpButton,
    fireButton,
    bg,
    bg2,
    oFog,
    ground,
    playGame={main:false},
    timeLoop = 1,
    timer,
    scorePercent = 0,
    timerTotal = 0,
    timerLimit = false,
    saveX = 0,
    saveY = 0,
    jumpKillF=false,
    jumpKillY=false,
    oneHP=0,
    keys=0,
    theEndCredits=false,
    moveX,
    moveY,
    playerSpeedLeftRight = 200,
    cursorDirection;

const preload = () => {

    game.load.tilemap('level1', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);

    // example full options:
    // proportiesMap[1] = {
    //     background:"background1",
    //     backgroundSecond:"background1_1",
    //     backgroundColor:"#f3f5ff",
    //     fog:"yellowFog",
    //     fogStop: false,
    //     fogPositionY:520,
    //     fogSpeed:0.25,
    //     positionGround:672,
    //     parallax:true,
    //     timeLimit: 120, // sec
    //     bgAudio: 'bg1'
    // };

    proportiesMap[1] = {
        background: "background4",
        //backgroundSecond:"background1_1",
        //backgroundColor: "#f3f5ff",
        //backgroundColor: "#00ff00",
        fog: "yellowFog",
        fogPositionY: 520,
        fogSpeed: 0, //0.25,
        positionGround: 672,
        parallax: true,
        //timeLimit: 200, // sec
        bgAudio: 'bg-sound'
    };

    game.load.tilemap('level2', 'levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
    proportiesMap[2] = {
        background: "background4",
        backgroundMoveX: 500,
        //backgroundSecond:"background1_1",
        backgroundColor: "#f3f5ff",
        fog: "yellowFog",
        fogPositionY: 520,
        fogSpeed: 0, //0.25,
        positionGround: 672,
        parallax: true,
        timeLimit: 200, // sec
        bgAudio: 'bg-sound-wind'
        //bgAudio: 'bg1'
        // background: "background2",
        // backgroundColor: "#f3f5ff",
        // fog: "whiteFog",
        // fogSpeed: 2,
        // positionGround: true,
        // parallax: true
    };

    game.load.tilemap('level3', 'levels/level3.json', null, Phaser.Tilemap.TILED_JSON);
    proportiesMap[3] = {
        background: "background4",
        backgroundMoveX: 800,
        //backgroundSecond:"background1_1",
        backgroundColor: "#f3f5ff",
        fog: "yellowFog",
        fogPositionY: 0,
        fogSpeed: 0, //0.25,
        positionGround: 96, // 271
        parallax: true,
        timeLimit: 200, // sec
        bgAudio: 'bg-sound-wind'
        // background: "background3",
        // backgroundColor: "#def7c3",
        // fog: "yellowFog",
        // fogPositionY: 0,
        // positionGround: true,
        // parallax: false
    };


    game.load.tilemap('level4', 'levels/level4.json', null, Phaser.Tilemap.TILED_JSON);
    proportiesMap[4] = {
        background: "background4",
        backgroundMoveX: 1000,
        //backgroundSecond:"background1_1",
        backgroundColor: "#f3f5ff",
        fog: "yellowFog",
        fogPositionY: -tileSize,
        positionGround: 4 * tileSize,
        parallax: true
    };

    game.load.tilemap('level5', 'levels/level5.json', null, Phaser.Tilemap.TILED_JSON);
    proportiesMap[5] = {
        background: "background5",
        backgroundRepeatX: true,
        //backgroundMoveX: 1000,
        //backgroundSecond:"background1_1",
        backgroundColor: "#f3f5ff",
        fog: "yellowFog",
        fogPositionY: -2*tileSize,
        positionGround: 4 * tileSize,
        parallax: true,
        bgAudio: 'bg-sound-wind'
    };

    game.load.tilemap('level6', 'levels/level6.json', null, Phaser.Tilemap.TILED_JSON);
    proportiesMap[6] = {
        background: "background5",
        backgroundRepeatX: true,
        //backgroundMoveX: 1000,
        //backgroundSecond:"background1_1",
        backgroundColor: "#f3f5ff",
        //fog: "yellowFog",
        //fogPositionY: -2*tileSize,
        positionGround: 180 * tileSize,
        parallax: true,
        bgAudio: 'bg-sound-wind'
    };

    game.load.tilemap('level7', 'levels/level7.json', null, Phaser.Tilemap.TILED_JSON);
    proportiesMap[7] = {
        //background: "background5",
        backgroundRepeatX: true,
        //backgroundMoveX: 1000,
        //backgroundSecond:"background1_1",
        backgroundColor: "#f3f5ff",
        //fog: "yellowFog",
        fogPositionY: -2*tileSize,
        positionGround: 50 * tileSize,
        parallax: true,
        bgAudio: 'bg-sound-wind'
    };

    game.load.tilemap('level8', 'levels/level8.json', null, Phaser.Tilemap.TILED_JSON);
    proportiesMap[8] = {
        background: "background5",
        backgroundRepeatX: true,
        //backgroundMoveX: 1000,
        //backgroundSecond:"background1_1",
        backgroundColor: "#f3f5ff",
        //fog: "yellowFog",
        //fogPositionY: -2*tileSize,
        positionGround: 173 * tileSize,
        parallax: true,
        bgAudio: 'bg-sound-wind'
    };

    game.load.tilemap('level9', 'levels/level9.json', null, Phaser.Tilemap.TILED_JSON);
    proportiesMap[9] = {
        background: "the-end",
        backgroundColor: "#000000",
        fog: false,
        positionGround: false,
        parallax: false,
        bgAudio: 'bg-sound-music'
    };


    game.load.image('tiles-1', 'images/tiles-1.png');

    //game.load.spritesheet('dude', 'images/, 35, 48);
    game.load.spritesheet('dude', 'images/players1.png', 48, 64);
    game.load.spritesheet('intruder1', 'images/intruders4.png', 48, 64);
    game.load.spritesheet('intruder2', 'images/intruders2.png', 48, 64);
    game.load.spritesheet('intruder3', 'images/intruders3.png', 48, 64);
    game.load.spritesheet('intruder4', 'images/snake3.png', 71, 33);
    game.load.spritesheet('intruder5', 'images/condor2.png', 64, 68);
    game.load.spritesheet('intruder6', 'images/intruders6.png', 48, 64);
    game.load.spritesheet('intruder7', 'images/owl.png', 50, 53);
    //game.load.spritesheet('intruder', 'images/intruder2.png', 48, 48);
    game.load.image('backgroundMenu', 'images/menu.jpg');
    game.load.image('boxMenu', 'images/box-menu4-mini.png');
    game.load.image('boxTopMenu', 'images/top-menu-mini.png');
    game.load.image('background1', 'images/background1.png');
    game.load.image('background1_1', 'images/background1_1.png');
    game.load.image('background2', 'images/background2_1.png');
    game.load.image('background3', 'images/background3.png');
    game.load.image('background4', 'images/background4.jpg');
    game.load.image('background5', 'images/background5.jpg');
    game.load.image('tile-size-black', 'images/tile-size-black.png');
    game.load.image('the-end', 'images/the-end.png');

    game.load.spritesheet('buttonsWindowMenu', 'images/buttons.png', 112, 48);

    game.load.spritesheet('buttonsIcons', 'images/icons.png', 48, 48);
    game.load.spritesheet('buttonLevel', 'images/button-level.png', 64, 64);
    game.load.spritesheet('buttonNavigation', 'images/navigations.png', 112, 112);
    game.load.image('buttonPause', 'images/pause.png');
    game.load.spritesheet('lifes-single-bar', 'images/lifes-single-bar.png', 58, 16);

    game.load.spritesheet('log', 'images/log.png', 16, 16);
    game.load.spritesheet('stone', 'images/stone.png', 16, 16);

    game.load.image('yellowFog', 'images/fog-yellow.png');
    game.load.image('whiteFog', 'images/fog-white.png');
    game.load.image('ground', 'images/ground.png');

    //game.load.spritesheet('coin', 'images/nu1.png', 24,32);
    game.load.spritesheet('coin', 'images/nu3.png', 16, 24);
    game.load.spritesheet('Life', 'images/LifeFull.png', 16, 31);
    game.load.spritesheet('Life2', 'images/LifeSingle.png', 16, 24);
    game.load.spritesheet('key', 'images/key.png', 16, 43);
    game.load.image('door', 'images/door2.png');
    game.load.image('door-horizontal', 'images/door-horizontal.png');
    game.load.image('lock', 'images/lock1.png');

    game.load.image('sentence1', 'images/sentence1.png');
    game.load.image('sentence2', 'images/sentence2.png');
    game.load.image('cactus', 'images/cactus2.png');
    game.load.image('grassLr', 'images/grass_lr.png');
    game.load.spritesheet('cactus-animate', 'images/cactus-animate.png',61,94); //32,32
    game.load.spritesheet('grass-lr-anim', 'images/grass_anim8.png',34.5,32); //32,32
    game.load.spritesheet('tree', 'images/tree-short.png',130,179); //32,32

    game.load.image('bullet', 'images/bullet.png');
    game.load.spritesheet('bullets_gun', 'images/gun-bullets6.png', 20, 28);
    game.load.spritesheet('end_level', 'images/end_level.png', 100, 130);
    game.load.spritesheet('save_level', 'images/save-level2.png', 100, 130);

    game.load.spritesheet('fire_up', 'images/fire_up3.png', 48, 48);
    game.load.spritesheet('fire_up_normal', 'images/fire_up_normal_3.png', 24, 24);
    game.load.spritesheet('fire_down', 'images/fire_down3.png', 24, 24);
    game.load.spritesheet('fire_left', 'images/fire_left3.png', 24, 24);
    game.load.spritesheet('fire_right', 'images/fire_right3.png', 24, 24);

    game.load.image('windmill_1_new', 'images/windmill_1_5_new.png');
    game.load.image('windmill_2_new', 'images/windmill_2_5_new.png');

    //game.load.image('gun', 'images/gun2.png');

    game.load.image('gun', 'images/gun-real.png');

    game.load.image('cave', 'images/cave.png');

    game.load.image('stone-big', 'images/stone-big.png');
    game.load.spritesheet('stone-big-explosion', 'images/stone-big-explosion.png', 96, 96);

    game.load.spritesheet('fog-single', 'images/fog-anim-half.png',800,206);
    //game.load.spritesheet('fog-single-static', 'images/fog-static.png',800,206);

    game.load.image('building1', 'images/building-barn1.png');
    game.load.image('building2', 'images/building-home1.png');
    game.load.image('building3', 'images/building-big-home1.png');
    game.load.image('building4', 'images/building-home2.png');
    game.load.image('building5', 'images/building-big-home2.png');
    game.load.image('building6', 'images/building-blacksmith.png');
    game.load.image('building7', 'images/building-sheriff.png');
    game.load.image('building8', 'images/building-saloon.png');
    game.load.image('building9', 'images/building-store.png');

    game.load.image('b-sheriff', 'images/b-sheriff.png');
    game.load.image('b-saloon', 'images/b-saloon.png');
    game.load.image('b-store', 'images/b-store.png');

    game.load.spritesheet('mine-part-2', 'images/mine-part2-4.png', 175, 331);
    game.load.image('mine-part-1', 'images/mine-part1-6.png');

    //game.load.spritesheet('water', 'images/water_2.png', 128, 32);
    //game.load.spritesheet('water', 'images/water_3.png', 192, 32);
    game.load.spritesheet('water-red', 'images/water_red6.png', 256, 32);
    game.load.spritesheet('water', 'images/water_4.png', 256, 32);
    game.load.spritesheet('splash', 'images/splash7.png', 84, 38);
    game.load.spritesheet('splash-water-red', 'images/splash-red9.png', 84, 38);
    game.load.spritesheet('fireb', 'images/fish7.png', 16, 40);
    game.load.spritesheet('fireb2', 'images/fireb.png', 16, 16);

    game.load.spritesheet('explosion', 'images/explosion.png', 64, 64);

    game.load.image('invisible', 'images/invisible.png');

    game.load.image('kladka-short', 'images/kladka-short.png');


    // audio
    game.load.audio('footstep', 'audio/footstep2.mp3'); // licence no ok
    game.load.audio('coin', 'audio/coin.mp3'); // licence ok
    game.load.audio('shoot', 'audio/shoot2.mp3'); // licence ok
    game.load.audio('bullets', 'audio/bullets3.mp3');
    game.load.audio('explosion-intruder', 'audio/explosion-intruder.mp3');
    game.load.audio('explosion', 'audio/explosion.mp3');
    game.load.audio('break-bones', 'audio/break-bones.mp3');
    game.load.audio('scream', 'audio/scream.mp3'); // licence ok
    game.load.audio('scream2', 'audio/scream2.mp3'); // licence ok
    game.load.audio('scream-intruder', 'audio/scream-intruder.mp3'); // licence ok
    game.load.audio('splash', 'audio/splash.mp3'); // licence ok
    game.load.audio('life', 'audio/life.mp3'); // licence ok
    game.load.audio('condor', 'audio/condor.mp3'); // licence ok
    game.load.audio('key', 'audio/key.mp3'); // licence no ok
    game.load.audio('break-ground', 'audio/break.mp3'); // licence ok
    game.load.audio('quake', 'audio/quake.mp3'); // licence ok
    game.load.audio('door-lift', 'audio/door-lift.mp3'); // licence ok
    game.load.audio('bg1', 'audio/bg.mp3'); // licence ok
    game.load.audio('flash', 'audio/flash.mp3'); // licence ok
    game.load.audio('next-level', 'audio/next-level.mp3'); // licence ok
    game.load.audio('tic-score', 'audio/tic.mp3'); // licence ok
    game.load.audio('scale-down', 'audio/down.mp3'); // licence ok
    game.load.audio('magic', 'audio/magic.mp3'); // licence no ok
    game.load.audio('bingo', 'audio/bingo.mp3'); // licence no ok
    game.load.audio('elevator', 'audio/elevator.mp3'); // licence no ok
    game.load.audio('owl', 'audio/owl.mp3'); // licence no ok
    game.load.audio('bg-sound', 'audio/background2.mp3'); // my
    game.load.audio('bg-sound-wind', 'audio/only-wind.mp3'); // my
    game.load.audio('bg-sound-music', 'audio/background.mp3'); // my




    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.pageAlignHorizontally = true;
    //this.scale.pageAlignVertically = true;

    //this.scale.updateLayout;

    game.scale.maxWidth = 800;
    game.scale.maxHeight = 450;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.windowConstraints.bottom = "visual";
    //this.scale.setScreenSize();
};

// game options
const toolsGame={
    resetGameCookies: function(type) {
        if(type==="all") {
            removeCookies("unlock-levels");
            unlockLevels = 1;

            removeCookies('coins-procent-last-memory');
            removeCookies('id-level-last-memory');

            for(let i=1; i<=amountLevels; i++) {
                removeCookies('coins-' + i);
                removeCookies('coins-procent-' + i);
            }
        }
        removeCookies('bullets');
        removeCookies('coins');
        removeCookies('Lifes');
        removeCookies('main-Lifes');
    },
    bgSet:function(bgColor) {
        game.stage.backgroundColor = bgColor;
    },
    // slider: {
    //     bounds: false,
    //     min: false,
    //     slider: false,
    //     show: function() { // toolsGame.slider.show();
    //         //define the boundary of the handler
    //         this.bounds= new Phaser.Rectangle(100,100,500,80);
    //         const graphics = game.add.graphics(this.bounds.x, this.bounds.y);
    //         graphics.beginFill(0x000077);
    //         graphics.drawRect(0, 0, this.bounds.width, this.bounds.height);
    //         graphics.fixedToCamera = true;
    //
    //
    //         //add empty sprite for input detection
    //         this.slider = game.add.sprite(100, 100,'bullet');
    //         this.slider.fixedToCamera = true;
    //         this.slider.scale.setTo(1);
    //         this.slider.inputEnabled = true;
    //         this.slider.input.enableDrag(false,false,false,255,this.bounds);
    //         this.slider.input.allowVerticalDrag = false;
    //         this.slider.events.onDragStop.add(function(){
    //             const that = toolsGame.slider;
    //             if(that.slider.x>(that.bounds.width/2)+that.bounds.x){
    //                 that.min=((that.bounds.width+that.bounds.x-that.slider.x-that.slider.width)/(that.bounds.width+that.bounds.x-that.slider.width))*100;
    //             }
    //             if(that.slider.x<(that.bounds.width/2)+that.bounds.x){
    //                 that.min=((that.bounds.width+that.bounds.x-that.slider.x)/(that.bounds.width))*100;
    //             }
    //             console.log(that.min);
    //         }, game);
    //         this.min=1;
    //     },
    //     hide: function () {
    //
    //     }
    // },
    audio: {
        footStep: function (volume) { // toolsGame.audio.footStep();
            if(!this.a1) {
                const footstep = game.add.audio('footstep');
                footstep.play('',false,volume ? volume : 0.2);
                //footstep.volume = 0.05;
                this.a1= true;
                footstep.onStop.addOnce(function() {
                    this.a1=false;
                }, this);
            }
        },
        magic: function (volume) { // toolsGame.audio.footStep();
            const magic = game.add.audio('magic');
            magic.play('',false,volume ? volume : 0.2);

        },
        bingo: function (volume) { // toolsGame.audio.bingo();
            const bingo = game.add.audio('bingo');
            bingo.play('',false,volume ? volume : 0.2);

        },
        coin: function (volume) { // toolsGame.audio.footStep();
            const coin = game.add.audio('coin');
            coin.play('',false,volume ? volume : 0.2);

        },
        ticScore: function (volume) { // toolsGame.audio.footStep();
            const ticScore = game.add.audio('tic-score');
            ticScore.play('',false,volume ? volume : 0.2);

        },
        shoot: function (volume) { // toolsGame.audio.footStep();
            const shoot = game.add.audio('shoot');
            shoot.play('', false, volume ? volume : 0.2);
        },
        bullets: function (volume) { // toolsGame.audio.footStep();
            const bullets = game.add.audio('bullets');
            bullets.play('', false, volume ? volume : 0.2);
        },
        explosionIntruder: function () { // toolsGame.audio.footStep();
            const explosionIntruder = game.add.audio('explosion-intruder');
            explosionIntruder.play('', false, 0.5);
        },
        explosion: function () { // toolsGame.audio.footStep();
            const explosion = game.add.audio('explosion');
            explosion.play('', false, 0.5);
        },
        breakBones: function (volume) { // toolsGame.audio.breakBones();
            const breakBones = game.add.audio('break-bones');
            breakBones.play('', false, volume ? volume : 0.2);
        },
        scaleDown: function (volume) { // toolsGame.audio.footStep();
            const sd = game.add.audio('scale-down');
            sd.play('', false, volume ? volume : 0.2);
        },
        scream: function (volume) { // toolsGame.audio.footStep();
            const scream = game.add.audio('scream');
            scream.play('', false, volume ? volume : 0.2);
        },
        screamIntruder: function (volume) { // toolsGame.audio.footStep();
            const s = game.add.audio('scream-intruder');
            s.play('', false, volume ? volume : 0.2);
        },
        flash: function (volume) { // toolsGame.audio.footStep();
            const flash = game.add.audio('flash');
            flash.play('', false, volume ? volume : 0.2);
        },
        splash: function (volume) { // toolsGame.audio.footStep();
            if(!this.aSplash) {
                const splash = game.add.audio('splash');
                splash.play('',false,volume ? volume : 0.1);
                this.aSplash= true;
                game.time.events.add(500, function(){
                    this.aSplash=false;
                }, this);
            }
        },
        elevator: function (volume) { // toolsGame.audio.footStep();
            if(!this.aElevator) {
                const elevator = game.add.audio('elevator');
                elevator.play('',false,volume ? volume : 0.1);
                this.aElevator= true;
                game.time.events.add(500, function(){
                    this.aElevator=false;
                }, this);
            }
        },
        life: function (volume) { // toolsGame.audio.footStep();
            const life = game.add.audio('life');
            life.play('', false, volume ? volume : 0.2);
        },
        key: function (volume) { // toolsGame.audio.footStep();
            const key = game.add.audio('key');
            key.play('', false, volume ? volume : 0.2);
        },
        condor: function (volume) { // toolsGame.audio.footStep();
            if(!this.aCcondor) {
                const condor = game.add.audio('condor');
                condor.play('',false,volume ? volume : 0.2);
                //footstep.volume = 0.05;
                this.aCcondor = true;
                condor.onStop.addOnce(function() {
                    this.aCcondor=false;
                }, this);
            }
        },
        owl: function (volume) { // toolsGame.audio.footStep();
            if(!this.aOwl) {
                const condor = game.add.audio('owl');
                condor.play('',false,volume ? volume : 0.2);
                //footstep.volume = 0.05;
                this.aOwl = true;
                condor.onStop.addOnce(function() {
                    this.aOwl=false;
                }, this);
            }
        },
        breakGround: function (volume) { // toolsGame.audio.footStep();
            const breakGround = game.add.audio('break-ground');
            breakGround.play('', false, volume ? volume : 0.2);
        },
        quake: function (volume) { // toolsGame.audio.footStep();
            const quake = game.add.audio('quake');
            quake.play('', false, volume ? volume : 0.2);
        },
        doorLift: function (volume) { // toolsGame.audio.footStep();
            const doorLift = game.add.audio('door-lift');
            doorLift.play('', false, volume ? volume : 0.2);
        },
        bg: {
            //obj: false,
            play:function (volume,bg) {
                if(bg) {
                    if(isExists(this.obj)) this.obj.destroy();
                    this.obj = game.add.audio(bg);
                    this.obj.play('', false, volume ? volume : 0.2, true);
                }
            },
            stop:function () {
                if(isExists(this.obj)) this.obj.stop();
            }
        },
        nextLevelNew: {
            play:function (volume) {
                if(!this.nL) {
                    if(isExists(this.obj)) this.obj.destroy();
                    this.obj = game.add.audio('next-level');
                    this.obj.play('', false, volume ? volume : 0.2);
                    this.nL= true;
                    this.obj.onStop.addOnce(function() {
                        this.nL=false;
                    }, this);
                }
            },
            stop:function () {
                if(isExists(this.obj)) this.obj.stop();
            }

        }

    },
    preloader: {
        //obj: true,
        add: function(x,y,lastMap,percentLevel) {
            //alert(theEndCredits);

            toolsGame.bgSet('#000000');
            toolsGame.preloader.obj = game.add.group();
            toolsGame.preloader.obj.enableBody = true;

            const LoadingCongratylation1 = theEndCredits?(lastMap?'Congratulations!':''):("Level " + levelFile.activeIdLevel ),
                LoadingCongratylation2 = theEndCredits?(lastMap?"To be continued...":''):('Loading...');
            toolsGame.text.show('center',0,-tileSize,0.9,LoadingCongratylation1,'bold 52px Arial','#ffffff',true,'loading1');
            toolsGame.text.show('center',0,0.7*tileSize,0.9,LoadingCongratylation2,'bold 28px Arial','#ffffff',true,'loading2');
            toolsGame.text.show('center',0,5*tileSize,0.9,'Copyright \u00A9 Gold Rush, once upon a time in the Wild West...','16px Arial','#ffffff',true,'loadingCopyright1');
            toolsGame.text.show('center',0,5.75*tileSize,0.9,'semDesign','14px Arial','#ffffff',true,'loadingCopyright2');
        },
        hide: function () {
            if(isExists(this.obj)) {
                this.obj.destroy();
            }
            toolsGame.text.hide('loading1');
            toolsGame.text.hide('loading2');
            toolsGame.text.hide('loadingCopyright1');
            toolsGame.text.hide('loadingCopyright2');
            //clearInterval(this.interval);
        }
    },
    windows:{
        boxTopMenu: {
            positionBar: function (type) {
                if(toolsGame.windows.boxMenu.obj || type==='inside-boxMenu') {
                    moveY = 6*tileSize+8;
                    moveX = 7*tileSize;
                } else {
                    moveX = -1*tileSize;
                    moveY = -1*tileSize+2;
                }
            },
            const: {
                show: function (type) { // toolsGame.windows.boxTopMenu.const.show()
                    /**/
                    toolsGame.windows.boxTopMenu.positionBar(type);
                    if(!theEndCredits) {
                        toolsGame.windows.boxTopMenu.positionBar();

                        toolsGame.image.show(
                            (toolsGame.windows.boxMenu.obj)?18*tileSize+moveX:33*tileSize+moveX,
                            (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY:1.5*tileSize+moveY,
                            'Life','Life1',1,1,.8,.8,8
                        );

                        //
                        // toolsGame.image.show(
                        //     (toolsGame.windows.boxMenu.obj)?18*tileSize+moveX:33*tileSize+moveX,
                        //     (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY:1.75*tileSize+moveY,
                        //     'lifes-single-bar','lifes-single-bar',1,1,.8,.8,1
                        // );

                        toolsGame.image.show(
                            (toolsGame.windows.boxMenu.obj)?22*tileSize+moveX:37*tileSize+moveX,
                            (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY:1.5*tileSize+moveY,
                            'coin','coin',1,1,.8,.8,3
                        );

                        toolsGame.image.show(
                            (toolsGame.windows.boxMenu.obj)?28.4*tileSize+moveX:43.4*tileSize+moveX,
                            (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY-4:1.5*tileSize+moveY-4,
                            'bullets_gun','bullets_gun',1,1,.75,.75,0
                        );

                        toolsGame.image.show(
                            (toolsGame.windows.boxMenu.obj)?32.5*tileSize+moveX:47.5*tileSize+moveX,
                            (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY-2:1.5*tileSize+moveY-2,
                            'key','key',1,1,.7,.5,5
                        );
                    }
                    /**/
                }, //  toolsGame.windows.boxTopMenu.const.hide();
                hide: function () {
                    if(!theEndCredits) {
                        const hideArray = ['Life1','Life2','coin','bullets_gun','key'];
                        for(let i=0, iLnegth=hideArray.length; i<iLnegth; i++ ){
                            toolsGame.image.hide(hideArray[i]);
                        }
                    }
                }
            },
            letAlways: {
                show: function () {
                    toolsGame.windows.boxTopMenu.positionBar();

                    if(proportiesMap[levelFile.activeIdLevel].timeLimit && !levelFile.blockedKeys) {
                        if(timerTotal === proportiesMap[levelFile.activeIdLevel].timeLimit) {
                            toolsGame.windows.boxMenu.show('time-over');
                            //toolsGame.windows.boxMenu.show();
                        }
                        timerLimit=proportiesMap[levelFile.activeIdLevel].timeLimit-timerTotal;
                    }

                    toolsGame.text.show(false,
                        (toolsGame.windows.boxMenu.obj)?4*tileSize+moveX:4*tileSize+moveX,
                        (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY:1.5*tileSize+moveY,
                        1,('Level ' + levelFile.activeIdLevel + ' / ' +
                        (proportiesMap[levelFile.activeIdLevel].timeLimit? 'Limit: ' +timerLimit:timerTotal)) + 's',
                        '700 15px Arial' ,'#ded4b8',true,'level_text',true
                    );
                }
            },
            let: {
                show: function () { //  toolsGame.windows.boxTopMenu.let.show();
                    toolsGame.windows.boxTopMenu.positionBar();

                    // toolsGame.text.show(false,
                    //     (toolsGame.windows.boxMenu.obj)?19*tileSize+moveX:34*tileSize+moveX,
                    //     (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY:1.5*tileSize+moveY,
                    //     1,('x ' + toolsGame.mainElements.player.numberLifes),'700 15px Arial' ,'#ded4b8',true,'number_Lifes_text',true
                    // );

                    toolsGame.text.show(false,
                        (toolsGame.windows.boxMenu.obj)?19*tileSize+moveX:34*tileSize+moveX,
                        (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY:1.5*tileSize+moveY,
                        1,('x ' + toolsGame.mainElements.player.numberMainLifes),'700 15px Arial' ,'#ded4b8',true,'number_main_Lifes_text',true
                    );

                    toolsGame.image.show(
                        (toolsGame.windows.boxMenu.obj)?14.7*tileSize+moveX:29.7*tileSize+moveX,
                        (toolsGame.windows.boxMenu.obj)?1.75*tileSize+moveY:1.75*tileSize+moveY,
                        'lifes-single-bar','lifes-single-bar',1,1,.8,.8,3-toolsGame.mainElements.player.numberLifes
                    );

                    toolsGame.text.show(false,
                        (toolsGame.windows.boxMenu.obj)?23*tileSize+moveX:38*tileSize+moveX,
                        (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY:1.5*tileSize+moveY,
                        1,('x ' + toolsGame.mainElements.player.numberCoins + ' (' + toolsGame.mainElements.player.numberCoinsLevelProcent + '%)'),'700 15px Arial' ,'#ded4b8',true,'coinstext',true
                    );

                    toolsGame.text.show(false,
                        (toolsGame.windows.boxMenu.obj)?29.5*tileSize+moveX:44.5*tileSize+moveX,
                        (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY:1.5*tileSize+moveY,
                        1,('x ' + toolsGame.mainElements.player.countBullets),'700 15px Arial' ,'#ded4b8',true,'bullets_gun_text',true
                    );

                    toolsGame.text.show(false,
                        (toolsGame.windows.boxMenu.obj)?33.5*tileSize+moveX:48.5*tileSize+moveX,
                        (toolsGame.windows.boxMenu.obj)?1.5*tileSize+moveY:1.5*tileSize+moveY,
                        1,('x ' + keys),'700 15px Arial' ,'#ded4b8',true,'key_text',true
                    );
                }
            }
        },
        boxMenu:{
            obj:false,
            bg:function(type){
                if(this.obj) this.obj.destroy();
                //this.obj = game.add.image(tileSize*2, tileSize*2, 'boxMenu');
                this.obj = game.add.tileSprite(tileSize*2, tileSize*2, 736, 377, 'boxMenu');
                this.obj.alpha = 0;
                this.obj.fixedToCamera = true;
                if(!type){
                    game.add.tween(this.obj).to({alpha: 0.8}, 180, Phaser.Easing.Linear.None, true);
                } else {
                    this.obj.alpha = 0.8;
                }

                // game.physics.arcade.enable(this.obj);
                //console.log(this.obj);
                // game.add.tween(this.obj).to( { x: 200 }, 300, Phaser.Easing.Exponential.Out, true);
                //console.log("x");
            },
            show:function(type){
                //console.log(toolsGame.windows.boxMenu.obj);
                //console.log(this.obj);
                toolsGame.buttons.openBoxMenu.hide();

                //boxMenu.
                // if(this.obj) this.obj.destroy();
                // this.obj=game.add.image(tileSize*2, tileSize*2, 'boxMenu');
                // this.obj.alpha = 0.8;
                // this.obj.fixedToCamera = true;
                this.bg(type); // toolsGame.windows.boxMenu.bg();

                toolsGame.buttons.end.show();
                toolsGame.buttons.startFromBeginning.show();
                //toolsGame.buttons.reset.show();
                toolsGame.buttons.mute.show(getCookies('mute')?10:9);

                if(playGame.main) {
                    toolsGame.buttons.navigations.hide();
                    toolsGame.image.hide('boxTopMenu',true);
                    toolsGame.windows.boxTopMenu.const.hide();
                    toolsGame.windows.boxTopMenu.const.show('inside-boxMenu');

                    // setTimeout(function(){
                    //     game.paused = true;
                    // },210);

                    game.time.events.add(300, function(){
                        game.paused = true;
                    }, this);
                }
                else
                {
                    toolsGame.buttons.reset.show();
                    toolsGame.buttons.cheat.show();
                    toolsGame.buttons.levels.hide();
                    toolsGame.buttons.play.hide();
                    toolsGame.buttons.quit.hide();
                    toolsGame.buttons.mute.hide();
                    toolsGame.animationImage.sentence1.hide();
                }



                //toolsGame.buttons.closeBoxMenu.show();
                if(type === 'game-complete') {
                    toolsGame.text.show('center',0,0,0.6,"Thank you for playing",'bold 46px Arial','#ffffff',true,'game-complite');
                } else if(type === 'game-over') {
                    toolsGame.text.show('center', 0, 0, 0.6, "Game Over!", 'bold 46px Arial', '#ffffff', true, 'game-complite');
                } else if(type === 'time-over')  {
                    toolsGame.text.show('center', 0, 0, 0.6, "Time Over!", 'bold 46px Arial', '#ffffff', true, 'game-complite');
                } else {
                    toolsGame.buttons.closeBoxMenu.show();
                    toolsGame.buttons.resume.show();
                }
                toolsGame.windows.boxTopMenu.f=false;

            },
            hide:function(){
                //if(game.paused)
                //{
                const hide = game.add.tween(this.obj).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
                hide.onComplete.add(function(o){
                    o.destroy();
                }, this);
                //this.obj.destroy();

                this.obj=false;

                toolsGame.buttons.end.hide();
                toolsGame.buttons.startFromBeginning.hide();
                toolsGame.buttons.reset.hide();
                toolsGame.buttons.cheat.hide();
                toolsGame.buttons.resume.hide();
                toolsGame.buttons.mute.hide();
                toolsGame.buttons.closeBoxMenu.hide();
                //game.input.onDown.removeAll();
                game.paused = false;
                if(playGame.main) {
                    if(!theEndCredits) {
                        toolsGame.buttons.navigations.show();
                        toolsGame.image.show(
                            (toolsGame.windows.boxMenu.obj)?0:0,
                            (toolsGame.windows.boxMenu.obj)?0:0,
                            'boxTopMenu','boxTopMenu',.85,1,false,false,false,true
                        );
                        toolsGame.windows.boxTopMenu.const.show();
                    }
                    toolsGame.buttons.openBoxMenu.show('play-game');
                }
                else
                {
                    toolsGame.buttons.openBoxMenu.show();
                    toolsGame.buttons.levels.show();
                    toolsGame.buttons.play.show();
                    toolsGame.buttons.quit.show();
                    toolsGame.buttons.mute.show(getCookies('mute')?10:9);
                    toolsGame.animationImage.sentence1.show();
                }
                toolsGame.windows.boxTopMenu.f=false;
                //}

            }
        }
    },
    animationImage: { //toolsGame.animationImage.sentence1.show();
        sentence1:{
            fFirstLoad: false,
            show:function(){
                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.image(7*tileSize, 9*tileSize, 'sentence1');
                this.obj.alpha = 0;
                this.obj.fixedToCamera = true;

                if(isExists(this.obj2)) this.obj2.destroy();
                this.obj2 = game.add.image(28.5*tileSize, 15*tileSize, 'sentence2');
                this.obj2.alpha = 0;
                this.obj2.fixedToCamera = true;

                if(isExists(this.obj3)) this.obj3.destroy();
                this.obj3 = game.add.image(32*tileSize, 16.5*tileSize, 'sentence2');
                this.obj3.alpha = 0;
                this.obj3.fixedToCamera = true;
                this.obj3.scale.x = 0.7;
                this.obj3.scale.y = 0.7;

                if(isExists(this.obj4)) this.obj4.destroy();
                this.obj4 = game.add.image(34.6*tileSize, 16*tileSize, 'sentence2');
                this.obj4.alpha = 0;
                this.obj4.fixedToCamera = true;
                this.obj4.scale.x = 0.45;
                this.obj4.scale.y = 0.45;


                let timeShow = 1000;
                if(!this.fFirstLoad) {
                    timeShow = 6900;
                    this.fFirstLoad = true;
                }

                this.t1 = game.time.events.add(timeShow, function(){
                    game.add.tween(this.obj4).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true);
                    toolsGame.audio.shoot(.1);
                    this.t2 = game.time.events.add(300, function(){
                        game.add.tween(this.obj3).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true);
                        toolsGame.audio.shoot(.1);
                        this.t3 = game.time.events.add(300, function(){
                            game.add.tween(this.obj2).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true);
                            toolsGame.audio.shoot(.1);
                            this.t4 = game.time.events.add(300, function(){
                                game.add.tween(this.obj).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true);
                                toolsGame.audio.shoot(.1);
                                toolsGame.audio.nextLevelNew.play();
                            }, this);
                        }, this);
                    }, this);
                }, this);


                // setTimeout(function (that){
                //     game.add.tween(that.obj4).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true);
                //     toolsGame.audio.footStep();
                //     setTimeout(function (that){
                //         game.add.tween(that.obj3).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true);
                //         toolsGame.audio.footStep();
                //         setTimeout(function (that){
                //             game.add.tween(that.obj2).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true);
                //             toolsGame.audio.footStep();
                //             setTimeout(function (that){
                //                 game.add.tween(that.obj).to({alpha: 1}, 600, Phaser.Easing.Linear.None, true);
                //                 toolsGame.audio.footStep();
                //                 toolsGame.audio.nextLevel();
                //             },600,that);
                //         },600,that);
                //     },600,that);
                // },timeShow, this);
            },
            hide:function(){
                if(isExists(this.obj)) {
                    this.obj.destroy();
                }
                if(isExists(this.obj2)) {
                    this.obj2.destroy();
                }
                if(isExists(this.obj3)) {
                    this.obj3.destroy();
                }
                if(isExists(this.obj4)) {
                    this.obj4.destroy();
                }
                game.time.events.remove(this.t1);
                game.time.events.remove(this.t2);
                game.time.events.remove(this.t3);
                game.time.events.remove(this.t4);
                toolsGame.audio.nextLevelNew.stop();
            }
        }
    },
    buttons:{
        openBoxMenu:{
            //obj:false,
            show:function(type){
                //x
                //buttonPauseMenu
                //console.log(toolsGame.buttons.openBoxMenu);
                //console.log(this);
                if(isExists(this.obj)) this.obj.destroy();
                if(type==='play-game') {
                    this.obj = game.add.button(0, 0, 'buttonPause', function(){
                        toolsGame.audio.breakBones();
                        toolsGame.windows.boxMenu.show();
                        //alert("x");
                    }, this,0,0);
                } else {
                    this.obj = game.add.button(tileSize, tileSize, 'buttonsWindowMenu', function(){
                        toolsGame.audio.breakBones();
                        toolsGame.windows.boxMenu.show();
                    }, this,2,2);
                }
                if(type==='play-game') {
                    this.obj.alpha = buttonsOpacity;
                } else {
                    this.obj.alpha = buttonsOpacity;
                }
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) {
                    this.obj.destroy();
                }
                //toolsGame.buttons.openBoxMenu.obj.visible = false;
            }
        },
        //buttonsIcons
        closeBoxMenu:{
            //obj:false,
            show:function(){
                //buttonPauseMenu
                //console.log(toolsGame.buttons.openBoxMenu);
                //console.log(this);

                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.button(44*tileSize, 3*tileSize, 'buttonsIcons', function(){
                    toolsGame.audio.breakBones();
                    toolsGame.windows.boxMenu.hide();
                }, this,3,2);
                this.obj.alpha = 0.4;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) {
                    this.obj.destroy();
                }
                //toolsGame.buttons.closeBoxMenu.obj.visible = false;
            }
        },
        play: { //toolsGame.buttons.play.show()
            //obj:false,
            show:function(){
                //buttonPlay
                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.button(9*tileSize, tileSize, 'buttonsWindowMenu', function(){
                    toolsGame.audio.breakBones();
                    startGame('continuation');
                }, this);
                this.obj.alpha = buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) {

                    this.obj.destroy();

                }
                //toolsGame.buttons.play.obj.visible = false;
            }
        },
        quit: { //toolsGame.buttons.quit.show()
            //obj:false,
            show:function(){
                //buttonQuit
                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.button(17*tileSize, 1*tileSize, 'buttonsWindowMenu', function(){
                    //alert("Quit game!");
                    //toolsGame.windows.boxMenu.show('quite');
                    toolsGame.audio.breakBones();
                    toolsGame.windows.boxMenu.bg();
                    toolsGame.text.show('center',0,-10,0.9,'Are you sure you want to quit the game?','bold 26px Arial','#ffffff',true,'quit-1');

                    toolsGame.buttons.yes.show(16,16,'quit');
                    toolsGame.buttons.no.show(27,16,'quit');

                    toolsGame.buttons.openBoxMenu.hide();
                    toolsGame.buttons.levels.hide();
                    toolsGame.buttons.play.hide();
                    toolsGame.buttons.quit.hide();
                    toolsGame.buttons.mute.hide();
                    toolsGame.animationImage.sentence1.hide();
                }, this,6,6);
                this.obj.alpha = buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) this.obj.destroy();
                //toolsGame.buttons.play.obj.visible = false;
            }
        },
        end: {
            //obj:false,
            show:function(){
                //buttonEnd
                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.button(3*tileSize, 3*tileSize, 'buttonsWindowMenu', function(){
                    //game.paused = false;
                    //closeMenu();
                    toolsGame.audio.breakBones();
                    game.time.events.removeAll();
                    toolsGame.windows.boxMenu.hide();
                    correctCookiesProcent();
                    endGame();
                    levelFile.name='level1';
                    levelFile.activeIdLevel=1;
                }, this,1,1);
                this.obj.alpha = buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) this.obj.destroy();
                //toolsGame.buttons.end.obj.visible = false;
            }
        },
        startFromBeginning: {
            //obj:false,
            show:function(){
                //buttonStartFromBeginning
                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.button(11*tileSize, 3*tileSize, 'buttonsWindowMenu', function(){
                    toolsGame.audio.breakBones();
                    game.time.events.removeAll();
                    toolsGame.windows.boxMenu.hide();

                    toolsGame.mainElements.player.numberMainLifes = amountMainLife;
                    toolsGame.mainElements.player.numberLifes = amountLife;
                    toolsGame.mainElements.player.countBullets = amountBullet;
                    toolsGame.mainElements.player.numberCoins = 0;

                    // necessary after the endLevelS event
                    setCookies('coins', 0);
                    setCookies('Lifes', amountLife);
                    setCookies('main-Lifes', amountMainLife);
                    setCookies('bullets', amountBullet);


                    //alert(toolsGame.mainElements.player.numberMainLifes + " - " + toolsGame.mainElements.player.numberLifes + " -" + toolsGame.mainElements.player.countBullets + " - " + toolsGame.mainElements.player.numberCoins);

                    endGame();
                    //alert(levelFile.activeIdLevel + " - " + unlockLevels + " - " + amountLevels);
                    if(levelFile.activeIdLevel<amountLevels) {
                        levelFile.name='level'+levelFile.activeIdLevel;
                        levelFile.activeIdLevel=levelFile.activeIdLevel;
                    } else {
                        levelFile.name='level1';
                        levelFile.activeIdLevel=1;
                    }
                    //toolsGame.resetGameCookies("all");

                    startGame();
                }, this,3,3);
                this.obj.alpha = buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) this.obj.destroy();
            }
        },
        reset: {
            //obj:false,
            show:function(){
                //buttonResetFromBeginning
                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.button(19*tileSize, 3*tileSize, 'buttonsWindowMenu', function(){
                    toolsGame.audio.breakBones();
                    toolsGame.windows.boxMenu.hide();
                    levelFile.name='level1';
                    levelFile.activeIdLevel=1;
                    toolsGame.resetGameCookies("all");
                    endGame();
                    toolsGame.buttons.levels.hide();
                    toolsGame.buttons.levels.show();
                }, this,4,4);
                this.obj.alpha = buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) this.obj.destroy();
            }
        },
        cheat: { // 5 times click, then break 5s and then 10 times click
            //obj:false,
            show:function(){
                //buttonResetFromBeginning
                if(isExists(this.obj)) this.obj.destroy();
                let iCheat = 1, iCheatSecond = 0;
                let timeCheat=true, startCheatSecond=true;
                this.obj = game.add.button(3*tileSize, 7*tileSize, 'buttonsWindowMenu', function(){
                    toolsGame.audio.breakBones();

                    if(!iCheatSecond) {
                        clearTimeout(timeCheat);
                        timeCheat = setTimeout(function () {
                            iCheat=1;
                        },3000);
                        iCheat+=1;
                        if(iCheat === 6) {
                            //toolsGame.audio.quake(1);
                            startCheatSecond = setTimeout(function () {
                                iCheatSecond=1;
                            },5000);
                        } else if(iCheat > 6) {
                            iCheat=1;
                            //console.log("resetujemy");
                            clearTimeout(startCheatSecond);
                        }
                    } else {
                        if(iCheatSecond === 10) {
                            toolsGame.audio.magic();
                            setCookies('unlock-levels',9);
                            setTimeout(function () {
                                location.reload();
                            },1000);
                            iCheat=1;
                            iCheatSecond=0;
                        } else {
                            iCheatSecond+=1;
                        }
                    }

                }, this,11,11);
                this.obj.alpha = buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) this.obj.destroy();
            }
        },
        resume: {
            //obj:false,
            show:function(){
                //buttonResume
                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.button(20*tileSize, 14*tileSize, 'buttonsWindowMenu', function(){
                    toolsGame.audio.breakBones();
                    toolsGame.windows.boxMenu.hide();
                    if(!playGame.main) {
                        startGame('continuation');
                    }
                }, this,!playGame.main?0:5,!playGame.main?0:5);
                this.obj.scale.x = 1.4;
                this.obj.scale.y = 1.4;
                this.obj.alpha = buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) this.obj.destroy();
            }
        },
        mute: {
            //obj:false,
            show:function(frames){
                //buttonResume
                if(isExists(this.obj)) this.obj.destroy();
                const x = (playGame.main)?3*tileSize:tileSize,
                    y = (playGame.main)?7*tileSize:5*tileSize;
                this.obj = game.add.button(x, y, 'buttonsWindowMenu', function(){
                    toolsGame.audio.breakBones();
                    if(game.paused) {
                        game.paused = false;
                        game.time.events.remove(this.t);
                        this.t = game.time.events.add(100, function(){
                            game.paused = true;
                        }, this);
                    }
                    this.obj.destroy();
                    if(getCookies('mute')) {
                        toolsGame.buttons.mute.show(9);
                        game.sound.mute = false;
                        removeCookies('mute');
                    } else {
                        toolsGame.buttons.mute.show(10);
                        game.sound.mute = true;
                        setCookies('mute',1);
                    }
                }, this,frames,frames);
                this.obj.alpha = (playGame.main)?buttonsOpacity:buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) this.obj.destroy();
            }
        },
        yes: { // toolsGame.buttons.yes.show(x,y,'quit');
            //obj:false,
            show:function(x,y,type){
                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.button(x*tileSize, y*tileSize, 'buttonsWindowMenu', function(){
                    toolsGame.audio.breakBones();
                    if(type==='quit') {
                        if(detectionDevice()){
                            if(typeof navigator.app === "object") { // cordova
                                navigator.app.exitApp();
                            } else if(typeof window.jsToJava === "object") { // jsToJava
                                window.jsToJava.closeApp();
                            }
                        } else {
                            //alert('This option doesn\'t work in the browser');
                            location.reload();
                        }
                    }
                }, this,7,7);
                this.obj.alpha = buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) this.obj.destroy();
            }
        },
        no: { // toolsGame.buttons.no.show(x,y,'quit');
            //obj:false,
            show:function(x,y,type){
                if(isExists(this.obj)) this.obj.destroy();
                this.obj = game.add.button(x*tileSize, y*tileSize, 'buttonsWindowMenu', function(){
                    toolsGame.audio.breakBones();
                    if(type==='quit') {
                        toolsGame.buttons.no.hide();
                        toolsGame.buttons.yes.hide();
                        //toolsGame.windows.boxMenu.obj.destroy();
                        if(this.obj) {
                            const hide = game.add.tween(toolsGame.windows.boxMenu.obj).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
                            hide.onComplete.add(function(o){
                                o.destroy();
                            }, this);
                        }
                        toolsGame.windows.boxMenu.obj = false;
                        toolsGame.text.hide('quit-1');

                        toolsGame.buttons.openBoxMenu.show();
                        toolsGame.buttons.levels.show();
                        toolsGame.buttons.play.show();
                        toolsGame.buttons.quit.show();
                        toolsGame.buttons.mute.show(getCookies('mute')?10:9);
                        toolsGame.animationImage.sentence1.show();
                    }
                }, this,8,8);
                this.obj.alpha = buttonsOpacity;
                this.obj.fixedToCamera = true;
            },
            hide:function(){
                if(isExists(this.obj)) this.obj.destroy();
            }
        },


        navigations: {
            //left:false,
            //right:false,
            //up:false,
            //shot:false,
            show:function(){
                if(isExists(this.left)) this.left.destroy();
                this.left = game.add.button(-(tileSize/2),(game.height-(10*tileSize)), 'buttonNavigation', function(){}, this,0,0); //#
                this.left.alpha = 0.4;
                this.left.scale.setTo(1.5,1.5);
                this.left.fixedToCamera = true;
                this.left.onInputDown.add(function(){
                    cursors.left.isDown = true;
                    //triggerKeyboardEvent(window,37,"keydown");
                });
                this.left.onInputUp.add(function(){
                    cursors.left.isDown = false;
                    //triggerKeyboardEvent(window,37,"keyup");
                });

                // butnav
                if(isExists(this.right)) this.right.destroy();
                this.right = game.add.button(8*tileSize,game.height-(10*tileSize), 'buttonNavigation', function(){}, this,1,1); //#
                this.right.alpha = 0.4;
                this.right.scale.setTo(1.5,1.5);
                this.right.fixedToCamera = true;
                this.right.onInputDown.add(function(){
                    cursors.right.isDown = true;
                    //triggerKeyboardEvent(window,39,"keydown");
                });
                this.right.onInputUp.add(function(){
                    cursors.right.isDown = false;
                    //triggerKeyboardEvent(window,39,"keyup");
                });

                // check varible fireButton
                if(isExists(this.shot)) this.shot.destroy();
                this.shot = game.add.button((game.width-(7*tileSize)),(game.height-(13*tileSize)), 'buttonNavigation', function(){}, this,3,3); //#
                this.shot.alpha = toolsGame.mainElements.player.countBullets ? 0.6 : 0; // toolsGame.buttons.navigations.show.shot.alpha
                this.shot.inputEnabled = toolsGame.mainElements.player.countBullets ? true : false;
                this.shot.fixedToCamera = true;
                this.shot.onInputDown.add(function(){
                    fireButton.isDown = true;
                    game.time.events.add(100, function(){
                        fireButton.isDown = false;
                    }, this);
                    //triggerKeyboardEvent(window,17,"keydown");
                });

                // this doesn't work correct:
                //this.shot.onInputUp.add(function(){
                    //fireButton.isDown = false;
                    //triggerKeyboardEvent(window,17,"keyup");
                //});

                if(isExists(this.up)) this.up.destroy();
                this.up = game.add.button((game.width-(7*tileSize)),(game.height-(7*tileSize)), 'buttonNavigation', function(){}, this,2,2); //#
                this.up.alpha = 0.6;
                this.up.fixedToCamera = true;
                this.up.onInputDown.add(function(){
                    cursors.up.isDown = true;
                    //triggerKeyboardEvent(window,38,"keydown");
                });
                this.up.onInputUp.add(function(){
                    cursors.up.isDown = false;
                    //triggerKeyboardEvent(window,38,"keyup");
                });

                if(isExists(this.down)) this.down.destroy();
                this.down = game.add.button((game.width-(13*tileSize)),(game.height-(7*tileSize)), 'buttonNavigation', function(){}, this,4,4); //#
                this.down.alpha = 0.6;
                this.down.fixedToCamera = true;
                this.down.onInputDown.add(function(){
                    cursors.down.isDown = true;
                    //triggerKeyboardEvent(window,38,"keydown");
                });
                this.down.onInputUp.add(function(){
                    cursors.down.isDown = false;
                    //triggerKeyboardEvent(window,38,"keyup");
                });

            },
            hide:function(){
                if(isExists(this.left) && isExists(this.right) && isExists(this.up) && isExists(this.shot)) {
                    this.left.destroy();
                    this.right.destroy();
                    this.up.destroy();
                    this.shot.destroy();
                    this.down.destroy();
                }
            }
        },
        levels: {
            obj:[],
            text:[],
            text2: [],
            show:function(){
                //toolsGame.buttons.levels
                let item=0, itemMoveX=0, itemMoveY=0, theEnd=false;
                //alert(levelFile.activeIdLevel + " =? " + unlockLevels + " =? " + getCookies("unlock-levels"));

                //console.log(Object.keys(game.cache._cacheMap[7]).length);
                for (const key in game.cache._cacheMap[7]) {
                    if (game.cache._cacheMap[7].hasOwnProperty(key)) {
                        item++;
                        //console.log(key + " - " + item);
                        this.obj.push(item);
                        this.text.push(item);
                        this.text2.push(item);

                        if(item>9) {
                            itemMoveX=45*tileSize;
                            itemMoveY=5*tileSize;
                        }

                        theEnd=false;
                        if(item === Object.keys(game.cache._cacheMap[7]).length) {
                            theEnd = '?'
                        }
                        if(item<=unlockLevels || theEnd) {
                            this.obj[item] = game.add.button(5*tileSize*(item-1)+(3*tileSize)-itemMoveX, 22*tileSize+itemMoveY, 'buttonLevel', function(){
                                //console.log(this);
                                toolsGame.audio.breakBones();
                                levelFile.name='level'+this;
                                levelFile.activeIdLevel=this;
                                //alert(toolsGame.mainElements.player.numberLifes);
                                toolsGame.resetGameCookies();
                                startGame();
                            }, item, 0);
                            this.text2[item] = game.add.text(0, 0, (theEnd)?'Credits':"(" + (getCookies('coins-procent-'+item)?getCookies('coins-procent-'+item):0) +"%)" , {font: "12px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle"});
                            this.text2[item].setTextBounds(0, 0, 4*tileSize, 7*tileSize);
                            this.obj[item].addChild(this.text2[item]);
                        } else {
                            this.obj[item] = game.add.button(5*tileSize*(item-1)+(3*tileSize)-itemMoveX, 22*tileSize+itemMoveY, 'buttonLevel', function(){
                                // nothing to do
                            }, item, 1, 1);
                        }

                        this.text[item] = game.add.text(0, 0, (theEnd)?theEnd:item, {font: "24px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle"});
                        this.text[item].setTextBounds(0, 0, 4*tileSize, 4.5*tileSize);
                        this.obj[item].alpha = 0.8;
                        this.obj[item].addChild(this.text[item]);
                        this.obj[item].fixedToCamera = true;

                    }
                }
                amountLevels = item;
                //console.log("levels: " + amountLevels);
                //alert(this.start.length);
            },
            hide:function(){
                //alert(toolsGame.buttons.levels.obj.length);
                for(let i=1, iLength=this.obj.length; i<iLength; i++) {
                    //console.log(this.obj[i]);
                    this.obj[i].destroy();
                }
                this.obj=[];
                this.text=[];
                this.text2=[];

            }
        }
    },
    text: {
        obj: [],
        show: function(typeText,x,y,opacitySpec,textSpec,fontSpec,colorSpec,cameraFixed,idName,textShadow){
            if(this.obj[idName]) this.obj[idName].destroy();
            this.obj.push(idName);
            if(typeText === 'center')
            {
                this.obj[idName] = game.add.text(x, y, textSpec, { font: fontSpec, fill: colorSpec, boundsAlignH: "center", boundsAlignV: "middle"  });
                this.obj[idName].setTextBounds(x, y, game.width, game.height);
            }
            else
            {
                this.obj[idName] = game.add.text(x, y, textSpec, { font: fontSpec, fill: colorSpec });
            }
            this.obj[idName].alpha = opacitySpec;
            this.obj[idName].fixedToCamera = cameraFixed;
            if(textShadow) {
                this.obj[idName].setShadow(1, -1, 'rgba(0,0,0,1)', 0);
            }
            if(typeText === 'add-point') {
                //game.physics.arcade.enable([ this.obj[idName] ]);
                //console.log(this.obj[idName]);
                //this.obj[idName].enableBody = true;
                //this.obj[idName].body.allowGravity = false;
                //this.obj[idName].body.velocity.y=-50;
                game.add.tween(this.obj[idName]).to({y: (y-48)}, 900, Phaser.Easing.Linear.None, true);

                game.time.events.add(600,
                    function() {
                        const tween = game.add.tween(this.obj[idName]).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true);
                        tween.onComplete.add(function(o){
                            o.destroy();
                        }, this);
                    }, this
                );
            }

        },
        hide: function(idName){
            if(this.obj[idName]) this.obj[idName].destroy();
        }
    },
    image: {
        obj: [],
        show: function(x,y,nameSpriteOrImage,idName,opacitySpec,cameraFixed,scaleW,scaleH,frame,fade){
            if(this.obj[idName]) this.obj[idName].destroy();
            this.obj.push(idName);
            if(nameSpriteOrImage === 'boxTopMenu'){
                this.obj[idName] = game.add.tileSprite(x, y, game.scale.maxWidth, 48, nameSpriteOrImage);
            } else {
                this.obj[idName] = game.add.image(x, y, nameSpriteOrImage);
            }
            if(opacitySpec) this.obj[idName].alpha = opacitySpec;
            if(cameraFixed) this.obj[idName].fixedToCamera = cameraFixed;
            if(scaleW && scaleH) this.obj[idName].scale.setTo(scaleW,scaleH);﻿
            if(frame) this.obj[idName].frame = frame;﻿
            if(fade) {
                this.obj[idName].alpha=0;
                game.add.tween(this.obj[idName]).to({alpha: opacitySpec?opacitySpec:1}, 200, Phaser.Easing.Linear.None, true);
            }

        },
        hide: function(idName,fade){
            if(this.obj[idName]) {
                if(fade) {
                    const hide = game.add.tween(this.obj[idName]).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
                    hide.onComplete.add(function(o){
                        o.destroy();
                    }, this);
                } else {
                    this.obj[idName].destroy();
                }
            }
        }
    },

    createCenterObject: function(thatObj,x,y,name,type) {
        let width = game.cache.getImage(name).width,
            height = game.cache.getImage(name).height;
        if(type === "sprite") {
            width = game.cache._cache.image[name].frameWidth;
            height = game.cache._cache.image[name].frameHeight;
        }
        return thatObj.create((x*tileSize)+(2*tileSize)-(width﻿/2+tileSize+tileSize/2), (y*tileSize)-(height-2*tileSize), name);
    },
    createLeftObject: function(thatObj,x,y,name,type) {
        let height = game.cache.getImage(name).height;
        if(type == "sprite") {
            height = game.cache._cache.image[name].frameHeight;
        }
        return thatObj.create((x*tileSize), (y*tileSize)-(height-2*tileSize), name);
    },
    checkSpecialBlankBlockElementAndElevatorSound: function(lay,k) {
        if(k) {
            if (k.deltaY !== 0) {
                toolsGame.audio.elevator(.1);
            }
            else if (k.deltaX !== 0) {
                toolsGame.audio.elevator(.1);
            }
        }
        if(lay.index === 101) {
            lay.collideDown=true;
            lay.collideUp=true;
            lay.collideLeft=true;
            lay.collideRight=true;
        }
    },
    jumpCollision: function(o,yVelocity) {
        let jumpTimer = 0;
        if (game.time.now > jumpTimer) {
            o.body.velocity.y = -yVelocity;
            jumpTimer = game.time.now + yVelocity;
        }
    },
    mainElements: {
        player:{
            detectionHoldOnObject:function(o,numberAlgo) { // toolsGame.mainElements.player.detectionHoldOnObject()
                //console.log("my:");
                //console.log(this.obj.position.x-o.position.x);
                //console.log("phaser:");
                //console.log(game.physics.arcade.distanceBetween(toolsGame.mainElements.player.obj,o));

                if(this.obj.position.x>o.position.x-game.width/numberAlgo &&
                    this.obj.position.x<o.position.x+game.width/numberAlgo &&
                    this.obj.position.y>o.position.y-game.height/numberAlgo &&
                    this.obj.position.y<o.position.y+game.height/numberAlgo) {
                    return true;
                } else {
                    return false;
                }
            },
            detectionHoldOnTile:function(x,y,numberAlgo) { // toolsGame.mainElements.player.detectionHoldOnObject()
                if(this.obj.position.x>x*tileSize-game.width/numberAlgo &&
                    this.obj.position.x<x*tileSize+game.width/numberAlgo &&
                    this.obj.position.y>y*tileSize-game.height/numberAlgo &&
                    this.obj.position.y<y*tileSize+game.height/numberAlgo) {
                    return true;
                } else {
                    return false;
                }
            },
            countLifes:function(){ // toolsGame.mainElements.player.countLifes.f()
                //\\//
                if(!getCookies('Lifes')) {
                    toolsGame.mainElements.player.numberLifes = amountLife;
                } else {
                    toolsGame.mainElements.player.numberLifes = parseInt(getCookies('Lifes'));
                }

                if(!getCookies('main-Lifes')) {
                    toolsGame.mainElements.player.numberMainLifes = amountMainLife;
                } else {
                    toolsGame.mainElements.player.numberMainLifes = parseInt(getCookies('main-Lifes'));
                }

            },
            countCoins:function(){ // toolsGame.mainElements.player.countCoints.f()
                //\\//
                if(!getCookies('coins')) {
                    toolsGame.mainElements.player.numberCoins = 0;
                } else {
                    toolsGame.mainElements.player.numberCoins = parseInt(getCookies('coins'));
                }




                if(getCookies('coins-procent-' + levelFile.activeIdLevel)>0) {
                    toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory = getCookies('coins-procent-' + levelFile.activeIdLevel);
                }
                else {
                    toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory = 0;
                }

                toolsGame.mainElements.player.numberCoinsLevel = 0;
                toolsGame.mainElements.player.numberCoinsLevelProcent = 0;
                toolsGame.mainElements.logs.lengthBonusCoins = 0;

                //alert(getCookies('Lifes'));
                //toolsGame.mainElements.player.numberCoins = parseInt(getCookies('coins'));
            },
            removeKeepStone: function(){
                if(toolsGame.mainElements.stoneBigS.keepStone){
                    toolsGame.mainElements.stoneBigS.keepStone = false;
                    playerSpeedLeftRight = (toolsGame.mainElements.player.obj.scale.y !== 1)?300:200;
                    toolsGame.mainElements.stoneBigS.obj.forEach(function(s){
                        s.keepStone = false;
                    },this);
                }
            },
            lostLife: function(player,amount) {
                toolsGame.mainElements.player.removeKeepStone();

                if(!player.holdLostLife) {
                    player.holdLostLife = true;
                    // player.gun
                    //console.log(toolsGame.mainElements.player.gun.obj);

                    // if(toolsGame.mainElements.player.gun.obj) {
                    //    toolsGame.mainElements.player.gun.obj.alpha=0.1;
                    // }

                    //toolsGame.mainElements.player.gun.obj.alpha = 0;
                    if (!levelFile.blockedKeys && toolsGame.mainElements.player.numberLifes > 0) {
                        toolsGame.mainElements.player.numberLifes -= amount?amount:1;
                        toolsGame.audio.scream();
                        if(player.scale.y > 1) {
                            this.scale('restart');// same === toolsGame.mainElements.player.scale();
                        }
                        //player.scale.setTo(1,1);
                        //this.scale(); // same === toolsGame.mainElements.player.scale();
                    }
                    if (toolsGame.mainElements.player.numberLifes < 1) {


                        if(!levelFile.blockedKeys && !toolsGame.mainElements.player.gameOver) {
                            // player.body.x=saveX;
                            // player.body.y=saveY;

                            // shake durning lost Life
                            game.camera.shake(0.02, 450, true, Phaser.Camera.SHAKE_VERTICAL);
                            toolsGame.audio.quake(1);
                            levelFile.blockedKeys = true;
                            toolsGame.mainElements.player.numberLifes=0;
                            if(toolsGame.mainElements.player.gun.obj) {
                                toolsGame.mainElements.player.gun.obj.destroy();
                                toolsGame.mainElements.player.gun.obj=false;
                            }

                            // animation kill player
                            //console.log(toolsGame.mainElements.player.obj); //.events.onAnimationComplete
                            toolsGame.mainElements.player.obj.animations.play('kill-right');

                            toolsGame.mainElements.player.numberMainLifes--;
                            //console.log("kill...");
                        }
                        if(toolsGame.mainElements.player.numberMainLifes === 0) {
                            toolsGame.mainElements.player.gameOver = true;
                            // toolsGame.mainElements.player.obj.body.position.x=-10000;
                            // toolsGame.mainElements.player.obj.body.position.y=-10000;
                            // game over
                            // setTimeout(function(){
                            //     toolsGame.windows.boxMenu.show('game-over');
                            //     toolsGame.mainElements.player.gameOver = false;
                            // },600);

                            game.time.events.add(1500, function(){
                                toolsGame.windows.boxMenu.show('game-over');
                                //toolsGame.mainElements.player.gameOver = false;
                            }, this);

                        } else {
                            game.time.events.add(1200, function(){
                                toolsGame.mainElements.player.numberLifes=amountLife;
                                toolsGame.windows.boxTopMenu.f=false;
                                game.time.events.add(1000, function(){
                                    levelFile.blockedKeys = false;
                                    facing = 'idle';
                                }, this);
                            }, this);

                            // setTimeout(function(){
                            //     toolsGame.mainElements.player.numberLifes=amountLife;
                            //     toolsGame.windows.boxTopMenu.f=false;
                            //     setTimeout(function () {
                            //         levelFile.blockedKeys = false;
                            //         facing = 'idle';
                            //     },1000);
                            // },1200);
                        }
                    }

                    game.time.events.remove(player.timeoutKill);
                    player.timeoutKill = game.time.events.add(800, function(){
                        player.holdLostLife = false;
                        player.alpha = 1;
                        //if(levelFile.blockedKeys) player.alpha = 0;
                        game.time.events.remove(player.fltTime);
                    }, this);

                    // clearTimeout(player.timeoutKill);
                    // player.timeoutKill = setTimeout(function () {
                    // 	player.holdLostLife = false;
                    // 	player.alpha = 1;
                    // 	//if(levelFile.blockedKeys) player.alpha = 0;
                    // 	clearInterval(player.fltTime);
                    // }, 800);

                    // postac miga podczas kolizji z imtruzem/layerem z duzej wysokosci ubytek zycia

                    //game.time.events.loop
                    player.fltTime = game.time.events.loop(50,function () {
                        player.alpha = (player.alpha === 0.4) ?  1 : 0.4;
                    }, this);

                    // player.fltTime = setInterval(function () {
                    // 	player.alpha = (player.alpha === 0.4) ?  1 : 0.4;
                    // },50);
                }
                toolsGame.windows.boxTopMenu.f=false;
            },
            checkIfWasKilledAndOther: function(player,type){
                if(!theEndCredits) {
                    if(player.touchGround) { // toolsGame.mainElements.player.obj.touchGround
                        //clearTimeout(player.touchGroundTime);
                        game.time.events.remove(player.touchGroundTime);
                        player.touchGround=false;
                    }

                    // fix foe kladki-poziom - dopracowac
                    if(type==='kladki-poziom') {
                        player.onGround = true;
                    }
                    player.t1=true;
                    if(!player.onGround) {
                        toolsGame.audio.footStep();
                        //console.log("step");
                        player.onGround=true;
                    }

                    if(cursors.left.isDown || cursors.right.isDown) {
                        toolsGame.audio.footStep();
                    }

                    //console.log(toolsGame.mainElements.player.obj.body.y);
                    //console.log(toolsGame.mainElements.player.obj.body.blocked.left);

                    //przetestować jeszcze
                    if(jumpKillF && !toolsGame.mainElements.player.obj.body.blocked.left && !toolsGame.mainElements.player.obj.body.blocked.right) {
                        if(toolsGame.mainElements.player.obj.body.y-jumpKillY > 250) {
                            game.camera.shake(0.02, 250, true, Phaser.Camera.SHAKE_VERTICAL);
                            toolsGame.audio.quake(1);
                        }

                        if(type !== 'water' && toolsGame.mainElements.player.obj.body.y-jumpKillY > 400) {
                            //alert("kill");
                            toolsGame.mainElements.player.lostLife(player,3);
                        }
                        //console.log('coordination: ' + jumpKillY + ' / ' + toolsGame.mainElements.player.obj.body.y);
                        jumpKillF = false;
                    }
                }

            },
            gun:{
                obj: false, //toolsGame.mainElements.player.gun.obj
                startGun: false, //toolsGame.mainElements.player.gun.startGun
                bullets:{
                    obj: false, // toolsGame.mainElements.player.gun.bullets.obj
                    restartBullets:function(){ // toolsGame.mainElements.player.gun.bullets.restartBullets()
                        if(this.obj === true)
                        {
                            this.obj.z=0;
                            this.obj.destroy(true);
                        }
                        this.obj = game.add.group();
                        this.obj.enableBody = true;
                        this.obj.createMultiple(9, 'bullet');
                        this.obj.setAll('anchor.x', 0.5);
                        this.obj.setAll('anchor.y', 1);
                    }
                },
                visualGun:function(player){ // toolsGame.mainElements.player.gun.visualGun()
                    if(this.obj)
                    {
                        //console.log(player.obj.scale.y);
                        if(player.obj.scale.y!==1){
                            this.obj.scale.y = 1.2;
                            this.obj.tint =  16776960; //  * 0xFFFFFF; //200324
                        }
                        else {
                            this.obj.scale.y = 1;
                            this.obj.tint = 0xFFFFFF;
                        }

                        if ((player.obj.frame>=6 && player.obj.frame<=11)) {
                            this.obj.scale.x = -1;
                            this.obj.reset(player.obj.x + 37, player.obj.y + 33);
                        } else if(cursors.left.isDown) {
                            this.obj.scale.x = -1;
                            this.obj.reset(player.obj.x + 33, player.obj.y + 33);
                        } else if ((player.obj.frame>=0 && player.obj.frame<=5)) {
                            this.obj.scale.x = 1;
                            this.obj.reset(player.obj.x + 11, player.obj.y + 33);
                        } else if(cursors.right.isDown) {
                            this.obj.scale.x = 1;
                            this.obj.reset(player.obj.x + 15, player.obj.y + 33);
                        }
                    }
                },
                shot:function(player){ // toolsGame.mainElements.player.gun.shot()
                    if (fireButton.isDown && toolsGame.mainElements.player.numberLifes && !levelFile.blockedKeys)
                    {
                        if (player.countBullets > 0 && game.time.now > player.bulletTime)
                        {
                            //  Grab the first bullet we can from the pool
                            player.bullet = player.gun.bullets.obj.getFirstExists(false);

                            if (player.bullet)
                            {

                                player.countBulletsF = true;
                                player.countBullets--;
                                toolsGame.windows.boxTopMenu.f=false;
                                toolsGame.audio.shoot();

                                //clearTimeout(player.gun.startGun);
                                game.time.events.remove(player.gun.startGun);
                                if(!player.gun.obj)
                                {
                                    player.gun.obj = game.add.image(player.obj.x, player.obj.y, "gun");
                                }
                                player.bullet.body.gravity.y = -700;

                                player.gun.startGun=game.time.events.add(1000, function(){
                                    if(player.gun.obj)
                                    {
                                        player.gun.obj.destroy();
                                        player.gun.obj=false;
                                        game.time.events.remove(player.gun.startGun);
                                    }
                                }, this);



                                if ((player.obj.frame>=6 && player.obj.frame<=11) || cursors.left.isDown)
                                {
                                    player.bullet.reset(player.obj.x + 10, player.obj.y + 42);
                                    player.bullet.body.velocity.x = -1400;
                                    player.bullet.direction = 'left';
                                }
                                else if ((player.obj.frame>=0 && player.obj.frame<=5) || cursors.right.isDown)
                                {
                                    player.bullet.reset(player.obj.x + 30, player.obj.y + 42);
                                    player.bullet.body.velocity.x = 1400;
                                    player.bullet.direction = 'right';
                                }
                                //player.body.allowGravity = false;
                                player.bulletTime = game.time.now + 200;
                                //console.log(bullet.z);
                            }
                            else
                            {
                                player.bullet=0;
                                player.gun.bullets.restartBullets();
                            }
                        }
                    }
                }
            },
            bullet: false,//toolsGame.mainElements.player.bullet
            bulletTime: 0,//toolsGame.mainElements.player.bulletTime
            countBulletsF: false,
            countBullets: 6, //toolsGame.mainElements.player.countBullets
            jumpTimer: 0, //toolsGame.mainElements.player.jumpTimer
            obj: false,
            add:function(x,y){ //add visual player
                if(this.obj==false)
                {
                    //toolsGame.mainElements.player.obj =  player
                    this.obj = game.add.sprite((x*tileSize), ((y*tileSize)-(4*tileSize)), 'dude');
                    game.physics.enable(this.obj, Phaser.Physics.ARCADE);
                    this.obj.body.bounce.y = 0.3;
                    this.obj.body.collideWorldBounds = true;

                    this.obj.animations.add('idle-right', [0, 1, 2, 3, 4, 5,0, 1, 2, 3, 4, 5,0, 1, 33, 3, 4, 5], 6, true);

                    this.obj.animations.add('idle-right', [0, 1, 2, 3, 4, 5,0, 1, 2, 3, 4, 5,0, 1, 33, 3, 4, 5], 6, true);
                    this.obj.animations.add('idle-left', [6, 7, 8, 9, 10, 11, 6, 7, 8, 9, 10, 11, 6, 7, 34, 9, 10, 11], 6, true);

                    this.obj.animations.add('end-level', [38, 37, 36, 37, 38], 10, true); // false - animacja konczy sie na ostatnim slajdzie

                    this.obj.animations.add('jump-right', [25], 20, true);
                    this.obj.animations.add('jump-left', [26], 20, true);

                    this.obj.animations.add('kill-right', [28,29,30,31,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32], 16, false).onComplete.add(function(){
                        toolsGame.mainElements.player.generateAgain = true;
                    }, this);

                    this.obj.animations.add('left', [18, 19, 20, 21, 22, 23], 20, true);
                    this.obj.animations.add('right', [12, 13, 14, 15, 16, 17], 20, true);
                    //this.obj.body.allowGravity = false;
                    //game.camera.follow(this.obj);
                    game.camera.follow(this.obj, Phaser.Camera.FOLLOW_LOCKON, 0.1,0.1);
                    //console.log(game.camera.lerp);

                    this.gun.bullets.restartBullets();
                    if(!getCookies('bullets')) {
                        this.countBullets=amountBullet;
                    } else {
                        this.countBullets=parseInt(getCookies('bullets'));
                    }
                    this.gun.obj=false;
                    saveX = x*tileSize;
                    saveY = y*tileSize;
                    //console.log(x + " x " + y);
                }
            },
            velocityNormal: playerJumpVelocityNormalSmall,
            velocityWater: playerJumpVelocityWaterSmall,
            velocityStone: playerJumpVelocityStoneSmall,
            scale: function(type){ // toolsGame.mainElements.player.scale();
                //console.log("tint:");
                //console.log(this.obj.tint);
                if(type==='increase') {
                    this.obj.scale.setTo(1,playerScaleBig);
                    playerSpeedLeftRight = 300;
                    //this.obj.tint = 0x000000;
                    this.obj.tint = 16776960; // 200324 * 0xFFFFFF; //   0xFF7E1C; // 200324 * 0xFFFFFF; //Math.random()
                } else {
                    if(type === 'restart') toolsGame.audio.scaleDown();
                    playerSpeedLeftRight = 200;
                    this.obj.scale.setTo(1,1);
                    this.obj.tint = 0xFFFFFF;
                }
                const playerScale = toolsGame.mainElements.player.obj.scale.y !== 1;
                this.velocityNormal = (playerScale)?playerJumpVelocityNormalBig:playerJumpVelocityNormalSmall; // 530:430
                this.velocityWater = (playerScale)?playerJumpVelocityWaterBig:playerJumpVelocityWaterSmall; // 300:200
                this.velocityStone = (playerScale)?playerJumpVelocityStoneBig:playerJumpVelocityStoneSmall; // 300:200
            }
        },
        intruders:{ // toolsGame.mainElements.intruders
            obj: true,
            id: 0,
            add: function(x,y,type) {
                //toolsGame.mainElements.intruders.obj =  intruders
                const intruz = this.obj.create((x*tileSize), ((y*tileSize)-(2*tileSize)), 'intruder'+type);
                intruz.scale.setTo(0, 0);
                //console.log(intruz.scale);
                //intruz.scale.setTo(1, 1);
                if(type===6){
                    game.add.tween(intruz.scale).to({x: 1.18, y: 1.23}, 400, Phaser.Easing.Linear.None, true);
                } else {
                    game.add.tween(intruz.scale).to({x: 1, y: 1}, 400, Phaser.Easing.Linear.None, true);
                }

                intruz.type = type;
                intruz.wspStartX = x;
                intruz.wspStartY = y;

                game.physics.enable(intruz, Phaser.Physics.ARCADE);
                intruz.body.bounce.y = 0.4;
                intruz.body.collideWorldBounds = true;
                // intruz.animations.add('left', [6, 7, 8, 9, 10, 11], 10, true); //12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
                // intruz.animations.add('right', [0, 1, 2, 3, 4, 5], 10, true);
                intruz.randomSpeed=randomArray([90,110,130]);
                if(type===4) {
                    intruz.animations.add('left', [14,15,16,17,18,19,20,21,22,23,24,25,26,27], intruz.randomSpeed/8, true); //12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
                    intruz.animations.add('right', [0,1,2,3,4,5,6,7,8,9,10,11,12,13], intruz.randomSpeed/8, true);
                    intruz.animations.add('idle-right', [6], 6, true);
                    intruz.animations.add('idle-left', [20], 6, true);
                    intruz.animations.add('kill', [28,29,30,31,32,33,34,35], 15, false);
                    intruz.animations.add('turn-left', [40,37], 5, false);
                    intruz.animations.add('turn-right', [41,37], 5, false);
                } else if (type===5 || type===7) {
                    //intruz.animations.add('left', [14,15,16,17,18,21,22,23,24], intruz.randomSpeed/8, true); //12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
                    intruz.animations.add('left', [14,15,16,17,18,21,22,23,24,25], intruz.randomSpeed/8, true); //12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 // old condor
                    //intruz.animations.add('right', [0,1,2,3,4,7,8,9,10], intruz.randomSpeed/8, true);
                    intruz.animations.add('right', [0,1,2,3,4,7,8,9,10,11], intruz.randomSpeed/8, true); // old condor
                    intruz.animations.add('idle-right', [6], 6, true);
                    intruz.animations.add('idle-left', [20], 6, true);
                    intruz.animations.add('kill', [28, 29, 30, 31, 32,39,40,41,42,43,44,45,46,47,47,47,47], 15, false);
                    //intruz.animations.add('kill', [0,1,2,3,4,7,8,9,10,11], intruz.randomSpeed/8, true); // old condor
                    //intruz.animations.add('kill', [28,29,30,31,32,33,34,35], 15, false);
                    //intruz.animations.add('kill', [28, 29, 30, 31, 32,39,40,41,42,43,44,45,46,47], 20, false);
                    intruz.animations.add('turn-left', [40,37], 5, false);
                    intruz.animations.add('turn-right', [41,37], 5, false);
                } else {
                    intruz.animations.add('left', [18, 19, 20, 21, 22, 23], intruz.randomSpeed/8, true); //12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
                    intruz.animations.add('right', [12, 13, 14, 15, 16, 17], intruz.randomSpeed/8, true);
                    intruz.animations.add('idle-right', [0, 1, 2, 3, 4, 5,0, 1, 2, 3, 4, 5,0, 1, 33, 3, 4, 5], 6, true);
                    intruz.animations.add('idle-left', [6, 7, 8, 9, 10, 11, 6, 7, 8, 9, 10, 11, 6, 7, 34, 9, 10, 11], 6, true);
                    intruz.animations.add('kill', [28, 29, 30, 31, 32,39,40,41,42,43,44,45,46,47], 20, false);
                }
                intruz.randomMove=parseInt(Math.random() * 2) ?  'intruzRight' : 'intruzLeft';
                //console.log("c i");
            },
            jump: function(intruz,yVelocity) {
                let jumpTimerIntruz = 0;
                if (intruz.body.onFloor() && game.time.now > jumpTimerIntruz) {
                    intruz.body.velocity.y = -yVelocity;
                    jumpTimerIntruz = game.time.now + yVelocity;
                    if(intruz.type === 5 || intruz.type === 7) {
                        intruz.jumpToFly = true;
                        game.time.events.add(300,function(){
                            intruz.jumpToFly = false;
                        },this);
                    }
                }
            },
            collisionIntruz: function(intruz,destiny){ // toolsGame.mainElements.intruders.collisionIntruz

                if(intruz.randomMove==='intruzRight' || intruz.randomMove==='intruzLeft') {
                    intruz.saveRandom = intruz.randomMove;
                } else {
                    intruz.saveRandom = 'intruzRight';
                }

                const ftf=game.time.events.loop(1000/60,function(){
                    if(isEven(Math.ceil(game.time.now/100)))
                    {
                        //if(destiny=="total-kill") intruz.alpha=0.2;
                        intruz.body.velocity.y = -30;
                    }
                    else
                    {
                        //intruz.alpha=1;
                    }
                    //intruz.scale.setTo(0.5,0.5);
                    if(destiny!=="total-kill")
                    {
                        if(intruz.type === 4) {
                            if(intruz.randomMove=='intruzRight') {
                                intruz.frame = 38;
                            }
                            else if(intruz.randomMove=='intruzLeft') {
                                intruz.frame = 39;
                            }
                        }

                        if(intruz.randomMove=='intruzRight' || intruz.randomMove=='intruzLeft')
                        {
                            intruz.randomMove='intruzStop';
                            toolsGame.mainElements.player.obj.body.velocity.y = -playerJumpVelocityIntruder;
                        }
                    }

                }, this);

                if(destiny==="total-kill")
                {
                    toolsGame.audio.breakBones(0.5);
                    toolsGame.audio.explosionIntruder();
                    if(intruz.type === 4) {
                        intruz.animations.add('left', [28,29,30,31,32,33,34,35], 15, false);
                        intruz.animations.add('right', [28,29,30,31,32,33,34,35], 15, false);
                    } else if(intruz.type === 5 || intruz.type === 7) {
                        //alert("x");
                        //intruz.animations.stop();
                        //intruz.animations.play('kill');
                        intruz.animations.add('left', [28, 29, 30, 31, 32,39,40,41,42,43,44,45,46,47,47,47,47], 15, false);
                        intruz.animations.add('right', [28, 29, 30, 31, 32,39,40,41,42,43,44,45,46,47,47,47,47], 15, false);
                    } else {
                        intruz.animations.add('left', [28, 29, 30, 31, 32,39,40,41,42,43,44,45,46,47], 20, false);
                        intruz.animations.add('right', [28, 29, 30, 31, 32,39,40,41,42,43,44,45,46,47], 20, false);
                    }
                    intruz.randomSpeed=0;
                    game.time.events.add(500, function(){
                        intruz.killed = false;
                        game.time.events.remove(ftf);
                        intruz.randomMove='intruzDelete';
                    }, this);
                }
                else
                {
                    game.time.events.add(100, function(){
                        game.time.events.remove(ftf);
                        //intruz.randomMove='intruzRight'
                        //console.log(intruz.saveRandom);
                        intruz.randomMove=intruz.saveRandom;
                        //intruz.alpha=1;
                    }, this);
                }
                toolsGame.mainElements.player.obj.body.overlapY=0;
            },
            collisionBack: function(i) {
                if(!i.checkPosition) {
                    i.checkPosition = i.body.position.x;
                    // setTimeout(function () {
                    //     //console.log(i.checkPosition + " - " + i.body.position.x);
                    //     if(Math.abs(i.checkPosition-i.body.position.x)<2) {
                    //         //console.log("stoi w miejscu");
                    //         if(i.randomMove === 'intruzRight') i.randomMove='intruzLeft';
                    //         else i.randomMove='intruzRight';
                    //     }
                    //     i.checkPosition = false;
                    // },600);

                    game.time.events.add(600, function(){
                        //console.log(i.checkPosition + " - " + i.body.position.x);
                        if(Math.abs(i.checkPosition-i.body.position.x)<2) {
                            //console.log("stoi w miejscu");
                            if(i.randomMove === 'intruzRight') i.randomMove='intruzLeft';
                            else i.randomMove='intruzRight';
                        }
                        i.checkPosition = false;
                    }, this);

                }
            }
        },
        coins:{
            add: function(x,y) {
                //toolsGame.mainElements.coins.obj = coins
                const coin = this.obj.create(x*tileSize, y*tileSize, 'coin');
                coin.animations.add('run',[0,1,2,3,4,5,6,7,8,8,7,6,5,4,3,2,1,0]);
                coin.animations.play('run', 18, true);
                coin.body.allowGravity = false;
            }
        },

        invisibleLogs: {
            add: function(x,y) {
                const log = this.obj.create(x*tileSize, y*tileSize, 'log');
                //log.animations.add('run',[11]);
                //log.animations.play('run');
                log.frame=11;

                game.physics.enable(log, Phaser.Physics.ARCADE);

                log.scale.setTo(3, 1);
                log.body.allowGravity = false;
                log.body.collideWorldBounds = true;
                log.body.immovable = true;
            }
        },

        logs:{
            lengthBonusCoins: 0,
            add: function(x,y,type,name,lotterySuprise) {
                //toolsGame.mainElements.log.obj = logs
                const log = this.obj.create(x*tileSize, y*tileSize, name);
                log.frame=0;

                //log.animations.add('run');

                game.physics.enable(log, Phaser.Physics.ARCADE);
                //log.animations.play('run', 15, true);
                log.body.allowGravity = false;
                log.body.collideWorldBounds = true;
                log.body.immovable = true;
                if(type) {
                    toolsGame.audio.bingo();
                }
                if(type==='coin') {
                    log.coin = true;
                } else if(type==='surprise'){
                    if(name==='log') {
                        const lotterySuprise = randomBetween(1,4);
                        //console.log(lotterySuprise);
                        switch (lotterySuprise) {
                            case 1:
                                log.surprise = 1; // bulletsgun
                                break;
                            case 2:
                                log.surprise = 2;  // life
                                break;
                            case 3:
                                log.surprise = 3; // intruz type 3
                                break;
                            case 4:
                                log.surprise = 5; //  intruz type 5 (bird)

                                break;
                        }
                    } else if(name==='stone') {
                        const lotterySuprise = randomBetween(1,2);
                        //console.log(lotterySuprise);
                        switch (lotterySuprise) {
                            case 1:
                                log.surprise = 1; // bulletsgun
                                break;
                            case 2:
                                log.surprise = 2; // life
                                break;
                        }
                    }
                }
            },
            destruction:function(p) {
                if(!p.onlynOne) {
                    const savePX=p.x/tileSize, savePY=p.y/tileSize-3;
                    //p.body.allowGravity = true;
                    p.body.velocity.y = -330;
                    if(facing === 'left') {
                        p.body.velocity.x = -130;
                    } else if(facing === 'right') {
                        p.body.velocity.x = 130;
                    }

                    toolsGame.audio.breakGround();

                    p.body.checkCollision.up=false;
                    p.body.checkCollision.down=false;
                    p.body.checkCollision.left=false;
                    p.body.checkCollision.right=false;

                    game.time.events.add(50, function(){
                        p.body.allowGravity = true;
                        //p.body.checkCollision.down=false;
                    },this);
                    p.animations.add('run');
                    game.time.events.add(300, function(){
                        p.animations.play('run', 20, false);
                    },this);

                    // jesli id = 514 to dostajemy bonusowe zloto
                    if(p.coin) {
                        game.time.events.add(200, function(){
                            toolsGame.mainElements.coins.add(savePX, savePY);

                        },this);
                    } else if(p.surprise) {
                        game.time.events.add(200, function(){
                            //console.log(p.surprise);
                            switch (p.surprise) {
                                case 1:
                                    toolsGame.mainElements.bulletsGuns.add(savePX, savePY);
                                    break;
                                case 2:
                                    toolsGame.mainElements.LifeSingleS.add(savePX, savePY);
                                    break;
                                case 3:
                                    toolsGame.mainElements.intruders.add(savePX, savePY, 3);
                                    break;
                                case 4:
                                    toolsGame.mainElements.coins.add(savePX, savePY);
                                    break;
                                case 5:
                                    toolsGame.mainElements.intruders.add(savePX, savePY, 5);
                                    break;
                            }
                        },this);
                    }

                    game.time.events.add(900, function(){
                        // toolsGame.mainElements.coins.add(p.saveX/tileSize, p.saveY/tileSize);
                        p.kill();
                    }, this);
                    p.onlynOne= true;
                }
            }
        },

        Lifes:{ //toolsGame.mainElements.Lifes.obj = Lifes
            add: function(x,y) {
                //toolsGame.mainElements.Lifes.obj = Lifes
                const Life = this.obj.create(x*tileSize, y*tileSize, 'Life');
                //Life.scale.setTo(1.2, 1.2);
                Life.animations.add('run',[2,3,4,5,6,7,8,8,7,6,5,4,3,2,1,0,0,1]);
                Life.animations.play('run', 18, true);
                Life.body.allowGravity = false;
            }
        },
        LifeSingleS:{ //toolsGame.mainElements.Lifes.obj = Lifes
            add: function(x,y) {
                const Life = this.obj.create(x*tileSize, y*tileSize, 'Life2');
                Life.animations.add('run',[4,5,6,7,8,8,7,6,5,4,3,2,1,0,0,1,2,3]);
                Life.animations.play('run', 18, true);
                Life.body.allowGravity = false;
            }
        },
        bulletsGuns:{
            add: function(x,y) {
                //toolsGame.mainElements.bulletsGuns.obj = bullets_guns
                const bullets_gun = this.obj.create((x*tileSize)-5, (y*tileSize)-5, 'bullets_gun');
                bullets_gun.animations.add('run',[8,7,6,5,4,3,2,1,0,0,1,2,3,4,5,6,7,8]);
                bullets_gun.animations.play('run', 18, true);
                bullets_gun.body.allowGravity = false;
            }
        },
        keys: {
            add: function(x,y) {
                const key = this.obj.create((x*tileSize), (y*tileSize), 'key');
                key.animations.add('run',[7,8,8,7,6,5,4,3,2,1,0,0,1,2,3,4,5,6]);
                key.animations.play('run', 18, true);
                key.body.allowGravity = false;
            }
        },
        locks: {
            add: function(x,y,reverse) {
                const lock = this.obj.create((x*tileSize)+(reverse?tileSize:0), (y*tileSize), 'lock');
                if(reverse) lock.scale.x *= -1;
                lock.body.allowGravity = false;
            }
        },
        doors: {
            add: function(x,y, none) {
                const door = toolsGame.createCenterObject(this.obj,x,y,"door");
                game.physics.enable(door, Phaser.Physics.ARCADE);
                door.body.allowGravity = false;
                door.body.collideWorldBounds = true;
                door.body.immovable = true; // blokowanie objektu
                //console.log(door);
                if(none) {
                    door.zero = true;
                    door.body.checkCollision.none=true;
                    door.scale.setTo(0, 0);
                }
            }
        },
        doorsHorizontal: {
            //obj: true,
            add: function(x,y, none) {
                const door = toolsGame.createCenterObject(this.obj,x,y,"door-horizontal");
                game.physics.enable(door, Phaser.Physics.ARCADE);
                door.body.allowGravity = false;
                door.body.collideWorldBounds = true;
                door.body.immovable = true;
                if(none) {
                    door.zero = true;
                    door.body.checkCollision.none=true;
                    door.scale.setTo(0, 0);
                }
            }
        },
        openDoor:function(l) {
            let ind1 = 0;
            toolsGame.mainElements.doorsHorizontal.obj.forEach(function(doorH){
                doorH.index = ind1;
                ind1++;
            },this);
            let ind2 = 0;
            toolsGame.mainElements.doors.obj.forEach(function(door){
                door.index = ind2;
                ind2++;
            },this);

            const distanceArray = [];
            toolsGame.mainElements.doors.obj.forEach(function(door){
                distanceArray.push(game.physics.arcade.distanceBetween(l,door));
                //console.log(game.physics.arcade.distanceBetween(l,door));
            },this);
            const minDistnaceArray = Math.min.apply(null, distanceArray);

            const distanceArrayH = [];
            toolsGame.mainElements.doorsHorizontal.obj.forEach(function(doorH){
                distanceArrayH.push(game.physics.arcade.distanceBetween(l,doorH));
                //console.log(game.physics.arcade.distanceBetween(l,door));
            },this);
            const minDistnaceArrayH = Math.min.apply(null, distanceArrayH);


            toolsGame.mainElements.doors.obj.forEach(function(door){

                if(isExists(door) && !door.deactive) {
                    if (minDistnaceArray === game.physics.arcade.distanceBetween(l, door)) {
                        //console.log(door.index);
                        if(isExists(door) && !door.deactive) {
                            if(!door.zero) {
                                door.deactive = true;
                                door.body.velocity.y = -50;
                                toolsGame.audio.doorLift();
                                const doorYSave = Math.ceil(door.y/tileSize);
                                const timeDoorLoop = game.time.events.loop(100, function(){
                                    //console.log("------------");
                                    //console.log(Math.ceil(door.y/tileSize));
                                    //console.log(door.y);
                                    //console.log(door.body.y);
                                    //console.log(door);
                                    if(Math.ceil(door.y/tileSize) <= doorYSave - 10 ){
                                        door.body.velocity.y = 0;
                                        game.time.events.remove(timeDoorLoop);
                                    }
                                }, this);
                                // game.time.events.add(3000, function(){
                                //     door.body.velocity.y = 0;
                                // }, this);
                            }
                        }
                    }
                }
            },this);

            toolsGame.mainElements.doorsHorizontal.obj.forEach(function(doorH){

                if (minDistnaceArrayH === game.physics.arcade.distanceBetween(l, doorH)) {
                    if (isExists(doorH) && !doorH.deactive) {
                        if(!doorH.zero) {
                            doorH.deactive = true;
                            toolsGame.mainElements.explosion.add(doorH.x / tileSize, doorH.y / tileSize);
                            doorH.kill();
                        }
                    }
                }
            },this);
        },
        cacti:{
            add: function(x,y) {
                const cactus = toolsGame.createCenterObject(this.obj,x,y,"cactus");
                cactus.body.allowGravity = false;
            }
        },
        grassLeft: {
            add: function(x,y) {
                const grass = toolsGame.createLeftObject(this.obj,x,y,"grassLr");
                grass.body.allowGravity = false;
            }
        },
        grassAnim: {
            add: function(x,y,type) {
                const grass = toolsGame.createCenterObject(this.obj,x,y,"grass-lr-anim","sprite");
                grass.animations.add('run',[0,1,2,3,4,5,5,4,3,2,1,0]);
                grass.animations.play('run', 8, true);
                if(type==='right') {
                    grass.scale.x *= -1;
                    grass.anchor.setTo(1,0);﻿
                }
                grass.body.allowGravity = false;
            }
        },

        trees: {
            add: function(x,y) {
                const tree = toolsGame.createCenterObject(this.obj,x,y,"tree","sprite");
                tree.animations.add('run');
                tree.animations.play('run', 8, true);
                tree.body.allowGravity = false;
            }
        },
        cactusAnimateS: {
            add: function(x,y) {
                const c = toolsGame.createCenterObject(this.obj,x,y,"cactus-animate","sprite");
                c.animations.add('run',[0,1,2,3,4,3,2,1,0]);
                c.animations.play('run', 10, true);
                c.body.allowGravity = false;
                c.body.width = 39;  // 61,94
                c.body.height = 70;
                c.body.offset.y=11;
                c.body.offset.x=11;
            }
        },
        grassRight: {
            add: function(x,y) {
                const grass = toolsGame.createLeftObject(this.obj,x,y,"grassLr");
                grass.body.allowGravity = false;
                grass.scale.x *= -1;
            }
        },

        explosion:{
            add: function(x,y) {
                const e = toolsGame.createCenterObject(this.obj,x,y-1,"explosion","sprite");
                e.animations.add('run').onComplete.add(function(o){
                    o.kill();
                }, this);
                e.animations.play('run', 16, false);
                e.body.allowGravity = false;
                toolsGame.audio.explosion(0.5);
            }
        },

        stoneBigExplosion:{
            add: function (x,y) {
                const e = toolsGame.createCenterObject(this.obj,x,y+1,"stone-big-explosion","sprite");
                e.animations.add('run').onComplete.add(function(o){
                    o.kill();
                }, this);
                e.animations.play('run', 40, false);
                e.body.allowGravity = false;
            }
        },

        stoneBigS: {
            add: function(x,y) {
                const s = toolsGame.createLeftObject(this.obj,x,y,"stone-big");
                game.physics.enable(s, Phaser.Physics.ARCADE);
                s.body.collideWorldBounds = true;
                s.allowGravity = true;
                s.body.height = 40;
                s.body.width = 40;
                //s.body.offset.x=10;
                s.anchor.setTo(0.5, 0.5);
                s.angle = randomBetween(0,180);
            }
        },

        caves:{
            add: function(x,y) {
                const cave = this.obj.create((x*tileSize)+(2*tileSize), (y*tileSize)-240, 'cave');
                cave.body.allowGravity = false;
            }
        },
        // fogSingleS:{
        //     add: function(x,y) {
        //         const f = toolsGame.createCenterObject(this.obj,x,y,'fog-single',"sprite");
        //         f.animations.add('run');
        //         f.animations.play('run', 9, true);
        //         f.alpha = .65;
        //         f.body.allowGravity = false;
        //     }
        // },
        fogSingleS:{
            add: function(x,y) {
                const f = toolsGame.createCenterObject(this.obj,x,y,'fog-single',"sprite");
                f.animations.add('run');
                //f.animations.play('run', 9, true);
                f.animations.play('run', 9, true);
                f.alpha = .8;
                f.body.allowGravity = false;
            }
        },
        buildings:{
            //obj: true,
            add: function(x,y,name) {
                const building = toolsGame.createCenterObject(this.obj,x,y,name); //this.obj.create((x*tileSize)+(2*tileSize)-(game.cache.getImage("building1").width﻿/2), (y*tileSize)-(game.cache.getImage("building1").height-tileSize), 'building1');
                building.body.allowGravity = false;
            }
        },
        blackboards:{
            //obj: true,
            add: function(x,y,name) {
                const blackboard = toolsGame.createCenterObject(this.obj,x,y,name); //this.obj.create((x*tileSize)+(2*tileSize)-(game.cache.getImage("building1").width﻿/2), (y*tileSize)-(game.cache.getImage("building1").height-tileSize), 'building1');
                blackboard.body.allowGravity = false;
            }
        },

        mines:{
            //obj: true,
            add: function(x,y) {
                const building2 = toolsGame.createCenterObject(this.obj,x+6.5,y,"mine-part-2","sprite");
                building2.animations.add('run',[0,1,2,3,4,5,4,3,2,1,0,6,7,8,9,10,9,8,7,6]);
                building2.animations.play('run', 12, true);

                building2.body.allowGravity = false;
                const building1 = toolsGame.createCenterObject(this.obj,x-0.2,y,"mine-part-1");
                building1.body.allowGravity = false;
            }
        },
        waters:{
            //obj: true,
            add: function(x,y,type) {
                const water = toolsGame.createLeftObject(this.obj,x,y,type?type:"water","sprite");
                water.animations.add('run');
                water.animations.play('run', 16, true);
                water.body.allowGravity = false;
                water.alpha = type?.7:.7;
                if(type==='water-red') {
                    water.type='water-red';
                }
            }
        },
        waterStaticS:{
            //obj: true,
            add: function(x,y,type,align) {
                let water;
                if(align==="center") {
                    water = toolsGame.createCenterObject(this.obj,x,y,type?type:"water","sprite");
                } else {
                    water = toolsGame.createLeftObject(this.obj,x,y,type?type:"water","sprite");
                }
                water.body.allowGravity = false;
                water.alpha = type?.7:.7;
                if(type==='water-red') {
                    water.type='water-red';
                }
            }
        },
        firebs:{
            //obj: true,
            add: function(x,y,randomStart,typeFire) {
                const fireb = toolsGame.createLeftObject(this.obj,x,y,typeFire?"fireb2":"fireb","sprite");
                if(!typeFire) {
                    fireb.animations.add('run1',[0,1,2,1]);
                    fireb.animations.add('run2',[3,4,5,4]);
                } else {
                    fireb.typeFire=true;
                }
                fireb.body.allowGravity = false;
                fireb.alpha = 0;
                fireb.randomStart = randomStart;
            }
        },
        splashs:{
            //obj: true,
            add: function(x,y,typeColor,typeName) {

                const splash = toolsGame.createCenterObject(this.obj,x,y,typeColor?typeColor:"splash","sprite");
                splash.animations.add('run').onComplete.add(function(s){
                    //toolsGame.mainElements.player.obj.gForceWaterOnlyeOne = false;
                    s.kill();
                }, this);
                splash.animations.play('run', 30, false);
                splash.body.allowGravity = false;
                splash.alpha = .6;
                if(typeName==='blood') {
                    splash.position.y = splash.position.y - 2*tileSize;
                    splash.position.x = splash.position.x + tileSize;
                    splash.scale.setTo(.8, .8);
                    splash.alpha=.9;
                    // splash.scale.y *= -1;
                    // splash.anchor.setTo(.5,.5);﻿
                } else {
                    toolsGame.audio.splash();
                }
            }
        },
        endLevelS:{ //end_level_s
            //obj: true, // toolsGame.mainElements.endLevelS.obj = end_level_s
            add: function(x,y) {

                const end_level = toolsGame.createCenterObject(this.obj,x,y,"end_level","sprite");
                end_level.animations.add('run');
                end_level.animations.play('run', 17, true);
                end_level.body.allowGravity = false;
            }
        },
        saveLevelS:{
            //obj: true, // toolsGame.mainElements.endLevelS.obj = end_level_s
            add: function(x,y,type) {

                const save_level = toolsGame.createCenterObject(this.obj,x,y,"save_level","sprite");
                let frames1, frames2;
                if(type==='<-') {
                    frames1=[26,25,24,23,22,22,23,24,25,26,26,21,20,19,18,18,19,20,21,26]; // 18-26
                    frames2=[35,34,33,32,31,31,32,33,34,35,35,30,29,28,27,27,28,29,30,35]; // 27-35
                } else {
                    frames1=[0, 1, 2, 3, 4, 4, 3, 2, 1, 0, 0, 5, 6, 7, 8, 8, 7, 6, 5, 0];
                    frames2=[9,10,11,12,13,13,12,11,10,9,9,14,15,16,17,17,16,15,14,9];
                }
                save_level.animations.add('run1',frames1);
                save_level.animations.add('run2',frames2);
                save_level.animations.play('run1', 17, true);
                save_level.body.allowGravity = false;
            }
        },
        fire: {
            fireAnimation: function(that,x,y,type) {
                const fire = that.obj.create(x, y, type);
                fire.animations.add('run');
                fire.animations.play('run', randomBetween(16,20), true);
                fire.alpha = .8;
                fire.body.allowGravity = false;
            },
            fireUpS:{
                //obj: true,
                add: function(x,y) {
                    toolsGame.mainElements.fire.fireAnimation(this,(x*tileSize)-4,(y*tileSize)-8,'fire_up');
                }
            },
            fireUpNormalS:{
                add: function(x,y) {
                    toolsGame.mainElements.fire.fireAnimation(this,(x*tileSize)-4,(y*tileSize)-(1.5*tileSize),'fire_up_normal');
                }
            },
            fireDownS:{
                //obj: true,
                add: function(x,y) {
                    toolsGame.mainElements.fire.fireAnimation(this,(x*tileSize)-4,(y*tileSize),'fire_down');
                }
            },
            fireLeftS:{
                //obj: true,
                add: function(x,y) {
                    toolsGame.mainElements.fire.fireAnimation(this,(x*tileSize)-8,(y*tileSize)-4,'fire_left');
                }
            },
            fireRightS:{
                //obj: true,
                add: function(x,y) {
                    toolsGame.mainElements.fire.fireAnimation(this,(x*tileSize),(y*tileSize)-4,'fire_right');
                }
            },
        },
        windmills:{
            //obj: true,
            add: function(x,y) {
                //alert(game.cache._cache.image["windmill"].frameWidth);
                //console.log(game.cache);
                // alert(game.cache.getImage("windmill"));
                const windmill = toolsGame.createCenterObject(this.obj,x,y,"windmill","sprite"); //  this.obj.create((x*tileSize)-52, (y*tileSize)-306, 'windmill');
                windmill.animations.add('run');
                windmill.animations.play('run', 20, true);
                windmill.body.allowGravity = false;
            }
        },
        windmillNewS:{ // toolsGame.mainElements.windmillNewS.obj
            //obj1: true,
            //obj2: true,
            add: function(x,y) {
                const w2 = toolsGame.createCenterObject(this.obj2,x,y,"windmill_2_new"); //this.obj2.create((x*tileSize), (y*tileSize)-200, 'windmill_2_new');
                w2.body.allowGravity = false;

                const  w1 =  this.obj1.create((x*tileSize)+9, (y*tileSize)-240, 'windmill_1_new'); //  this.obj.create((x*tileSize)-52, (y*tileSize)-306, 'windmill');
                w1.anchor.setTo(0.5, 0.5);
                w1.body.allowGravity = false;
            },
        },
        kladki:{
            kladkaPlayerBounceReset: true, // toolsGame.mainElements.kladki.kladkaPlayerBounceReset
            poziom: {
                //obj: true, // toolsGame.mainElements.kladki.poziom.obj = kladki
                add: function(x,y){
                    const kladkaPoz = this.obj.create(x*tileSize, y*tileSize, 'kladka-short');
                    game.physics.enable(kladkaPoz, Phaser.Physics.ARCADE);
                    kladkaPoz.body.collideWorldBounds = true;
                    kladkaPoz.body.allowGravity = false;
                    kladkaPoz.body.immovable = true;
                }
            },
            //\\
            run: { // for vertical only
                startCollision: function (player,type) { // toolsGame.mainElements.kladki.run.startCollision(player,type)
                    if(!player.lock) {
                        if(!player.back) {
                            if(type === 'pionTopBack' || type === 'pionTop') player.body.velocity.y = 150;
                            else if(type === 'pionBottomBack' || type === 'pionBottom') player.body.velocity.y = -150;
                        } else {
                            if(type === 'pionTopBack' || type === 'pionTop') player.body.velocity.y = -150;
                            else if(type === 'pionBottomBack' || type === 'pionBottom') player.body.velocity.y = 150;
                        }
                    }
                    //toolsGame.audio.elevator();
                    //console.log("player uderza w kladke");
                    player.isUp=true;
                    toolsGame.mainElements.player.obj.body.bounce.y = 0;
                    game.time.events.add(300, function(){
                        player.isUp=false;
                    }, this);
                    // setTimeout(function(){
                    //     player.isUp=false;
                    // },300);
                },
                endCollision: function (player,type) { // toolsGame.mainElements.kladki.run.endCollision(kladka,type)
                    player.lock = true;
                    //console.log("kladka uderza w layer");
                    game.time.events.remove(player.resetart1);
                    player.resetart1=game.time.events.add(2500,function(){
                        if(type === 'pionTopBack') {
                            if(!player.back) player.body.velocity.y = -150;
                        } else if(type === 'pionBottomBack') {
                            if(!player.back) player.body.velocity.y = 150;
                        }
                        player.back = player.back?false:true;
                        player.lock = false;
                    }, this);
                }
            },
            pionTopBack: {
                //obj: true, // toolsGame.mainElements.kladki.pionTopBack.obj = pionTopBack
                add: function(x,y){
                    const kladkapionTopBack = this.obj.create(x*tileSize, y*tileSize, 'kladka-short');
                    game.physics.enable(kladkapionTopBack, Phaser.Physics.ARCADE);
                    kladkapionTopBack.body.collideWorldBounds = true;
                    kladkapionTopBack.body.allowGravity = false;
                    kladkapionTopBack.body.immovable = true;
                    kladkapionTopBack.body.orginalY=y;
                    //toolsGame.audio.elevator();
                }
            },
            pionBottomBack: {
                //obj: true, // toolsGame.mainElements.kladki.pionBottomBack.obj = pionBottomBack
                add: function(x,y){
                    const kladkapionBottomBack = this.obj.create(x*tileSize, y*tileSize, 'kladka-short');
                    game.physics.enable(kladkapionBottomBack, Phaser.Physics.ARCADE);
                    kladkapionBottomBack.body.collideWorldBounds = true;
                    kladkapionBottomBack.body.allowGravity = false;
                    kladkapionBottomBack.body.immovable = true;
                    kladkapionBottomBack.body.orginalY=y;
                }
            },
            pionTop: {
                //obj: true, // toolsGame.mainElements.kladki.pionTop.obj = kladkipionTop
                add: function(x,y){
                    const kladkaPionTop = this.obj.create(x*tileSize, y*tileSize, 'kladka-short');
                    game.physics.enable(kladkaPionTop, Phaser.Physics.ARCADE);
                    kladkaPionTop.body.collideWorldBounds = true;
                    kladkaPionTop.body.allowGravity = false;
                    kladkaPionTop.body.immovable = true;
                    kladkaPionTop.body.orginalY=y;
                }
            },
            pionBottom: {
                //obj: true, // toolsGame.mainElements.kladki.pionBottom.obj = kladkipionBottom
                add: function(x,y){
                    const kladkaPionBottom = this.obj.create(x*tileSize, y*tileSize, 'kladka-short');
                    game.physics.enable(kladkaPionBottom, Phaser.Physics.ARCADE);
                    kladkaPionBottom.body.collideWorldBounds = true;
                    kladkaPionBottom.body.allowGravity = false;
                    kladkaPionBottom.body.immovable = true;
                    kladkaPionBottom.body.orginalY=y;
                }
            }
        }
    },
    intruzCollisonBack: function (intruz) {  // toolsGame.intruzCollisonBack(intruz);
        let jumpTimerIntruz=0;
        if (intruz.body.onFloor() && game.time.now > jumpTimerIntruz)
        {
            intruz.body.velocity.y = -350;
            jumpTimerIntruz = game.time.now + 350;
        }
        if(jumpTimerIntruz!==0)
        {
            if(intruz.randomMove=='intruzLeft') intruz.randomMove='intruzRight';
            else if(intruz.randomMove=='intruzRight') intruz.randomMove='intruzLeft';
        }
    },
    intruzCollisonNoBack: function (intruz) {  // toolsGame.intruzCollisonBack(intruz);
        let jumpTimerIntruz=0;
        if (intruz.body.onFloor() && game.time.now > jumpTimerIntruz)
        {
            intruz.body.velocity.y = -350;
            jumpTimerIntruz = game.time.now + 350;
        }
    },
    addPoint: function (x,y,idName,text) {
        toolsGame.text.show('add-point',
            x,y,1,text, '700 15px Arial' ,'#ded4b8',false,idName,true
        );
    }
}

const startGame = (type,lastMap,percentLevel) => {
    levelFile.readyLoad=false;
    levelFile.blockedKeys=false;

    if(type==="continuation") {
        levelFile.name='level'+unlockLevels;
        levelFile.activeIdLevel = parseInt(unlockLevels);
    }

    game.physics.startSystem(Phaser.Physics.ARCADE);

    // wykrywanie otatniego levelu dla Credits
    theEndCredits = false;
    if(Object.keys(game.cache._cacheMap[7]).length === levelFile.activeIdLevel) {
        theEndCredits = true;
    }

    toolsGame.preloader.add(13,14,lastMap,percentLevel);

    //odmierzanie czasu co 1s
    timer = game.time.create(false);
    timerTotal=0;
    timer.loop(1000, function(){
        if(!levelFile.blockedKeys) {
            timerTotal++;
        }
    }, this);
    timer.start();

    game.time.advancedTiming = true;

    game.time.desiredFps = (window.innerWidth<800)?40:50;

    //game.time.desiredFps = 60;

    //reset keep stone
    toolsGame.mainElements.player.removeKeepStone();

    //reset inkubatorow
    wspInkub=[];

    //reset klucza/y
    keys=0;

    //usuwanie przyciskow leveli
    toolsGame.buttons.levels.hide();

    //usuwanie logo text
    toolsGame.text.hide('logoText');

    // usuwanie tla menu
    bgMenu.destroy();

    //usuwanie przycisku menu
    toolsGame.buttons.openBoxMenu.hide();

    //game.time.slowMotion = 1.0;

    //cookies Lifes
    toolsGame.mainElements.player.countLifes();

    //cookies coins
    toolsGame.mainElements.player.countCoins();


    let loaderSpeed = 300;
    if(theEndCredits) {
        if(lastMap) {
            loaderSpeed = 2000;
        } else {
            loaderSpeed = 0;
        }
    }

    game.time.events.add(loaderSpeed, function(){

        map = game.add.tilemap(levelFile.name);
        map.addTilesetImage('tiles-1');
        levelFile.blockedKeys=false;

        //console.log(proportiesMap[levelFile.activeIdLevel]);


        // map.setTileIndexCallback(9, function(objectCollision,mapElement){
        // 	if(objectCollision.key=="dude")
        // 	{
        // 		//objectCollision.alpha=0.5; // to jest player
        // 		//console.log(objectCollision.key);
        // 		//console.log(map);
        // 		//console.log(map + " | " + map.getTile(65, 75, layer, true).index);
        // 	}
        // }, this);

        // ta funkcja dziala tak ze player calkowicie pozbawiany jest blkowania przy tej kolizji
        // map.setTileIndexCallback([109,110,111,112], function(objectCollision,mapElement){
        //     if(objectCollision.key==="dude")
        //     {
        //         console.log("test collision");
        //     }
        //     return false;
        // }, this);

        map.setCollisionByExclusion(
            [102, 155, 205, 206, 207, 201, 202, 203,
                301, 302, 303, 304, 305, 306,
                401, 402, 403, 404, 405, 406, 407, 416, 417, 451, 452, 453, 454, 455, 456, 457, 459,
                552,
                651,652,653,654,655,656,657,658,659,660,661,662,
                701,702,703,704,705,706,707,708,
                751,752,753,754,755,756,757,758,
                801,802,803,804,805,806,
                807,808,809,810,811,812,813,814,815,816,817,818,819,820,821,822,823,824,825,
                857,858,859,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,
                851,852,853,854,855,856,
                901,902,903,904,905,906,
                209,210,211,212,259,260,261,262,
                309,310,311,312,
                1013,1014,1015,
                1668,1619,1601, 1651, 1712, 1762, 1812, 1813, 1863, 1915, 1957,
                1965, 2016, 2067, 2018, 2169, 2220, 2221, 2271, 2322, 2323,
                2373, 2374, 2375, 2376]);

        //ladowanie background tla dla daenj mapy z jsona
        if(proportiesMap[levelFile.activeIdLevel].backgroundColor)
        {
            levelFile.backgroundColor=proportiesMap[levelFile.activeIdLevel].backgroundColor;
        }
        else
        {
            levelFile.backgroundColor='#4488AA';
        }
        toolsGame.bgSet(levelFile.backgroundColor);


        if(!proportiesMap[levelFile.activeIdLevel].background)
        {
            levelFile.backgroundLevel='none';
        }
        else // jesli jest to laduje obrazek
        {
            let credits=false;

            if(Object.keys(game.cache._cacheMap[7]).length === levelFile.activeIdLevel) {
                credits=true;
            }

            levelFile.backgroundLevel=proportiesMap[levelFile.activeIdLevel].background;
            // obrazek o rozmiarze 1600px specjalnie pod parallaxe...
            //bg = game.add.sprite(0, credits?0:(game.height-game.cache.getImage(levelFile.backgroundLevel).height), levelFile.backgroundLevel);

            //console.log(map.widthInPixels);
            if(proportiesMap[levelFile.activeIdLevel].backgroundRepeatX) {
                bg = game.add.tileSprite(0, credits?0:(game.height-game.cache.getImage(levelFile.backgroundLevel).height), map.widthInPixels*2, game.cache.getImage(levelFile.backgroundLevel).height,  levelFile.backgroundLevel);
            }
            else {
                bg = game.add.sprite(0, credits?0:(game.height-game.cache.getImage(levelFile.backgroundLevel).height), levelFile.backgroundLevel);
            }
            //his.obj = game.add.tileSprite(tileSize*2, tileSize*2, 736, 377, 'boxMenu');
            //bg.width=game.cache.getImage(levelFile.backgroundLevel).width﻿; //100*tileSize;
            //bg.height=game.cache.getImage(levelFile.backgroundLevel).height﻿; //28.125*tileSize;
            bg.fixedToCamera = credits?false:true;

            if(proportiesMap[levelFile.activeIdLevel].backgroundSecond) {
                bg2 = game.add.sprite(0, (game.height-game.cache.getImage(proportiesMap[levelFile.activeIdLevel].backgroundSecond).height), proportiesMap[levelFile.activeIdLevel].backgroundSecond);
                bg2.width=game.cache.getImage(proportiesMap[levelFile.activeIdLevel].backgroundSecond).width﻿;
                bg2.height=game.cache.getImage(proportiesMap[levelFile.activeIdLevel].backgroundSecond).height﻿;
                bg2.fixedToCamera = true;
            }

            if(proportiesMap[levelFile.activeIdLevel].parallax)
            {
                levelFile.backgroundParallax=true;
            }
            else
            {
                levelFile.backgroundParallax=false;
            }

        }

        //alert(map.width + ' x ' + map.height);
        if(proportiesMap[levelFile.activeIdLevel].fog)
        {
            const heightLessForGround=tileSize*4; // default
            const algoPosit=25/(tileSize/10);
            const moveYfog = proportiesMap[levelFile.activeIdLevel].fogPositionY?proportiesMap[levelFile.activeIdLevel].fogPositionY:0; // default 0

            oFog = game.add.tileSprite(-(map.width*tileSize), ((map.height-algoPosit)*tileSize)-heightLessForGround-moveYfog, ((2*map.width)*tileSize), (algoPosit*tileSize), proportiesMap[levelFile.activeIdLevel].fog);
            //oFog.fixedToCamera = true;
        }

        if(proportiesMap[levelFile.activeIdLevel].positionGround) {
            let positionGround = 6*tileSize; // default
            if(Number.isInteger(proportiesMap[levelFile.activeIdLevel].positionGround)) {
                positionGround = proportiesMap[levelFile.activeIdLevel].positionGround;
            }
            ground = game.add.tileSprite(-(map.width*tileSize), (map.height*tileSize)-positionGround-1, ((2*map.width)*tileSize), map.height*tileSize, 'ground');
        }

        //layer = map.createLayer('Tile Layer 1');
        //console.log(map + " | " + map.getTile(65, 75, layer, true).index);
        //  Un-comment this on to see the collision tiles
        // layer.debug = true;
        //layer.resizeWorld();

        //console.log(game.world.width + "x" + game.world.height);

        game.physics.arcade.gravity.y = 750;

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //console.log(Phaser.Keyboard);


        //ustawianie obiektow wg indexow mapy
        //kolejnosc wyznacza z-index warstwy

        // toolsGame.mainElements.fogSingleS.obj = game.add.group();
        // toolsGame.mainElements.fogSingleS.obj.enableBody = true;

        layerDeep = map.createLayer('levels-deep');
        layerDeep.resizeWorld();

        toolsGame.mainElements.caves.obj = game.add.group();
        toolsGame.mainElements.caves.obj.enableBody = true;

        toolsGame.mainElements.buildings.obj = game.add.group();
        toolsGame.mainElements.buildings.obj.enableBody = true;

        toolsGame.mainElements.blackboards.obj = game.add.group();
        toolsGame.mainElements.blackboards.obj.enableBody = true;

        // toolsGame.mainElements.building1s.obj = game.add.group();
        // toolsGame.mainElements.building1s.obj.enableBody = true;
        //
        // toolsGame.mainElements.building2s.obj = game.add.group();
        // toolsGame.mainElements.building2s.obj.enableBody = true;
        //
        // toolsGame.mainElements.building3s.obj = game.add.group();
        // toolsGame.mainElements.building3s.obj.enableBody = true;
        //
        // toolsGame.mainElements.building4s.obj = game.add.group();
        // toolsGame.mainElements.building4s.obj.enableBody = true;
        //
        // toolsGame.mainElements.building5s.obj = game.add.group();
        // toolsGame.mainElements.building5s.obj.enableBody = true;

        toolsGame.mainElements.mines.obj = game.add.group();
        toolsGame.mainElements.mines.obj.enableBody = true;

        toolsGame.mainElements.cactusAnimateS.obj = game.add.group();
        toolsGame.mainElements.cactusAnimateS.obj.enableBody = true;

        toolsGame.mainElements.grassLeft.obj = game.add.group();
        toolsGame.mainElements.grassLeft.obj.enableBody = true;

        toolsGame.mainElements.grassRight.obj = game.add.group();
        toolsGame.mainElements.grassRight.obj.enableBody = true;

        toolsGame.mainElements.grassAnim.obj = game.add.group();
        toolsGame.mainElements.grassAnim.obj.enableBody = true;

        toolsGame.mainElements.trees.obj = game.add.group();
        toolsGame.mainElements.trees.obj.enableBody = true;

        toolsGame.mainElements.keys.obj = game.add.group();
        toolsGame.mainElements.keys.obj.enableBody = true;

        toolsGame.mainElements.locks.obj = game.add.group();
        toolsGame.mainElements.locks.obj.enableBody = true;

        toolsGame.mainElements.doors.obj = game.add.group();
        toolsGame.mainElements.doors.obj.enableBody = true;

        toolsGame.mainElements.doorsHorizontal.obj = game.add.group();
        toolsGame.mainElements.doorsHorizontal.obj.enableBody = true;

        toolsGame.mainElements.fire.fireUpS.obj = game.add.group();
        toolsGame.mainElements.fire.fireUpS.obj.enableBody = true;

        toolsGame.mainElements.fire.fireUpNormalS.obj = game.add.group();
        toolsGame.mainElements.fire.fireUpNormalS.obj.enableBody = true;

        toolsGame.mainElements.fire.fireDownS.obj = game.add.group();
        toolsGame.mainElements.fire.fireDownS.obj.enableBody = true;

        toolsGame.mainElements.fire.fireLeftS.obj = game.add.group();
        toolsGame.mainElements.fire.fireLeftS.obj.enableBody = true;

        toolsGame.mainElements.fire.fireRightS.obj = game.add.group();
        toolsGame.mainElements.fire.fireRightS.obj.enableBody = true;

        toolsGame.mainElements.windmills.obj = game.add.group();
        toolsGame.mainElements.windmills.obj.enableBody = true;

        toolsGame.mainElements.windmillNewS.obj2 = game.add.group();
        toolsGame.mainElements.windmillNewS.obj2.enableBody = true;

        toolsGame.mainElements.windmillNewS.obj1 = game.add.group();
        toolsGame.mainElements.windmillNewS.obj1.enableBody = true;

        toolsGame.mainElements.bulletsGuns.obj = game.add.group();
        toolsGame.mainElements.bulletsGuns.obj.enableBody = true;


        toolsGame.mainElements.player.obj=false;


        layerObject = map.createLayer('levels-objects');
        layerObject.resizeWorld();

        toolsGame.mainElements.stoneBigS.obj = game.add.group();
        toolsGame.mainElements.stoneBigS.obj.enableBody = true;

        layer = map.createLayer('levels-main');
        layer.resizeWorld();

        toolsGame.mainElements.explosion.obj = game.add.group();
        toolsGame.mainElements.explosion.obj.enableBody = true;


        toolsGame.mainElements.stoneBigExplosion.obj = game.add.group();
        toolsGame.mainElements.stoneBigExplosion.obj.enableBody = true;

        //console.log("objects:");
        //console.log(map.objects['just-objects']);
        if(map.objects['just-objects']) {
            map.objects['just-objects'].forEach(function (o) {
                // generowanie animowanej trawy z lewej
                if (o.gid === 461) {
                    toolsGame.mainElements.grassAnim.add(o.x/tileSize, o.y/tileSize);
                }

                // generowanie animowanej trawy z prawej
                if (o.gid === 462) {
                    toolsGame.mainElements.grassAnim.add(o.x/tileSize, o.y/tileSize, 'right');
                }

                if (o.gid === 13) {
                    toolsGame.mainElements.stoneBigS.add(o.x/tileSize, o.y/tileSize);
                }

                //generowanie ognia up big
                if (o.gid === 111) {
                    toolsGame.mainElements.fire.fireUpS.add(o.x/tileSize, o.y/tileSize);
                }

                //generowanie ognia up small N
                if (o.gid === 117) {
                    toolsGame.mainElements.fire.fireUpNormalS.add(o.x/tileSize, o.y/tileSize);
                }

                //generowanie ognia down
                if (o.gid === 110) {
                    toolsGame.mainElements.fire.fireDownS.add(o.x/tileSize, o.y/tileSize);
                }

                //generowanie ognia left
                if (o.gid === 109) {
                    toolsGame.mainElements.fire.fireLeftS.add(o.x/tileSize, o.y/tileSize);
                }

                //generowanie ognia right
                if (o.gid === 112) {
                    toolsGame.mainElements.fire.fireRightS.add(o.x/tileSize, o.y/tileSize);
                }

            });

        }

        for(let x=0; x < map.width; x++) {
            for (let y = 0; y < map.height; y++) {

                if (map.getTile(x, y, layer, true).index == 51) {
                    // toolsGame.mainElements.logs.add(x, y, 'surprise', 'log');
                    // map.removeTile(x, y, layerObject);

                    map.removeTile(x, y, layer);
                    map.putTile(101,x,y,layer);
                }

                // //generate single fog
                // if (map.getTile(x, y, layerObject, true).index === 62) {
                //     toolsGame.mainElements.fogSingleS.add(x, y);
                //     map.removeTile(x, y, layerObject);
                // }

                //generowanie jaskini
                if (map.getTile(x, y, layerObject, true).index == 1) {
                    toolsGame.mainElements.caves.add(x, y);
                    map.removeTile(x, y, layerObject);
                }


                if (map.getTile(x, y, layerObject, true).index == 522) {
                    toolsGame.mainElements.trees.add(x, y);
                    map.removeTile(x, y, layerObject);
                }


                //generate balckboard SHERIFF
                if (map.getTile(x, y, layerObject, true).index == 52) {
                    toolsGame.mainElements.blackboards.add(x, y, 'b-sheriff');
                    map.removeTile(x, y, layerObject);
                }

                //generate balckboard SALOON
                if (map.getTile(x, y, layerObject, true).index == 53) {
                    toolsGame.mainElements.blackboards.add(x, y, 'b-saloon');
                    map.removeTile(x, y, layerObject);
                }

                //generate balckboard STORE
                if (map.getTile(x, y, layerObject, true).index == 54) {
                    toolsGame.mainElements.blackboards.add(x, y, 'b-store');
                    map.removeTile(x, y, layerObject);
                }

                //generowanie building1
                if (map.getTile(x, y, layerObject, true).index == 2) {
                    toolsGame.mainElements.buildings.add(x, y, 'building1');
                    map.removeTile(x, y, layerObject);
                }

                //generowanie building2
                if (map.getTile(x, y, layerObject, true).index == 4) {
                    toolsGame.mainElements.buildings.add(x, y, 'building2');
                    map.removeTile(x, y, layerObject);
                }

                //generowanie building3
                if (map.getTile(x, y, layerObject, true).index == 7) {
                    toolsGame.mainElements.buildings.add(x, y, 'building3');
                    map.removeTile(x, y, layerObject);
                }

                //generowanie building4
                if (map.getTile(x, y, layerObject, true).index == 8) {
                    toolsGame.mainElements.buildings.add(x, y, 'building4');
                    map.removeTile(x, y, layerObject);
                }

                //generowanie building5
                if (map.getTile(x, y, layerObject, true).index == 5) {
                    toolsGame.mainElements.buildings.add(x, y, 'building5');
                    map.removeTile(x, y, layerObject);
                }

                //generowanie building6
                if (map.getTile(x, y, layerObject, true).index == 9) {
                    toolsGame.mainElements.buildings.add(x, y, 'building6');
                    map.removeTile(x, y, layerObject);
                }
                //generowanie building7
                if (map.getTile(x, y, layerObject, true).index == 10) {
                    toolsGame.mainElements.buildings.add(x, y, 'building7');
                    map.removeTile(x, y, layerObject);
                }
                //generowanie building8
                if (map.getTile(x, y, layerObject, true).index == 11) {
                    toolsGame.mainElements.buildings.add(x, y, 'building8');
                    map.removeTile(x, y, layerObject);
                }
                //generowanie building9
                if (map.getTile(x, y, layerObject, true).index == 12) {
                    toolsGame.mainElements.buildings.add(x, y, 'building9');
                    map.removeTile(x, y, layerObject);
                }


                //generowanie mine
                if (map.getTile(x, y, layerObject, true).index == 6) {
                    toolsGame.mainElements.mines.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie kaktusow
                if (map.getTile(x, y, layerObject, true).index == 504) {
                    toolsGame.mainElements.cactusAnimateS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                // generowanie trawy z lewej
                if (map.getTile(x, y, layerObject, true).index == 511) {
                    toolsGame.mainElements.grassLeft.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie trawy z prawej
                if (map.getTile(x, y, layerObject, true).index == 512) {
                    toolsGame.mainElements.grassRight.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                // generowanie animowanej trawy z lewej
                if (map.getTile(x, y, layerObject, true).index == 461) {
                    toolsGame.mainElements.grassAnim.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                // generowanie animowanej trawy z prawej
                if (map.getTile(x, y, layerObject, true).index == 462) {
                    toolsGame.mainElements.grassAnim.add(x, y, 'right');
                    map.removeTile(x, y, layerObject);
                }

                //generowanie klucza
                if (map.getTile(x, y, layerObject, true).index == 515) {
                    toolsGame.mainElements.keys.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie drzwi pionowych
                if (map.getTile(x, y, layerObject, true).index == 516) {
                    //console.log(x + "x" + y);
                    toolsGame.mainElements.doors.add(x, y, (map.getTile(x+1, y, layerObject, true).index === 466));
                    map.removeTile(x, y, layerObject);
                }
                //generowanie drzwi poziomych
                if (map.getTile(x, y, layerObject, true).index == 466) {
                    // if(map.getTile(x+1, y, layerObject, true).index == 516) {
                    //     console.log("jest");
                    // }
                    toolsGame.mainElements.doorsHorizontal.add(x, y, (map.getTile(x+1, y, layerObject, true).index === 516));
                    map.removeTile(x, y, layerObject);
                }
                //generowanie zamków/locks
                if (map.getTile(x, y, layerObject, true).index == 517) //lewy
                {
                    toolsGame.mainElements.locks.add(x, y);
                    map.removeTile(x, y, layerObject);
                }
                if (map.getTile(x, y, layerObject, true).index == 467) //prawy
                {
                    toolsGame.mainElements.locks.add(x, y, true);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie ognia up BIG
                if (map.getTile(x, y, layerObject, true).index == 111) {
                    toolsGame.mainElements.fire.fireUpS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie ognia up SMALL NORMAL
                if (map.getTile(x, y, layerObject, true).index == 117) {
                    toolsGame.mainElements.fire.fireUpNormalS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie ognia down
                if (map.getTile(x, y, layerObject, true).index == 110) {
                    toolsGame.mainElements.fire.fireDownS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie ognia left
                if (map.getTile(x, y, layerObject, true).index == 109) {
                    toolsGame.mainElements.fire.fireLeftS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie ognia right
                if (map.getTile(x, y, layerObject, true).index == 112) {
                    toolsGame.mainElements.fire.fireRightS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie windmillNewS.add();
                if (map.getTile(x, y, layerObject, true).index == 3) {
                    toolsGame.mainElements.windmillNewS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie inkubatora
                if (map.getTile(x, y, layerObject, true).index === 552 ||
                    map.getTile(x, y, layerDeep, true).index === 552 ||
                    map.getTile(x, y, layer, true).index === 552) {
                    wspInkub.push(x * tileSize + "," + y * tileSize);
                }
            }
        }

        // next z-index

        toolsGame.mainElements.saveLevelS.obj = game.add.group();
        toolsGame.mainElements.saveLevelS.obj.enableBody = true;

        toolsGame.mainElements.endLevelS.obj = game.add.group();
        toolsGame.mainElements.endLevelS.obj.enableBody = true;

        toolsGame.mainElements.logs.obj = game.add.group();
        toolsGame.mainElements.logs.obj.enableBody = true;

        toolsGame.mainElements.invisibleLogs.obj = game.add.group();
        toolsGame.mainElements.invisibleLogs.obj.enableBody = true;

        toolsGame.mainElements.Lifes.obj = game.add.group();
        toolsGame.mainElements.Lifes.obj.enableBody = true;

        toolsGame.mainElements.LifeSingleS.obj = game.add.group();
        toolsGame.mainElements.LifeSingleS.obj.enableBody = true;

        toolsGame.mainElements.coins.obj = game.add.group();
        toolsGame.mainElements.coins.obj.enableBody = true;

        toolsGame.mainElements.intruders.obj = game.add.group();
        toolsGame.mainElements.intruders.obj.enableBody = true;

        toolsGame.mainElements.kladki.poziom.obj = game.add.group();
        toolsGame.mainElements.kladki.poziom.obj.enableBody = true;

        toolsGame.mainElements.kladki.pionTopBack.obj = game.add.group();
        toolsGame.mainElements.kladki.pionTopBack.obj.enableBody = true;

        toolsGame.mainElements.kladki.pionBottomBack.obj = game.add.group();
        toolsGame.mainElements.kladki.pionBottomBack.obj.enableBody = true;

        toolsGame.mainElements.kladki.pionTop.obj = game.add.group();
        toolsGame.mainElements.kladki.pionTop.obj.enableBody = true;

        toolsGame.mainElements.kladki.pionBottom.obj = game.add.group();
        toolsGame.mainElements.kladki.pionBottom.obj.enableBody = true;

        // next z-inedx
        for(let x=0; x<map.width; x++) {
            for (let y = 0; y < map.height; y++) {

                //generowanie zapisywania levelu
                if (map.getTile(x, y, layerObject, true).index == 602) {
                    toolsGame.mainElements.saveLevelS.add(x, y,'->');
                    map.removeTile(x, y, layerObject);
                }
                if (map.getTile(x, y, layerObject, true).index == 603) {
                    toolsGame.mainElements.saveLevelS.add(x, y,'<-');
                    map.removeTile(x, y, layerObject);
                }

                //generowanie konca levelu
                if (map.getTile(x, y, layerObject, true).index == 601) {
                    toolsGame.mainElements.endLevelS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                // generating Life main
                if (map.getTile(x, y, layerObject, true).index == 510) {
                    toolsGame.mainElements.Lifes.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                // generating Life single
                if (map.getTile(x, y, layerObject, true).index == 460) {
                    toolsGame.mainElements.LifeSingleS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie monet
                if (map.getTile(x, y, layerObject, true).index == 502) {
                    toolsGame.mainElements.coins.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie animowanych klod
                if (map.getTile(x, y, layerObject, true).index == 513) {
                    //toolsGame.mainElements.logs.add(x, y);
                    // zamiana objektu na tile - szybcie działa
                    map.removeTile(x, y, layerObject);
                    map.putTile(463,x,y,layer);
                }

                //generowanie animowanych stone
                if (map.getTile(x, y, layerObject, true).index == 267) {
                    //toolsGame.mainElements.logs.add(x, y);
                    // zamiana objektu na tile - szybcie działa
                    map.removeTile(x, y, layerObject);
                    map.putTile(217,x,y,layer);
                }

                //generowanie niewidocznych animowanych blockow z kloda (wyskakuja kladka))
                if (map.getTile(x, y, layerObject, true).index == 414) {
                    toolsGame.mainElements.invisibleLogs.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie animowanych klod ze zlotem
                if (map.getTile(x, y, layerObject, true).index == 514) {
                    toolsGame.mainElements.logs.lengthBonusCoins++;

                    map.removeTile(x, y, layerObject);
                    map.putTile(564,x,y,layer);
                }

                //generowanie animowanych klod z niespodzianka
                if (map.getTile(x, y, layerObject, true).index == 464) {
                    // toolsGame.mainElements.logs.add(x, y, 'surprise', 'log');
                    // map.removeTile(x, y, layerObject);

                    map.removeTile(x, y, layerObject);
                    map.putTile(465,x,y,layer);
                }

                //generowanie animowanych stone ze zlotem
                if (map.getTile(x, y, layerObject, true).index == 268) {
                    toolsGame.mainElements.logs.lengthBonusCoins++;

                    map.removeTile(x, y, layerObject);
                    map.putTile(218,x,y,layer);
                }

                //generowanie animowanych stone z niespodzianka
                if (map.getTile(x, y, layerObject, true).index == 269) {
                    // toolsGame.mainElements.logs.add(x, y, 'surprise', 'log');
                    // map.removeTile(x, y, layerObject);

                    map.removeTile(x, y, layerObject);
                    map.putTile(219,x,y,layer);
                }

                //generowanie stone big
                if (map.getTile(x, y, layerObject, true).index == 13) {
                    toolsGame.mainElements.stoneBigS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie nabojow
                if (map.getTile(x, y, layerObject, true).index == 503) {
                    toolsGame.mainElements.bulletsGuns.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie intruzow typ 1
                if (map.getTile(x, y, layerObject, true).index == 551) {
                    toolsGame.mainElements.intruders.add(x, y, 1);
                    map.removeTile(x, y, layerObject);
                }
                //generowanie intruzow typ 2
                if (map.getTile(x, y, layerObject, true).index == 553) {
                    toolsGame.mainElements.intruders.add(x, y, 2);
                    map.removeTile(x, y, layerObject);
                }
                //generowanie intruzow typ 3
                if (map.getTile(x, y, layerObject, true).index == 554) {
                    toolsGame.mainElements.intruders.add(x, y, 3);
                    map.removeTile(x, y, layerObject);
                }
                //generowanie intruzow typ 4 snake
                if (map.getTile(x, y, layerObject, true).index == 555) {
                    toolsGame.mainElements.intruders.add(x, y, 4);
                    map.removeTile(x, y, layerObject);
                }
                //generowanie intruzow typ 5 bird condor
                if (map.getTile(x, y, layerObject, true).index == 556) {
                    toolsGame.mainElements.intruders.add(x, y, 5);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie intruzow typ 6 - main enemy
                if (map.getTile(x, y, layerObject, true).index == 557) {
                    toolsGame.mainElements.intruders.add(x, y, 6);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie intruzow typ 7 bird owl
                if (map.getTile(x, y, layerObject, true).index == 558) {
                    toolsGame.mainElements.intruders.add(x, y, 7);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie kladki poziomej
                if (map.getTile(x, y, layerObject, true).index == 505) {
                    toolsGame.mainElements.kladki.poziom.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie kladki pionowej top back
                if (map.getTile(x, y, layerObject, true).index == 506) {
                    toolsGame.mainElements.kladki.pionTopBack.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie kladki pionowej bottom back
                if (map.getTile(x, y, layerObject, true).index == 509) {
                    toolsGame.mainElements.kladki.pionBottomBack.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie kladki pionowej top
                if (map.getTile(x, y, layerObject, true).index == 507) {
                    toolsGame.mainElements.kladki.pionTop.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie kladki pionowej bottom
                if (map.getTile(x, y, layerObject, true).index == 508) {
                    toolsGame.mainElements.kladki.pionBottom.add(x, y);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie playera
                if (map.getTile(x, y, layerObject, true).index == 501) {
                    //player moze byc tylko jeden wiec tylko raz jest genrowany
                    toolsGame.mainElements.player.add(x, y);
                    map.removeTile(x, y, layerObject);
                }
            }
        }

        // next z-index

        toolsGame.mainElements.firebs.obj = game.add.group();
        toolsGame.mainElements.firebs.obj.enableBody = true;

        // woda ma miec wyzszy z-index od playera dlatego w tym miejscu
        toolsGame.mainElements.waters.obj = game.add.group();
        toolsGame.mainElements.waters.obj.enableBody = true;

        // generowanie wody statycznej
        toolsGame.mainElements.waterStaticS.obj = game.add.group();
        toolsGame.mainElements.waterStaticS.obj.enableBody = true;

        // dodanie spashy wody
        toolsGame.mainElements.splashs.obj = game.add.group();
        toolsGame.mainElements.splashs.obj.enableBody = true;

        // fog single
        toolsGame.mainElements.fogSingleS.obj = game.add.group();
        toolsGame.mainElements.fogSingleS.obj.enableBody = true;

        for(let x=0; x<map.width; x++)
        {
            for(let y=0; y<map.height; y++)
            {

                // generowanie ryb
                if (map.getTile(x, y, layerObject, true).index==520)
                {
                    toolsGame.mainElements.firebs.add(x,y,randomBetween(1,6));
                    map.removeTile(x, y, layerObject);
                }

                // generowanie ognistej kuli
                if (map.getTile(x, y, layerObject, true).index==521)
                {
                    toolsGame.mainElements.firebs.add(x,y,randomBetween(1,6),true);
                    map.removeTile(x, y, layerObject);
                }

                //generowanie wody
                if (map.getTile(x, y, layerObject, true).index==518)
                {
                    toolsGame.mainElements.waters.add(x,y);
                    map.removeTile(x, y, layerObject);
                }
                if (map.getTile(x, y, layerObject, true).index==519)
                {
                    toolsGame.mainElements.waters.add(x,y,'water-red');
                    map.removeTile(x, y, layerObject);
                }
                if (map.getTile(x, y, layerObject, true).index===468)
                {
                    toolsGame.mainElements.waterStaticS.add(x,y,false,'left');
                    map.removeTile(x, y, layerObject);
                }
                if (map.getTile(x, y, layerObject, true).index===418)
                {
                    toolsGame.mainElements.waterStaticS.add(x,y,false,'center');
                    map.removeTile(x, y, layerObject);
                }

                //generate single fog
                if (map.getTile(x, y, layerObject, true).index === 62) {
                    toolsGame.mainElements.fogSingleS.add(x, y);
                    map.removeTile(x, y, layerObject);
                }
            }
        }

        if(!toolsGame.mainElements.logs.lengthBonusCoins) toolsGame.mainElements.logs.lengthBonusCoins = 0;
        oneHP = toolsGame.mainElements.coins.obj.children.length + toolsGame.mainElements.logs.lengthBonusCoins;

        playGame.main=true;
        //console.log(game.world.width + "x" + game.world.height);
        toolsGame.audio.bg.play(0.15,proportiesMap[levelFile.activeIdLevel].bgAudio);
        game.load.start();
    }, this);

    toolsGame.buttons.play.hide();
    toolsGame.buttons.quit.hide();
    toolsGame.buttons.mute.hide();
    toolsGame.animationImage.sentence1.hide();

};

// n* else next time
const create = () => {

    // Disable clearing the canvas on each tick (usually not needed).
    // sprwadzic czy tu potrzeba!!!
    game.clearBeforeRender = false;

    //console.log("test-create");
    // ladowanie tla dla menu i domyslnego dla mapy gry
    unlockLevels=(parseInt(getCookies("unlock-levels"))>1)?getCookies("unlock-levels"):1;
    toolsGame.bgSet('#dfe4ff');
    //toolsGame.bgSet('#000000');
    bgMenu = game.add.image(0, 0, 'backgroundMenu');
    bgMenu.fixedToCamera = true;

    toolsGame.buttons.play.show();
    toolsGame.buttons.quit.show();
    toolsGame.buttons.mute.show(getCookies('mute')?10:9);
    toolsGame.animationImage.sentence1.show();

    const webGL = detectionWEBGL()?'GL':'CA';
    toolsGame.text.show(false,game.width-180,game.height-25,.9,'semDesign Game (' + (detectionDevice() ? detectionDevice() : 'Browser') + ')'+' '+webGL, '400 12px Arial' ,'#000000',true,'logoText');

    toolsGame.buttons.openBoxMenu.show();

    toolsGame.buttons.levels.show();
    //console.log('mute: ' + (getCookies('mute')?true:false));
    game.sound.mute = getCookies('mute')?true:false;

    // fix for repeat onload
    let onlyOneLoad=true;
    game.load.onLoadComplete.add(function() {
        if(onlyOneLoad) {
            //restart ewentualnych mocy playera
            toolsGame.mainElements.player.scale();

            toolsGame.preloader.hide();
            // theEndCredits = false;
            // if(Object.keys(game.cache._cacheMap[7]).length === levelFile.activeIdLevel) {
            //     theEndCredits = true;
            // }

            toolsGame.windows.boxTopMenu.f=false;
            if(!theEndCredits) {
                //console.log("test load create");
                // x,y,nameSpriteOrImage,idName,opacitySpec,cameraFixed,scaleW,scaleH,frame,fade
                toolsGame.image.show(
                    (toolsGame.windows.boxMenu.obj)?0:0,
                    (toolsGame.windows.boxMenu.obj)?0:0,
                    'boxTopMenu','boxTopMenu',.85,1,false,false,false,true
                );
                toolsGame.windows.boxTopMenu.const.show();
                toolsGame.buttons.navigations.show();

                // if(typeof window.admob === "object" && window.navigator.onLine) {
                //     game.time.events.add(600, function(){
                //         toolsGame.windows.boxMenu.show();
                //     },this);
                //     window.admob.interstitial.show();
                // }

                if(detectionDevice() && window.navigator.onLine) {
                    game.time.events.add(900, function(){
                        toolsGame.windows.boxMenu.show();
                    },this);
                    window.jsToJava.showInterstitial();
                }

            } else {
                //alert("s");
                toolsGame.mainElements.endLevelS.obj.alpha=0;
                toolsGame.mainElements.player.obj.body.gravity.y=-740;
                toolsGame.mainElements.player.obj.body.bounce.y = 0;
                levelFile.blockedKeys=true;
                //toolsGame.mainElements.player.obj.alpha=0;
                // fix...
                game.time.events.add(1,function () {
                    toolsGame.mainElements.player.obj.alpha=0;
                },this);
                game.camera.follow(toolsGame.mainElements.player.obj, Phaser.Camera.FOLLOW_LOCKON, 1, 1);
            }
            toolsGame.buttons.openBoxMenu.show('play-game');
            onlyOneLoad=false;
        }
        //toolsGame.audio.bg.play(0.06,'bg-sound');
    }, this);

    //fullscreen...
    //game.input.onDown.add(gofull, this);

    //window.graphics = graphics;
};

// main loop the game
const update = () => {

    if(playGame.main)
    {

        toolsGame.mainElements.windmillNewS.obj1.forEach(function(windmill){
            windmill.angle += 1;
        }, this, true);

        // dopracowac kolizje playera
        //console.log('player: ');
        //console.log(toolsGame.mainElements.player.obj.body);
        toolsGame.mainElements.player.obj.body.offset.x=8;
        toolsGame.mainElements.player.obj.body.width = 32;
        //console.log(toolsGame.mainElements.player.obj.body);

        // toolsGame.mainElements.cactusAnimateS.obj.forEach(function(c){
        //     c.body.width = 39;  // 61,94
        //     c.body.height = 70;
        //     c.body.offset.y=11;
        //     c.body.offset.x=11;
        // }, this, true);


        if((cursors.left.isDown || cursors.right.isDown || cursors.up.isDown) && !jumpKillF) {
            jumpKillY=toolsGame.mainElements.player.obj.body.y;
            jumpKillF=true;
            toolsGame.mainElements.player.obj.body.bounce.y = 0.3;
        }

        //console.log(map);

        // position player

        //console.log(toolsGame.mainElements.player.obj.body.y + ' + ' + toolsGame.mainElements.player.obj.height + ' = ' + map.height*map.tileHeight);
        //console.log("x: " + toolsGame.mainElements.player.obj.body.x + " / " + "y: " + toolsGame.mainElements.player.obj.body.y);



        //generowanie animowanych klod z niespodzianka
        // if (map.getTile(x, y, layer, true).index==514)
        // {
        //     toolsGame.mainElements.logs.add(x,y,true);
        //     toolsGame.mainElements.logs.lengthBonusCoins ++;
        //     map.removeTile(x, y, layer);
        // }
        // toolsGame.mainElements.windmillNewS.obj1.forEach(function(windmill){
        //     windmill.angle += 1;
        // }, this, true);





        //console.log(map);

        // player vs lay

        game.physics.arcade.overlap(toolsGame.mainElements.player.gun.bullets.obj, layer, function(bullet,lay){
            if(
                lay.index === 463 || lay.index === 564 || lay.index === 465 ||
                lay.index === 217 || lay.index === 218 || lay.index === 219
            ) {
                //console.log("destruction");

                // dopracować - ddoatkowy waruek dla konca mapy
                // jesli osoba uzyje shotguna to moze utracic niespodzianki o zloto -musi sie z tym liczyc, mozna dodac do instrukcji gry
                if (
                    lay.x-1> 0 && lay.y-1>0 &&
                    (
                        map.getTile(lay.x-1, lay.y-1, layer, true).index === 463 ||
                        map.getTile(lay.x-1, lay.y-1, layer, true).index === 564 ||
                        map.getTile(lay.x-1, lay.y-1, layer, true).index === 465 ||
                        map.getTile(lay.x-1, lay.y-1, layer, true).index === 217 ||
                        map.getTile(lay.x-1, lay.y-1, layer, true).index === 218 ||
                        map.getTile(lay.x-1, lay.y-1, layer, true).index === 219
                    )
                )  map.removeTile(lay.x-1, lay.y-1);
                if (
                    map.getTile(lay.x+1, lay.y+1, layer, true).index === 463 ||
                    map.getTile(lay.x+1, lay.y+1, layer, true).index === 564 ||
                    map.getTile(lay.x+1, lay.y+1, layer, true).index === 465 ||
                    map.getTile(lay.x+1, lay.y+1, layer, true).index === 217 ||
                    map.getTile(lay.x+1, lay.y+1, layer, true).index === 218 ||
                    map.getTile(lay.x+1, lay.y+1, layer, true).index === 219
                )  map.removeTile(lay.x+1, lay.y+1);
                if (
                    map.getTile(lay.x+1, lay.y, layer, true).index === 463 ||
                    map.getTile(lay.x+1, lay.y, layer, true).index === 564 ||
                    map.getTile(lay.x+1, lay.y, layer, true).index === 465 ||
                    map.getTile(lay.x+1, lay.y, layer, true).index === 217 ||
                    map.getTile(lay.x+1, lay.y, layer, true).index === 218 ||
                    map.getTile(lay.x+1, lay.y, layer, true).index === 219
                )  map.removeTile(lay.x+1, lay.y);
                if (
                    map.getTile(lay.x, lay.y+1, layer, true).index === 463 ||
                    map.getTile(lay.x, lay.y+1, layer, true).index === 564 ||
                    map.getTile(lay.x, lay.y+1, layer, true).index === 465 ||
                    map.getTile(lay.x, lay.y+1, layer, true).index === 217 ||
                    map.getTile(lay.x, lay.y+1, layer, true).index === 218 ||
                    map.getTile(lay.x, lay.y+1, layer, true).index === 219
                )  map.removeTile(lay.x, lay.y+1);
                if (
                    lay.x-1>0 &&
                    (
                        map.getTile(lay.x-1, lay.y, layer, true).index === 463 ||
                        map.getTile(lay.x-1, lay.y, layer, true).index === 564 ||
                        map.getTile(lay.x-1, lay.y, layer, true).index === 465 ||
                        map.getTile(lay.x-1, lay.y, layer, true).index === 217 ||
                        map.getTile(lay.x-1, lay.y, layer, true).index === 218 ||
                        map.getTile(lay.x-1, lay.y, layer, true).index === 219
                    )
                )  map.removeTile(lay.x-1, lay.y);
                if (
                    lay.y-1>0 &&
                    (
                        map.getTile(lay.x, lay.y-1, layer, true).index === 463 ||
                        map.getTile(lay.x, lay.y-1, layer, true).index === 564 ||
                        map.getTile(lay.x, lay.y-1, layer, true).index === 465 ||
                        map.getTile(lay.x, lay.y-1, layer, true).index === 217 ||
                        map.getTile(lay.x, lay.y-1, layer, true).index === 218 ||
                        map.getTile(lay.x, lay.y-1, layer, true).index === 219
                    )
                )  map.removeTile(lay.x, lay.y-1);
                if (
                    lay.x-1>0 &&
                    (
                        map.getTile(lay.x-1, lay.y+1, layer, true).index === 463 ||
                        map.getTile(lay.x-1, lay.y+1, layer, true).index === 564 ||
                        map.getTile(lay.x-1, lay.y+1, layer, true).index === 465 ||
                        map.getTile(lay.x-1, lay.y+1, layer, true).index === 217 ||
                        map.getTile(lay.x-1, lay.y+1, layer, true).index === 218 ||
                        map.getTile(lay.x-1, lay.y+1, layer, true).index === 219
                    )
                )  map.removeTile(lay.x-1, lay.y+1);
                if (
                    lay.y-1>0 &&
                    (
                        map.getTile(lay.x+1, lay.y-1, layer, true).index === 463 ||
                        map.getTile(lay.x+1, lay.y-1, layer, true).index === 564 ||
                        map.getTile(lay.x+1, lay.y-1, layer, true).index === 465 ||
                        map.getTile(lay.x+1, lay.y-1, layer, true).index === 217 ||
                        map.getTile(lay.x+1, lay.y-1, layer, true).index === 218 ||
                        map.getTile(lay.x+1, lay.y-1, layer, true).index === 219
                    )
                )  map.removeTile(lay.x+1, lay.y-1);
                if (
                    map.getTile(lay.x+2, lay.y, layer, true).index === 463 ||
                    map.getTile(lay.x+2, lay.y, layer, true).index === 564 ||
                    map.getTile(lay.x+2, lay.y, layer, true).index === 465 ||
                    map.getTile(lay.x+2, lay.y, layer, true).index === 217 ||
                    map.getTile(lay.x+2, lay.y, layer, true).index === 218 ||
                    map.getTile(lay.x+2, lay.y, layer, true).index === 219
                )  map.removeTile(lay.x+2, lay.y);
                if (
                    lay.x-2>0 && (
                        map.getTile(lay.x-2, lay.y, layer, true).index === 463 ||
                        map.getTile(lay.x-2, lay.y, layer, true).index === 564 ||
                        map.getTile(lay.x-2, lay.y, layer, true).index === 465 ||
                        map.getTile(lay.x-2, lay.y, layer, true).index === 217 ||
                        map.getTile(lay.x-2, lay.y, layer, true).index === 218 ||
                        map.getTile(lay.x-2, lay.y, layer, true).index === 219
                    )
                )  map.removeTile(lay.x-2, lay.y);

                toolsGame.mainElements.explosion.add(lay.x, lay.y);
                map.removeTile(lay.x, lay.y);
                if(lay.index === 463)  toolsGame.mainElements.logs.add(lay.x, lay.y,false,'log');
                if(lay.index === 564)  toolsGame.mainElements.logs.add(lay.x, lay.y, 'coin', 'log');
                if(lay.index === 465)  toolsGame.mainElements.logs.add(lay.x, lay.y, 'surprise', 'log');
                if(lay.index === 217)  toolsGame.mainElements.logs.add(lay.x, lay.y,false,'stone');
                if(lay.index === 218)  toolsGame.mainElements.logs.add(lay.x, lay.y,'coin','stone');
                if(lay.index === 219)  toolsGame.mainElements.logs.add(lay.x, lay.y,'surprise','stone');

                // if(lay.index === 564 || lay.index === 465 || lay.index === 218 || lay.index === 219) {
                //     toolsGame.audio.bingo();
                // }


            }
            else if(lay.index>0 && bullet) {
                bullet.kill();
                toolsGame.mainElements.explosion.add(lay.x, lay.y);
            }
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, layer, function(player, lay){
            if(lay.index === 101) {
                //console.log(layer);
                lay.collideDown=false;
                lay.collideUp=false;
                lay.collideLeft=false;
                lay.collideRight=false;
                game.time.events.add(1, function(){
                    lay.collideDown=true;
                    lay.collideUp=true;
                    lay.collideLeft=true;
                    lay.collideRight=true;
                },this);
            }
            else if(lay.index === 417) {
                // let rotation = false, flippedVal = false;
                // if(lay.rotation) {
                //     rotation = lay.rotation;
                //     flippedVal = lay.flippedVal;
                // }
                // //console.log(lay);
                //console.log(lay);
                map.removeTile(lay.x, lay.y, layer);
                map.putTile(416,lay.x, lay.y, layer);
                //console.log(rotation);
                // lay.rotation = rotation;
                // lay.flippedVal = flippedVal;
                //console.log(lay.x + "x" + lay.y);
                //game.time.events.add(1000,function(){
                //    map.replace(417, 416, lay.x, lay.y, tileSize, tileSize, layer);
                //},this);
                // map.replace(417, 416, lay.x, lay.y, tileSize, tileSize, layer);
                toolsGame.mainElements.openDoor(player);
            }
            else if(
                lay.index === 463 || lay.index === 564 || lay.index === 465 ||
                lay.index === 217 || lay.index === 218 || lay.index === 219
            ) {
                //console.log("log collide;");
                map.removeTile(lay.x, lay.y);
                if(lay.index === 463)  toolsGame.mainElements.logs.add(lay.x, lay.y,false,'log');
                if(lay.index === 564)  toolsGame.mainElements.logs.add(lay.x, lay.y, 'coin', 'log');
                if(lay.index === 465)  toolsGame.mainElements.logs.add(lay.x, lay.y, 'surprise', 'log');
                if(lay.index === 217)  toolsGame.mainElements.logs.add(lay.x, lay.y,false,'stone');
                if(lay.index === 218)  toolsGame.mainElements.logs.add(lay.x, lay.y,'coin','stone');
                if(lay.index === 219)  toolsGame.mainElements.logs.add(lay.x, lay.y,'surprise','stone');

                // if(lay.index === 564 || lay.index === 465 || lay.index === 218 || lay.index === 219) {
                //     toolsGame.audio.bingo();
                // }
            }
        }, null, this);

        // usuwanie kolizji miedzy bullet a niewidzialnym blockiem dla intruzow
        game.physics.arcade.overlap(toolsGame.mainElements.player.gun.bullets.obj, layer, function(bullet, lay){
            //console.log(lay.index);
            if(lay.index === 101) {
                //console.log(layer);
                //console.log("shot");
                lay.collideDown=false;
                lay.collideUp=false;
                lay.collideLeft=false;
                lay.collideRight=false;
                game.time.events.add(1, function(){
                    lay.collideDown=true;
                    lay.collideUp=true;
                    lay.collideLeft=true;
                    lay.collideRight=true;
                },this);
            }
        }, null, this);


        toolsGame.mainElements.player.obj.t1=false;
        game.physics.arcade.collide(toolsGame.mainElements.player.obj, layer, function(player, layer){
            //console.log(player.body.checkCollision.down);
            //console.log(player.body.blocked.right);

            // player.t1=true;
            // if(!player.onGround) {
            //     toolsGame.audio.footStep();
            //     player.onGround=true;
            // }
            //
            // if(cursors.left.isDown || cursors.right.isDown) {
            //     toolsGame.audio.footStep();
            // }

            toolsGame.mainElements.player.checkIfWasKilledAndOther(player);

            if(player.killHitIntruder) {
                player.killHitIntruder=false;
            }

            // wchodzenie pod gorke
            if((cursors.right.isDown || cursors.left.isDown) && (player.body.blocked.right || player.body.blocked.left) && !jumpButton.isDown && player.body.onFloor())
            {
                //console.log("up");
                player.body.velocity.y = -12*tileSize;
            }
            //console.log("x: " + player.body.x + " / " + "y: " + player.body.y);
        },null, this);

        game.physics.arcade.collide(toolsGame.mainElements.coins.obj, layer);

        game.physics.arcade.collide(toolsGame.mainElements.logs.obj, layer);

        //game.physics.arcade.collide(toolsGame.mainElements.invisibleLogs.obj, layer);

        // game.physics.arcade.overlap(toolsGame.mainElements.player.gun.bullets.obj, toolsGame.mainElements.intruders.obj, function(bullet, intruz){
        //     //jden strzal wywoluje jedna funkcje...
        //     if(!intruz.killing) toolsGame.mainElements.intruders.collisionIntruz(intruz,"total-kill");
        //     intruz.killing=true;
        //     bullet.kill();
        // }, null, this);

        ///\\\///
        // game.physics.arcade.overlap(toolsGame.mainElements.logs.obj, toolsGame.mainElements.player.obj, function(log,p){
        //     p.isUp=false;
        // },null, this);


        // dopracowac - to musi byc aby intruders mogli przemieszcac sie p ktych kladkach
        game.physics.arcade.collide(toolsGame.mainElements.logs.obj,toolsGame.mainElements.intruders.obj,function(l,i){
            // nie wykrywa blokowania dla intruza
            //console.log("intruz:");
            //console.log(i.body);
            //console.log("log:");
            //console.log(l.body);
            //console.log(l.body);
            toolsGame.mainElements.intruders.collisionBack(i);
        }, null, this);

        //
        // game.physics.arcade.overlap(toolsGame.mainElements.logs.obj,toolsGame.mainElements.intruders.obj,function(l,i){
        //     //console.log(i.body.blocked);
        // }, null, this);

        game.physics.arcade.collide(toolsGame.mainElements.logs.obj,toolsGame.mainElements.logs.obj,function(log){
            // dla logs tez dziala
            //toolsGame.intruzCollisonBack(log);
        });

        game.physics.arcade.overlap(toolsGame.mainElements.invisibleLogs.obj, toolsGame.mainElements.player.obj, function(log,p){

            if(!p.onlynOne && !(toolsGame.mainElements.player.obj.body.overlapY>0)) {
                //p.body.allowGravity = true;
                p.body.velocity.y = -330;
                if(facing === 'left') {
                    p.body.velocity.x = -30;
                } else if(facing === 'right') {
                    p.body.velocity.x = 30;
                }

                toolsGame.audio.breakGround();

                game.time.events.add(50, function(){
                    p.body.allowGravity = true;
                    p.body.checkCollision.down=false;
                },this);
                //console.log(p.x);
                //console.log(p.y);
                //p.originX = p.x;
                p.originY = p.y;

                p.scale.setTo(1, 1);
                p.animations.add('run',[11,10,9,8,7,6,5,4,3,2,1,0,0,0]).onComplete.add(function(){
                    //console.log(Math.ceil(p.x/tileSize));
                    //console.log(Math.ceil(p.y/tileSize));
                    p.originX = p.x;
                    toolsGame.audio.magic();
                    map.putTile(104, Math.ceil(p.originX/tileSize), Math.ceil(p.originY/tileSize)+1, layer);
                    map.putTile(104, Math.ceil(p.originX/tileSize)+1, Math.ceil(p.originY/tileSize)+1, layer);
                    map.putTile(104, Math.ceil(p.originX/tileSize)+2, Math.ceil(p.originY/tileSize)+1, layer);
                    map.putTile(104, Math.ceil(p.originX/tileSize)-1, Math.ceil(p.originY/tileSize)+1, layer);
                    map.putTile(104, Math.ceil(p.originX/tileSize)-2, Math.ceil(p.originY/tileSize)+1, layer);
                    p.kill();
                }, this);
                p.animations.play('run', 15, false);
                p.onlynOne= true;
            }


        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.gun.bullets.obj, toolsGame.mainElements.logs.obj, function(bullet,log){
            toolsGame.mainElements.logs.destruction(log);
            //console.log(log);
            // if(!p.onlynOne) {
            //     //p.body.allowGravity = true;
            //     p.body.velocity.y = -330;
            //     if (facing === 'left') {
            //         p.body.velocity.x = -130;
            //     } else if (facing === 'right') {
            //         p.body.velocity.x = 130;
            //     }
            //
            //     toolsGame.audio.breakGround();
            //
            //     game.time.events.add(50, function () {
            //         p.body.allowGravity = true;
            //         p.body.checkCollision.down = false;
            //     }, this);
            //     p.animations.add('run');
            //     game.time.events.add(300, function () {
            //         p.animations.play('run', 20, false);
            //     }, this);
            //
            //     // jesli id = 514 to dostajemy bonusowe zloto
            //     if (p.coin) {
            //         game.time.events.add(200, function () {
            //             toolsGame.mainElements.coins.add(p.x / tileSize, p.y / tileSize);
            //         }, this);
            //     } else if (p.surprise) {
            //         game.time.events.add(200, function () {
            //             //console.log(p.surprise);
            //             switch (p.surprise) {
            //                 case 1:
            //                     toolsGame.mainElements.bulletsGuns.add(p.x / tileSize, p.y / tileSize);
            //                     break;
            //                 case 2:
            //                     toolsGame.mainElements.LifeSingleS.add(p.x / tileSize, p.y / tileSize);
            //                     break;
            //                 case 3:
            //                     toolsGame.mainElements.intruders.add(p.x / tileSize, p.y / tileSize, 3);
            //                     break;
            //                 case 4:
            //                     toolsGame.mainElements.coins.add(p.x / tileSize, p.y / tileSize);
            //                     break;
            //                 case 5:
            //                     toolsGame.mainElements.intruders.add(p.x / tileSize, p.y / tileSize, 5);
            //                     break;
            //             }
            //         }, this);
            //     }
            //
            //     game.time.events.add(900, function () {
            //         // toolsGame.mainElements.coins.add(p.saveX/tileSize, p.saveY/tileSize);
            //         p.kill();
            //     }, this);
            //     p.onlynOne = true;
            // }
            bullet.kill();
        }, null, this);

        game.physics.arcade.collide(toolsGame.mainElements.logs.obj, toolsGame.mainElements.player.obj, function(log,p){
            if(toolsGame.mainElements.player.obj.body.overlapY>0)
            {
                toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
                p.isUp=true;
                toolsGame.mainElements.player.obj.body.allowGravity = false;
                game.time.events.add(300, function(){
                    p.isUp=false;
                },this);
            } else {
                toolsGame.mainElements.logs.destruction(p);
            }
        }, null, this);


        /* big stone */

        toolsGame.mainElements.stoneBigS.obj.forEach(function(s){
            // przyrost odleglosci w spadaniu
            if(s.body.gravity.x!==0) {
                s.body.gravity.x=0;
            }
            if(s.keepStone){
                //s.angle = 0;
                toolsGame.mainElements.stoneBigS.keepStone = true;
                s.y=toolsGame.mainElements.player.obj.y+toolsGame.mainElements.player.obj.height-(s.body.height/2);
                if(cursorDirection === 'right'){
                    s.x=toolsGame.mainElements.player.obj.x+toolsGame.mainElements.player.obj.width;
                } else if(cursorDirection === 'left') {
                    s.x=toolsGame.mainElements.player.obj.x;
                }
            } else {
                if(Math.ceil(s.body._dy)>4){
                    s.quake=true;
                }
            }
        }, this, true);
        game.physics.arcade.collide(toolsGame.mainElements.stoneBigS.obj, layer, function(s,lay){
            //console.log(s);
            if(s.quake) {
                toolsGame.audio.quake();
                game.camera.shake(0.005, 200, true, Phaser.Camera.SHAKE_VERTICAL);
                s.quake=false;
            }
        }, null, this);

        game.physics.arcade.collide(toolsGame.mainElements.intruders.obj, toolsGame.mainElements.stoneBigS.obj,function(i,s){

            if(s.quake) {
                s.quake=false;
                // pomimo height 0 ciagle pojawia sie male opznienie
                if(i.body.overlapY<0 && i.body.height) {
                    i.body.height=0;
                    //console.log(i.body);
                    // i.body.y=100;
                    // i.body.x=100;
                    if(!i.killing) {
                        toolsGame.mainElements.intruders.collisionIntruz(i, "total-kill");
                    }
                    i.killing=true;
                }
                toolsGame.audio.quake();
                game.camera.shake(0.005, 200, true, Phaser.Camera.SHAKE_VERTICAL);
            } else {
                toolsGame.mainElements.intruders.collisionBack(i);
                s.body.moves = false;
                s.body.immovable = true;

                game.time.events.remove(s.fOnlyOne);
                s.fOnlyOne=game.time.events.add(300, function(){
                    s.body.moves = true;
                    s.body.immovable = false;
                    s.body.velocity.x = 0;
                    s.body.velocity.y = 0;
                }, this);
            }
        }, null, this);
        game.physics.arcade.collide(toolsGame.mainElements.player.gun.bullets.obj, toolsGame.mainElements.stoneBigS.obj,function(b,s){
            toolsGame.mainElements.explosion.add(b.body.position.x/tileSize, b.body.position.y/tileSize);
            toolsGame.mainElements.stoneBigExplosion.add(s.body.position.x/tileSize, s.body.position.y/tileSize);
            s.kill();
            b.kill();
        }, null, this);

        //game.physics.arcade.collide(toolsGame.mainElements.stoneBigS.obj, layer);


        toolsGame.mainElements.player.colisinStoneCollision=0;
        game.physics.arcade.collide(toolsGame.mainElements.player.obj, toolsGame.mainElements.stoneBigS.obj, function(p,s){

            // console.log(p.body.blocked);
            // console.log(s.body);
            // if(s.body.blocked.left) {
            //     console.log("blokuje z lewej");
            // }
            // if(s.body.blocked.right) {
            //     console.log("blokuje z prawej");
            // }
            //console.log("p:");
            //console.log(p);
            //console.log("s:");
            //console.log(s);



            /* push and pull stone */

            if(p.body.overlapY===0) {

                toolsGame.mainElements.player.colisinStoneCollision++;

                if(cursors.down.isDown && !toolsGame.mainElements.stoneBigS.keepStone) {
                    s.keepStone = true;
                    toolsGame.mainElements.stoneBigS.keepStone = true;
                    playerSpeedLeftRight = 50;
                    p.youCanJump = false;
                    if(cursors.left.isDown) {
                        cursorDirection = 'left';
                    } else {
                        cursorDirection = 'right';
                    }
                    game.time.events.add(10,function(){
                        playerSpeedLeftRight = 50;
                    },this);
                    // game.time.events.add(4000,function(){
                    //     s.keepStone = false;
                    //     toolsGame.mainElements.stoneBigS.keepStone = false;
                    //     playerSpeedLeftRight = (toolsGame.mainElements.player.obj.scale.y !== 1)?300:200;
                    // },this);
                } else {

                    s.body.immovable = true;
                    s.body.moves = false;
                    game.time.events.remove(p.timeStoneHeavy);
                    p.timeStoneHeavy=game.time.events.add(300,function(){
                        s.body.immovable = false;
                        s.body.moves = true;
                    },this);

                    if(cursors.down.isDown && toolsGame.mainElements.stoneBigS.keepStone) {
                        s.keepStone = false;
                        toolsGame.mainElements.stoneBigS.keepStone = false;
                        playerSpeedLeftRight = (toolsGame.mainElements.player.obj.scale.y !== 1)?300:200;
                        s.body.velocity.y = -300;
                        if(cursorDirection === 'left') {
                            s.body.velocity.x = -300;
                        }else {
                            s.body.velocity.x = 300;
                        }

                    }
                }

                //if(!toolsGame.mainElements.stoneBigS.keepStone) {
                    s.body.immovable = false;
                    s.body.moves = true;

                    s.body.gravity.x=0;
                    if(!levelFile.blockedKeys) {
                        if(cursors.right.isDown) {
                            s.body.gravity.x = !toolsGame.mainElements.stoneBigS.keepStone?-8500:8500;
                        } else if(cursors.left.isDown) {
                            s.body.gravity.x = !toolsGame.mainElements.stoneBigS.keepStone?8500:-8500;
                        }
                    } else {
                        s.body.gravity.x = 0;
                    }
                    game.time.events.remove(p.timeStoneHeavy);
                    p.timeStoneHeavy=game.time.events.add(30,function(){
                        s.body.gravity.x=0;
                        s.body.immovable = false;
                    },this);
                    if(toolsGame.mainElements.player.colisinStoneCollision>1){
                        s.body.gravity.x = 0;
                    }
                //}
            }
            /* end push stone */



            if(s.quake) {
                toolsGame.audio.quake();
                game.camera.shake(0.005, 200, true, Phaser.Camera.SHAKE_VERTICAL);
                s.quake=false;

                //console.log(p.body.overlapY);
                if(p.body.overlapY<0 && p.body.height) {
                    const saveBodyHeight = p.body.height;
                    p.body.height=0;
                    game.time.events.add(300,function(){p.body.height=saveBodyHeight;},this);
                    toolsGame.mainElements.player.lostLife(p,10);
                }
            }

            if(!s.keepStone) {
                p.youCanJump = true;
                game.time.events.add(300, function(){
                    p.youCanJump = false;
                },this);
            }
            //toolsGame.mainElements.player.obj.body.bounce.y = 1;
            s.quake=false;

            if(!s.onlyOne || facing !== 'idle') {
                //toolsGame.mainElements.player.obj.body.bounce.y = 2;
                toolsGame.mainElements.player.checkIfWasKilledAndOther(p);
                s.onlyOne = true;
            }
            game.time.events.remove(s.fOnlyOne);
            s.fOnlyOne=game.time.events.add(100, function(){
                s.onlyOne = false;

                s.body.moves = true;
                s.body.immovable = false;
                s.body.velocity.x = 0;
                s.body.velocity.y = 0;

            }, this);

        }, null, this);
        //console.log(toolsGame.mainElements.player.colisinStoneCollision);

        game.physics.arcade.collide(toolsGame.mainElements.stoneBigS.obj, toolsGame.mainElements.stoneBigS.obj, function(s1,s2){
            //po 50ms kamien sie zatrzyma
            game.time.events.remove(s1.timeCheck1);
            s1.timeCheck1 = game.time.events.add(50,function(){
                s1.body.velocity.x = 0;
            },this);
            game.time.events.remove(s2.timeCheck1);
            s2.timeCheck1 = game.time.events.add(50,function(){
                s2.body.velocity.x = 0;
            },this);
        });

        /* end big stone */


        game.physics.arcade.collide(toolsGame.mainElements.Lifes.obj, layer);

        game.physics.arcade.collide(toolsGame.mainElements.player.gun.bullets.obj, layer);

        game.physics.arcade.overlap(toolsGame.mainElements.player.gun.bullets.obj, toolsGame.mainElements.intruders.obj, function(bullet, intruz){
            //jden strzal wywoluje jedna funkcje...
            if(intruz.type === 4 || intruz.type === 5 || intruz.type === 7) {
                if(!intruz.killing) {
                    toolsGame.mainElements.intruders.collisionIntruz(intruz, "total-kill");
                }
                intruz.killing=true;
            } else {
                toolsGame.audio.screamIntruder(.05);
                //console.log(intruz.body.velocity.x);

                // evry shot makes intruz jump
                intruz.deactiveVelocity = bullet.direction;
                if(!intruz.firstShoot) {
                    if(intruz.type === 6) {
                        intruz.firstShoot=0;
                    }
                    else {
                        intruz.firstShoot=1;
                        intruz.randomSpeed = intruz.randomSpeed/2;
                    }

                    // blood
                    game.time.events.add(50, function(){
                        toolsGame.mainElements.splashs.add(
                            intruz.body.position.x/tileSize,
                            bullet.body.position.y/tileSize,
                            'splash-water-red',
                            'blood'
                        );
                    }, this);

                    game.time.events.add(50, function(){
                        if(intruz.randomMove === 'intruzRight') {
                            intruz.randomMove = 'intrudersdleLeft';
                        } else {
                            intruz.randomMove = 'intrudersdleRight';
                        }
                    },this);
                    game.time.events.add(600, function(){
                        if(intruz.randomMove === 'intrudersdleLeft') {
                            intruz.randomMove = 'intruzRight';
                        } else {
                            intruz.randomMove = 'intruzLeft';
                        }
                        intruz.deactiveVelocity = false;
                    },this);
                } else {
                    intruz.randomMove = 'intruzLeft';
                    if(!intruz.killing) {
                        toolsGame.mainElements.intruders.collisionIntruz(intruz, "total-kill");
                        intruz.killing=true;
                    }
                }
            }

            toolsGame.mainElements.explosion.add(bullet.body.position.x/tileSize, bullet.body.position.y/tileSize);
            bullet.kill();
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.gun.bullets.obj, layer, function(bullet, layer){
            if(bullet.body.blocked.right || bullet.body.blocked.left)
            {
                bullet.kill();
            }
        }, null, this);

        if(toolsGame.mainElements.player.obj.gForceWater) {
            toolsGame.mainElements.player.obj.body.gravity.y = 0;
            toolsGame.mainElements.player.obj.gForceWater = false;
        }


        toolsGame.mainElements.firebs.obj.forEach(function(f){
            //console.log(toolsGame.mainElements.player.obj.position.x);
            //console.log(f.position.x);
            //console.log(game.width);



            if(!f.startPositionSaveY){
                f.startPositionSaveY = Math.ceil(f.body.position.y/tileSize);
            }

            f.currentPositionY = Math.ceil(f.body.position.y/tileSize);
            //console.log(f.startPositionSaveY - f.currentPositionY);


            //if(timerTotal == f.randomStart) {
            if(timerTotal == 0) {
                f.start = true;
            }

            // detection activate firebs
            if(toolsGame.mainElements.player.detectionHoldOnObject(f,2)){
                f.active = true;
                if(f.activeWait) {
                    // setTime to Phaser
                    game.time.events.add(randomBetween(0,3)*1000, function(){
                        f.fall=false;
                        f.alpha=1;
                    }, this);
                    // setTimeout(function(){
                    //     f.fall=false;
                    //     f.alpha=1;
                    // },randomBetween(0,3)*1000);
                    f.activeWait=false;
                }
            } else {
                f.active = false;
            }


            if(f.start) {
                if(!f.fall) {
                    if(f.startPositionSaveY-f.currentPositionY === 0) {
                        // unosi sie
                        if(!f.typeFire) {
                            f.animations.play('run1', 10, true);
                        }
                        f.alpha = 1;
                        f.body.allowGravity = false;
                        f.body.velocity.y = -600;
                    } else if(f.startPositionSaveY-f.currentPositionY === 4) {
                        f.body.allowGravity = true;
                    } else if(f.startPositionSaveY-f.currentPositionY === 16) {
                        // opada
                        if(!f.typeFire) {
                            f.animations.play('run2', 10, true);
                        }
                        f.body.allowGravity = true;
                        f.body.velocity.y = 0;
                        f.fall = true;
                        f.t=false;
                    }
                } else {
                    if(f.startPositionSaveY-f.currentPositionY === 0 && !f.t) {
                        // zatrzymuje sie
                        f.body.velocity.y = 0;
                        f.body.allowGravity = false;
                        f.t=true;
                        f.alpha=0;

                        // detection activate firebs
                        game.time.events.add(randomBetween(1,6)*1000, function(){
                            if(f.active) {
                                f.fall=false;
                                f.alpha=1;
                            } else {
                                f.activeWait=true;
                            }
                            //console.log("aktywuj ponownie");
                        }, this);

                        // setTimeout(function(){
                        //     if(f.active) {
                        //         f.fall=false;
                        //         f.alpha=1;
                        //     } else {
                        //         f.activeWait=true;
                        //     }
                        //     //console.log("aktywuj ponownie");
                        // },randomBetween(1,6)*1000);
                    }
                }

            }
        }, this, true);
        game.physics.arcade.overlap(toolsGame.mainElements.firebs.obj, toolsGame.mainElements.waters.obj, function(f,w){
            //console.log(f.randomStart);

            // clearTimeout(f.gForceWaterTimer);
            // f.gForceWaterTimer = setTimeout(function(){
            //     f.gForceWaterOnlyeOne = false;
            // },100);

            game.time.events.remove(f.gForceWaterTimer);
            f.gForceWaterTimer = game.time.events.add(100, function(){
                f.gForceWaterOnlyeOne = false;
            }, this);


            if(!f.gForceWaterOnlyeOne) {
                toolsGame.mainElements.splashs.add((f.body.position.x+(f.body.width/2))/tileSize,((f.body.position.y+(f.typeFire?(-16):8))/tileSize),(w.type==='water-red')?'splash-water-red':false);
                f.gForceWaterOnlyeOne = true;
            }
        }, null, this);


        game.physics.arcade.overlap(toolsGame.mainElements.stoneBigS.obj, toolsGame.mainElements.waters.obj, function(s,w){
            game.time.events.remove(s.gForceWaterTimer);
            s.gForceWaterTimer = game.time.events.add(100, function(){
                s.gForceWaterOnlyeOne = false;
            }, this);
            if(!s.gForceWaterOnlyeOne) {
                toolsGame.mainElements.splashs.add((s.body.position.x+(s.body.width/2))/tileSize,((s.body.position.y+(s.typeFire?(-16):8))/tileSize),(w.type==='water-red')?'splash-water-red':false);
                s.gForceWaterOnlyeOne = true;
            }
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.firebs.obj, function(p,f){
            if(f.alpha===1) {
                //console.log("collision with player");
                toolsGame.mainElements.player.lostLife(p);
            }
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.waters.obj, function(p,w){
            p.body.gravity.y = -525;

            toolsGame.mainElements.player.checkIfWasKilledAndOther(p,'water');
            // if(jumpKillF) {
            //     game.camera.shake(0.02, 250, true, Phaser.Camera.SHAKE_VERTICAL);
            //     jumpKillF = false;
            //     game.time.events.add(300,function(){
            //         jumpKillF = true;
            //     },this);
            // }
            //p.t1=true;
            //p.onGround = false;
            // clearTimeout(p.gForceWaterTimer);
            // p.gForceWaterTimer = setTimeout(function(){
            //     p.gForceWaterOnlyeOne = false;
            // },100);

            game.time.events.remove(p.gForceWaterTimer);
            p.gForceWaterTimer = game.time.events.add(100, function(){
                p.gForceWaterOnlyeOne = false;
            }, this);


            if(w.type!=="water-red") {

                //console.log("p: " + p.body.position.x);
                // clearTimeout(p.waterYSaveTime);
                // p.waterYSaveTime = setTimeout(function () {
                //     p.waterYSave = false;
                // },300);

                game.time.events.remove(p.waterYSaveTime);
                p.waterYSaveTime = game.time.events.add(300, function(){
                    p.waterYSave = false;
                }, this);


                if(!p.waterYSave) {
                    p.waterYSave = Math.ceil(w.body.position.y/tileSize);
                }
                //console.log(p.waterYSave - Math.ceil(p.body.position.y/tileSize));
                if(p.waterYSave - Math.ceil(p.body.position.y/tileSize) < 2) {
                    if(!p.iterWater) {
                        p.iterWater=1;
                    }
                    p.iterWater++;
                    //console.log(w.type);
                    if(p.iterWater >= 250){
                        //console.log("kill");
                        toolsGame.mainElements.player.lostLife(p);
                        p.iterWater = false;
                    }
                } else {
                    p.iterWater = false;
                }
            } else {
                //console.log("kill");
                toolsGame.mainElements.player.lostLife(p,10);
                //
            }


            //console.log(p.animations.currentAnim.name);
            if(!p.gForceWaterOnlyeOne) {
                //console.log(p.body.position.x + " - " + p.body.position.y);
                //console.log(p.body);
                //console.log(p.animations.currentAnim.name);
                let typeSplash=false;
                // toolsGame.audio.splash();

                if(w.type==='water-red') {
                    typeSplash='splash-water-red';
                }
                if(p.animations.currentAnim.name==="left" || p.animations.currentAnim.name==="jump-left") {
                    toolsGame.mainElements.splashs.add(((p.body.position.x+(p.body.width/2))/tileSize)-(32/tileSize),((p.body.position.y+32)/tileSize),typeSplash);
                } else if(p.animations.currentAnim.name==="right" || p.animations.currentAnim.name==="jump-right") {
                    toolsGame.mainElements.splashs.add(((p.body.position.x+(p.body.width/2))/tileSize)+(32/tileSize),((p.body.position.y+32)/tileSize),typeSplash);
                } else {
                    toolsGame.mainElements.splashs.add((p.body.position.x+(p.body.width/2))/tileSize,((p.body.position.y+28)/tileSize),typeSplash);
                }
                p.gForceWaterOnlyeOne = true;
            }
            p.gForceWater = true;

            if(cursors.left.isDown || cursors.right.isDown) {
                if(!p.delayWater) {
                    p.gForceWaterOnlyeOne = false;
                    p.delayWater = true;
                }
                if(timeLoop % 15 == 0) {
                    p.delayWater = false;
                }
            }

        }, null, this);

        toolsGame.mainElements.waters.obj.forEach(function(w){
            if(toolsGame.mainElements.player.detectionHoldOnObject(w,1)){
                //console.log(w.alpha);
                if(!w.alpha) {
                    w.alpha = 0.7;
                }
                //console.log("ładowANIE WOdy");
            } else {
                if(w.alpha) {
                    w.alpha=0;
                }
            }
        }, this, true);

        toolsGame.mainElements.intruders.obj.forEach(function(intruz){
            if(intruz.type < 4) {
                intruz.body.offset.x = 8;
                intruz.body.width = 32;
                //console.log("test");
            }

            if(intruz.gForceWater) {
                intruz.body.gravity.y = 0;
                intruz.gForceWater = false;
            }

            if(intruz.type === 4) {
                intruz.body.offset.y=6;
                intruz.body.height = 26;
            } else if(intruz.type === 5 || intruz.type === 7) {
                // intruz.body.velocity.y = -intruz.randomSpeed/2;

                intruz.body.offset.y=16;
                intruz.body.height = 52;
                if(!intruz.jumpToFly) {
                    if(timeLoop >= 0 && timeLoop < 60) {
                        intruz.body.velocity.y = -50;
                    }
                    else {
                        intruz.body.velocity.y = 25;
                    }
                }
                //console.log(timeLoop);

                // intruz.timeFly = game.time.events.add(2000, function () {
                //     game.time.events.remove(intruz.timeFly);
                //     intruz.body.velocity.y = -50;
                //
                // },this);

            }

            // warunek jesli intruz dotyka dna mapy
            if(intruz.body.y+intruz.height === map.height*map.tileHeight) {
                if(!intruz.killing) toolsGame.mainElements.intruders.collisionIntruz(intruz,"total-kill");
                intruz.killing=true;
            }

            if(intruz.type === 6) {
                if(intruz.randomMove === 'intrudersdleRight' || intruz.randomMove === 'intrudersdleLeft') {
                    //console.log("player position:");
                    //console.log(toolsGame.mainElements.player.obj.position.x);
                    //console.log("intruder position");
                    //console.log(intruz.position.x);
                    //console.log(intruz.area);
                    if(intruz.position.x > toolsGame.mainElements.player.obj.position.x-128 &&
                        intruz.position.x < toolsGame.mainElements.player.obj.position.x+64) {

                        //console.log("xxxx");

                        if(intruz.randomMove === 'intrudersdleRight') intruz.randomMove = 'intruzRight';
                        else if(intruz.randomMove === 'intrudersdleLeft') intruz.randomMove = 'intruzLeft';

                        // intruz.area = true;
                        // game.time.events.remove(intruz.timeArea);
                        // intruz.timeArea = game.time.events.add(600,function(){
                        //     intruz.area = false;
                        // },this);

                    } else {
                        //intruz.area = false;
                    }
                }

            }
        }, this, true);

        game.physics.arcade.overlap(toolsGame.mainElements.intruders.obj, toolsGame.mainElements.waters.obj, function(i,w){
            if(i.active) {
                i.body.gravity.y = -525;

                // clearTimeout(i.gForceWaterTimer);
                // i.gForceWaterTimer = setTimeout(function(){
                //     i.gForceWaterOnlyeOne = false;
                // },100);

                game.time.events.remove(i.gForceWaterTimer);
                i.gForceWaterTimer = game.time.events.add(100, function(){
                    i.gForceWaterOnlyeOne = false;
                }, this);

                if(!i.gForceWaterOnlyeOne) {
                    //console.log(i.body.position.x + " - " + i.body.position.y);
                    //console.log(i.body);
                    if(i.type===4) {
                        i.move_y = -33/tileSize;
                    } else {
                        i.move_y = 0;
                    }
                    let typeSplash=false;
                    if(w.type==='water-red') {
                        if(!i.killed) {
                            toolsGame.mainElements.intruders.collisionIntruz(i, "total-kill");
                            i.killed = true;
                        }
                        typeSplash='splash-water-red';
                    }
                    if(i.animations.currentAnim.name==="left") {
                        toolsGame.mainElements.splashs.add(((i.body.position.x+(i.body.width/2))/tileSize)-(32/tileSize),i.move_y + ((i.body.position.y+32)/tileSize),typeSplash);
                    } else if(i.animations.currentAnim.name==="right") {
                        toolsGame.mainElements.splashs.add(((i.body.position.x+(i.body.width/2))/tileSize)+(32/tileSize),i.move_y + ((i.body.position.y+32)/tileSize),typeSplash);
                    } else {
                        toolsGame.mainElements.splashs.add((i.body.position.x+(i.body.width/2))/tileSize,i.move_y + ((i.body.position.y+28)/tileSize),typeSplash);
                    }

                    //toolsGame.mainElements.splashs.add((i.body.position.x+(i.body.width/2))/tileSize,((i.body.position.y+28)/tileSize));
                    i.gForceWaterOnlyeOne = true;
                }
                i.gForceWater = true;

                //console.log(i.animations.currentAnim.name);
                if(i.animations.currentAnim.name=='right' || i.animations.currentAnim.name=='left') {
                    if(!i.delayWater) {
                        i.gForceWaterOnlyeOne = false;
                        i.delayWater = true;
                    }
                    if(timeLoop % 15 == 0) {
                        i.delayWater = false;
                    }
                }
            }
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.coins.obj, function(player, coin){
            toolsGame.audio.coin();
            toolsGame.mainElements.player.numberCoins++;
            toolsGame.mainElements.player.numberCoinsLevel++;

            toolsGame.mainElements.player.numberCoinsLevelProcent = Math.ceil(100*toolsGame.mainElements.player.numberCoinsLevel/oneHP);
            //console.log("100*" + toolsGame.mainElements.player.numberCoinsLevel + " / " + oneHP);
            coin.kill();
            toolsGame.windows.boxTopMenu.f=false;

            //console.log(player.x);

            //toolsGame.mainElements.coins.add(player.x/tileSize, player.y/tileSize);

            // only animation text
            toolsGame.addPoint(coin.x,player.y,'addPointGold'+toolsGame.mainElements.player.numberCoins,'+1 gold');

        }, null, this);

        // game.physics.arcade.overlap(toolsGame.mainElements.intruders.obj, toolsGame.mainElements.coins.obj, function(player, coin){
        //     coin.kill();
        // }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.Lifes.obj, function(player, Life){
            toolsGame.mainElements.player.numberMainLifes++;
            toolsGame.audio.life();
            player.body.velocity.y = -300;
            game.time.events.remove(toolsGame.mainElements.player.timeLife);
            if(player.scale.y === 1) {
                toolsGame.mainElements.player.scale('increase');
                toolsGame.mainElements.player.timeLife = game.time.events.add(30000, function(){
                    if(player.scale.y > 1) {
                        toolsGame.mainElements.player.scale('restart');
                    }
                }, this);
            }

            //player.moreJump = true;

            // setTimeout(function(){
            //     toolsGame.audio.life();
            //     setTimeout(function(){
            //         toolsGame.audio.life();
            //     },200);
            // },200);

            game.time.events.add(200, function(){
                toolsGame.audio.life();
                game.time.events.add(200, function(){
                    toolsGame.audio.life();
                }, this);
            }, this);

            Life.kill();
            toolsGame.windows.boxTopMenu.f=false;
            toolsGame.addPoint(Life.x,player.y,'addPointFullLife'+toolsGame.mainElements.player.numberMainLifes,'+1 full life');
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.LifeSingleS.obj, function(player, LifeSingle){
            if(toolsGame.mainElements.player.numberLifes===amountLife) {
                // toolsGame.mainElements.player.numberMainLifes++;
            } else {
                toolsGame.mainElements.player.numberLifes++;
                toolsGame.audio.life();
                LifeSingle.kill();
                toolsGame.windows.boxTopMenu.f=false;
                toolsGame.addPoint(LifeSingle.x,player.y,'addPointLife'+toolsGame.mainElements.player.numberLifes,'+1 life');
            }
        }, null, this);


        /////
        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.bulletsGuns.obj, function(player, bullets_gun){
            const numberAddBullets = 6;
            toolsGame.audio.bullets();
            toolsGame.mainElements.player.countBullets += numberAddBullets;
            toolsGame.mainElements.player.countBulletsF = true;
            bullets_gun.kill();
            toolsGame.windows.boxTopMenu.f=false;
            toolsGame.addPoint(bullets_gun.x,player.y,'addPointBullet'+toolsGame.mainElements.player.countBullets,'+' + numberAddBullets + ' bullets');
        }, null, this);

        //// Finishing the level
        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.endLevelS.obj, function(player, end_level){
            if(!levelFile.readyLoad)
            {

                toolsGame.mainElements.player.removeKeepStone();
                toolsGame.audio.nextLevel(0.5);
                // saving to cookies

                setCookies('id-level-last-memory',levelFile.activeIdLevel);

                setCookies('coins', toolsGame.mainElements.player.numberCoins);
                setCookies('coins-' + levelFile.activeIdLevel,toolsGame.mainElements.player.numberCoinsLevel);
                //console.log(toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory + " - " + toolsGame.mainElements.player.numberCoinsLevelProcent);
                if(toolsGame.mainElements.player.numberCoinsLevelProcent>toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory) {
                    setCookies('coins-procent-' + levelFile.activeIdLevel,toolsGame.mainElements.player.numberCoinsLevelProcent);
                    //console.log("save");
                }

                setCookies('Lifes', toolsGame.mainElements.player.numberLifes);
                setCookies('main-Lifes', toolsGame.mainElements.player.numberMainLifes);

                setCookies('bullets',toolsGame.mainElements.player.countBullets);

                // poprawic
                //alert("x");
                //clearTimeout(toolsGame.mainElements.player.obj.touchGroundTime);
                //toolsGame.mainElements.player.obj.animations.stop();

                levelFile.readyLoad=true;

                levelFile.blockedKeys=true;
                //console.log(toolsGame.mainElements.player.obj.position.y);
                //toolsGame.mainElements.player.obj.position.y = toolsGame.mainElements.player.obj.position.y - 50;

                //console.log(amountLevels + " - " + levelFile.activeIdLevel);

                const finishLevel = function(){
                    toolsGame.text.hide('score');
                    toolsGame.text.hide('scoreTotal');
                    correctCookiesProcent();
                    levelFile.activeIdLevel=levelFile.activeIdLevel+1;
                    //alert(Object.keys(game.cache._cacheMap[7]).length + " - " + amountLevels + " - " + levelFile.activeIdLevel);
                    if(amountLevels === levelFile.activeIdLevel-1) {
                        toolsGame.windows.boxMenu.show('game-complete');
                    }
                    else {
                        //alert(id);
                        endGame();
                        levelFile.name='level'+levelFile.activeIdLevel;
                        //console.log(getCookies("unlock-levels") + " - " + levelFile.activeIdLevel);

                        if(!getCookies("unlock-levels") || getCookies("unlock-levels")<levelFile.activeIdLevel) {
                            unlockLevels = levelFile.activeIdLevel;
                            setCookies('unlock-levels',unlockLevels);
                            //alert("unlockLevels zapisane: " + unlockLevels);
                        }
                        //alert(amountLevels + " - " + levelFile.activeIdLevel);
                        // if(amountLevels === levelFile.activeIdLevel) {
                        //     alert("congratulations!");
                        // }
                        startGame(false,amountLevels === levelFile.activeIdLevel,scorePercent);
                        // levelFile.readyLoad=false;
                        // levelFile.blockedKeys=false;
                    }
                };

                if(!theEndCredits) {
                    toolsGame.mainElements.player.obj.animations.play('end-level');
                    game.time.events.add(3000,function(){
                        toolsGame.mainElements.player.obj.animations.play('idle-left');
                    },this);
                    toolsGame.mainElements.player.obj.body.bounce.y = .9;

                    // jump for finish level
                    toolsGame.mainElements.player.obj.body.velocity.y = -330;
                    toolsGame.mainElements.player.jumpTimer = game.time.now + 330;

                    // Percent presentation
                    const theBestScorePrecent = toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory;
                    let showTheBestScore='';
                    scorePercent = 0;

                    const scoreInterval = function () {
                        toolsGame.text.show('center',0,0,0.9,'Score: '+scorePercent+'%','bold 20px Arial','#dad9d5',true,'score',true);
                        toolsGame.audio.ticScore();
                        if(scorePercent < toolsGame.mainElements.player.numberCoinsLevelProcent) {
                            scorePercent ++;
                            game.time.events.add(100, scoreInterval, this);
                        } else {
                            toolsGame.audio.quake();
                            game.camera.shake(0.05, 500, true, Phaser.Camera.SHAKE_VERTICAL);
                            if(theBestScorePrecent>scorePercent) {
                                showTheBestScore="\n" + 'Your the best score: ' + theBestScorePrecent + '%';
                            } else {
                                if(scorePercent) {
                                    showTheBestScore="\n" + 'This is your best score!';
                                }
                            }

                            //console.log(amountLevels + " - " + levelFile.activeIdLevel);
                            if(amountLevels === levelFile.activeIdLevel+1){
                                game.time.events.add(1000, function(){
                                    //console.log(amountLevels);
                                    let globalPercent = 0;
                                    for(let i=1; i<amountLevels; i++){
                                        if(getCookies('coins-procent-' + i)) {
                                            globalPercent +=  parseInt(getCookies('coins-procent-' + i));
                                            //console.log(i + ' istnieje i wynosci: ' + getCookies('coins-procent-' + i) + '%');
                                        }
                                    }
                                    globalPercent = Math.ceil(globalPercent / (amountLevels-1));

                                    let scoreTotalPercent = 0;
                                    const scoreTotalIntreval = function() {
                                        if(scoreTotalPercent < globalPercent) {
                                            scoreTotalPercent ++;
                                            game.time.events.add(100, scoreTotalIntreval, this);
                                        }
                                        else {
                                            toolsGame.audio.quake(.6);
                                            game.camera.shake(0.08, 600, true, Phaser.Camera.SHAKE_VERTICAL);
                                            game.time.events.add(4000, finishLevel, this);
                                        }
                                        toolsGame.text.hide('scoreTotal');
                                        toolsGame.text.show('center',0,3*tileSize,0.9,'Score Total: '+scoreTotalPercent+'%','bold 32px Arial','#dad9d5',true,'scoreTotal',true);
                                        toolsGame.audio.ticScore();
                                    };
                                    scoreTotalIntreval();
                                }, this);
                            } else {
                                game.time.events.add(4000, finishLevel, this);
                            }
                        }
                        toolsGame.text.hide('score');
                        toolsGame.text.show('center', 0, 0, 0.9, 'Score: ' + scorePercent + '%' + showTheBestScore, 'bold 20px Arial', '#dad9d5', true, 'score', true);
                    };
                    //scoreInterval();
                    game.time.events.add(3000, scoreInterval, this);

                } else {
                    game.time.events.add(3000, finishLevel, this);
                }

                // animation jump left/right for finish level
                let start = null;
                const step = function(timestamp) {
                    if (!start) start = timestamp;

                    if (facing === 'right') {
                        toolsGame.mainElements.player.obj.body.velocity.x = 100;

                    } else if (facing === 'left') {
                        toolsGame.mainElements.player.obj.body.velocity.x = -100;
                    }

                    const progress = timestamp - start;
                    if (progress < 500) {
                        window.requestAnimationFrame(step);
                    }
                }

                window.requestAnimationFrame(step);

            }
            toolsGame.windows.boxTopMenu.f=false;
        }, null, this);

        //// Save the place
        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.saveLevelS.obj, function(player, save_level){
            //console.log(player);
            if(!(saveX === save_level.body.x && saveY === save_level.body.y) && !save_level.block) {
                //console.log("Save place: " + save_level.body.x + " / " + save_level.body.y);
                saveX = save_level.body.x;
                saveY = save_level.body.y;
                save_level.block = true;
                save_level.animations.play('run2', 17, true);
                toolsGame.audio.flash(1);
            }

        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.keys.obj, function(p,k){
            k.kill();
            keys++;
            toolsGame.audio.key(.8);
            toolsGame.windows.boxTopMenu.f=false;
            toolsGame.addPoint(k.x,p.y,'addPointKey','You got the key!');
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.locks.obj, function(p,l){

            if(keys > 0) {
                l.kill();

                toolsGame.mainElements.openDoor(p);

                // let ind1 = 0;
                // toolsGame.mainElements.doorsHorizontal.obj.forEach(function(doorH){
                //     doorH.index = ind1;
                //     ind1++;
                // },this);
                // let ind2 = 0;
                // toolsGame.mainElements.doors.obj.forEach(function(door){
                //     door.index = ind2;
                //     ind2++;
                // },this);
                //
                // const distanceArray = [];
                // toolsGame.mainElements.doors.obj.forEach(function(door){
                //     distanceArray.push(game.physics.arcade.distanceBetween(l,door));
                //     //console.log(game.physics.arcade.distanceBetween(l,door));
                // },this);
                // const minDistnaceArray = Math.min.apply(null, distanceArray);
                //
                // const distanceArrayH = [];
                // toolsGame.mainElements.doorsHorizontal.obj.forEach(function(doorH){
                //     distanceArrayH.push(game.physics.arcade.distanceBetween(l,doorH));
                //     //console.log(game.physics.arcade.distanceBetween(l,door));
                // },this);
                // const minDistnaceArrayH = Math.min.apply(null, distanceArrayH);
                //
                //
                // toolsGame.mainElements.doors.obj.forEach(function(door){
                //
                //     if(isExists(door) && !door.deactive) {
                //         if (minDistnaceArray === game.physics.arcade.distanceBetween(l, door)) {
                //             //console.log(door.index);
                //             if(isExists(door) && !door.deactive) {
                //                 if(!door.zero) {
                //                     door.deactive = true;
                //                     door.body.velocity.y = -50;
                //                     toolsGame.audio.doorLift();
                //                     game.time.events.add(3000, function(){
                //                         door.body.velocity.y = 0;
                //                     }, this);
                //                 }
                //             }
                //         }
                //     }
                // },this);
                //
                // toolsGame.mainElements.doorsHorizontal.obj.forEach(function(doorH){
                //
                //     if (minDistnaceArrayH === game.physics.arcade.distanceBetween(l, doorH)) {
                //         if (isExists(doorH) && !doorH.deactive) {
                //             if(!doorH.zero) {
                //                 doorH.deactive = true;
                //                 toolsGame.mainElements.explosion.add(doorH.x / tileSize, doorH.y / tileSize);
                //                 doorH.kill();
                //             }
                //         }
                //     }
                // },this);


                toolsGame.windows.boxTopMenu.f=false; // refresh
                keys--;
            }
        }, null, this);

        game.physics.arcade.collide(toolsGame.mainElements.player.obj, toolsGame.mainElements.doors.obj);
        game.physics.arcade.collide(toolsGame.mainElements.player.obj, toolsGame.mainElements.doorsHorizontal.obj,function(p,d){
            // ten sposob sprawdza sie najlepiej - sprobowac wdrozyc go wszedzie jako standard
            p.youCanJump = true;
            game.time.events.add(300, function(){
                p.youCanJump = false;
            },this);
            toolsGame.mainElements.player.checkIfWasKilledAndOther(p);
        },null,this);

        game.physics.arcade.collide(toolsGame.mainElements.intruders.obj, toolsGame.mainElements.doors.obj, function(i,d){
            toolsGame.mainElements.intruders.collisionBack(i);
        });

        game.physics.arcade.collide(toolsGame.mainElements.intruders.obj, toolsGame.mainElements.doorsHorizontal.obj);

        game.physics.arcade.collide(toolsGame.mainElements.stoneBigS.obj, toolsGame.mainElements.doors.obj);
        game.physics.arcade.collide(toolsGame.mainElements.player.gun.bullets.obj, toolsGame.mainElements.doors.obj,function(b,d){
            toolsGame.mainElements.explosion.add(d.x/tileSize, b.y/tileSize);
            b.kill();;
        },null,this);
        game.physics.arcade.collide(toolsGame.mainElements.stoneBigS.obj, toolsGame.mainElements.doorsHorizontal.obj);


        // dotatkowy warunek jesli player dotyka dna mapy
        if(toolsGame.mainElements.player.obj.body.y+toolsGame.mainElements.player.obj.height === map.height*map.tileHeight) {
            //toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
            toolsGame.mainElements.player.lostLife(toolsGame.mainElements.player.obj,3);
        }

        //player vs fire
        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.fire.fireUpS.obj, function(player, fire){
            toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
            toolsGame.mainElements.player.lostLife(player);
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.fire.fireDownS.obj, function(player, fire){
            toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
            toolsGame.mainElements.player.lostLife(player);
        }, null, this);

        // game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.fire.fireUpNormalS.obj, function(player, fire){
        //     toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
        //     toolsGame.mainElements.player.lostLife(player);
        // }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.fire.fireLeftS.obj, function(player, fire){
            toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
            toolsGame.mainElements.player.lostLife(player);
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.fire.fireRightS.obj, function(player, fire){
            toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
            toolsGame.mainElements.player.lostLife(player);
        }, null, this);

        game.physics.arcade.collide(toolsGame.mainElements.intruders.obj, layer);



        // player vs intruder
        if(!levelFile.blockedKeys) {

            game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.intruders.obj, function(player, intruz){
                if(!intruz.killing) {
                    if(player.body.overlapY>0)
                    {

                        toolsGame.mainElements.player.checkIfWasKilledAndOther(player);


                        if(intruz.type === 4) {
                            toolsGame.audio.breakBones();
                        } else if(intruz.type === 5) {
                            toolsGame.audio.condor();
                        } else if(intruz.type === 7) {
                            toolsGame.audio.owl();
                        } else {
                            toolsGame.audio.screamIntruder(.05);
                        }
                        toolsGame.mainElements.intruders.collisionIntruz(intruz);
                        if(!(intruz.type === 5 || intruz.type === 6 || intruz.type === 5)) {
                            if(!intruz.hit || !player.killHitIntruder) {
                                player.killHitIntruder=true;
                                intruz.hit=1;
                            }
                            if(intruz.hit > 6) {
                                if(!intruz.killing) toolsGame.mainElements.intruders.collisionIntruz(intruz,"total-kill");
                                intruz.killing=true;
                                intruz.hit=false;
                                if(intruz.type<4) {
                                    toolsGame.mainElements.bulletsGuns.add(intruz.x/tileSize-1, intruz.y/tileSize);
                                }
                                if(intruz.type<4 && intruz.giveBackLive) {
                                    toolsGame.mainElements.LifeSingleS.add(intruz.x/tileSize, intruz.y/tileSize);
                                }
                            } else {
                                intruz.hit++;
                            }
                        }
                    }

                    // tracenie zycia
                    //if(player.body.overlapX>0 || player.body.overlapX<0)
                    if(player.body.overlapY!==0)
                    {
                        toolsGame.mainElements.player.lostLife(player);
                        intruz.giveBackLive = true;
                    }
                    //console.log(player.body.overlapY);
                }
            }, null, this);

            game.physics.arcade.collide(toolsGame.mainElements.intruders.obj, toolsGame.mainElements.player.obj);

        }

        // przeniesiona do gory - dotatkowy warunek jesli intruz dotyka dna mapy
        // toolsGame.mainElements.intruders.obj.forEach(function(intruz){
        //     if(intruz.body.y+intruz.height === map.height*map.tileHeight) {
        //         if(!intruz.killing) toolsGame.mainElements.intruders.collisionIntruz(intruz,"total-kill");
        //         intruz.killing=true;
        //     }
        // }, this, true);


        // Shooting
        if(toolsGame.mainElements.player.countBulletsF){
            if(toolsGame.mainElements.player.countBullets === 0) {
                //console.log("end of ammunition");
                toolsGame.buttons.navigations.shot.alpha = 0;
                toolsGame.buttons.navigations.shot.inputEnabled = false;
            } else {
                //console.log("you have ammunition");
                toolsGame.buttons.navigations.shot.alpha = 0.6;
                toolsGame.buttons.navigations.shot.inputEnabled = true;
            }
            toolsGame.mainElements.player.countBulletsF = false;
        }




        if(timeLoop>=120) timeLoop=0;
        else timeLoop++;
        //console.log(timeLoop);


        // tego uzyc zamiast detectionHoldOnObject ...
        // toolsGame.mainElements.keys.obj.forEach(function(k){
        //     console.log(game.physics.arcade.distanceBetween(toolsGame.mainElements.player.obj,k));
        // }, this, true);

        game.physics.arcade.overlap(toolsGame.mainElements.intruders.obj, layer, function(intruz,lay){

            //console.log(game.physics.arcade.distanceBetween(toolsGame.mainElements.player.obj,intruz));

            // if(toolsGame.mainElements.player.obj.position.x>intruz.position.x-game.width/1.5 &&
            //     toolsGame.mainElements.player.obj.position.x<intruz.position.x+game.width/1.5 &&
            //     toolsGame.mainElements.player.obj.position.y>intruz.position.y-game.height/1.5 &&
            //     toolsGame.mainElements.player.obj.position.y<intruz.position.y+game.height/1.5) {


            if(/* intruz.type===6 || */ toolsGame.mainElements.player.detectionHoldOnObject(intruz,.8)) { // im mniejsza wartosc tym wikeszy zasieg aktywacji intruza
                intruz.active = true;
                if(intruz.alpha===0) {
                    intruz.alpha=1;
                }
            } else {
                intruz.active = false;
                intruz.alpha = 0;
                intruz.body.velocity.x=0;
                intruz.animations.stop();
            }




            if(intruz.active) {
                if(!intruz.timeLoop) {
                    intruz.timeLoop = 1;
                    toolsGame.mainElements.intruders.id++;
                    intruz.id = toolsGame.mainElements.intruders.id;
                    intruz.break = 4000 * intruz.id;
                    //console.log("intruz type: " + intruz.type + " loaded");
                }

                //if parzyste {} else {}

                //console.log(intruz);

                intruz.timeLoop++;


                intruz.body.velocity.x = 0;


                if(intruz.randomMove=='intruzRight' || intruz.randomMove=='intruzLeft')
                {
                    if(intruz.type === 1 || intruz.type === 4 || intruz.type === 5 || intruz.type === 7) {

                        if(intruz.body.blocked.left) {
                            if(intruz.type === 4) {
                                intruz.frame=41;
                                //intruz.animations.play('turn-left');
                                // setTimeout(function(){
                                //     intruz.frame=37;
                                // },30);
                                // setTimeout(function(){
                                //     intruz.randomMove='intruzLeft';
                                // },60);

                                game.time.events.add(30, function(){
                                    intruz.frame=37;
                                }, this);
                                game.time.events.add(60, function(){
                                    intruz.randomMove='intruzLeft';
                                }, this);

                            }
                            else intruz.randomMove='intruzLeft';

                            if(intruz.type === 5) {
                                toolsGame.audio.condor();
                            }

                            if(intruz.type === 7) {
                                toolsGame.audio.owl();
                            }
                        }
                        else if(intruz.body.blocked.right) {
                            if(intruz.type === 4) {
                                intruz.frame=40;

                                // setTimeout(function(){
                                //     intruz.frame=37;
                                // },30);
                                // setTimeout(function(){
                                //     intruz.randomMove='intruzRight';
                                // },60);

                                game.time.events.add(30, function(){
                                    intruz.frame=37;
                                }, this);
                                game.time.events.add(60, function(){
                                    intruz.randomMove='intruzRight';
                                }, this);
                            }
                            else intruz.randomMove='intruzRight';

                            if(intruz.type === 5) {
                                toolsGame.audio.condor();
                            }
                            if(intruz.type === 7) {
                                toolsGame.audio.owl();
                            }
                        }
                    }

                    if(intruz.body.blocked.up) {
                        if(intruz.body.blocked.left) intruz.randomMove='intruzLeft';
                        else if(intruz.body.blocked.right) intruz.randomMove='intruzRight';
                    }

                    if(intruz.type === 2 || intruz.type === 3) {
                        if(intruz.body.blocked.left || intruz.body.blocked.right) {
                            toolsGame.mainElements.intruders.jump(intruz,450);
                            if (timeLoop === 2) {
                                if (intruz.body.blocked.left) intruz.randomMove = 'intruzLeft';
                                else if (intruz.body.blocked.right) intruz.randomMove = 'intruzRight';
                            }
                        }
                    }

                    if(intruz.type === 1 || intruz.type === 2 || intruz.type === 4 || intruz.type === 5 || intruz.type === 6 || intruz.type === 7) {
                        if (intruz.randomMove == 'intruzRight') {
                            if(intruz.type === 4) {
                                intruz.body.velocity.x = -intruz.randomSpeed/2;
                            } else if (intruz.type === 5 || intruz.type === 7) {
                                intruz.body.velocity.x = -intruz.randomSpeed/1.2;
                            } else {
                                if(intruz.deactiveVelocity) {
                                    if(intruz.deactiveVelocity === 'left') {
                                        intruz.body.velocity.x = -1000;
                                    } else {
                                        intruz.body.velocity.x = 1000;
                                    }
                                    toolsGame.mainElements.intruders.jump(intruz,200);
                                } else {
                                    intruz.body.velocity.x = -intruz.randomSpeed;
                                }
                            }
                            intruz.animations.play('left');
                            intruz.check = false;
                        }
                        else if (intruz.randomMove == 'intruzLeft') {
                            if(intruz.type === 4) {
                                intruz.body.velocity.x = intruz.randomSpeed/2;
                            } else if (intruz.type === 5 || intruz.type === 7) {
                                intruz.body.velocity.x = intruz.randomSpeed/1.2;
                            } else {
                                if(intruz.deactiveVelocity) {
                                    if(intruz.deactiveVelocity === 'left') {
                                        intruz.body.velocity.x = -1000;
                                    } else {
                                        intruz.body.velocity.x = 1000;
                                    }
                                    toolsGame.mainElements.intruders.jump(intruz,200);
                                } else {
                                    intruz.body.velocity.x = intruz.randomSpeed;
                                }
                            }
                            intruz.animations.play('right');
                            intruz.check = false;
                        }
                    }
                    else if(intruz.type === 3) {
                        if (intruz.randomMove == 'intruzRight') {
                            if (intruz.timeLoop >= 2000 + intruz.break && intruz.timeLoop <= 4000 + intruz.break) {
                                if (!intruz.check) {
                                    intruz.body.velocity.x = 0;
                                    intruz.animations.play('idle-left');
                                    intruz.randomMove = 'intruzLeft';
                                    //console.log("x");
                                    intruz.check = true;
                                }
                                if (intruz.killing) {
                                    //console.log("xKill");
                                    intruz.animations.play('kill');
                                }
                            } else {
                                if(intruz.deactiveVelocity) {
                                    if(intruz.deactiveVelocity === 'left') {
                                        intruz.body.velocity.x = -1000;
                                    } else {
                                        intruz.body.velocity.x = 1000;
                                    }
                                    toolsGame.mainElements.intruders.jump(intruz,200);
                                } else {
                                    intruz.body.velocity.x = -intruz.randomSpeed;
                                }
                                intruz.animations.play('left');
                                intruz.check = false;
                            }
                        }
                        else if (intruz.randomMove == 'intruzLeft') {
                            if (intruz.timeLoop >= 2000 + intruz.break && intruz.timeLoop <= 4000 + intruz.break) {
                                if (!intruz.check) {
                                    intruz.body.velocity.x = 0;
                                    intruz.animations.play('idle-right');
                                    intruz.randomMove = 'intruzRight';
                                    //console.log("x");
                                    intruz.check = true;
                                }
                                if (intruz.killing) {
                                    //console.log("xKill");
                                    intruz.animations.play('kill');
                                }
                            } else {
                                if(intruz.deactiveVelocity) {
                                    if(intruz.deactiveVelocity === 'left') {
                                        intruz.body.velocity.x = -1000;
                                    } else {
                                        intruz.body.velocity.x = 1000;
                                    }
                                    toolsGame.mainElements.intruders.jump(intruz,200);
                                } else {
                                    intruz.body.velocity.x = intruz.randomSpeed;
                                }
                                intruz.animations.play('right');
                                intruz.check = false;
                            }
                        }
                    }

                    if(intruz.type === 6) {
                        //console.log("player position:");
                        //console.log(toolsGame.mainElements.player.obj.position.x);
                        //console.log("intruder position");
                        //console.log(intruz.position.x);
                        if(!intruz.area) {

                            //intruz.position.x > toolsGame.mainElements.player.obj.position.x-128 &&
                            //intruz.position.x < toolsGame.mainElements.player.obj.position.x+64

                            if(intruz.position.x < toolsGame.mainElements.player.obj.position.x) {
                                intruz.randomMove = 'intruzLeft';
                            } else {
                                intruz.randomMove = 'intruzRight';
                            }
                            intruz.area = true;
                            game.time.events.add(randomArray([600,900,1200]),function(){
                                //console.log("goni cie intruz");
                                //console.log(randomArray([600,900,1200]));
                                intruz.area = false;
                            },this);

                            // if(intruz.body.blocked.left || intruz.body.blocked.right) {
                            //     toolsGame.mainElements.intruders.jump(intruz,450);
                            //     if (timeLoop === 2) {
                            //         if (intruz.body.blocked.left) intruz.randomMove = 'intruzLeft';
                            //         else if (intruz.body.blocked.right) intruz.randomMove = 'intruzRight';
                            //     }
                            // }
                        }

                        if(intruz.body.blocked.left || intruz.body.blocked.right) {
                            toolsGame.mainElements.intruders.jump(intruz,450);
                            if (timeLoop === 2) {
                                if (intruz.body.blocked.left) intruz.randomMove = 'intrudersdleLeft';
                                else if (intruz.body.blocked.right) intruz.randomMove = 'intrudersdleRight';
                                // game.time.events.add(4000,function(){
                                //     if(intruz.randomMove === 'intrudersdleLeft') intruz.randomMove = 'intruzLeft';
                                //     else if (intruz.randomMove === 'intrudersdleRight') intruz.randomMove = 'intruzRight';
                                // },this);
                            }
                        }

                    }

                    if(intruz.type === 5 || intruz.type === 7) {
                        if(intruz.body.blocked.down) {
                            //console.log("touch bottom lay");
                            //console.log(intruz.body.blocked);

                            toolsGame.mainElements.intruders.jump(intruz,350);
                            if(intruz.type === 5) toolsGame.audio.condor();
                            if(intruz.type === 7) toolsGame.audio.owl();
                        }
                    }

                    if (!(intruz.timeLoop >= 1 && intruz.timeLoop <= 4000 + intruz.break)) {
                        intruz.timeLoop = 1;
                    }


                } else if(intruz.randomMove==='intrudersdleRight') {
                    intruz.animations.play('idle-right');
                } else if(intruz.randomMove==='intrudersdleLeft') {
                    intruz.animations.play('idle-left');
                }
                else if(intruz.randomMove==='intruzDelete'){
                    intruz.randomMove=parseInt(Math.random() * 2) ?  'intruzRight' : 'intruzLeft';
                    let wsp=[], wspX=intruz.wspStartX, wspY=intruz.wspStartY;
                    //console.log(intruz.wspStartY);
                    //console.log(intruz.wspStartX);
                    if(wspInkub.length>0)
                    {
                        //console.log("wsp inkub istnieje");
                        const randomWspInk=randomBetween(0,wspInkub.length-1);
                        //console.log("nr: " + randomWspInk);
                        //console.log(randomWspInk);
                        wsp=wspInkub[randomWspInk].split(",");
                        wspX=parseInt(wsp[0]/tileSize);
                        wspY=parseInt(wsp[1]/tileSize);
                        //console.log(wsp[0]/tileSize + "x" + wsp[1]/tileSize);
                    }

                    //console.log(wspInkub);
                    //console.log(wspX + "," + wspY);

                    // intruz.body.x=wspX;
                    // intruz.body.y=wspY;
                    intruz.kill();

                    // setTimeout(function(){
                    //     toolsGame.mainElements.intruders.add(wspX,wspY,intruz.type);
                    // }, randomBetween(3,6)*1000);

                    // if we want reactivate intruder:
                    game.time.events.add(randomBetween(8,16)*1000, function(){
                        toolsGame.mainElements.intruders.add(wspX,wspY,intruz.type);
                    }, this);



                    //intruz.alpha=1;
                }
                else if(intruz.randomMove=='intruzStop'){
                    if(intruz.type === 4 || intruz.type === 5 || intruz.type === 7) {
                        //intruz.frame = 37;
                    } else {
                        intruz.frame = 37;
                    }
                }
            }


            //console.log(intruz.randomMove);
        },null, this);


        toolsGame.mainElements.player.obj.body.velocity.x = 0;
        //console.log(toolsGame.mainElements.player.obj.touchGround + " and " + levelFile.blockedKeys);
        if(!levelFile.blockedKeys) // zmiana levelu - blokowanie klawiszy
        {

            // if(toolsGame.mainElements.player.obj.gForceWaterOnlyeOne && (cursors.up.isDown || cursors.left.isDown || cursors.right.isDown)) {
            //     toolsGame.mainElements.player.obj.gForceWaterOnlyeOne = false;
            // }

            if (cursors.up.isDown) {
                // if(toolsGame.mainElements.player.obj.onGround) {
                //     toolsGame.mainElements.player.obj.onGround=false;
                // }
                if (facing === 'right') {
                    if(!toolsGame.mainElements.player.obj.touchGround) {
                        toolsGame.mainElements.player.obj.animations.play('jump-right');
                    }
                }
                else if (facing === 'left') {
                    if(!toolsGame.mainElements.player.obj.touchGround) {
                        toolsGame.mainElements.player.obj.animations.play('jump-left');
                    }
                }


                // toolsGame.mainElements.player.obj.touchGroundTime = setTimeout(function(){
                // 	if(!levelFile.blockedKeys) {
                //         if (facing === 'left') {
                //             toolsGame.mainElements.player.obj.animations.play('left');
                //         } else if (facing === 'right') {
                //             toolsGame.mainElements.player.obj.animations.play('right');
                //         }
                //         toolsGame.mainElements.player.obj.touchGround=true;
                // }
                // },300);

                toolsGame.mainElements.player.obj.touchGroundTime = game.time.events.add(300, function(){
                    if(!levelFile.blockedKeys) {
                        if (facing === 'left') {
                            toolsGame.mainElements.player.obj.animations.play('left');
                        } else if (facing === 'right') {
                            toolsGame.mainElements.player.obj.animations.play('right');
                        }
                        toolsGame.mainElements.player.obj.touchGround=true;
                    }
                }, this);
            }



            if (cursors.left.isDown)
            {

                toolsGame.mainElements.player.obj.body.velocity.x = -playerSpeedLeftRight;
                //console.log(game.camera.x);
                //if() bg.cameraOffset.x+=1;

                if (facing !== 'left')
                {
                    toolsGame.mainElements.player.obj.animations.play('left');
                    facing = 'left';
                }

            }
            else if (cursors.right.isDown)
            {
                toolsGame.mainElements.player.obj.body.velocity.x = playerSpeedLeftRight;
                //console.log(game.camera.x);
                //bg.cameraOffset.x-=1;

                if (facing !== 'right')
                {
                    toolsGame.mainElements.player.obj.animations.play('right');
                    facing = 'right';
                }
            }
            else {
                if (facing !== 'idle') {
                    toolsGame.mainElements.player.obj.animations.stop();

                    if (facing === 'left')
                    {
                        //toolsGame.mainElements.player.obj.frame = 0;
                        toolsGame.mainElements.player.obj.animations.play('idle-left');
                    }
                    else
                    {
                        //toolsGame.mainElements.player.obj.frame = 4;
                        toolsGame.mainElements.player.obj.animations.play('idle-right');
                    }

                    facing = 'idle';
                }
            }

        }

        // camera and backing to other part screen
        //console.log(game.camera.x);
        // game.camera.follow();
        // game.camera.x+=10;

        /* aniamacja kladki itp */

        game.physics.arcade.collide(toolsGame.mainElements.kladki.poziom.obj, layer);
        game.physics.arcade.overlap(toolsGame.mainElements.kladki.poziom.obj, layer, function(kladka,lay){

            kladka.body.velocity.x = 0;

            //if(toolsGame.mainElements.player.detectionHoldOnObject(kladka,.8)) {

                // zkaomentuj jesli chcesz aby kaldki byly na starcie nieruchome
                if(!kladka.onlyOne) {
                    kladka.run = true;
                    kladka.onlyOne= true;
                }

                //console.log(kladka.run);

                if(kladka.run) {
                    //toolsGame.checkSpecialBlankBlockElementAndElevatorSound(lay,kladka);

                    if(kladka.body.blocked.right) {
                        kladka.direction="left";
                    }
                    else if(kladka.body.blocked.left) {
                        kladka.direction="right";
                    }

                    if(kladka.direction=="right")
                    {
                        kladka.body.velocity.x = 100;
                    }
                    else
                    {
                        kladka.body.velocity.x = -100;
                    }
                }

                if(kladka.body.blocked.left || kladka.body.blocked.right) {
                    kladka.run = false;
                    game.time.events.add(1000,function(){
                        kladka.run = true;
                    },this);
                }
            //}


            kladka.isUp=false;


        },null, this);

        toolsGame.mainElements.player.obj.body.allowGravity = true;
        game.physics.arcade.collide(toolsGame.mainElements.kladki.poziom.obj, toolsGame.mainElements.player.obj, function(p,kladka){
            //console.log(kladka);
            if(kladka.body.overlapY>0)
            {
                if(!kladka.run) {
                    kladka.run = true;
                }

                toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj,'kladki-poziom');

                toolsGame.mainElements.player.obj.body.allowGravity = true;
                toolsGame.mainElements.player.obj.body.bounce.y = 0;
                kladka.isUp=true;
                toolsGame.mainElements.player.obj.body.velocity.x += kladka.body.velocity.x;

                toolsGame.mainElements.player.obj.body.allowGravity = false;
                //console.log(toolsGame.mainElements.player.obj.body.allowGravity);

                game.time.events.remove(toolsGame.mainElements.kladki.kladkaPlayerBounceReset);
                toolsGame.mainElements.kladki.kladkaPlayerBounceReset=game.time.events.add(200, function(){
                    toolsGame.mainElements.player.obj.body.bounce.y = 0.3;
                }, this);

                // clearTimeout(toolsGame.mainElements.kladki.kladkaPlayerBounceReset);
                // toolsGame.mainElements.kladki.kladkaPlayerBounceReset=setTimeout(function(){
                // 	toolsGame.mainElements.player.obj.body.bounce.y = 0.3;
                // },200);
                //console.log(toolsGame.mainElements.player.obj.body.bounce.y + " / " + toolsGame.mainElements.player.obj.body.overlapY);
            }

        }, null, this);

        game.physics.arcade.collide(toolsGame.mainElements.kladki.poziom.obj, toolsGame.mainElements.intruders.obj, function(kladka,intruz){
            //intruz.body.velocity.x += kladka.body.velocity.x;
        }, null, this);


        //console.log(toolsGame.mainElements.player.obj.body.bounce.y + " / " + toolsGame.mainElements.player.obj.body.overlapY);
        //console.log(toolsGame.mainElements.player.obj.body.blocked.down);
        /* end aniamacja kladki itp */


        //\\ start
        //game.physics.arcade.collide(toolsGame.mainElements.kladki.pionTopBack.obj, toolsGame.mainElements.blankTileS.obj);

        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionTopBack.obj, toolsGame.mainElements.kladki.poziom.obj);
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionTopBack.obj, toolsGame.mainElements.intruders.obj,function(k,intruz){
            //console.log("intruz vs kladka");
            toolsGame.intruzCollisonNoBack(intruz);
        });
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionTopBack.obj, toolsGame.mainElements.player.obj, function(k,p){
            if(p.body.overlapY>0) {
                //console.log("kladka pion top (auto back)");
                toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
                toolsGame.mainElements.kladki.run.startCollision(p,"pionTopBack");
            }
        }, null, this);
        game.physics.arcade.overlap(toolsGame.mainElements.kladki.pionTopBack.obj, layer, function(k,lay){
            toolsGame.checkSpecialBlankBlockElementAndElevatorSound(lay,k);
        }, null, this);
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionTopBack.obj, layer, function(k,lay){
            toolsGame.mainElements.kladki.run.endCollision(k,"pionTopBack");
        }, null, this);





        ////pionBottomBack
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionBottomBack.obj, toolsGame.mainElements.kladki.poziom.obj);
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionBottomBack.obj, toolsGame.mainElements.intruders.obj,function(k,intruz){
            //console.log("intruz vs kladka");
            toolsGame.intruzCollisonNoBack(intruz);
        });
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionBottomBack.obj, toolsGame.mainElements.player.obj, function(k,p){
            if(p.body.overlapY>0) {
                //console.log("kladka pion bottom (auto back)");
                //console.log("test y");
                toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
                toolsGame.mainElements.kladki.run.startCollision(p,"pionBottomBack");
            }
        }, null, this);

        game.physics.arcade.overlap(toolsGame.mainElements.kladki.pionBottomBack.obj, layer, function(k,lay){
            toolsGame.checkSpecialBlankBlockElementAndElevatorSound(lay,k);
        }, null, this);

        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionBottomBack.obj, layer, function(k,lay){
            toolsGame.mainElements.kladki.run.endCollision(k,"pionBottomBack");
            //console.log(lay);
        }, null, this);
        ////



        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionTop.obj, toolsGame.mainElements.kladki.poziom.obj);
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionTop.obj, toolsGame.mainElements.intruders.obj,function(k,intruz){
            //console.log("intruz vs kladka");
            toolsGame.intruzCollisonNoBack(intruz);
        });
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionTop.obj, toolsGame.mainElements.player.obj, function(k,p){
            if(p.body.overlapY>0) {
                //console.log("kladka pion top");
                toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
                toolsGame.mainElements.kladki.run.startCollision(p,"pionTop");
            }
        }, null, this);
        game.physics.arcade.overlap(toolsGame.mainElements.kladki.pionTop.obj, layer, function(k,lay){
            toolsGame.checkSpecialBlankBlockElementAndElevatorSound(lay,k);
        }, null, this);
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionTop.obj, layer, function(k,lay){
            toolsGame.mainElements.kladki.run.endCollision(k,"pionTop");
        }, null, this);

        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionBottom.obj, toolsGame.mainElements.kladki.poziom.obj);
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionBottom.obj, toolsGame.mainElements.intruders.obj,function(k,intruz){
            //console.log("intruz vs kladka");
            toolsGame.intruzCollisonNoBack(intruz);
        });
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionBottom.obj, toolsGame.mainElements.player.obj, function(k,p){
            if(p.body.overlapY>0) {
                //console.log("kladka pion bottom");
                toolsGame.mainElements.player.checkIfWasKilledAndOther(toolsGame.mainElements.player.obj);
                toolsGame.mainElements.kladki.run.startCollision(p,"pionBottom");
            }
        }, null, this);
        game.physics.arcade.overlap(toolsGame.mainElements.kladki.pionBottom.obj, layer, function(k,lay){
            toolsGame.checkSpecialBlankBlockElementAndElevatorSound(lay,k);
        }, null, this);
        game.physics.arcade.collide(toolsGame.mainElements.kladki.pionBottom.obj, layer, function(k,lay){
            toolsGame.mainElements.kladki.run.endCollision(k,"pionBottom");
        }, null, this);
        //\\ end


        /* teleporter postaci
        console.log(toolsGame.mainElements.player.obj.body.x + " : " + toolsGame.mainElements.player.obj.body.y);
        if(toolsGame.mainElements.player.obj.body.x>1200) {
            //game.camera.follow(false);
            //game.camera.follow(toolsGame.mainElements.intruders.obj.children[0]);
            toolsGame.mainElements.player.obj.body.x=100;
            toolsGame.mainElements.player.obj.body.y=100;
            //game.camera.follow(toolsGame.mainElements.player.obj);
            //game.camera.follow(toolsGame.mainElements.player.obj, Phaser.Camera.FOLLOW_LOCKON, 0.05, 0.05);

        }
        /* end teleporter postaci */


        // shot bullet whit gun
        toolsGame.mainElements.player.gun.shot(toolsGame.mainElements.player);

        // visual gun
        toolsGame.mainElements.player.gun.visualGun(toolsGame.mainElements.player);

        // visual fog
        if(typeof proportiesMap[levelFile.activeIdLevel] === 'object') {
            if(proportiesMap[levelFile.activeIdLevel].fog && proportiesMap[levelFile.activeIdLevel].fogSpeed)
            {
                if(oFog.x>=-2500) oFog.x=-3000;
                else oFog.x += proportiesMap[levelFile.activeIdLevel].fogSpeed;
                //console.log(oFog.x);
            }
        }

        //console.log(bg.position.x);

        // parallaxa backgroundu
        if(levelFile.backgroundParallax)
        {

            if(proportiesMap[levelFile.activeIdLevel].background) {
                let backgroundMoveX = 0;
                if(proportiesMap[levelFile.activeIdLevel].backgroundMoveX) {
                    backgroundMoveX = -proportiesMap[levelFile.activeIdLevel].backgroundMoveX;
                }
                bg.cameraOffset.x = backgroundMoveX-200-game.camera.x / 15;
            }
            if(proportiesMap[levelFile.activeIdLevel].backgroundSecond) {
                bg2.cameraOffset.x=-game.camera.x/8;
            }
        }

        // if (toolsGame.mainElements.player.numberLifes < 1) {
        //     toolsGame.mainElements.player.obj.animations.play('kill-right');
        // }


        if(toolsGame.mainElements.player.generateAgain && !toolsGame.mainElements.player.gameOver) {
            toolsGame.mainElements.player.obj.body.x=saveX;
            toolsGame.mainElements.player.obj.body.y=saveY;
            toolsGame.mainElements.player.obj.alpha = 1;

            toolsGame.mainElements.player.obj.play("idle-right");
            toolsGame.mainElements.player.generateAgain = false;
        }

        //toolsGame.mainElements.intruders.obj.children
        //(toolsGame.mainElements.intruders.obj.children[0].indexOf("intruzStop") !== -1)
        //console.log(toolsGame.mainElements.player.obj.body.onFloor());
        if (
            jumpButton.isDown &&
            (toolsGame.mainElements.player.obj.body.onFloor() ||
                inArrayObject('kladki', toolsGame.mainElements.logs.obj.children,true) ||
                inArrayObject('kladki',toolsGame.mainElements.kladki.poziom.obj.children,true) ||
                inArrayObject('kladki',toolsGame.mainElements.kladki.pionTopBack.obj.children,true) ||
                inArrayObject('kladki',toolsGame.mainElements.kladki.pionBottomBack.obj.children,true) ||
                inArrayObject('kladki',toolsGame.mainElements.kladki.pionTop.obj.children,true) ||
                inArrayObject('kladki',toolsGame.mainElements.kladki.pionBottom.obj.children,true) ||
                toolsGame.mainElements.player.obj.youCanJump
            ) && game.time.now > toolsGame.mainElements.player.jumpTimer
        )
        {
            if(!levelFile.blockedKeys)
            {
                //console.log(toolsGame.mainElements.player.obj.body.onFloor());
                if(toolsGame.mainElements.player.obj.gForceWater) {
                    toolsGame.mainElements.player.obj.body.velocity.y = -toolsGame.mainElements.player.velocityWater;
                    toolsGame.mainElements.player.jumpTimer = game.time.now + toolsGame.mainElements.player.velocityWater;
                } else if(toolsGame.mainElements.stoneBigS.keepStone) {
                    toolsGame.mainElements.player.obj.body.velocity.y = -toolsGame.mainElements.player.velocityStone;
                    toolsGame.mainElements.player.jumpTimer = game.time.now + toolsGame.mainElements.player.velocityStone;
                } else {
                    toolsGame.mainElements.player.obj.body.velocity.y = -toolsGame.mainElements.player.velocityNormal;
                    toolsGame.mainElements.player.jumpTimer = game.time.now + toolsGame.mainElements.player.velocityNormal;
                }

                if(!toolsGame.mainElements.player.obj.body.bounce.y) {
                    toolsGame.mainElements.player.obj.body.bounce.y = 0.3;
                }
            }
        }

        if(!toolsGame.mainElements.player.obj.t1) {
            toolsGame.mainElements.player.obj.onGround=false;
        }

        game.physics.arcade.overlap(toolsGame.mainElements.player.obj, toolsGame.mainElements.cactusAnimateS.obj, function(p, c){
            //console.log(p);
            if(!p.holdLostLife && !levelFile.blockedKeys) {
                toolsGame.mainElements.player.lostLife(p);
                toolsGame.jumpCollision(p,250);
            }

        }, null, this);

        if(!theEndCredits) {
            // game.time.advancedTiming = true;﻿
            // toolsGame.text.show(false,
            //     (toolsGame.windows.boxMenu.obj)?3*tileSize:tileSize,
            //     (toolsGame.windows.boxMenu.obj)?7*tileSize:5*tileSize,
            //     1,
            //     (
            //         "timeLoop: " + timeLoop + "\n" +
            //         "level " + levelFile.activeIdLevel + "\n" +
            //         'Timer: ' + timerTotal + "\n" +
            //         '\u2764 Main Lifes x ' + toolsGame.mainElements.player.numberMainLifes + "\n" +
            //         '\u2661 Life x ' +  toolsGame.mainElements.player.numberLifes + "\n" +
            //         'Current gold record: ' + ((toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory>toolsGame.mainElements.player.numberCoinsLevelProcent)?toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory + '%':'-') + "\n" +
            //         'Golds: ' +  toolsGame.mainElements.player.numberCoins + ' (' + toolsGame.mainElements.player.numberCoinsLevelProcent + '%)' + "\n" +
            //         '\u204D bullets: ' + toolsGame.mainElements.player.countBullets + "\n" +
            //         '\u26BF keys: ' + keys + "\n" +
            //         "FPS: " + game.time.fps
            //     ),
            //     '700 12px Arial' ,'#ded4b8',true,'infogame',true
            // );

            toolsGame.windows.boxTopMenu.letAlways.show();
            if(!toolsGame.windows.boxTopMenu.f) {
                toolsGame.windows.boxTopMenu.let.show();
                toolsGame.windows.boxTopMenu.f=true;
            }

        }

        //+ timer.duration.toFixed(0)

    }


};

const correctCookiesProcent = () => {
    console.log("########### Correct procent #############");

    if(toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory>toolsGame.mainElements.player.numberCoinsLevelProcent) {
        toolsGame.mainElements.player.numberCoinsLevelProcent = toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory;
        setCookies('coins-procent-' + levelFile.activeIdLevel, toolsGame.mainElements.player.numberCoinsLevelProcentLastMemory);
    }
};

const cookiesLastLevelMemory = () => {
    if(getCookies('coins-procent-last-memory')>0 && getCookies('id-level-last-memory')>0) {
        console.log("################# cookies last level and last ID #################");
        console.log(getCookies('id-level-last-memory') + " = prcent:" + getCookies('coins-procent-last-memory'));
        setCookies('coins-procent-'+getCookies('id-level-last-memory'),getCookies('coins-procent-last-memory'));
        setCookies('id-level-last-memory',getCookies('id-level-last-memory'));
    }
};
cookiesLastLevelMemory();

const endGame = () => {
    if(playGame.main) {
        console.log("########### end game #############");
        game.world.removeAll();
        timer.destroy();
        toolsGame.audio.bg.stop();
        playGame.main=false;
        // deactive Game Over flag;
        toolsGame.mainElements.player.gameOver = false;
        create();
    }
    else
    {
        //navigator.app.exitApp();
    }
};

const render = () => {
    //game.debug.text(game.time.physicsElapsed, 32, 32);
    //game.debug.bodyInfo(toolsGame.mainElements.player.obj, 16, 24);
    //if(toolsGame.mainElements.intruders.obj.children[0]) game.debug.body(toolsGame.mainElements.intruders.obj.children[0]);
    //if(toolsGame.mainElements.intruders.obj.children[0]) game.debug.bodyInfo(toolsGame.mainElements.intruders.obj.children[0], 16, 24);
    //console.log("x-game.load.onLoadStart");
};

// new Game(width, height, renderer, parent, state, transparent, antialias, physicsConfig)
const config = {
    width: 800,
    height: 450,
    renderer: Phaser.AUTO,
    //renderer: Phaser.WEBGL,
    //renderer: Phaser.CANVAS,
    //renderer: Phaser.WEBGL_FILTER,
    parent: 'game-content',
    //antialias: true,
    //multiTexture: true,
    enableDebug: false,
    state: {
        preload: preload,
        create: create,
        update: update
        //render: render
    }
};
const game = new Phaser.Game(config);
//const game = new Phaser.Game(800, 450, Phaser.CANVAS, 'game-content', { preload: preload, create: create, update: update, render: render });

//alert(navigator.userAgent);

// window.addEventListener('blur', function(){
//     //toolsGame.windows.boxMenu.show();
//     if(playGame.main) {
//         alert("x");
//     }
// });
// window.addEventListener('focus', function(){
//     //toolsGame.windows.boxMenu.show();
//     if(playGame.main) {
//
//     }
// });

