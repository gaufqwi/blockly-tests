/**
 * @file Phaser main loop and interface
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports, Phaser) {
    var tileSize = 48;
    var boardX = 12;
    var boardY = 12;
    var walkTime = 1200;

    var initFunc;
    var nextStepFunc;
    var game;
    var player;
    var map;

    var bootState = Object.create(Phaser.State.prototype);
    
    bootState.preload = function () {
        console.log('boot preload');
        game.load.spritesheet('progbar',
            'assets/gridworld/progbar-ss.png', 400, 50);
    };
    
    bootState.create = function () {
        console.log('boot create');
        game.state.start('preload');
    };

    var preloadState = Object.create(Phaser.State.prototype);
    
    preloadState.preload = function () {
        console.log('preload preload', game.cache);
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
            'assets/gridworld/purple-zombie-ss.png', 40, 40);
        game.load.tilemap('map', 'assets/gridworld/level1.json', null,
            Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/gridworld/tileset.png');
        game.load.image('features', 'assets/gridworld/features.png');
    };

    preloadState.create = function () {
        console.log('preload create');
        game.state.start('play');
    };

    var playState = Object.create(Phaser.State.prototype);
    
    playState.create = function () {
        console.log('play create');
        map = game.add.tilemap('map');
        
        map.addTilesetImage('Ground', 'tiles');
        map.addTilesetImage('Features', 'features');
        
        var ground = map.createLayer('Ground');
        ground.resizeWorld();
        map.createLayer('Features');
        
        player = game.add.sprite(2, 2, 'player');
        player.animations.add('walk_s', [0,1,2], 6, true);
        player.animations.add('walk_e', [3,4,5], 6, true);
        player.animations.add('walk_n', [6,7,8], 6, true);
        player.animations.add('walk_w', [9,10,11], 6, true);
        player.animations.add('stand_s', [0], 1, true);
        player.animations.add('stand_e', [3], 1, true);
        player.animations.add('stand_n', [6], 1, true);
        player.animations.add('stand_w', [9], 1, true);
        player.animations.play('stand_s');
        
        initFunc();
    };
    
    // exports.init = function (game) {
    //     game.state.add('boot', bootState);
    //     game.state.add('preload', preloadState);
    //     game.state.add('play', playState);
    // }

    
    // var gameState = {
    //     preload: function () {
    //         game.load.spritesheet('player',
    //             'assets/gridworld/purple-zombie-ss.png', 40, 40);
    //         game.load.tilemap('map', 'assets/gridworld/level1.json', null,
    //             Phaser.Tilemap.TILED_JSON);
    //         game.load.image('tiles', 'assets/gridworld/tileset.png');
    //         game.load.image('features', 'assets/gridworld/features.png');
    //     },
        
    //     create: function () {
    //         map = game.add.tilemap('map');
            
    //         map.addTilesetImage('Ground', 'tiles');
    //         map.addTilesetImage('Features', 'features');
            
    //         var ground = map.createLayer('Ground');
    //         ground.resizeWorld();
    //         map.createLayer('Features');
            
    //         player = game.add.sprite(2, 2, 'player');
    //         player.animations.add('walk_s', [0,1,2], 6, true);
    //         player.animations.add('walk_e', [3,4,5], 6, true);
    //         player.animations.add('walk_n', [6,7,8], 6, true);
    //         player.animations.add('walk_w', [9,10,11], 6, true);
    //         player.animations.add('stand_s', [0], 1, true);
    //         player.animations.add('stand_e', [3], 1, true);
    //         player.animations.add('stand_n', [6], 1, true);
    //         player.animations.add('stand_w', [9], 1, true);
    //         player.animations.play('stand_s');
            
    //         initFunc();
            
    //     },
        
    //     update: function () {
    //         //console.log('Update Loop', exports.busy);
    //     }
    // };
    
    // exports.atGoal = function () {
    //     var tile = map.getTileWorldXY(player.x, player.y);
    //     return !!tile && (tile.properties.goal === 'true');
    // };
    
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
            timer.add(walkTime, function () {
                //exports.busy = false;
                player.animations.play('stand_' + dir);
                nextStepFunc();
            });
            timer.start();
            return false;
        }
        // Nothing in the way; go ahead
        var tween = game.add.tween(player);
        tween.to(tweenProps, walkTime);
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

    //exports.busy = false;
    
})(module, exports, Phaser);