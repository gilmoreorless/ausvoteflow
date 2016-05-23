/* global utils, d3 */
(function (exports) {

    function ballot() {
        var bal = {},
            // Settable options
            mode = ballot.MODE_UNSTYLED,
            candidates = [],
            container,
            // Internal references
            hasRendered = false,
            root, candidateNodes;

        const FontSize = 20,
            LineHeight = FontSize * 1.5,
            UnstyledCandidateMargin = FontSize / 2,
            StyledCandidateMargin = LineHeight,
            VoteBoxWidth = FontSize * 2;

        bal.container = function (elem) {
            if (!arguments.length) return container;
            container = elem;
            root = d3.select(elem)
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

        bal.mode = function (m) {
            if (!arguments.length) return mode;
            mode = m;
            return bal;
        }

        bal.candidates = function (c) {
            if (!arguments.length) return candidates;
            candidates = Array.from(c);
            return bal;
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

        function positionUnstyled() {
            this.translate(0, (d, i) =>
                LineHeight / 2 + (i * LineHeight * 2) + (i * UnstyledCandidateMargin));
        }

        function positionStyled() {
            this.translate(VoteBoxWidth + FontSize, (d, i) =>
                LineHeight + (i * LineHeight * 2) + (i * StyledCandidateMargin));
        }

        function fadeIn() {
            candidateNodes
                .call(positionUnstyled)
                .style('opacity', 0)
            .transition()
                .duration(1000)
                .delay((d, i) => i * 300)
                .style('opacity', 1);
        }

        function renderUnstyled() {
            if (!hasRendered) {
                return fadeIn();
            }
            candidateNodes.transition()
                .duration(1000)
                .call(positionUnstyled)
        }

        function renderStyled() {
            candidateNodes
                .transition()
                .duration(700)
                .call(positionStyled)
        }

        bal.render = function () {
            setupNodes();
            if (mode === ballot.MODE_UNSTYLED) {
                renderUnstyled();
            }
            if (mode === ballot.MODE_STYLED) {
                renderStyled();
            }
            hasRendered = true;
            return bal;
        }

        bal.randomise = function () {
            d3.shuffle(candidates);
            return bal.render();
        }

        return bal;
    }

    ballot.MODE_UNSTYLED = 'unstyled';
    ballot.MODE_STYLED = 'styled';

    exports.horBallot = ballot;

})(this);
