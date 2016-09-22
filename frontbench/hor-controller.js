(function (exports) {

    var candidates = [
        {name: 'PIMPERNEL, Scarlet', party: 'Reds'},
        {name: 'FIELDS, Clover', party: 'Greens'},
        {name: 'SCHWARTZ, Ebony', party: 'Blacks'},
        {name: 'ALMOND, Blanche', party: 'Whites'}
    ];

    var ballot = horBallot()
        .container('#hor-example')
        .candidates(candidates);

    var details = d3.select('#hor-example')
        .append('div')
        .attr('class', 'explanation-details');

    var ballotAnimator = animator();

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

        // Invalid votes — not all boxes numbered
        s6: {
            text: [
                'This is wrong. What are you doing?'
            ],
            setup() {
                ballot.showCard(true);
            },
            run() {
                ballot
                    .fadeInVotes()
                    .duration(1000)
                    .delay(100)
                    .votes([0, 1, 2, 0]);
            }
        },

        // Invalid votes — wrong numbers
        s7: {
            text: [
                'This is also wrong. Do you know how counting works?'
            ],
            setup() {
                ballot.showCard(true);
            },
            run() {
                ballot
                    .fadeInVotes()
                    .duration(1000)
                    .delay(100)
                    .votes([5, 3, 1, 7]);
            }
        },

        // Donkey vote
        s8: {
            text: [
                'A so-called “Donkey Vote”. It’s not invalid, just silly.'
            ],
            setup() {
                ballot.showCard(true);
            },
            run() {
                ballot
                    .fadeInVotes()
                    .duration(1000)
                    .delay(100)
                    .votes([1, 2, 3, 4]);
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
            ballotAnimator.steps([
                steps.run.bind(steps, 5),
                steps.run.bind(steps, 6),
                steps.run.bind(steps, 7),
                steps.run.bind(steps, 8),
            ]).play();
        }
    };

    steps.test();

    // TEMPORARY: For console testing only
    exports.ballot = ballot;
    exports.bsteps = steps;
    exports.banimator = ballotAnimator;

})(this);
