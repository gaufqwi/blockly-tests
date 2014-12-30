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
        source = source || {}
        for (var o in source) {
            if (source.hasOwnProperty(o) && !target.hasOwnProperty(o)) {
                target[o] = source[o];
            }
        }
    }
    
    exports.merge = merge;
    
})(module, exports);