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