(function (constants, map) {
  'use strict';

  var turns = 0;

  function incrementTurns() {
    turns += 1;
  }

  function bindEvents() {
    document.addEventListener('click', function (e) {
      var hero = document.querySelectorAll('.hero')[0];

      if (e.target.classList.contains('map-col')) {
        map.moveCharTowards(hero, e.target);
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
      else if (e.target.classList.contains('character')) {
        map.moveCharTowards(hero, e.target.parentNode);
        document.dispatchEvent(new CustomEvent('hero:endTurn'));
      }
    });
    document.addEventListener('hero:endTurn', function (e) {
      map.moveEnemies();
      incrementTurns();
      document.getElementsByClassName('info-turn-count')[0].innerHTML = turns;
    });
  }

  map.init();
  bindEvents();
}(window.dungeon.constants, window.dungeon.map));
