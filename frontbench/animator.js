(function (exports) {

    /**
     * IDEAS
     *
     * Requirements
     * - Given a set of steps and durations, allow running an animation:
     * -- From start to finish, with pause/play
     * -- Step-by-step (manual advance/replay)
     * - Display a visual countdown until the next step runs
     * - Provide controls or BYO?
     *
     * API
     * (Note: All methods are chainable)
     *
     * .delay(millis)
     *   Default delay time before moving to the next step.
     *   Can be overridden on per-step basis.
     *
     * .steps([fn, fn, obj, ...])
     *   Setter for step functions / objects (either are accepted).
     *   If plain function is used, that step uses the default delay.
     *   If object is used, it can override the default delay:
     *   {
     *     run: fn,
     *     delay: millis
     *   }
     *
     * .play()
     *   Run the animation from the current step.
     *
     * .pause()
     *   Set the animation to paused state, and stop any current "next step" timers.
     *
     * .goto(stepNum)
     *   Reset to the given step number, and set animation to paused state
     *
     * .next()
     *   Jump to the next step – effectively .goto(currentStep + 1).
     *   Does nothing if currently on the last step.
     *
     * .prev()
     *   Jump to the previous step – effectively .goto(currentStep - 1)
     *   Does nothing if currently on the first step.
     *
     * .countdownElem
     *   Read-only getter for the element that provides the countdown timer, for placement in the DOM.
     *   Lazily-initialised, so that it doesn't exist until it's first needed.
     */

    function animator() {
        var anim = {},
            // Settable options
            steps = [],
            defaultDelay = 500,
            // Internal state
            isPlaying = false,
            currentStep,
            maxStep = 0,
            countdownElem;

        anim.steps = function (s) {
            if (!arguments.length) return steps;
            steps = [].concat(s);
            currentStep = 0;
            maxStep = steps.length - 1;
            return anim;
        }

        anim.delay = function (d) {
            if (!arguments.length) return defaultDelay;
            defaultDelay = +d || 0;
            return anim;
        }

        function setPlaying(bool) {
            isPlaying = bool;
        }

        anim.play = function () {
            setPlaying(true);
            runStep(currentStep || 0);
            return anim;
        }

        anim.pause = function () {
            setPlaying(false);
            return anim;
        }

        function runStep(stepNum) {
            let step = steps[stepNum];
            let fn = typeof step === 'function' ? step : step.run || function () {};
            let delay = 'delay' in step ? step.delay : defaultDelay;
            currentStep = stepNum;
            return Promise.resolve(fn())
                .then(() => pause(delay))
                .then(nextIfPlaying);
        }

        function pause(time) {
            return new Promise(function (resolve) {
                setTimeout(resolve, time);
            });
        }

        function nextIfPlaying() {
            if (isPlaying) {
                anim.next();
            }
        }

        anim.goto = function (stepNum) {
            // Clamp stepNum to [0, stepCount] bounds
            stepNum = Math.max(0, Math.min(maxStep, stepNum));
            if (currentStep !== stepNum) {
                runStep(stepNum);
            }
            return anim;//.pause();
        }

        anim.next = function () {
            return anim.goto(currentStep + 1);
        }

        anim.prev = function () {
            return anim.goto(currentStep - 1);
        }

        Object.defineProperty(anim, 'countdownElem', {
            get() {
                if (!countdownElem) {
                    let frag = document.createDocumentFragment();
                    let elem = d3.select(frag).append('svg');
                    countdownElem = elem.node();
                }
                return countdownElem;
            }
        });

        return anim;
    }

    exports.animator = animator;

})(this);
