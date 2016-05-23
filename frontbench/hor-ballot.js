/* global utils, d3 */
(function (exports) {

    function ballot() {
        var bal = {},
            // Settable options
            mode = ballot.MODE_UNSTYLED,
            candidates = [],
            container,
            // Internal references
            root, candidateNodes;

        const FONT_SIZE = 16,
            LINE_HEIGHT = FONT_SIZE * 1.5,
            UNSTYLED_CANDIDATE_MARGIN = FONT_SIZE / 2;

        bal.container = function (elem) {
            if (!arguments.length) return container;
            container = elem;
            root = d3.select(elem)
                .append('svg')
                .attr('class', 'hor-ballot')
                .attr('height', 300)
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
                .data(candidates);
            let groups = candidateNodes.enter().append('g')
                .attr('class', 'hor-candidate')
            groups.append('text')
                .text(d => d.name)
                .attr('dy', '0.4em');
            groups.append('text')
                .text(d => d.party)
                .attr('dy', '0.4em')
                .attr('y', LINE_HEIGHT);
            candidateNodes.style('opacity', 0);
        }

        bal.render = function () {
            setupNodes();
            candidateNodes
                .translate(0, (d, i) => LINE_HEIGHT / 2 + (i * LINE_HEIGHT * 2) + (i * UNSTYLED_CANDIDATE_MARGIN))
            .transition()
                .duration(1000)
                .delay((d, i) => i * 300)
                .style('opacity', 1);
            return bal;
        }

        return bal;
    }

    ballot.MODE_UNSTYLED = 'unstyled';
    ballot.MODE_STYLED = 'styled';

    exports.horBallot = ballot;

})(this);
