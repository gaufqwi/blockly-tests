/**
 * @file Interface to JS-Interpreter
 */
 
(function (module, exports, Interpreter, Blockly) {
    var defaultWait = 10;
    
    var goFlag;
    var waitFlag;
    var game;
    var collisionHandler;
    var featureHandler;
    var activeTerp;
 
    var baseCode = 
        "function walkNorth() {\n" +
        "var t = walk('n');\n" +
        //"while (isBusy()) ;\n" +
        "wait();\n" +
        "if (!t) reportCollision();\n" +
        "else reportFeatures();\n" +
        "}\n" +
        "function walkSouth() {\n" +
        "var t = walk('s');\n" +
        //"while (isBusy()) ;\n" +
        "wait();\n" +
        "if (!t) reportCollision();\n" +
        "else reportFeatures();\n" +
        "}\n" +
        "function walkEast() {\n" +
        "var t = walk('e');\n" +
        //"while (isBusy()) ;\n" +
        "wait();\n" +
        "if (!t) reportCollision();\n" +
        "else reportFeatures();\n" +
        "}\n" +
        "function walkWest() {\n" +
        "var t = walk('w');\n" +
        //"while (isBusy()) ;\n" +
        "wait();\n" +
        "if (!t) reportCollision();\n" +
        "else reportFeatures();\n" +
        "}\n";
        
    var initEnv = function (terp, scope) {
        var wrapper = function (dir) {
            return terp.createPrimitive(game.walk(dir.toString()));
        };
        terp.setProperty(scope, 'walk',
            terp.createNativeFunction(wrapper));
        wrapper = function () {
            return terp.createPrimitive(game.atGoal());
        };
        // terp.setProperty(scope, 'atGoal',
        //     terp.createNativeFunction(wrapper));
        // wrapper = function () {
        //     return terp.createPrimitive(game.busy);
        // };
        // terp.setProperty(scope, 'isBusy',
        //     terp.createNativeFunction(wrapper));
        // wrapper = function () {
        //     if (collisionHandler) {
        //         collisionHandler();
        //     }
        // };
        terp.setProperty(scope, 'reportCollision',
            terp.createNativeFunction(wrapper));
        wrapper = function () {
            var f = game.getFeatureProperties();
            if (featureHandler && (Object.keys(f).length > 0)) {
                featureHandler(f);
            }
        };
        terp.setProperty(scope, 'reportFeatures',
            terp.createNativeFunction(wrapper));
        wrapper = function () {
            waitFlag = true;
        };
        terp.setProperty(scope, 'wait',
            terp.createNativeFunction(wrapper));
      wrapper = function(id) {
        id = id ? id.toString() : '';
        Blockly.mainWorkspace.highlightBlock(id);
      };
      terp.setProperty(scope, 'highlightBlock',
          terp.createNativeFunction(wrapper));
    };
 
exports.init = function (g) {
    game = g;
};

exports.setCollisionHandler = function (h) {
    collisionHandler = h;
};


exports.setFeatureHandler = function (h) {
    featureHandler = h;
};


var step = function () {
    waitFlag = false;
    if (goFlag && activeTerp.step() && !waitFlag) {
        setTimeout(step, defaultWait);
    }
};
 
exports.start = function (code) {
    goFlag = true;
    activeTerp = new Interpreter(baseCode + code, initEnv);
    setTimeout(step ,0);
};

exports.resume = function () {
    setTimeout(step, 0);
};
 
exports.stop = function () {
    goFlag = false;
};
 
})(module, exports, Interpreter, Blockly);