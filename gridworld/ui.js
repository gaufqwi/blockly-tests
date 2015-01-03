/**
 * @file Thin api for accessing dom elements
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports) {
    
    var goal = document.getElementById('goal');
    var blocksLeft = document.getElementById('blocksleft');
    var gobutton = document.getElementById('gobutton');
    
    var createOverlay = function () {
        var overlay = document.createElement('div');
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.zIndex = 1000;
        overlay.style.backgroundColor = 'black';
        overlay.style.opacity = '0.0';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
        return overlay;
    };
    
    var createDialog = function () {
        var dialog = document.createElement('div');
        dialog.className = 'gridworld-dialog theme-dialog';
        dialog.style.position = 'absolute';
        dialog.style.zIndex = '2000';
        dialog.style.display = 'none';
        var content = document.createElement('div');
        content.className = 'content';
        dialog.appendChild(content);
        var hr = document.createElement('hr');
        dialog.appendChild(hr);
        var button = document.createElement('button');
        button.onclick = function () {
            exports.toggleDialog(false);
        };
        button.innerHTML = 'OK';
        dialog.appendChild(button);
        document.body.appendChild(dialog);
        return dialog;
    };
    
    var overlay = createOverlay();
    var dialog = createDialog();
    
    exports.toggleOverlay = function (state, darken) {
        if (state) {
            overlay.style.opacity = (darken ? '0.5' : '0');
            overlay.style.display = 'block';
       } else {
           overlay.style.display = 'none';
       }
    };
    
    exports.toggleDialog = function (state, html) {
        if (state) {
            exports.toggleOverlay(true, true);
            dialog.style.display = 'block';
            dialog.firstChild.innerHTML = html;
            setTimeout(function () {
                dialog.style.top = (window.innerHeight - dialog.offsetHeight)/2 + 'px';
                dialog.style.left = (window.innerWidth - dialog.offsetWidth)/2 + 'px';
            }, 0);
        } else {
            exports.toggleOverlay(false);
            dialog.style.display = 'none';
        }
    };
    
    exports.setGoButtonHandler = function (f) {
        gobutton.onclick = f;
    };
    
    exports.setGoal = function (g) {
        goal.innerHTML = g;
    };
    
    exports.setBlocksLeft = function (n) {
        if (n === Infinity) {
            n = '&infin;';
        }
        blocksLeft.innerHTML = n;
    };
    
    exports.blockly = document.getElementById('blockly');
    exports.phaser = document.getElementById('phaser');
    
})(module, exports);