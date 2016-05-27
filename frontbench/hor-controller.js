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
            ballot
                .withCard(false)
                .fadeInCandidates()
                .duration(1000)
                .delay(100)
                .render()
        },

        // Shuffle the order of candidates
        s2() {
            ballot.randomise(2).render()
        },

        // Re-position candidates to account for ballot card
        s3() {
            ballot
                .withCard(true)
                .showCard(false)
                .delay(0)
                .render()
        },

        // Show the full ballot card
        s4() {
            ballot
                .showCard(true)
                .fadeInCard()
                .duration(500)
                .render()
        },

        // Add some votes
        s5() {
            ballot
                .fadeInVotes()
                .duration(1000)
                .delay(400)
                .votes([2, 1, 4, 3])
                .render()
        },

        test() {
            console.log('render: candidates with no card')
            ballot.withCard(false)
                .duration(0).delay(0)
                .render()
            .then(pause(500))
            .then(() => {
                console.log('render: candidates positioned for card')
                return ballot.withCard(true)
                    .duration(500)
                    .render()
            }).then(pause(1000))
            .then(() => {
                console.log('render: card details')
                return ballot.showCard(true)
                    .duration(500)
                    .fadeInCard()
                    .render()
            }).then(pause(1000))
            .then(() => {
                console.log('render: votes')
                ballot.fadeInVotes()
                    .votes([1,2,0,3])
                    .delay(200)
                    .render()
            })
        }
    };

    steps.test();

    exports.ballot = ballot;
    exports.bSteps = steps;

/**
 * A simple Promise that just pauses execution for a given amount of milliseconds
 */
function pause(time) {
    return function () {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }
}

})(this);
