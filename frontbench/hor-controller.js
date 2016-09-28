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
                'We start with a list of nominated candidates for an electorate.'
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
                'This randomised ballot draw is performed after nominations are no longer accepted.'
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
                'To vote, number all the boxes in order — in this case, from 1 to 4.',
                'You must number <em>all</em> the boxes correctly for your vote to count.'
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
                'This is an invalid vote (also known as an informal vote).',
                'Although the numbers are in the right order, not all the boxes have been filled in,' +
                ' so this vote will not be counted.',
                'In some Australian state elections, this would be enough, but for a Federal (i.e. Australia-wide)' +
                ' election you need to fill in <em>all</em> the boxes.'
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
                'This is also an invalid (informal) vote.',
                'All the boxes have been filled in, but the numbers are not counting up correctly from 1 to 4.',
                'It’s important to always double-check your vote to make sure you’ve filled it in correctly.',
                'If you do make a mistake, you can always ask for a new ballot paper to try again.'
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
                'A so-called “Donkey Vote” where the boxes are numbered in order from top to bottom.',
                'This is still counted as a valid vote, but is often a pattern used by voters who' +
                ' don’t care where their vote goes. There will be voters who genuinely want to direct' +
                ' their preferences this way, but it’s impossible to distinguish their votes from those' +
                ' who just number the boxes from top to bottom to get the voting process out of the way.',
                'The prevalence of “Donkey” voting results in candidates hoping to get the top ballot position' +
                ' in the random ballot draw, effectively giving them some “free” votes that they wouldn’t usually receive.',
                'TODO: LOOK UP THE ORIGIN OF THE TERM "DONKEY VOTE"',
                'TODO: FIND STATISTIC ANALYSIS OF DONKEY VOTING. DOES IT HAPPEN IN COUNTRIES WITHOUT COMPULSORY VOTING?'
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
                steps.run.bind(steps, 1),
                steps.run.bind(steps, 2),
                {
                    delay: 0,
                    run: steps.run.bind(steps, 3)
                },
                steps.run.bind(steps, 4),
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
