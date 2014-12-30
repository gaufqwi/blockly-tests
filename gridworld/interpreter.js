/**
 * @file Interface to JS-Interpreter
 */
 
(function (module, exports, Interpreter) {
    var goFlag;
    var game;
    var stepCount;
    var collisionHandler;
    var goalHandler;
 
    var baseCode = 
        "function walkNorth() {\n" +
        "var t = walk('n');\n" +
        "while (isBusy()) ;\n" +
        "if (!t) reportCollision();\n" +
        "else if (atGoal()) reportGoal();\n" +
        "}\n" +
        "function walkSouth() {\n" +
        "var t = walk('s');\n" +
        "while (isBusy()) ;\n" +
        "if (!t) reportCollision();\n" +
        "else if (atGoal()) reportGoal();\n" +
        "}\n" +
        "function walkEast() {\n" +
        "var t = walk('e');\n" +
        "while (isBusy()) ;\n" +
        "if (!t) reportCollision();\n" +
        "else if (atGoal()) reportGoal();\n" +
        "}\n" +
        "function walkWest() {\n" +
        "var t = walk('w');\n" +
        "while (isBusy()) ;\n" +
        "if (!t) reportCollision();\n" +
        "else if (atGoal()) reportGoal();\n" +
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
        terp.setProperty(scope, 'atGoal',
            terp.createNativeFunction(wrapper));
        wrapper = function () {
            return terp.createPrimitive(game.busy);
        };
        terp.setProperty(scope, 'isBusy',
            terp.createNativeFunction(wrapper));
        wrapper = function () {
            if (collisionHandler) {
                collisionHandler();
            }
        };
        terp.setProperty(scope, 'reportCollision',
            terp.createNativeFunction(wrapper));
        wrapper = function () {
            if (goalHandler) {
                goalHandler();
            }
        };
        terp.setProperty(scope, 'reportGoal',
            terp.createNativeFunction(wrapper));
    };
 
exports.init = function (g) {
    game = g;
};

exports.setCollisionHandler = function (h) {
    collisionHandler = h;
};


exports.setGoalHandler = function (h) {
    goalHandler = h;
};
 
exports.start = function (code) {
    console.log('starting');
    goFlag = true;
    stepCount = 0;
    var terp = new Interpreter(baseCode + code, initEnv);
    var step = function () {
        //console.log('step', stepCount)
        if (goFlag && terp.step()) {
            setTimeout(step, 0);
            //stepCount++;
        }
    };
    step();
};
 
exports.stop = function () {
    goFlag = false;
};
 
})(module, exports, Interpreter);