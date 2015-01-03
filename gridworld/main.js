/**
 * @file Main entry point for GridWorld app
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
(function (module, exports, Blockly) {
    var blocks = require('./game-blocks.js');
    var game = require('./game.js');
    var interpreter = require('./interpreter.js');
    var ui = require('./ui.js');
    
    //console.log('GI', Phaser, Interpreter);
    
    window.onload = function () {
        
        // Test ////
        document.getElementById('shower').onclick = function () {
            ui.toggleDialog(true, 'Hiya!');
        };
        
        ui.setGoButtonHandler(function () {
            Blockly.mainWorkspace.traceOn(true);
            Blockly.mainWorkspace.highlightBlock(null);
            var blocks = Blockly.mainWorkspace.getTopBlocks();
            if (blocks.length === 0) {
                // No code - Appropriate error
                console.log('no code');
            } else if (blocks.length > 1) {
                // Stray blocks - appropriate error
                console.log('strays');
            }
            Blockly.JavaScript.init(Blockly.mainWorkspace);
            var code = Blockly.JavaScript.blockToCode(blocks[0]);
            // interpreter.setFeatureHandler(function (ob) {
            //     console.log('-Feature', ob);
            // });
            interpreter.start(code);
        });
        

        game.init(ui.phaser, 'zombie');
        interpreter.init(game);
        game.start();
        Blockly.inject(ui.blockly, {toolbox: '<xml></xml>'});
        Blockly.addChangeListener(function () {
            ui.setBlocksLeft(Blockly.mainWorkspace.remainingCapacity());
        });
        
        game.collision.add(function () {
            game.stopMove();
            console.log('Bump!');
        });
        game.features.add(function (f) {
            console.log('Yay!', f);
        });
        game.ready.add (function (type) {
            setupLevel(0);
        });
        
        var defaultWorkspaceDom = Blockly.Xml.textToDom(
            '<xml><block type="gridworld_start" deletable="false" ' +
            'moveble="false" x="200" y="10"></block></xml>');
        
        /**
         * @param {number} n - 0-based level number
         */
        var setupLevel = function (n) {
            var level = game.setLevel(n);
            var xml = '';
            for (var i=0, l=level.blocks.length; i<l; i++) {
                xml += '<block type="' + level.blocks[i] + '"></block>';
            }
            Blockly.updateToolbox('<xml>' + xml + '</xml>');
            Blockly.mainWorkspace.clear();
            Blockly.mainWorkspace.maxBlocks = ('max_blocks' in level ?
                level.max_blocks + 1 : Infinity);
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace,
                defaultWorkspaceDom);
            ui.setGoal(level.goal);
        };
    
    };
    
})(module, exports, Blockly);