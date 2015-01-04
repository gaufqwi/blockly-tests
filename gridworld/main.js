/**
 * @file Main entry point for GridWorld app
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
(function (module, exports, Blockly) {
    var blocks = require('./game-blocks.js');
    var game = require('./game.js');
    var interpreter = require('./interpreter.js');
    var ui = require('./ui.js');
    var rules = require('./rules.js');
    
    var levelNo = 0;
    var level;
    
    var defaultWorkspaceDom = Blockly.Xml.textToDom(
    '<xml><block type="gridworld_start" deletable="false" ' +
    'moveble="false" x="200" y="10"></block></xml>');

    
    //console.log('GI', Phaser, Interpreter);
    
    var runCode = function () {
        Blockly.mainWorkspace.traceOn(true);
        Blockly.mainWorkspace.highlightBlock(null);
        var blocks = Blockly.mainWorkspace.getTopBlocks();
        if (blocks.length > 1) {
            ui.toggleDialog(true, 'Oops! Make sure all of your blocks are connected to the start block.',
                'warning');
            return;
        } else if (blocks[0].nextConnection.targetConnection === null) {
            ui.toggleDialog(true, 'Oops! Drag blocks to the workspace and attach them to the start block to write code',
                'warning');
            return;
        }
        Blockly.JavaScript.init(Blockly.mainWorkspace);
        var code = Blockly.JavaScript.blockToCode(blocks[0]);
        rules.enact(level.rules);
        ui.toggleOverlay(true, false);
        ui.toggleButton('gobutton', false);
        ui.toggleButton('resetbutton', true);
        interpreter.start(code, finishedCB);
    };
    
    var finishedCB = function (completed) {
        if (completed) {
            ui.toggleOverlay(false);
        }
        if (rules.getFlags().win) {
            ui.toggleButton('nextbutton', true);
        } else {
            console.log('Too bad');
        }
    };
    
    var setupLevel = function () {
        level = game.setLevel(levelNo);
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
        ui.toggleButton('gobutton', true);
        ui.toggleButton('nextbutton', false);
        ui.toggleButton('resetbutton', false);
    };

    var resetLevel = function () {
        console.log('reset');
        level = game.setLevel(levelNo);
        ui.toggleButton('gobutton', true);
        ui.toggleButton('nextbutton', false);
        ui.toggleButton('resetbutton', false);
    };

    window.onload = function () {
        
        ui.setButtonHandler('gobutton', runCode);
        ui.setButtonHandler('resetbutton', setupLevel);
        ui.setButtonHandler('nextbutton', function () {
            levelNo += 1;
            setupLevel();
        });

        game.init(ui.phaser, 'zombie');
        interpreter.init(game);
        rules.init(game, interpreter, ui);
        game.start();
        Blockly.inject(ui.blockly, {toolbox: '<xml></xml>'});
        Blockly.addChangeListener(function () {
            ui.setBlocksLeft(Blockly.mainWorkspace.remainingCapacity());
        });
        
        game.gameReady.add(function (type) {
            setupLevel();
        });
        
    };
    
})(module, exports, Blockly);