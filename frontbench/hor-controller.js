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

    var steps = {
        // Initial state - fade in candidates one-by-one
        s1: {
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

        run(s) {
            let key = 's' + s;
            let step = steps[key];
            if (step) {
                ballot.duration(0).delay(0);
                if (step.setup) {
                    step.setup();
                }
                return ballot.render().then(function () {
                    step.run();
                    return ballot.render();
                });
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
            ].reduce((prev, cur) => prev.then ? prev.then(cur) : prev())
        }
    };

    steps.run(4);

    exports.ballot = ballot;
    exports.bsteps = steps;

})(this);
