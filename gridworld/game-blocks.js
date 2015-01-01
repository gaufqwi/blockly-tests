/**
 * @file Blockly blocks to interact with game world
 * @author Jay Bloodoworth <johnabloodworth3@gmail.com>
 */

(function (module, exports, Blockly) {
    
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    
    Blockly.Blocks['gridworld_gonorth'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('go north');
            this.setTooltip('Ask the zombie to move north');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_gonorth'] = function (block) {
        return 'walkNorth();\n';
    };
    
    Blockly.Blocks['gridworld_gosouth'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('go south');
            this.setTooltip('Ask the zombie to move south');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_gosouth'] = function (block) {
        return 'walkSouth();\n';
    };
    
    Blockly.Blocks['gridworld_goeast'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('go east');
            this.setTooltip('Ask the zombie to move east');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_goeast'] = function (block) {
        return 'walkEast();\n';
    };
    
    Blockly.Blocks['gridworld_gowest'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('go west');
            this.setTooltip('Ask the zombie to move west');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_gowest'] = function (block) {
        return 'walkWest();\n';
    };

    Blockly.Blocks['gridworld_start'] = {
        init: function () {
            this.setColour(240);
            this.appendDummyInput()
                .appendField('when the program starts');
            this.setTooltip('Attach blocks here');
            this.setNextStatement(true);
            this.setPreviousStatement(false);
            this.setDeletable(false);
            this.setMovable(false);
        }
    };

    Blockly.JavaScript['gridworld_start'] = function (block) {
        return '\/* Start *\/\n';
    };

    
})(module, exports, Blockly);