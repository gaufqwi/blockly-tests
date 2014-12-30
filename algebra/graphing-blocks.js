/**
 * @file Define custom blocks for Blocky-based grapher
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
 /* global Blockly */

(function (Blockly, module, exports) {
    var algebra = require('./algebra.js');
    
    Blockly.Blocks['grapher_number'] = {
        init: function () {
            this.setColour(320);
            this.appendDummyInput()
                .appendField(new Blockly.FieldTextInput('1',
                    this.validator), 'NUM');
            this.setOutput(true, 'Number');
            this.setTooltip('Integer or fractions in the form n/d');
        },
        validator: function (x) {
            try {
                var f = new algebra.Frac(x);
                return x;
            } catch (err) {
                return null;
            }
        }
    };
    
    // Blockly.JavaScript['grapher_number'] = function (block) {
    //     return ['NUM Placeholder', Blockly.JavaScript.ORDER_ATOMIC];
    // };
    
    Blockly.Blocks['grapher_pair'] = {
        init: function () {
            this.setColour(120);
            this.appendDummyInput()
                .appendField('(');
            this.appendValueInput('X')
                .setCheck('Number');
            this.appendDummyInput()
                .appendField(',');
            this.appendValueInput('Y')
                .setCheck('Number');
            this.appendDummyInput()
                .appendField(')');
            this.setPreviousStatement(true, 'Pair');
            this.setNextStatement(true, 'Pair');
            this.setInputsInline(true);
            this.setTooltip('Ordered (x,y) pair');
        }
    };

    // Blockly.JavaScript['grapher_pair'] = function (block) {
    //     return 'PAIR Placeholder ' + block.id + '\n';
    // };

    Blockly.Blocks['grapher_si_equation'] = {
        init: function () {
            this.setColour(240);
            this.appendDummyInput()
                .appendField('y =');
            this.appendValueInput('M')
                .setCheck('Number');
            this.appendDummyInput()
                .appendField('x +');
            this.appendValueInput('B')
                .setCheck('Number');
            this.setNextStatement(true, ['Table', 'Graph']);
            this.setInputsInline(true);
            this.setTooltip('Slope intercept equation');
        }
    };

    Blockly.Blocks['grapher_std_equation'] = {
        init: function () {
            this.setColour(240);
            this.appendValueInput('A')
                .setCheck('Number');
            this.appendDummyInput()
                .appendField('x +');
            this.appendValueInput('B')
                .setCheck('Number');
            this.appendDummyInput()
                .appendField('y =');
            this.appendValueInput('C')
                .setCheck('Number');
            this.setNextStatement(true, ['Table', 'Graph']);
            this.setInputsInline(true);
            this.setTooltip('Standard form equation');
        }
    };

    Blockly.Blocks['grapher_ps_equation'] = {
        init: function () {
            this.setColour(240);
            this.appendDummyInput()
                .appendField('y - ');
            this.appendValueInput('Y0')
                .setCheck('Number');
            this.appendDummyInput()
                .appendField(' = ');
            this.appendValueInput('M')
                .setCheck('Number');
            this.appendDummyInput()
                .appendField('(x - ');
            this.appendValueInput('X0')
                .setCheck('Number');
            this.appendDummyInput()
                .appendField(')');
            this.setNextStatement(true, ['Table', 'Graph']);
            this.setInputsInline(true);
            this.setTooltip('Point-slope equation');
        }
    };
    
    // Blockly.JavaScript['grapher_si_equation'] = function (block) {
    //     return 'SI Placeholder ' + block.id + '\n';
    // };
    
    Blockly.Blocks['grapher_table'] = {
        init: function () {
            this.setColour(180);
            this.appendDummyInput()
                .appendField('function table')
                .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
            this.appendStatementInput('PAIRS')
                .setCheck('Pair');
            this.setPreviousStatement(true, 'Table');
            this.setNextStatement(true, 'Graph');
            this.setTooltip('Table of points');
        }
    };

    // Blockly.JavaScript['grapher_table'] = function (block) {
    //     if (block.previousConnection.targetBlock())
    //         return 'TABLE Placeholder ' + block.id + '\n';
    //     else
    //         return null;
    // };

    Blockly.Blocks['grapher_graph'] = {
        init: function () {
            this.setColour(120);
            this.appendDummyInput()
                .appendField('draw graph')
                .appendField(new Blockly.FieldColour('#ff0000'), 'COLOR');
            this.setPreviousStatement(true, 'Graph');
            this.setTooltip('Attach to equation or table to graph');
        }
    };

    // Blockly.JavaScript['grapher_graph'] = function (block) {
    //     return 'GRAPH Placeholder ' + block.id + '\n';
    // };
            
    
})(Blockly, module, exports);