// runAnimation

// FRAMEFUNC: frameFunc(timeStep : double) : bool 
//      -- Should return false (not undefined) to signal stop of animation.

function runAnimation(frameFunc) {
    var lastTime = null;
    // FRAME: frame(time : long)
    function frame(time) {
        var stop = false;
        if (lastTime != null) {
            var timeStep = clamp(time - lastTime, 0, 100) / 1000;
            stop = frameFunc(timeStep) === false;
        }
        lastTime = time;
        if (!stop) {
            requestAnimationFrame(frame);
        }
    }
    requestAnimationFrame(frame);
}
