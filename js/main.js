(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file Methods and structures for basic symbolic algebra
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports) {
    var abs = Math.abs, floor = Math.floor, round = Math.round;
    var options = {
        autoReduce: false,
    };
    
    /**
     * Euclid's algorithm for GCF
     */
    function euclid (a, b) {
        var t;
        if (b > a) {
            t = a;
            a = b;
            b = t;
        }
        while (b !== 0) {
            t = a % b;
            a = b;
            b = t;
        }
        return a;
    }
    
    /**
     * Fraction/rational number stuff
     */
    
    /**
     * @param {object} ops - Options to change
     */
    function setOptions (ops) {
        for (var o in ops) {
            if (ops.hasOwnProperty(o)) {
                options[o] = ops[o];
            }
        }
    }
    
    /**
     * @constructor
     * @param {number} n
     * @param {number} d
     */
    var Frac = function (n, d) {
        if (d === 0) {
            throw 'Division by zero';
        }
        if (n instanceof Frac) {
            this.n = n.n;
            this.d = n.d;
            this.s = n.s;
        } else if (typeof n === 'string') {
            this._fromString(n);
        } else {
            this.n = abs(n);
            d = d || 1;
            this.d = abs(d);
            this.s = n && round(n * d / abs(n * d));
            if (options.autoReduce) {
                this.reduce();
            }
        }
    };
    
    var reMixed = /^ *(-?\d+(?! *\/)) *(?: (\d+) *\/ *(\d+))? *$/;
    var reFrac = /^ *(-?\d+) *\/ *(-?\d+) *$/;
    
    /**
     * @param {string} s
     */
    Frac.prototype._fromString = function (s) {
        var i, n, d, m;
        if (m = reMixed.exec(s)) {
            i = parseInt(m[1], 10);
            if (m[2]) {
                this.d = parseInt(m[3], 10);
                this.n = abs(i) * this.d + parseInt(m[2], 10);
                this.s = i && round(i/abs(i));
            } else {
                this.n = abs(i);
                this.d = 1;
                this.s = i && round(this.n/i);
            }
        } else if (m = reFrac.exec(s)) {
            n = parseInt(m[1], 10);
            d = parseInt(m[2], 10);
            this.n = abs(n);
            this.d = abs(d);
            this.s = this.n && round(this.n*this.d / (n*d));
        } else {
            throw 'Unparseable fraction';
        }
        if (options.autoReduce) {
            this.reduce();
        }
    };
    
    /**
     * @return {Frac}
     */
    Frac.prototype.copy = function () {
        return new Frac(this.n, this.d);
    };
    
    /**
     * Reduce fraction to lowest terms
     */
    Frac.prototype.reduce = function () {
         var g = euclid(this.n, this. d);
         this.n = floor(this.n / g);
         this.d = floor(this.d / g);
    };
     
     /**
      * @param {object|number} x - Number to be added
      * @return {Frac}
      */
    Frac.prototype.plus = function (x) {
        if (!(x instanceof Frac)) {
            x = new Frac(x);
        }
        var g = euclid(this.d, x.d);
        return new Frac(round(this.s*this.n*x.d/g + x.s*x.n*this.d/g),
            floor(this.d*x.d/g));
    };

     /**
      * @param {object|number} x - Number to be subtracted
      * @return {Frac}
      */
    Frac.prototype.minus = function (x) {
        if (!(x instanceof Frac)) {
            x = new Frac(x);
        }
        var g = euclid(this.d, x.d);
        return new Frac(round(this.s*this.n*x.d/g - x.s*x.n*this.d/g),
            floor(this.d*x.d/g));
    };

     /**
      * @param {object|number} x - Number to be multiplied
      * @return {Frac}
      */
    Frac.prototype.times = function (x) {
        if (!(x instanceof Frac)) {
            x = new Frac(x);
        }
        return new Frac(this.s*this.n*x.s*x.n, this.d*x.d);
    };
    
     /**
      * @param {object|number} x - Number to be divided by
      * @return {Frac}
      */
    Frac.prototype.dividedby = function (x) {
        if (!(x instanceof Frac)) {
            x = new Frac(x);
        }
        return new Frac(this.s*this.n*x.s*x.d, this.d*x.n);
    };
    
    /**
     * @return {boolean}
     */
    Frac.prototype.isZero = function () {
        return (this.n === 0);
    };
     
    /**
     * @param {number|Frac} x - Number to be compared
     * @return {boolean}
     */
    Frac.prototype.isGreater = function (x) {
        if (!(x instanceof Frac)) {
          x = new Frac(x);
        }
        return (this.s*this.n*x.d > x.s*x.n*this.d);
    };
     
    /**
     * @param {number|Frac} x - Number to be compared
     * @return {boolean}
     */
    Frac.prototype.isLess = function (x) {
        if (!(x instanceof Frac)) {
          x = new Frac(x);
        }
        return (this.s*this.n*x.d < x.s*x.n*this.d);
    };
     
    /**
     * @param {number|Frac} x - Number to be compared
     * @return {boolean}
     */
    Frac.prototype.isEqual = function (x) {
        if (!(x instanceof Frac)) {
          x = Frac(x);
        }
        return (this.s*this.n*x.d === x.s*x.n*this.d);
    };
    
    /**
     * @return {number}
     */
    Frac.prototype.toDecimal = function () {
        return this.s*this.n / this.d;
    };
    
    exports.Frac = Frac;
    exports.setOptions = setOptions;
    
    /**
     * 2D Point (possibly labeled)
     */
     
    /**
     * @constructor
     * @param {number|Frac} x
     * @param {number|Frac} y
     * @param {string} label
     */
    var Point = function (x, y, label) {
        if (x instanceof Point) {
            this.x = x.x;
            this.y = x.y;
            this.label = x.label;
        } else if (x instanceof Array) {
            this.x = new Frac(x[0]);
            this.y = new Frac(x[1]);
            this.label = y;
        } else {
            this.x = new Frac(x);
            this.y = new Frac(y);
            this.label = label;
        }
    };
    
    exports.Point = Point;
    
    /**
     * Linear equations
     */

    /**
     * @param {number|string|Frac|Point} a - Slope, coefficient, string repr, or point
     * @param {number|Frac|Point} b - y-intercept, coefficient, or point
     * @param {number|Frac} c - Constant term
     */ 
    var LinEq = function (a, b, c) {
        if (arguments.length === 3) {
            this._fromStandard(a, b, c);
        } else if (typeof a === 'string') {
            this._fromString(a);
        } else if (a instanceof Array || a instanceof Point) {
            this._fromPoints(a, b);
        } else if (b instanceof Array || b instanceof Point) {
            this._fromPointSlope(a, b);
        } else {
            this._fromSlopeIntercept(a, b);
        }
    };
    
    /**
     * @param a {number|Frac} a - A coefficient
     * @param b {number|Frac} b - B coefficient
     * @parac c {number|Frac} c - C constant
     */
    LinEq.prototype._fromStandard = function (a, b, c) {
        this.a = new Frac(a);
        this.b = new Frac(b);
        this.c = new Frac(c);
        this.format = 'std';
    };
    
    /**
     * @param m {number|Frac} m - Slope
     * @param p {Array|Point} p - Point on line
     */
    LinEq.prototype._fromPointSlope = function (m, p) {
        m = new Frac(m);
        p = new Point(p);
        this.a = m.times(-1);
        this.b = new Frac(1);
        this.c = this.a.times(p.x).plus(p.y);
        this.format = 'ps';
        this.displayPoint = p;
    };
    
    /**
     * @param {number|Frac} m - Slope
     * @param {number|Frac} b - y-intercept
     */
    LinEq.prototype._fromSlopeIntercept = function (m, b) {
        this._fromPointSlope(m, [0, b]);
        this.format = 'si';
    };
    
    /**
     * @param {Array|Point} p1
     * @param {Array|Point} p2
     */
    LinEq.prototype._fromPoints = function (p1, p2) {
        p1 = new Point(p1);
        p2 = new Point(p2);
        if (p1.x.isEqual(p2.x)) {
            this.a = new Frac(1);
            this.b = new Frac(0);
            this.c = p1.x.copy();
            this.format = 'std';
        } else {
            var rise = p1.y.minus(p2.y);
            var run = p1.x.minus(p2.x);
            this._fromPointSlope(rise.dividedby(run), p1);
            this.format = 'si';
        }
    };
    
    /**
     * @param {Array|Point} p
     * @returns {boolean}
     */
    LinEq.prototype.contains = function (p) {
        p = new Point(p);
        return (this.a.times(p.x).plus(this.b.times(p.y)).isEqual(this.c));
    };
    
    /**
     * @return {function|boolean}
     */
    LinEq.prototype.getFunction = function () {
        if (this.b.isZero()) {
            return false;
        }
        var m = this.a.times(-1).dividedby(this.b).toDecimal();
        var b = this.c.dividedby(this.b).toDecimal();
        return (function (x) { return m*x + b;});
    };

    /**
     * @return {function|boolean}
     */
    LinEq.prototype.getInverseFunction = function () {
        if (this.a.isZero()) {
            return false;
        }
        var m = this.b.times(-1).dividedby(this.a).toDecimal();
        var b = this.c.dividedby(this.a).toDecimal();
        return (function (x) { return m*x + b;});
    };
    
    /**
     * @return {number|boolean}
     */
    LinEq.prototype.getXintercept = function () {
        if (!this.b.isZero()) {
            return false;
        }
        return this.c.dividedby(this.a).toDecimal();
    };
    
    var reSI = new RegExp();
    var rePS = new RegExp();
    var reSTD = new RegExp();
    
    /**
     * @param {string} s - String representation of equation
     */
    LinEq.prototype._fromString = function (s) {
        throw 'Not implemented';
    };
    
    exports.LinEq = LinEq;

})(module, exports);
},{}],2:[function(require,module,exports){
/**
 * @file Thin canvas wrapper with convenience functions and extensibility
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */

(function (module, exports) {

    /**
     * @constructor
     * @param {string} id - DOM id for canvas
     * @param {object} options - configuration options
     * @return {object} The wrapper object
     */
    var Canvas = function (id, options) {
        options = options || {};
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.id = id;
        //this.canvas.width = options.width || 800;
        //this.canvas.height = options.height || 600;
        this.resize(options.width || 800, options.height || 600);
        this.background = options.background || '#ffffff';
        return this;
    };
    
    /**
     * @param {number} w - Width of canvas
     * @param {number} h - Height of canvas
     */
    Canvas.prototype.resize = function (w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
    };
 
    /**
     * @param {object|string} element - DOM element or id to append to
     * @return {object} The wrapper object
     */
    Canvas.prototype.attach = function (element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        this.parent = element;
        element.appendChild(this.canvas);
        this.resize(element.clientWidth, element.clientHeight);
        this.clear();
        return this;
    };
    
    /**
     * Clear the canvas using the current background color
     */
     Canvas.prototype.clear = function () {
         this.context.save();
         this.context.fillStyle = this.background;
         this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
         this.context.restore();
     };
     
     
     // FIXME: add lesser used options
     var contextProps = {fillStyle: true, strokeStyle: true, lineWidth: true,
        globalAlpha: true, lineCap: true, lineJoin: true, miterLimit: true};
        
     /**
      * @param {object} options - Options to set
      */
     Canvas.prototype.setOptions = function (options) {
         if ('color' in options) {
             this.context.fillStyle = options.color;
             this.context.strokeStyle = options.color;
         }
         for (var o in options) {
             if (o in contextProps) {
                 this.context[o] = options[o];
             }
             // TODO: More special cases?
         }
     };
    
    /**
     * @param Name of method
     * @param ... Arguments
     * @return Wrapper object
     */
    Canvas.prototype.method = function () {
        var methodname = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        return this.context[methodname].apply(this.context, args);
    };
    
    /**
     * @param {string} prop - Name of property to get
     * @returns {*} - Value of property
     */
    Canvas.prototype.get = function (prop) {
        return this.context[prop];
    };
    
    /**
     * @param {string} prop - Name of property to set
     * @param {*} val - Value to set
     * @return Wrapper object
     */
     Canvas.prototype.set = function (prop, val) {
         this.context[prop] = val;
     };
    
    module.exports = Canvas;
})(module, exports);
},{}],3:[function(require,module,exports){
/**
 * @file Canvas to display basic algebraic graphs
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports) {
    var Canvas = require('./canvas-wrapper.js');
    var U = require('./utilities.js');
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
    
    
    var plotPointDefaults = {
        shape: 'circle',
        radius: 3,
        fill: true,
        stroke: false,
        color: 'black'
    }
    /**
     * @param {Point} p
     * @param {object} options - Drawing options
     */
    Cartesian.prototype.plotPoint = function (p, options) {
        U.merge(options, plotPointDefaults);
        //var radius = options.radius || 3;
        //var shape = options.shape || 'circle'
        this.context.save();
        this.setOptions(options);
        this._transform();
        this.context.beginPath();
        this.context.translate(p.x.toDecimal(), p.y.toDecimal());
        this.context.scale(1/this.dx, 1/this.dy);
        switch (options.shape) {
            case 'circle':
                this.context.arc(0, 0, options.radius, 0, 2*PI);
                break;
            case 'square':
                this.context.moveTo(options.radius, options.radius);
                this.context.lineTo(-options.radius, options.radius);
                this.context.lineTo(-options.radius, -options.radius);
                this.context.lineTo(options.radius, -options.radius);
                this.context.closePath();
                break;
            case 'x':
                this.context.moveTo(options.radius, options.radius);
                this.context.lineTo(-options.radius, -options.radius);
                this.context.moveTo(-options.radius, options.radius);
                this.context.lineTo(options.radius, -options.radius);
                options.stroke = true;
                options.fill = false;
                break;
        }
        if (options.fill) {
            this.context.fill();
        }
        if (options.stroke) {
            this.context.stroke();
        }
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
},{"./canvas-wrapper.js":2,"./utilities.js":7}],4:[function(require,module,exports){
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
},{"./algebra.js":1,"./cartesian-canvas.js":3,"./graphing-blocks.js":5,"./graphing.js":6}],5:[function(require,module,exports){
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
        },
        foo: 'bar'
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
},{"./algebra.js":1}],6:[function(require,module,exports){
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
                    console.log('Equation', block.id);
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
},{"./algebra.js":1}],7:[function(require,module,exports){
/**
 * @file Generic utility functions
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports) {
    
    /**
     * @param {object} target
     * @param {object} source
     */
    function merge (target, source) {
        target = target || {};
        for (var o in source) {
            if (source.hasOwnProperty(o) && !target.hasOwnProperty(o)) {
                target[o] = source[o];
            }
        }
    }
    
    exports.merge = merge;
    
})(module, exports);
},{}]},{},[4])