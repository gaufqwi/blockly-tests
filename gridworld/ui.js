/**
 * @file Thin api for accessing dom elements
 * @author Jay Bloodworth <johnabloodworth3@gmail.com>
 */
 
(function (module, exports) {
    
    var goal = document.getElementById('goal');
    var blocksLeft = document.getElementById('blocksleft');
    
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
        //dialog.className = 'gridworld-dialog theme-dialog';
        dialog.style.position = 'absolute';
        dialog.style.zIndex = '2000';
        dialog.style.display = 'none';
        var content = document.createElement('div');
        content.className = 'content';
        dialog.appendChild(content);
        var hr = document.createElement('hr');
        dialog.appendChild(hr);
        var button = document.createElement('button');
        button.className = 'greenbutton';
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
    var overlayFlag;
    var dialogCallback = null;
    
    exports.toggleOverlay = function (state, darken) {
        overlayFlag = state;
        if (state) {
            overlay.style.opacity = (darken ? '0.5' : '0');
            overlay.style.display = 'block';
       } else {
           overlay.style.display = 'none';
       }
    };
    
    exports.toggleDialog = function (state, html, cb, cls) {
        if (state) {
            if (typeof cb === 'function') {
                dialogCallback = cb;
            } else if (typeof cb === 'string') {
                cls = cb;
            }
            exports.toggleOverlay(true, true);
            dialog.style.display = 'block';
            dialog.firstChild.innerHTML = html;
            if (cls) {
                dialog.className = 'gridworld-dialog theme-dialog ' + cls;
            } else {
                dialog.className = 'gridworld-dialog theme-dialog';
            }
            setTimeout(function () {
                dialog.style.top = (window.innerHeight - dialog.offsetHeight)/2 + 'px';
                dialog.style.left = (window.innerWidth - dialog.offsetWidth)/2 + 'px';
            }, 0);
        } else {
            exports.toggleOverlay(overlayFlag, false);
            dialog.style.display = 'none';
            if (dialogCallback) {
                dialogCallback();
                dialogCallback = null;
            }
        }
    };
    
    exports.setButtonHandler = function (id, f) {
        document.getElementById(id).onclick = f;
    };
    
    exports.toggleButton = function (id, state) {
        document.getElementById(id).style.display = (state ? 'block' : 'none');
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