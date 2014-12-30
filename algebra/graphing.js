/**
 * @file Implement graphing in response to Blockly workspace
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports, Blockly) {
    var algebra = require('./algebra.js');
    var canvas;
    
    /**
     * Graph equations and top level tables
     */
    function handleUpdates (e) {
        var blocks = Blockly.mainWorkspace.getTopBlocks();
        canvas.clear();
        for (var i=0, l = blocks.length, block = blocks[i]; 
                i<l; i++, block = blocks[1]) {
            switch (block.type) {
                case 'grapher_table':
                    graphTable(block);
                    break;
                case 'grapher_si_equation':
                case 'grapher_std_equation':
                case 'grapher_ps_equation':
                    processEquation(block);
                    break;
                case 'grapher_pair':
                    block.setWarningText(null);
            }
        }
    }
    
    /**
     * @param {Blockly.Block} block
     */
    function processEquation (block) {
        // TODO: Handle equation types other than SI
        var aBlock, bBlock, cBlock, a, b, c, eq;
        switch (block.type) {
            case 'grapher_si_equation':
                aBlock = block.getInputTargetBlock('M');
                bBlock = block.getInputTargetBlock('B');
                try {
                    a = aBlock && new algebra.Frac(aBlock.getFieldValue('NUM'));
                    b = bBlock && new algebra.Frac(bBlock.getFieldValue('NUM'));
                } catch (err) {
                    return;
                }
                if (a && b) {
                    eq = new algebra.LinEq(a, b);
                } else {
                    return;
                }
                break;
            case 'grapher_std_equation':
                aBlock = block.getInputTargetBlock('A');
                bBlock = block.getInputTargetBlock('B');
                cBlock = block.getInputTargetBlock('C');
                try {
                    a = aBlock && new algebra.Frac(aBlock.getFieldValue('NUM'));
                    b = bBlock && new algebra.Frac(bBlock.getFieldValue('NUM'));
                    c = bBlock && new algebra.Frac(cBlock.getFieldValue('NUM'));
                } catch (err) {
                    return;
                }
                if (a && b && c) {
                    eq = new algebra.LinEq(a, b, c);
                } else {
                    return;
                }
                break;
            case 'grapher_ps_equation':
                aBlock = block.getInputTargetBlock('Y0');
                bBlock = block.getInputTargetBlock('M');
                cBlock = block.getInputTargetBlock('X0');
                try {
                    a = aBlock && new algebra.Frac(aBlock.getFieldValue('NUM'));
                    b = bBlock && new algebra.Frac(bBlock.getFieldValue('NUM'));
                    c = bBlock && new algebra.Frac(cBlock.getFieldValue('NUM'));
                } catch (err) {
                    return;
                }
                if (a && b && c) {
                    eq = new algebra.LinEq(b, [c, a]);
                } else {
                    return;
                }
                break;
        }
        var next = (block.nextConnection && block.nextConnection.targetBlock());
        while (next) {
            if (next.type === 'grapher_table') {
                graphTable(next, eq);
            } else if (next.type === 'grapher_graph') {
                var color = next.getFieldValue('COLOR');
                canvas.graphLinear(eq, {color: color});
            }
            next = (next.nextConnection && next.nextConnection.targetBlock());
        }
    }
    
    /**
     * @param {Blockly.Block} block
     * @param {LinEq?} equation
     */
    function graphTable (block, equation) {
        var color = block.getFieldValue('COLOR');
        var pairBlock = block.getInputTargetBlock('PAIRS');
        while (pairBlock) {
            var xBlock = pairBlock.getInputTargetBlock('X');
            var yBlock = pairBlock.getInputTargetBlock('Y');
            var x = xBlock && xBlock.getFieldValue('NUM');
            var y = yBlock && yBlock.getFieldValue('NUM');
            try {
                var p = new algebra.Point(x, y);
            } catch (err) {
                p = null;
            }
            if (p) {
                if (!equation) {
                    // Unbound table; just plot point square and subdued
                    canvas.plotPoint(p,
                        {shape: 'square', globalAlpha: 0.75, color: color});
                    pairBlock.setWarningText(null);
                } else if (equation.contains(p)) {
                    // Point is on graph; plot circle and fully opaque
                    canvas.plotPoint(p, {color: color});
                    pairBlock.setWarningText(null);
                } else {
                    // Point is not on graph; plot faded and x out
                    canvas.plotPoint(p, {globalAlpha: 0.5, color: color});
                    canvas.plotPoint(p,
                        {shape: 'x', color: 'black', lineWidth: 1});
                    pairBlock.setWarningText(
                        'This point is not on the graph of this equation');
                }
            }
            pairBlock = (pairBlock.nextConnection 
                && pairBlock.nextConnection.targetBlock());
        }
    }
     
    /**
     * Initiate event handling
     * @param {Cartesian} c
     */
    function start (c) {
        canvas = c;
        Blockly.addChangeListener(handleUpdates);
    }
    
    exports.start = start;
     
})(module, exports, Blockly);