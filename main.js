(function () {
  'use strict';

  function matchCoordFor(colOrRow) {
    var regex = colOrRow === 'col' ? /map-col-(\d+)/ : /map-row-(\d+)/;

    return function (prev, curr) {
      if (prev) {
        return prev;
      }

      var matches = curr.match(regex);

      if (matches) {
        return matches[1];
      }
    };
  }

  function getCoords(node) {
    var colReduce = Array.prototype.reduce.bind(node.classList);
    var rowReduce = Array.prototype.reduce.bind(node.parentNode.parentNode.classList);
    var col = colReduce(matchCoordFor('col'), null);
    var row = rowReduce(matchCoordFor('row'), null);

    return {
      row: row,
      col: col
    };
  }

  function bindEvents() {
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('map-col')) {
        console.log(getCoords(e.target));
      }
    });
  }

  bindEvents();
}());
