window.dungeon = window.dungeon || {};
window.dungeon.q = function (selector) {
  'use strict';

  var selection = document.querySelectorAll(selector);

  return Array.prototype.slice.call(selection);
};
