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
        s1() {
            return ballot
                .withCard(false)
                .fadeInCandidates()
                .duration(1000)
                .delay(100)
                .render()
        },

        // Shuffle the order of candidates
        s2() {
            return ballot.randomise(3).render()
        },

        // Re-position candidates to account for ballot card
        s3() {
            return ballot
                .withCard(true)
                .showCard(false)
                .delay(0)
                .render()
        },

        // Show the full ballot card
        s4() {
            return ballot
                .showCard(true)
                .fadeInCard()
                .duration(500)
                .render()
        },

        // Add some votes
        s5() {
            return ballot
                .fadeInVotes()
                .duration(1000)
                .delay(400)
                .votes([2, 1, 4, 3])
                .render()
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
                steps.s1,
                pause(500),
                steps.s2,
                pause(1000),
                steps.s3,
                pause(1000),
                steps.s4,
                pause(1000),
                steps.s5,
            ].reduce((prev, cur) => prev.then ? prev.then(cur) : prev())
        }
    };

    steps.test();

    exports.ballot = ballot;
    exports.bSteps = steps;

})(this);
