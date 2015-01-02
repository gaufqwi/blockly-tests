/**
 * @file Thin api for accessing dom elements
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports) {
    
    var goal = document.getElementById('goal');
    var blocksLeft = document.getElementById('blocksleft');
    var gobutton = document.getElementById('gobutton');
    
    exports.setGoButtonHandler = function (f) {
        gobutton.onclick = f;
    };
    
    exports.setGoal = function (g) {
        goal.innerHTML = g;
    };
    
    exports.setBlocksLeft = function (n) {
        if (n === Infinity) {
            n = '&infin;';
        }
        blocksLeft.innerHTML = n;
    };
    
    exports.blockly = document.getElementById('blockly');
    exports.phaser = document.getElementById('phaser');
    
})(module, exports);