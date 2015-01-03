/**
 * @file Interface to JS-Interpreter
 */
 
(function (module, exports, Interpreter, Blockly) {
    var defaultWait = 10;
    
    var goFlag;
    var waitFlag;
    var game;
    // var collisionHandler;
    // var featureHandler;
    var activeTerp;
 
    var baseCode = 
        // Walking (absolute)
        "function walkNorth() {\n" +
        "var t = walk('n');\n" +
        "wait();\n" +
        // "if (!t) reportCollision();\n" +
        // "else reportFeatures();\n" +
        "}\n" +
        "function walkSouth() {\n" +
        "var t = walk('s');\n" +
        "wait();\n" +
        // "if (!t) reportCollision();\n" +
        // "else reportFeatures();\n" +
        "}\n" +
        "function walkEast() {\n" +
        "var t = walk('e');\n" +
        "wait();\n" +
        // "if (!t) reportCollision();\n" +
        // "else reportFeatures();\n" +
        "}\n" +
        "function walkWest() {\n" +
        "var t = walk('w');\n" +
        "wait();\n" +
        // "if (!t) reportCollision();\n" +
        // "else reportFeatures();\n" +
        "}\n" +
        // Walking (relative)
        "function walkForward() {\n" +
        "var t = walkForwardInternal();\n" +
        // "wait();\n" +
        // "if (!t) reportCollision();\n" +
        // "else reportFeatures();\n" +
        "}\n" +
        // Facing (absolute)
        "function faceNorth() {\n" +
        "setFacing('n');\n" +
        "}\n" +
        "function faceEast() {\n" +
        "setFacing('e');\n" +
        "}\n" +
        "function faceSouth() {\n" +
        "setFacing('s');\n" +
        "}\n" +
        "function faceWest() {\n" +
        "setFacing('w');\n" +
        "}\n" +
        // Facing (relative)
        "function turnRight() {\n" +
        "turn(1);\n" +
        "}\n" +
        "function turnLeft() {\n" +
        "turn(-1);\n" +
        "}\n";
        
    var initEnv = function (terp, scope) {
        // walk
        var wrapper = function (dir) {
            return terp.createPrimitive(game.walk(dir.toString()));
        };
        terp.setProperty(scope, 'walk',
            terp.createNativeFunction(wrapper));
        // reportCollision
        wrapper = function () {
            return game.collision.dispatch();
        };
        terp.setProperty(scope, 'reportCollision',
            terp.createNativeFunction(wrapper));
        // reportFeatures
        wrapper = function () {
            var f = game.getFeatureProperties();
            if (Object.keys(f).length > 0) {
                game.features.dispatch(f);
            }
        };
        terp.setProperty(scope, 'reportFeatures',
            terp.createNativeFunction(wrapper));
        // wait
        wrapper = function () {
            waitFlag = true;
        };
        terp.setProperty(scope, 'wait',
            terp.createNativeFunction(wrapper));
        // highlightBlock
        wrapper = function(id) {
            id = id ? id.toString() : '';
            Blockly.mainWorkspace.highlightBlock(id);
        };
        terp.setProperty(scope, 'highlightBlock',
            terp.createNativeFunction(wrapper));
        // setFacing
        wrapper = function (dir) {
            game.setFacing(dir.toString());
        };
        terp.setProperty(scope, 'setFacing',
            terp.createNativeFunction(wrapper));
        // turn
        wrapper = function (num) {
            game.turn(num.toNumber());
        };
        terp.setProperty(scope, 'turn',
            terp.createNativeFunction(wrapper));
        // walkForwardInternal
        wrapper = function () {
            return terp.createPrimitive(game.walkForward());
        };
        terp.setProperty(scope, 'walkForwardInternal',
            terp.createNativeFunction(wrapper));
    };
 
exports.init = function (g) {
    game = g;
    // g.setNextStepFunction(function () {
    //     setTimeout(step, 0);
    // });
    g.resume.add(function () {
        setTimeout(step, 0);
    });
};

// exports.setCollisionHandler = function (h) {
//     collisionHandler = h;
// };


// exports.setFeatureHandler = function (h) {
//     featureHandler = h;
// };


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