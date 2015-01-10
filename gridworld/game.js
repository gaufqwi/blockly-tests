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
    // var nextStepFunc;
    var game;
    var player;
    var map;
    var ground;
    var features;
    var facing;
    var actionCanceled;

    var bootState = Object.create(Phaser.State.prototype);
    
    /** Preload essential assets: config file and progress bar graphics */
    bootState.preload = function () {
        game.load.spritesheet('progbar',
            baseUrl + 'progbar-ss.png', 400, 50);
        game.load.json('config', baseUrl + 'config-' + theme + '.json');
    };
    
    /** Cache config file and kick into "real" preload state */
    bootState.create = function () {
        config = game.cache.getJSON('config');
        game.state.start('preload');
    };

    var preloadState = Object.create(Phaser.State.prototype);
    
    /** Grab assets specified by config file */
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

    /** Start play state */
    preloadState.create = function () {
        game.state.start('play');
    };

    var playState = Object.create(Phaser.State.prototype);
    
    /** Setup game board and report ready for action */
    playState.create = function () {
        player = game.add.sprite(0, 0, 'player');
        
        var animations = ['walk_s', 'stand_s', 'walk_e', 'stand_e', 'walk_n',
            'stand_n', 'walk_w', 'stand_w'];
        for (var i=0, l=animations.length; i<l; i++) {
            var a = animations[i];
            player.animations.add(a, config.player.animations[a].frames,
            config.player.animations[a].fps, true);
        }

        exports.gameReady.dispatch();
    };

    /** Get properties of "features" tile where player is standing, if any
     * @returns {object}
     */
    exports.getFeatureProperties = function () {
        var tile = map.getTileWorldXY(player.x, player.y, tileSize, tileSize,
            'Features');
        return tile ? tile.properties : {};
    };
    
    /** Set player facing and play appropriate animation
     * @param {string} dir - compass direction
     */
    exports.setFacing = function (dir) {
        facing = dir;
        player.animations.play('stand_' + facing);
    };
    
    var directions = ['n', 'e', 's', 'w'];
    var dirmap = {n : 0, e : 1, s: 2, w: 3};
    
    /** Change player facing in 90 increments.
     * @param {number} n - pos = CW, neg = CCW
     */
    exports.turn = function (n) {
        var x = (dirmap[facing] + n) % 4;
        exports.actionStart('turn');
        if (x < 0) {
            x = (x + 4) % 4;
        }
        facing = directions[x];
        player.animations.play('stand_' + facing);
        exports.actionFinish.dispatch('turn');
    };
    
    /** Animate walking in the direction player is currently facing */
    exports.walkForward = function () {
        exports.walk(facing);  
    };

    /** Animate player walking in specified direction
     * @param {string} dir - Compass direction
     */
    exports.walk = function (dir) {
        actionCanceled = false;
        exports.actionStart.dispatch('walk');
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
            if (!actionCanceled) {
                // Walk in place
                player.animations.play('walk_' + dir);
                var timer = game.time.create(true);
                timer.add(config.player.speed, function () {
                    //exports.busy = false;
                    player.animations.play('stand_' + dir);
                    //nextStepFunc();
                    exports.actionFinish.dispatch('walk');
                });
                timer.start();
            } else {
                // Just resume interpreter immediately
                exports.actionFinish.dispatch('walk');
            }
            return;
        }
        // Nothing in the way; go ahead
        var tween = game.add.tween(player);
        tween.to(tweenProps, config.player.speed);
        //exports.busy = true;
        player.animations.play('walk_' + dir);
        tween.onComplete.add(function () {
            //exports.busy = false;
            player.animations.play('stand_' + dir);
            //nextStepFunc();
            var features = exports.getFeatureProperties();
            if (Object.keys(features).length > 0) {
                exports.featureSeen.dispatch(features);
            }
            exports.actionFinish.dispatch('walk');
        }, this);
        tween.start();
    };
    
    /** Cancel current action. Gives game logic a chance to overrule
     * command or animation
     */
    exports.cancelAction = function () {
        actionCanceled = true;
    };
    
    /** Initialize Phaser and module as a whole
     * @param {object} container - DOM object holding Phaser canvas
     * @param {string} thm - Theme. Prefix of config file to load.
     */
    exports.init = function (container, thm) {
        theme = thm;
        game = new Phaser.Game(boardX*tileSize, boardY*tileSize,
            Phaser.AUTO, container);
        game.state.add('boot', bootState);
        game.state.add('preload', preloadState);
        game.state.add('play', playState);

        // Signals
        exports.gameReady = new Phaser.Signal();
        exports.collision = new Phaser.Signal();
        exports.actionFinish = new Phaser.Signal();
        exports.actionStart = new Phaser.Signal();
        exports.featureSeen = new Phaser.Signal();
    };
    
    // exports.setNextStepFunction = function (f) {
    //     nextStepFunc = f;
    // };
    
    /** Start game. Kick off boot state */
    exports.start = function () {
        game.state.start('boot');
    };
    
    /** Pause Phaser main loop */
    exports.togglePaused = function (b) {
        game.paused = b;
    };

    /** Put player back in initial position
     * @param {number} n - 0 based level number
     */
    exports.resetLevel = function (n) {
        var level = config.levels[n];
        facing = level.facing;
        player.x = config.player.offset_x + tileSize*level.start_x;
        player.y = config.player.offset_y + tileSize*level.start_y;
        player.animations.play('stand_' + facing);
        player.bringToTop();
    };

    /** Show map for new level
     * @param {number} n - 0 based level number
     */
    exports.setLevel = function (n) {
        var level = config.levels[n];
        
        if (n === config.levels.length - 1) {
            level.last = true;
        }
        
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
        
        exports.resetLevel(n);
        
        return level;
    };
    
})(module, exports, Phaser);