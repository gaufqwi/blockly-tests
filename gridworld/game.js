/**
 * @file Phaser main loop and interface
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports, Phaser) {
    var tileSize = 48;
    var boardX = 12;
    var boardY = 12;
    var walkTime = 1200;

    var theme = 'zombie';
    var baseUrl = 'assets/gridworld/';
    var config;
    var initFunc;
    var nextStepFunc;
    var game;
    var player;
    var map;
    var ground;
    var features;
    var facing;

    var bootState = Object.create(Phaser.State.prototype);
    
    bootState.preload = function () {
        console.log('boot preload');
        game.load.spritesheet('progbar',
            baseUrl + 'progbar-ss.png', 400, 50);
        game.load.json('config', baseUrl + 'config-' + theme + '.json');
    };
    
    bootState.create = function () {
        console.log('boot create');
        config = game.cache.getJSON('config');
        console.log(config);
        game.state.start('preload');
    };

    var preloadState = Object.create(Phaser.State.prototype);
    
    preloadState.preload = function () {
        console.log('preload preload');
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
        console.log('preload create');
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

        setLevel(0);
        
        initFunc();
    };

    exports.getFeatureProperties = function () {
        var tile = map.getTileWorldXY(player.x, player.y, tileSize, tileSize,
            'Features');
        return tile ? tile.properties : {};
    };

    exports.walk = function (dir) {
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
            // Obstacle; walk in place
            //exports.busy = true;
            player.animations.play('walk_' + dir);
            var timer = game.time.create(true);
            timer.add(confif.player.speed, function () {
                //exports.busy = false;
                player.animations.play('stand_' + dir);
                nextStepFunc();
            });
            timer.start();
            return false;
        }
        // Nothing in the way; go ahead
        var tween = game.add.tween(player);
        tween.to(tweenProps, config.player.speed);
        //exports.busy = true;
        player.animations.play('walk_' + dir);
        tween.onComplete.add(function () {
            //exports.busy = false;
            player.animations.play('stand_' + dir);
            nextStepFunc();
        }, this);
        tween.start();
        return true;
    };
    
    exports.init = function (init_func, nextstep_func) {
        initFunc = init_func;
        nextStepFunc = nextstep_func;
        exports.busy = false;
        game = new Phaser.Game(boardX*tileSize, boardY*tileSize,
            Phaser.AUTO, 'phaser');
        console.log('End game init');
        game.state.add('boot', bootState);
        game.state.add('preload', preloadState);
        game.state.add('play', playState);
        game.state.start('boot');
        return game;
    };

    var setLevel = function (n) {
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
    };
    
})(module, exports, Phaser);