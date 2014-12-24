/**
 * @file Canvas to display basic algebraic graphs
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports) {
    var Canvas = require('./canvas-wrapper.js');
    var PI = Math.PI;
    var atan2 = Math.atan2, min = Math.min, max = Math.max;
    var arrows = {
        'acute': {path: [-5, -3, 0, 0, -5, 3], filled: false},
        'acute-filled': {path: [-5, -3, 0, 0, -5, 3], filled: true},
        'right': {path: [-5, -5, 0, 0, -5, 5], filled: false},
        'right-filled': {path: [-5, -5, 0, 0, -5, 5], filled: true}
    };
    
    var Cartesian = function (id, options) {
        options = options || {};
        this.minx = (typeof options.minx !== 'undefined' ? options.minx : -10);
        this.miny = (typeof options.miny !== 'undefined' ? options.miny : -10);
        this.maxx = (typeof options.maxx !== 'undefined' ? options.maxx : 10);
        this.maxy = (typeof options.maxy !== 'undefined' ? options.maxy : 10);
        this.xpadding = options.xpadding || options.padding || 5;
        this.ypadding = options.ypadding || options.padding || 5;
        Canvas.call(this, id, options);
    };
    Cartesian.prototype = Object.create(Canvas.prototype);

    /**
     * @param {number} w - Width of canvas
     * @param {number} h - Height of canvas
     */
    Cartesian.prototype.resize = function (w, h) {
        Canvas.prototype.resize.call(this, w, h);
        this.dx = (w - 2*this.xpadding) / (this.maxx - this.minx);
        this.dy = (h - 2*this.ypadding) / (this.maxy - this.miny);
        this.ds = Math.max(this.dx, this.dy);
    };

    /**
     * Clear screen and redraw background
     */
    Cartesian.prototype.clear = function () {
        Canvas.prototype.clear.call(this);
        //return;         // FIXME
        var w = this.canvas.width, h = this.canvas.height;
        //var dx = w / (this.maxx - this.minx);
        //var dy = h / (this.maxy - this.miny);
        this.context.save();
        this.context.strokeStyle = 'black';
        this.context.globalAlpha = 0.5;
        // Vertical grid lines
        for (var i=this.minx, c=0; i<=this.maxx; i++, c += this.dx) {
            if (i === 0) {
                this.drawLine(i, this.miny, i, this.maxy,
                    {globalAlpha: 1, lineWidth: 3, arrows: 'acute-filled'});
            } else {
                this.drawLine(i, this.miny, i, this.maxy);
            }
        }
        // Horizontal grid lines
        for (var i=this.miny, c=0; i<=this.maxy; i++, c += this.dy) {
            if (i === 0) {
                this.drawLine(this.minx, i, this.maxx, i,
                    {globalAlpha: 1, lineWidth: 3, arrows: 'acute-filled'});
            } else {
                this.drawLine(this.minx, i, this.maxy, i);
            }
        }
        this.context.restore();
    };

    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {object} options - Drawing options
     * @return {object} The wrapper object
     */
    Canvas.prototype.drawLine = function(x1, y1, x2, y2, options) {
        options = options || {};
        this.context.save();
        this.context.beginPath();
        this.setOptions(options);
        this._transform();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.save();
        this.context.lineWidth = this.context.lineWidth / this.ds;
        this.context.stroke();
        this.context.restore();
        if (options.arrows) {
            var angle = atan2(y2 - y1, x2 - x1);
            this._drawArrowHead(x1, y1, angle + PI, options.arrows);
            this._drawArrowHead(x2, y2, angle, options.arrows);
        }
        this.context.restore();
        return this;
    };
    
    /**
     * Tranform into grid coordinate system
     */
    Cartesian.prototype._transform = function () {
        this.context.translate(this.xpadding, this.ypadding);
        this.context.scale(this.dx, -this.dy);
        this.context.translate(-this.minx, -this.maxy);
    };
    
    /**
     * @param {number} x
     * @param {number} y
     * @param {object} options - Drawing options
     */
    Cartesian.prototype.plotPoint = function (x, y, options) {
        options = options || {};
        var radius = options.radius || 3;
        this.context.save();
        this.setOptions(options);
        this._transform();
        this.context.beginPath();
        this.context.translate(x, y);
        this.context.scale(1/this.dx, 1/this.dy);
        this.context.arc(0, 0, radius, 0, 2*PI);
        this.context.fill();
        this.context.restore();
        return this;
    };
    
    /**
     * @param {LinEq} eq - Linear equation to graph
     * @param {object} options
     */
    Cartesian.prototype.graphLinear = function (eq, options) {
        options = options || {};
        options.arrows = 'acute';
        options.lineWidth = 2;
        var f = eq.getFunction();
        if (!f) {
            // Vertical line
            var x = eq.getXintercept();
            this.drawLine(x, this.miny, x, this.maxy, options);
            return;
        }
        var finv = eq.getInverseFunction();
        if (!finv) {
            // Horizontal line
            var y = f(0);
            this.drawLine(this.minx, y, this.maxx, y, options);
            return;
        }
        var topx = finv(this.maxy), botx = finv(this.miny);
        var leftx = max(this.minx, min(topx, botx));
        var rightx = min(this.maxx, max(topx, botx));
        this.drawLine(leftx, f(leftx), rightx, f(rightx), options);
    };
    
    Cartesian.prototype._drawArrowHead = function (x, y, angle, style) {
        style = arrows[style];
        this.context.save();
        this.context.translate(x, y);
        this.context.scale(1/this.dx, 1/this.dy);
        this.context.rotate(angle);
        this.context.beginPath();
        this.context.moveTo(style.path[0], style.path[1]);
        for (var i=2, l = style.path.length; i<l; i += 2) {
            this.context.lineTo(style.path[i], style.path[i+1]);
        }
        if (style.filled) {
            this.context.fill();
        }
        //this.context.lineJoin = 'bevel';
        this.context.miterLimit = 3;
        this.context.stroke();
        this.context.restore();
    };

    
    module.exports = Cartesian;
})(module, exports);