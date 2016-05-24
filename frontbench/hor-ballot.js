/* global utils, d3 */
(function (exports) {

    /**
     * TODO: Switch to a D3-style chained API for everything. Get rid of "modes".
     */
    /*** EXAMPLE ***\/
    ballot.container('#example')
       // First state
       .candidates(['A','B','C','D'])
       .withCard(false)
       .fadeIn()
       .render()
       // Randomise candidate order
       .randomise().render()
       // Show ballot card
       .withCard(true).render()
       // Vote for candidates, fill slowly
       .vote([4,1,3,2]).delay(500).render()
       // Invalid card (votes missing)
       .vote([0,1,0,0]).delay(0).render()
       // Invalid card (not 1-4), fill quickly
       .vote([5,1,3,2]).delay(100).render()
       // "How to vote card"
       .attr('class', 'how-to-vote')
       .title('How to vote for Best Party')
       .highlight('C')
       .vote([4,2,1,3]).render()
    /*** END EXAMPLE ***/

    // TODO: Should .render() return a Promise?

    function ballot() {
        var bal = {},
            // Settable options
            container,
            candidates = [],
            votes = [],
            withCard = false,
            shouldFadeIn = false,
            transitionDelay = 0,
            transitionDuration = 0,
            // Internal references
            root, candidateNodes, voteBoxes, highlight;

        const FontSize = 20,
            LineHeight = FontSize * 1.5,
            UnstyledCandidateMargin = FontSize / 2,
            StyledCandidateMargin = LineHeight,
            VoteBoxWidth = FontSize * 2;

        /// GETTER / SETTER METHODS

        bal.container = function (elem) {
            if (!arguments.length) return container;
            container = d3.select(elem);
            root = container
                .append('svg')
                .attr('class', 'hor-ballot')
                .attr('width', '100%')
                .attr('height', 500)
            let style = d3.select('#hor-style');
            if (!style.size()) {
                style = root.append('style').attr('id', 'hor-style');
            }
            style.text(`.hor-candidate { font-size: ${FontSize}px; }`)
            return bal;
        }

        bal.candidates = function (c) {
            if (!arguments.length) return candidates;
            candidates = Array.from(c);
            return bal;
        }

        bal.votes = function (v) {
            if (!arguments.length) return votes;
            votes = Array.from(v);
            return bal;
        }

        bal.withCard = function (c) {
            if (!arguments.length) return withCard;
            withCard = !!c;
            return bal;
        }

        bal.delay = function (d) {
            if (!arguments.length) return transitionDelay;
            transitionDelay = +d || 0;
            return bal;
        }

        bal.duration = function (d) {
            if (!arguments.length) return transitionDuration;
            transitionDuration = +d || 0;
            return bal;
        }

        bal.attr = function (k, v) {
            if (arguments.length < 2) {
                return root ? root.attr(k) : undefined;
            }
            if (root) {
                root.attr(k, v);
            }
            return bal;
        }

        bal.title = function (t) {
            // TODO: Get/set visible title of ballot paper, like "How to vote for Party ABC"
        }

        /// WRITE-ONLY METHODS

        bal.randomise = function () {
            d3.shuffle(candidates);
            return bal;
        }

        bal.fadeIn = function () {
            shouldFadeIn = true;
            return bal;
        }

        bal.highlight = function () {
            // TODO
        }

        function setupNodes() {
            candidateNodes = root.selectAll('.hor-candidate')
                .data(candidates, d => d.name);
            let groups = candidateNodes.enter().append('g')
                .attr('class', 'hor-candidate')
            groups.append('text')
                .text(d => d.name)
                .attr('dy', '0.4em');
            groups.append('text')
                .text(d => d.party)
                .attr('dy', '0.4em')
                .attr('y', LineHeight);
        }

        function positionNoCard() {
            this.translate(0, (d, i) =>
                LineHeight / 2 + (i * LineHeight * 2) + (i * UnstyledCandidateMargin));
        }

        function positionWithCard() {
            this.translate(VoteBoxWidth + FontSize, (d, i) =>
                LineHeight + (i * LineHeight * 2) + (i * StyledCandidateMargin));
        }

        bal.render = function () {
            setupNodes();
            let nodes = candidateNodes;
            let positionFn = withCard ? positionWithCard : positionNoCard;

            if (shouldFadeIn) {
                nodes.style('opacity', 0)
                    .call(positionFn);
            }

            nodes = nodes.transition()
                .duration(transitionDuration)
            if (transitionDelay) {
                nodes.delay((d, i) => i * transitionDelay);
            }

            if (shouldFadeIn) {
                nodes.style('opacity', 1);
                shouldFadeIn = false;
            } else {
                nodes.call(positionFn);
            }

            return bal;
        }

        return bal;
    }

    exports.horBallot = ballot;

})(this);
