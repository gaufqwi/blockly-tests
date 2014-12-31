/**
 * @file Main entry point for GridWorld app
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
(function (module, exports, Blockly) {
    var blocks = require('./game-blocks.js');
    var game = require('./game.js');
    var interpreter = require('./interpreter.js');
    
    //console.log('GI', Phaser, Interpreter);
    
    window.onload = function () {
        
        var initBlockly = function () {
            interpreter.init(game);
            Blockly.inject(document.getElementById('blockly-inner'),
                {toolbox: document.getElementById('toolbox')});
            //console.log('>>',document.getElementById('startblock').childNodes);
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace,
                document.getElementById('startblock'));

            document.getElementById('gobutton').onclick = function () {
                var blocks = Blockly.mainWorkspace.getTopBlocks();
                if (blocks.length === 0) {
                    // No code - Appropriate error
                    console.log('no code');
                } else if (blocks.length > 1) {
                    // Stray blocks - appropriate error
                    console.log('strays');
                }
                var code = Blockly.JavaScript.blockToCode(blocks[0]);
                interpreter.start(code);
            };
        };

        game.init(initBlockly, interpreter.resume);
        
        // var testFun = function () {
    //         console.log('TestFun Go!!!')
    //         var code = "function doWalk(dir) {\n" +
    //             "while (isBusy()) ;\n" +
    //             "walk(dir);\n" +
    //             "}\n";
    //         code += "doWalk('s');\n" +
    //             "doWalk('e');\n" +
    //             "doWalk('s');\n" +
    //             "doWalk('s');\n" +
    //             "doWalk('e');\n" +
    //             "doWalk('e');\n" +
    //             "doWalk('s');\n" +
    //             "doWalk('w');\n" +
    //             "doWalk('w');\n" +
    //             "doWalk('n');\n";
                
    //         var initFunc = function (terp, scope) {
    //             var wrapper = function () {
    //                 console.log('iB', game.busy, steps);
    //                 return terp.createPrimitive(game.busy);
    //             };
    //             terp.setProperty(scope, 'isBusy',
    //                 terp.createNativeFunction(wrapper));
    //             wrapper = function walk(dir) {
    //                 console.log('Walk wrap', steps);
    //                 game.walk(dir.toString());
    //             };
    //             terp.setProperty(scope, 'walk',
    //                 terp.createNativeFunction(wrapper));
    //         };
            
    //         var interpreter = new Interpreter(code, initFunc);
            
    //         var steps = 0;
            
    //         function doStep () {
    //             if (steps < 5000 && interpreter.step()) {
    //                 //console.log('Step', steps);
    //                 steps++;
    //                 setTimeout(doStep, 0);
    //             }
    //         }
    //         doStep();
        
    //     };
        
    //     setTimeout(testFun, 3000);
    
    };
    
})(module, exports, Blockly);