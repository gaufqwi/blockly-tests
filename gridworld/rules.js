/**
 * @file Implements various rules for GridWorld games
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */

(function (exports, module) {
    var game;
    var ui;
    var interpreter;
    var handlers = [];
    var flags;
    
    exports.enact = function (ruleset) {
        // Remove handlers from previous rulesets
        for (var i=0, l=handlers.length; i<l; i++) {
            handlers[i].detach();
        }
        // Clear flags
        flags = {};
        // TODO: implement more complex rules
        if (ruleset.collision) {
            if (ruleset.collision.interrupt) {
                handlers.push(game.collision.add(function () {
                    game.cancelAction();
                }));
            }
            if (ruleset.collision.failure) {
                handlers.push(game.collision.add(function () {
                    game.actionFinish.addOnce(function () {
                        interpreter.stop();
                        ui.toggleDialog(true, ruleset.collision.message,
                            function () {
                                ui.toggleOverlay(false);
                            });
                    });
                }));
            }
        }
        if (ruleset.goal) {
            handlers.push(game.featureSeen.add(function (props) {
                if (props.type === ruleset.goal.type) {
                    flags.win = true;
                    game.actionFinish.addOnce(function () {
                        interpreter.stop();
                        ui.toggleDialog(true, ruleset.goal.message,
                            function () {
                                ui.toggleOverlay(false);
                            });
                    });
                }
            }));
        }
    };
    
    // FIXME: Need richer API
    exports.getFlags = function() {
        return flags;
    };
    
    exports.init = function (g, i, u) {
        game = g;
        interpreter = i;
        ui = u;
    };
    
})(exports, module);