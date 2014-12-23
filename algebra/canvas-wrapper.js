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
     
     /**
      * @param {object} options - Options to set
      */
     Canvas.prototype.setOptions = function (options) {
         for (var o in options) {
             if (o in this.context) {
                 this.context[o] = options[o];
             } else if (o === 'color') {
                 this.context.fillStyle = options[o];
                 this.context.strokeStyle = options[o];
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