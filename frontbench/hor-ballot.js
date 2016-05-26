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
            nodes = {},
            highlight;

        const FontSize = 20,
            LineHeight = FontSize * 1.5,
            UnstyledCandidateMargin = FontSize / 2,
            StyledCandidateMargin = LineHeight,
            VoteBoxWidth = FontSize * 2;

        /// GETTER / SETTER METHODS

        bal.container = function (elem) {
            if (!arguments.length) return container;
            container = d3.select(elem);
            nodes.root = container.append('svg')
                .attr('class', 'hor-ballot')
                .attr('width', '100%')
                .attr('height', 500)
            let style = d3.select('#hor-style');
            if (!style.size()) {
                style = nodes.root.append('style').attr('id', 'hor-style');
            }
            style.text(`.hor-candidate { font-size: ${FontSize}px; }`);

            [
                ['root', 'candidatesRoot', 'hor-candidates'],
                ['root', 'cardRoot', 'hor-ballot-card'],
                ['cardRoot', 'cardHeader', 'hor-ballot-header'],
                ['cardRoot', 'voteBoxesRoot', 'hor-vote-boxes'],
            ].forEach(defs => {
                let [parent, prop, cssClass] = defs;
                nodes[prop] = nodes[parent].append('g').attr('class', cssClass);
            });
            // nodes.cardRoot.style('opacity', 0);
            nodes.cardBorder = nodes.cardRoot.append('rect')
                .attr('class', 'hor-ballot-border')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', '100%')
                .attr('height', '100%');

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

        bal.randomise = function (minChange) {
            if (!candidates.length) {
                return bal;
            }
            minChange = utils.clamp(+minChange || 0, 1, candidates.length);
            let hasChangedEnough = false;
            let orig = [...candidates];
            while (!hasChangedEnough) {
                d3.shuffle(candidates);
                let changed = candidates.filter((c, i) => c !== orig[i]);
                hasChangedEnough = changed.length >= minChange;
            }
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
            /**
             * LAYOUT:
             *
             * container
             * \- root (svg)
             *    |- candidatesRoot (g -> nodes.candidates)
             *    |  \- candidate (g)
             *    |     |- name (text)
             *    |     \- party (text)
             *    \- cardRoot (g)
             *       |- border (rect)
             *       |- header (g)
             *       |  |- logo (image)
             *       |  \- title (text)
             *       \- voteBoxesRoot (g -> nodes.voteBoxes)
             *          \- voteBox (g)
             *             |- box (rect)
             *             \- number (text)
             */

            nodes.candidates = nodes.candidatesRoot.selectAll('.hor-candidate')
                .data(candidates, d => d.name);
            let cgroups = nodes.candidates.enter().append('g')
                .attr('class', 'hor-candidate');
            cgroups.append('text')
                .text(d => d.name)
                .attr('dy', '0.35em');
            cgroups.append('text')
                .text(d => d.party)
                .attr('dy', '0.35em')
                .attr('y', LineHeight);

            nodes.voteBoxes = nodes.voteBoxesRoot.selectAll('.hor-vote-box')
                .data(paddedVotes());
            let vgroups = nodes.voteBoxes.enter().append('g')
                .attr('class', 'hor-vote-box');
            vgroups.append('rect')
                .attr('class', 'hor-vote-box-border')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', VoteBoxWidth)
                .attr('height', VoteBoxWidth);
            vgroups.append('text')
                .attr('class', 'hor-vote-box-text')
                .attr('x', VoteBoxWidth / 2)
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .attr('y', VoteBoxWidth / 2);
        }

        function paddedVotes() {
            let lenDiff = candidates.length - votes.length;
            // More candidates than votes
            if (lenDiff > 0) {
                return votes.concat(Array(lenDiff).fill(0));
            }
            // More votes than candidates
            if (lenDiff < 0) {
                return votes.slice(0, candidates.length);
            }
            // Juuuuust right
            return [...votes];
        }

        function positionNoCard() {
            this.translate(0, (d, i) =>
                LineHeight / 2 + (i * LineHeight * 2) + (i * UnstyledCandidateMargin));
        }

        function positionWithCard() {
            this.translate(VoteBoxWidth + FontSize, (d, i) =>
                LineHeight + (i * LineHeight * 2) + (i * StyledCandidateMargin));
        }

        function positionVoteBox() {
            this.translate(FontSize / 2, (d, i) =>
                LineHeight * .75 + (i * LineHeight * 2) + (i * StyledCandidateMargin));
        }

        bal.render = function () {
            setupNodes();
            let cands = nodes.candidates;
            let positionFn = withCard ? positionWithCard : positionNoCard;

            if (shouldFadeIn) {
                cands.style('opacity', 0)
                    .call(positionFn);
            }

            cands = cands.transition()
                .duration(transitionDuration)
            if (transitionDelay) {
                cands.delay((d, i) => i * transitionDelay);
            }

            if (shouldFadeIn) {
                cands.style('opacity', 1);
                shouldFadeIn = false;
            } else {
                cands.call(positionFn);
            }

            if (withCard) {
                nodes.voteBoxes
                    .call(positionVoteBox)
                .select('.hor-vote-box-text')
                    .text(d => d ? d : '')
            }
            nodes.cardRoot.style('opacity', +withCard);

            return bal;
        }

        return bal;
    }

    exports.horBallot = ballot;

})(this);
