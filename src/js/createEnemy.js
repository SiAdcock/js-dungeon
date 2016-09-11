window.dungeon = window.dungeon || {};

window.dungeon.createEnemy = (function (pos, ev) {
  'use strict';

  return function createEnemy(options) {
    var enemyPos = {
      col: options.pos.col,
      row: options.pos.row
    };
    var aggroRange = options.aggroRange;
    var attackStrength = options.attackStrength;
    var name = options.name;
    var health = options.health;

    function getCoords() {
      return {
        col: enemyPos.col,
        row: enemyPos.row
      };
    }

    function setCoords(newPos) {
      enemyPos.col = newPos.col;
      enemyPos.row = newPos.row;
    }

    function getAggroRange() {
      return aggroRange;
    }

    function getAttackStrength() {
      return attackStrength;
    }

    function getName() {
      return name;
    }

    function getHealth() {
      return health;
    }

    function adjustHealthBy(amount) {
      health += amount;
    }

    function move(hero) {
      var enemyCoords = getCoords();
      var heroCoords = hero.getCoords();
      var vector = pos.getVector(enemyCoords, heroCoords);
      var potentialNextPos = pos.getNextPos(enemyCoords, vector);
      var nextPos;

      /**
       * TODO: this logic needs re-working. If hero moves toward enemy and lands
       * diagonally adjacent, enemy moves away!
       */
      // if enemy and hero are at the same position
      if (vector.x === 0 && vector.y === 0) {
        return;
      }
      // if hero is adjacent to enemy
      else if (Math.abs(vector.x) <= 1 && Math.abs(vector.y) <= 1) {
        // if enemy can attack hero
        if (potentialNextPos.row === heroCoords.row && potentialNextPos.col === heroCoords.col) {
          nextPos = potentialNextPos;
        }
        // if enemy can't attack (i.e. can't move diagonally), mirror the hero's vector
        else {
          nextPos = pos.getNextPos(getCoords(), hero.getLastVector());
        }
      }
      // if hero is within aggro range, move towards hero
      else if (Math.abs(vector.x) <= getAggroRange() && Math.abs(vector.y) <= getAggroRange()) {
        nextPos = potentialNextPos;
      }
      // hero is outside aggro range
      else {
        return;
      }
      setCoords(nextPos);
      ev.publish('enemy:move:end', { oldPos: enemyCoords, newPos: nextPos });
    }

    return {
      getCoords: getCoords,
      setCoords: setCoords,
      getName: getName,
      getAggroRange: getAggroRange,
      getAttackStrength: getAttackStrength,
      getHealth: getHealth,
      adjustHealthBy: adjustHealthBy,
      move: move
    };
  };
}(window.dungeon.pos, window.dungeon.ev));
