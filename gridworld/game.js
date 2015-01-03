/**
 * @file Phaser main loop and interface
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports, Phaser) {
    var tileSize = 48;
    var boardX = 12;
    var boardY = 12;

    var theme;
    var baseUrl = 'assets/gridworld/';
    var config;
    var nextStepFunc;
    var game;
    var player;
    var map;
    var ground;
    var features;
    var facing;
    var stopFlag;

    var bootState = Object.create(Phaser.State.prototype);
    
    bootState.preload = function () {
        game.load.spritesheet('progbar',
            baseUrl + 'progbar-ss.png', 400, 50);
        game.load.json('config', baseUrl + 'config-' + theme + '.json');
    };
    
    bootState.create = function () {
        config = game.cache.getJSON('config');
        game.state.start('preload');
    };

    var preloadState = Object.create(Phaser.State.prototype);
    
    preloadState.preload = function () {
        // Set up loading display
        var progbar = game.add.sprite(
            game.world.centerX-200, game.world.centerY, 'progbar');
        progbar.anchor.setTo(0, 0.5);
        progbar.animations.add('spin', [0,1,2,3], 12, true);
        progbar.animations.play('spin');
        game.load.setPreloadSprite(progbar, 0);
        var loadtext = game.add.text(
            game.world.centerX, game.world.centerY - 30, 'Loading....',
            {font: '36px Arial', fill: 'white'});
        loadtext.anchor.setTo(0.5, 1);
        var progtext = game.add.text(game.world.centerX, game.world.centerY, '0%',
            {font: '36px Arial', fill: 'white'});
        progtext.anchor.setTo(0.5, 0.5);
        game.load.onFileComplete.add(function (progress) {
            progtext.setText(progress + '%');
        }, this);
        
        // Load assets
        game.load.spritesheet('player',
            baseUrl + config.url_prefix + config.player.spritesheet,
            config.player.width, config.player.height);
        game.load.image('tiles',
            baseUrl + config.url_prefix + config.tilesets.main);
        game.load.image('features',
            baseUrl + config.url_prefix + config.tilesets.features);
        for (var i=0, l = config.levels.length; i<l; i++) {
            game.load.tilemap('level' + i,
                baseUrl + config.url_prefix + config.levels[i].map,
                null, Phaser.Tilemap.TILED_JSON);
        }
    };

    preloadState.create = function () {
        game.state.start('play');
    };

    var playState = Object.create(Phaser.State.prototype);
    
    playState.create = function () {
        console.log('play create');

        player = game.add.sprite(0, 0, 'player');
        
        var animations = ['walk_s', 'stand_s', 'walk_e', 'stand_e', 'walk_n',
            'stand_n', 'walk_w', 'stand_w'];
        for (var i=0, l=animations.length; i<l; i++) {
            var a = animations[i];
            player.animations.add(a, config.player.animations[a].frames,
            config.player.animations[a].fps, true);
        }

        exports.ready.dispatch();
    };

    exports.getFeatureProperties = function () {
        var tile = map.getTileWorldXY(player.x, player.y, tileSize, tileSize,
            'Features');
        return tile ? tile.properties : {};
    };
    
    exports.setFacing = function (dir) {
        facing = dir;
        player.animations.play('stand_' + facing);
    };
    
    var directions = ['n', 'e', 's', 'w'];
    var dirmap = {n : 0, e : 1, s: 2, w: 3};
    
    exports.turn = function (n) {
        var x = (dirmap[facing] + n) % 4;
        if (x < 0) {
            x = (x + 4) % 4;
        }
        facing = directions[x];
        player.animations.play('stand_' + facing);
    };
    
    exports.walkForward = function () {
        return exports.walk(facing);  
    };

    exports.walk = function (dir) {
        stopFlag = false;
        switch (dir) {
            case 'n':
                var dX = 0;
                var dY = -1;
                var tweenProps = {y: player.y + dY*tileSize};
                break;
            case 's':
                dX = 0;
                dY = 1;
                tweenProps = {y: player.y + dY*tileSize};
                break;
            case 'e':
                dX = 1;
                dY = 0;
                tweenProps = {x: player.x + dX*tileSize};
                break;
            case 'w':
                dX = -1;
                dY = 0;
                tweenProps = {x: player.x + dX*tileSize};
                break;
        }
        var dest = map.getTileWorldXY(
            player.x + dX*tileSize, player.y + dY*tileSize,
            tileSize, tileSize, 'Ground');
        if (!dest || (dest.properties.blocker === 'true')) {
            // Obstacle; See is any listeners care
            exports.collision.dispatch();   // TODO: Could include more info
            if (!stopFlag) {
                // Walk in place
                player.animations.play('walk_' + dir);
                var timer = game.time.create(true);
                timer.add(config.player.speed, function () {
                    //exports.busy = false;
                    player.animations.play('stand_' + dir);
                    //nextStepFunc();
                    exports.resume.dispatch();
                });
                timer.start();
            } else {
                // Just resume interpreter immediately
                exports.resume.dispatch();
            }
            return false;
        }
        //TODO: (maybe) dispatch other events and check stopFlag
        // Nothing in the way; go ahead
        var tween = game.add.tween(player);
        tween.to(tweenProps, config.player.speed);
        //exports.busy = true;
        player.animations.play('walk_' + dir);
        tween.onComplete.add(function () {
            //exports.busy = false;
            player.animations.play('stand_' + dir);
            //nextStepFunc();
            exports.resume.dispatch();
        }, this);
        tween.start();
        return true;
    };
    
    exports.stopMove = function () {
        stopFlag = true;
    };
    
    exports.init = function (container, thm) {
        theme = thm;
        game = new Phaser.Game(boardX*tileSize, boardY*tileSize,
            Phaser.AUTO, container);
        game.state.add('boot', bootState);
        game.state.add('preload', preloadState);
        game.state.add('play', playState);

        // Signals
        exports.ready = new Phaser.Signal();
        exports.collision = new Phaser.Signal();
        exports.resume = new Phaser.Signal();
        exports.features = new Phaser.Signal();
        exports.events = new Phaser.Signal();
        console.log('game init');
    };
    
    exports.setNextStepFunction = function (f) {
        nextStepFunc = f;
    }
    
    exports.start = function () {
        game.state.start('boot')
    }

    exports.setLevel = function (n) {
        var level = config.levels[n];
        
        if (map) {
            map.destroy();
            ground.destroy();
            features.destroy();
        }
        
        map = game.add.tilemap('level' + n);
        map.addTilesetImage('Ground', 'tiles');
        map.addTilesetImage('Features', 'features');
        ground = map.createLayer('Ground');
        features = map.createLayer('Features');
        
        facing = level.facing;
        player.x = config.player.offset_x + tileSize*level.start_x;
        player.y = config.player.offset_y + tileSize*level.start_y;
        player.animations.play('stand_' + facing);
        player.bringToTop();
        return level;
    };
    
})(module, exports, Phaser);