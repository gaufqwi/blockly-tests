/**
 * @file Main file for application
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (Blockly) {

    var blocks = require('./graphing-blocks.js');
    var Cartesian = require('./cartesian-canvas.js');
    var algebra = require('./algebra.js');
    var graphing = require('./graphing.js');
    
    window.onload = function () {
        var w = window.innerWidth*0.95;
        var h = Math.floor(window.innerHeight*0.9);
        var bW = Math.min(800, Math.floor(w*0.5));
        var bH = Math.min(h, Math.floor(bW*1.33));
        var gW = Math.floor(w - bW - 24);
        var gH = Math.min(h, gW);
        var div = document.getElementById('grapher-main');
        var bDiv = document.getElementById('blocklydiv');
        var gDiv = document.getElementById('canvasdiv');
        
        bDiv.style.width = bW + 'px';
        bDiv.style.height = bH + 'px';
        gDiv.style.width = gW + 'px';
        gDiv.style.height = gH + 'px';
        
        // Set up sizes
        // if (w >= 1200) {
        //     div.className = 'large';
        // } else if (w >= 1000) {
        //     div.className = 'med';
        // } else {
        //     div.className = 'small';
        // }
        
        Blockly.inject(bDiv,
            {toolbox: document.getElementById('toolbox'),
                comments: true
            });
        
        var c = new Cartesian('newcanvas', {width: 200, height: 200});
        c.attach('canvasdiv');

        graphing.start(c);
    };

})(Blockly);