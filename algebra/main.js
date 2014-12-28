/**
 * @file Main file for application
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (Blockly) {

    var blocks = require('./graphing-blocks.js');
    var Canvas = require('./cartesian-canvas.js');
    var algebra = require('./algebra.js');
    var graphing = require('./graphing.js');
    
    window.onload = function () {
        var w = window.innerWidth;
        var div = document.getElementById('grapher-main');
        
        // Set up sizes
        if (w >= 1200) {
            div.className = 'large';
        } else if (w >= 1000) {
            div.className = 'med';
        } else {
            div.className = 'small';
        }
        
        Blockly.inject(document.getElementById('blocklydiv'),
            {toolbox: document.getElementById('toolbox'),
                comments: true
            });
        
        var c = new Canvas('newcanvas', {width: 200, height: 200});
        c.attach('canvasdiv');
        
        graphing.start(c);
    };

})(Blockly);