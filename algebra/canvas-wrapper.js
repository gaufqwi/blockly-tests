/**
 * @file Thin canvas wrapper with convenience functions and extensibility
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */

(function (module, exports) {
    var U = require('./utilities.js');
    
    var canvasDefaults = {
        width: 800,
        height: 600,
        background: 'white'
    }

    /**
     * @constructor
     * @param {string} id - DOM id for canvas
     * @param {object} options - configuration options
     * @return {object} The wrapper object
     */
    var Canvas = function (id, options) {
        U.merge(options, canvasDefaults);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.id = id;
        this.resize(options);
        this.background = options.background;
        return this;
    };
    
    /**
     * @param {object} options - Options
     */
    Canvas.prototype.resize = function (options) {
        this.canvas.width = options.width;
        this.canvas.height = options.height;
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
        this.resize({width: element.clientWidth, height: element.clientHeight});
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