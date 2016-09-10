window.dungeon = window.dungeon || {};

window.dungeon.ev = (function () {
  'use strict';

  return {
    subscribe: function (name, handler) {
      document.addEventListener(name, handler);
    },
    publish: function (name, detail) {
      document.dispatchEvent(new CustomEvent(name, { detail: detail }));
    }
  };
}());
