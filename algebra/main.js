require('./custom_blocks.js');

var Canvas = require('./cartesian-canvas.js');

Blockly.inject(document.getElementById('blocklyDiv'),
    {toolbox: document.getElementById('toolbox'),
        comments: true
    });

var c = new Canvas('newcanvas', {width: 200, height: 200})
c.attach('canvasdiv');
//c.clear();
//c.drawLine(10,20, 200, 450);
//c.fillRect(50, 50, 300, 300);
//c.set('fillStyle', '#ff0000');
// c.set('strokeStyle', '#ff0000');
// c.drawLine(20, 400, 500, 30, {arrows: 'acute-filled'});
// c.set('fillStyle', '#0000ff');
// c.set('strokeStyle', '#0000ff');
// c.drawLine(420, 200, 50, 30, {arrows: 'acute'});
c.drawLine(1,1,8,7, {arrows: 'right-filled', color: 'green'});
c.drawLine(8,9,-4,-5, {arrows: 'acute', color: 'red'});
c.plotPoint(3,5);
c.plotPoint(-2,-6, {color: 'green'});