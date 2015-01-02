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
            this.setTooltip('Move north (towards the top of the screen)');
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
            this.setTooltip('Move south (towards the bottom of the screen)');
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
            this.setTooltip('Move east (towards the right side of the screen)');
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
            this.setTooltip('Move west (towards the left side of the screen)');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.Blocks['gridworld_goforward'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('go forward');
            this.setTooltip('Move forward without changing facing');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_goforward'] = function (block) {
        return 'walkForward();\n';
    };

    Blockly.Blocks['gridworld_turnright'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('turn right');
            this.setTooltip('Turn 90 degrees to the right');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_turnright'] = function (block) {
        return 'turnRight();\n';
    };

    Blockly.Blocks['gridworld_turnleft'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('turn left');
            this.setTooltip('Turn 90 degrees to the left');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_turnleft'] = function (block) {
        return 'turnLeft();\n';
    };

    Blockly.Blocks['gridworld_facenorth'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('face north');
            this.setTooltip('Face north (towards the top of the screen)');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_facenorth'] = function (block) {
        return 'faceNorth();\n';
    };

    Blockly.Blocks['gridworld_facesouth'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('face south');
            this.setTooltip('Face south (towards the bottom of the screen)');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_facesouth'] = function (block) {
        return 'faceSouth();\n';
    };

    Blockly.Blocks['gridworld_faceeast'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('face east');
            this.setTooltip('Face east (towards the right side of the screen)');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_faceeast'] = function (block) {
        return 'faceEast();\n';
    };

    Blockly.Blocks['gridworld_facewest'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField('face west');
            this.setTooltip('Face west (towards the left side of the screen)');
            this.setNextStatement(true);
            this.setPreviousStatement(true);
        }
    };
    
    Blockly.JavaScript['gridworld_facewest'] = function (block) {
        return 'faceWest();\n';
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