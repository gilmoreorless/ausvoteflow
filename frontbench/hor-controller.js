(function (exports) {

    var candidates = [
        {name: 'Scarlet PIMPERNEL', party: 'Reds'},
        {name: 'Clover FIELDS', party: 'Greens'},
        {name: 'Ebony SCHWARTZ', party: 'Blacks'},
        {name: 'Blanche ALMOND', party: 'Whites'}
    ];

    var ballot = horBallot()
        .container('#hor-example');

    ballot.candidates(candidates)
        .fadeIn()
        .duration(1000)
        .delay(100)
        .render()

    exports.ballot = ballot;

})(this);
