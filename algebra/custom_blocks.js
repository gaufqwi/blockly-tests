Blockly.Blocks['btest_move_north'] = {
    init: function () {
        this.setColour(320);
        this.appendValueInput('STEPS')
            //.setInputsLine(true)
            .setCheck('Number')
            .appendField('move north');
        this.appendDummyInput()
            .appendField('steps');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
    }
};