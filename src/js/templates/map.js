window.dungeon = window.dungeon || {};
window.dungeon.templates = window.dungeon.templates || {};

window.dungeon.templates.map = function mapTemplate(mapSize, startPos, endPos) {
  'use strict';

  var map = document.createElement('ul');
  var mapWidth = mapSize.width;
  var mapHeight = mapSize.height;
  var rowNum;
  var colNum;
  var row;
  var col;
  var rowList;
  var startNode;
  var endNode;

  for (rowNum = 1; rowNum <= mapHeight; rowNum += 1) {
    row = document.createElement('li');
    row.classList.add('map-row-' + rowNum);
    rowList = document.createElement('ul');
    for (colNum = 1; colNum <= mapWidth; colNum += 1) {
      col = document.createElement('li');
      col.classList.add('terrain', 'terrain-grass', 'map-col', 'map-col-' + colNum);
      col.setAttribute('data-col', colNum.toString());
      col.setAttribute('data-row', rowNum.toString());
      rowList.appendChild(col);
    }
    row.appendChild(rowList);
    map.appendChild(row);
  }
  startNode = map.querySelectorAll('.map-row-' + startPos.row + ' .map-col-' + startPos.col)[0];
  endNode = map.querySelectorAll('.map-row-' + endPos.row + ' .map-col-' + endPos.col)[0];
  startNode.classList.add('terrain-start');
  startNode.classList.remove('terrain-grass');
  endNode.classList.add('terrain-end');
  endNode.classList.remove('terrain-grass');

  return map;
}
