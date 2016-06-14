(function (exports) {

    var candidates = [
        {name: 'Scarlet PIMPERNEL', party: 'Reds'},
        {name: 'Clover FIELDS', party: 'Greens'},
        {name: 'Ebony SCHWARTZ', party: 'Blacks'},
        {name: 'Blanche ALMOND', party: 'Whites'}
    ];

    var ballot = horBallot()
        .container('#hor-example')
        .candidates(candidates);

    var details = d3.select('#hor-example')
        .append('div')
        .attr('class', 'explanation-details');

    var steps = {
        // Initial state - fade in candidates one-by-one
        s1: {
            text: [
                'We start with a list of nominated candidates.'
            ],
            setup() {
                ballot.withCard(false);
            },
            run() {
                ballot
                    .fadeInCandidates()
                    .duration(1000)
                    .delay(100);
            }
        },

        // Shuffle the order of candidates
        s2: {
            text: [
                'The candidates are put onto the ballot paper in a random order.',
                'This randomised ballot draw is performed after the deadline for nominations has passed.'
            ],
            setup() {
                ballot.withCard(false);
            },
            run() {
                ballot
                    .randomise(3)
                    .duration(1000);
            }
        },

        // Re-position candidates to account for ballot card
        s3: {
            text: [
                'On election day, you will be presented with a green ballot paper for the House of Representatives.'
            ],
            run() {
                ballot
                    .withCard(true)
                    .showCard(false)
                    .duration(1000);
            }
        },

        // Show the full ballot card
        s4: {
            setup() {
                ballot
                    .withCard(true)
                    .showCard(false)
                    .votes([0, 0, 0, 0]);
            },
            run() {
                ballot
                    .showCard(true)
                    .fadeInCard()
                    .duration(500);
            }
        },

        // Add some votes
        s5: {
            text: [
                'To vote, number the boxes. All of them.'
            ],
            setup() {
                ballot.showCard(true);
            },
            run() {
                ballot
                    .fadeInVotes()
                    .duration(1000)
                    .delay(400)
                    .votes([2, 1, 4, 3]);
            }
        },

        getText(stepNum) {
            stepNum = +stepNum || 0;
            let step;
            while (stepNum > 0 && (step = steps['s' + stepNum])) {
                if (step.text) {
                    return step.text;
                }
                stepNum--;
            }
            return '';
        },

        run(stepNum) {
            let key = 's' + stepNum;
            let step = steps[key];
            if (step) {
                ballot.duration(0).delay(0);
                if (step.setup) {
                    step.setup();
                }
                let text = steps.getText(stepNum);
                if (text) {
                    details.html(text.map(t => `<p>${t}</p>`).join(''));
                }
                // TODO: Allow jumping directly to steps with a pre-render,
                //       but for now just assume the steps are run in order.
                // return ballot.render().then(function () {
                //     step.run();
                //     return ballot.render();
                // });
                step.run();
                return ballot.render();
            }
        },

        test() {
            function pause(time) {
                return function () {
                    return new Promise(function (resolve) {
                        setTimeout(resolve, time);
                    });
                }
            }

            return [
                steps.run.bind(steps, 1),
                pause(500),
                steps.run.bind(steps, 2),
                pause(500),
                steps.run.bind(steps, 3),
                pause(500),
                steps.run.bind(steps, 4),
                pause(200),
                steps.run.bind(steps, 5),
            ].reduce((prev, cur) => prev.then(cur), Promise.resolve());
        }
    };

    steps.test();

    exports.ballot = ballot;
    exports.bsteps = steps;

})(this);
