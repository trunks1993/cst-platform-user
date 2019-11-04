"use strict";

exports.__esModule = true;
exports.noop = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.bottom = bottom;
exports.cloneLayout = cloneLayout;
exports.cloneLayoutItem = cloneLayoutItem;
exports.childrenEqual = childrenEqual;
exports.collides = collides;
exports.compact = compact;
exports.compactItem = compactItem;
exports.correctBounds = correctBounds;
exports.getLayoutItem = getLayoutItem;
exports.getFirstCollision = getFirstCollision;
exports.getAllCollisions = getAllCollisions;
exports.getStatics = getStatics;
exports.moveElement = moveElement;
exports.moveElementAwayFromCollision = moveElementAwayFromCollision;
exports.perc = perc;
exports.setTransform = setTransform;
exports.setTopLeft = setTopLeft;
exports.sortLayoutItems = sortLayoutItems;
exports.sortLayoutItemsByRowCol = sortLayoutItemsByRowCol;
exports.sortLayoutItemsByColRow = sortLayoutItemsByColRow;
exports.synchronizeLayoutWithChildren = synchronizeLayoutWithChildren;
exports.validateLayout = validateLayout;
exports.autoBindHandlers = autoBindHandlers;

var _lodash = require("lodash.isequal");

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isProduction = process.env.NODE_ENV === "production";
var DEBUG = false;

function bottom(layout) {
  var max = 0,
      bottomY = void 0;
  for (var _i = 0, len = layout.length; _i < len; _i++) {
    bottomY = layout[_i].y + layout[_i].h;
    if (bottomY > max) max = bottomY;
  }
  return max;
}

function cloneLayout(layout) {
  var newLayout = Array(layout.length);
  for (var _i2 = 0, len = layout.length; _i2 < len; _i2++) {
    newLayout[_i2] = cloneLayoutItem(layout[_i2]);
  }
  return newLayout;
}

function cloneLayoutItem(layoutItem) {
  return {
    w: layoutItem.w,
    h: layoutItem.h,
    x: layoutItem.x,
    y: layoutItem.y,
    i: layoutItem.i,
    minW: layoutItem.minW,
    maxW: layoutItem.maxW,
    minH: layoutItem.minH,
    maxH: layoutItem.maxH,
    moved: Boolean(layoutItem.moved),
    static: Boolean(layoutItem.static),
    // These can be null
    isDraggable: layoutItem.isDraggable,
    isResizable: layoutItem.isResizable
  };
}

function childrenEqual(a, b) {
  return (0, _lodash2.default)(_react2.default.Children.map(a, function (c) {
    return c.key;
  }), _react2.default.Children.map(b, function (c) {
    return c.key;
  }));
}

function collides(l1, l2) {
  if (l1.i === l2.i) return false; // same element
  if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
  if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
  if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
  if (l1.y >= l2.y + l2.h) return false; // l1 is below l2
  return true; // boxes overlap
}


function compact(layout, compactType, cols) {
  var compareWith = getStatics(layout);
  var sorted = sortLayoutItems(layout, compactType);
  var out = Array(layout.length);

  for (var _i3 = 0, len = sorted.length; _i3 < len; _i3++) {
    var l = cloneLayoutItem(sorted[_i3]);

    if (!l.static) {
      l = compactItem(compareWith, l, compactType, cols, sorted);

      compareWith.push(l);
    }

    out[layout.indexOf(sorted[_i3])] = l;

    l.moved = false;
  }

  return out;
}

var heightWidth = { x: "w", y: "h" };

function resolveCompactionCollision(layout, item, moveToCoord, axis) {
  var sizeProp = heightWidth[axis];
  item[axis] += 1;
  var itemIndex = layout.map(function (layoutItem) {
    return layoutItem.i;
  }).indexOf(item.i);

  for (var _i4 = itemIndex + 1; _i4 < layout.length; _i4++) {
    var otherItem = layout[_i4];
    if (otherItem.static) continue;
    if (otherItem.y > item.y + item.h) break;

    if (collides(item, otherItem)) {
      resolveCompactionCollision(layout, otherItem, moveToCoord + item[sizeProp], axis);
    }
  }

  item[axis] = moveToCoord;
}

function compactItem(compareWith, l, compactType, cols, fullLayout) {
  var compactV = compactType === "vertical";
  var compactH = compactType === "horizontal";
  if (compactV) {
    
    l.y = Math.min(bottom(compareWith), l.y);
    while (l.y > 0 && !getFirstCollision(compareWith, l)) {
      l.y--;
    }
  } else if (compactH) {
    l.y = Math.min(bottom(compareWith), l.y);
    while (l.x > 0 && !getFirstCollision(compareWith, l)) {
      l.x--;
    }
  }

  var collides = void 0;
  while (collides = getFirstCollision(compareWith, l)) {
    if (compactH) {
      resolveCompactionCollision(fullLayout, l, collides.x + collides.w, "x");
    } else {
      resolveCompactionCollision(fullLayout, l, collides.y + collides.h, "y");
    }
    if (compactH && l.x + l.w > cols) {
      l.x = cols - l.w;
      l.y++;
    }
  }
  return l;
}

function correctBounds(layout, bounds) {
  var collidesWith = getStatics(layout);
  for (var _i5 = 0, len = layout.length; _i5 < len; _i5++) {
    var l = layout[_i5];
    if (l.x + l.w > bounds.cols) l.x = bounds.cols - l.w;
    if (l.x < 0) {
      l.x = 0;
      l.w = bounds.cols;
    }
    if (!l.static) collidesWith.push(l);else {
      while (getFirstCollision(collidesWith, l)) {
        l.y++;
      }
    }
  }
  return layout;
}

function getLayoutItem(layout, id) {
  for (var _i6 = 0, len = layout.length; _i6 < len; _i6++) {
    if (layout[_i6].i === id) return layout[_i6];
  }
}

function getFirstCollision(layout, layoutItem) {
  for (var _i7 = 0, len = layout.length; _i7 < len; _i7++) {
    if (collides(layout[_i7], layoutItem)) return layout[_i7];
  }
}

function getAllCollisions(layout, layoutItem) {
  return layout.filter(function (l) {
    return collides(l, layoutItem);
  });
}

function getStatics(layout) {
  return layout.filter(function (l) {
    return l.static;
  });
}

function moveElement(layout, l, x, y, isUserAction, preventCollision, compactType, cols) {
  if (l.static) return layout;

  if (l.y === y && l.x === x) return layout;

  log("Moving element " + l.i + " to [" + String(x) + "," + String(y) + "] from [" + l.x + "," + l.y + "]");
  var oldX = l.x;
  var oldY = l.y;

  if (typeof x === "number") l.x = x;
  if (typeof y === "number") l.y = y;
  l.moved = true;

  var sorted = sortLayoutItems(layout, compactType);
  var movingUp = compactType === "vertical" && typeof y === "number" ? oldY >= y : compactType === "horizontal" && typeof x === "number" ? oldX >= x : false;
  if (movingUp) sorted = sorted.reverse();
  var collisions = getAllCollisions(sorted, l);

  if (preventCollision && collisions.length) {
    log("Collision prevented on " + l.i + ", reverting.");
    l.x = oldX;
    l.y = oldY;
    l.moved = false;
    return layout;
  }

  for (var _i8 = 0, len = collisions.length; _i8 < len; _i8++) {
    var collision = collisions[_i8];
    log("Resolving collision between " + l.i + " at [" + l.x + "," + l.y + "] and " + collision.i + " at [" + collision.x + "," + collision.y + "]");

    if (collision.moved) continue;

    if (collision.static) {
      layout = moveElementAwayFromCollision(layout, collision, l, isUserAction, compactType, cols);
    } else {
      layout = moveElementAwayFromCollision(layout, l, collision, isUserAction, compactType, cols);
    }
  }

  return layout;
}

function moveElementAwayFromCollision(layout, collidesWith, itemToMove, isUserAction, compactType, cols) {
  var compactH = compactType === "horizontal";
  var compactV = compactType !== "horizontal";
  var preventCollision = false; // we're already colliding

  if (isUserAction) {
    isUserAction = false;
    var fakeItem = {
      x: compactH ? Math.max(collidesWith.x - itemToMove.w, 0) : itemToMove.x,
      y: compactV ? Math.max(collidesWith.y - itemToMove.h, 0) : itemToMove.y,
      w: itemToMove.w,
      h: itemToMove.h,
      i: "-1"
    };

    if (!getFirstCollision(layout, fakeItem)) {
      log("Doing reverse collision on " + itemToMove.i + " up to [" + fakeItem.x + "," + fakeItem.y + "].");
      return moveElement(layout, itemToMove, compactH ? fakeItem.x : undefined, compactV ? fakeItem.y : undefined, isUserAction, preventCollision, compactType, cols);
    }
  }

  return moveElement(layout, itemToMove, compactH ? itemToMove.x + 1 : undefined, compactV ? itemToMove.y + 1 : undefined, isUserAction, preventCollision, compactType, cols);
}

function perc(num) {
  return num * 100 + "%";
}

function setTransform(_ref) {
  var top = _ref.top,
      left = _ref.left,
      width = _ref.width,
      height = _ref.height;
  var translate = "translate(" + left + "px," + top + "px)";
  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate,
    width: width + "px",
    height: height + "px",
    position: "absolute"
  };
}

function setTopLeft(_ref2) {
  var top = _ref2.top,
      left = _ref2.left,
      width = _ref2.width,
      height = _ref2.height;

  return {
    top: top + "px",
    left: left + "px",
    width: width + "px",
    height: height + "px",
    position: "absolute"
  };
}

function sortLayoutItems(layout, compactType) {
  if (compactType === "horizontal") return sortLayoutItemsByColRow(layout);else return sortLayoutItemsByRowCol(layout);
}

function sortLayoutItemsByRowCol(layout) {
  return [].concat(layout).sort(function (a, b) {
    if (a.y > b.y || a.y === b.y && a.x > b.x) {
      return 1;
    } else if (a.y === b.y && a.x === b.x) {
      return 0;
    }
    return -1;
  });
}

function sortLayoutItemsByColRow(layout) {
  return [].concat(layout).sort(function (a, b) {
    if (a.x > b.x || a.x === b.x && a.y > b.y) {
      return 1;
    }
    return -1;
  });
}

function synchronizeLayoutWithChildren(initialLayout, children, cols, compactType) {
  initialLayout = initialLayout || [];

  var layout = [];
  _react2.default.Children.forEach(children, function (child, i) {
    var exists = getLayoutItem(initialLayout, String(child.key));
    if (exists) {
      layout[i] = cloneLayoutItem(exists);
    } else {
      if (!isProduction && child.props._grid) {
        console.warn("`_grid` properties on children have been deprecated as of React 15.2. " + // eslint-disable-line
        "Please use `data-grid` or add your properties directly to the `layout`.");
      }
      var g = child.props["data-grid"] || child.props._grid;

      if (g) {
        if (!isProduction) {
          validateLayout([g], "ReactGridLayout.children");
        }
        layout[i] = cloneLayoutItem(_extends({}, g, { i: child.key }));
      } else {
        layout[i] = cloneLayoutItem({
          w: 1,
          h: 1,
          x: 0,
          y: bottom(layout),
          i: String(child.key)
        });
      }
    }
  });

  layout = correctBounds(layout, { cols: cols });
  layout = compact(layout, compactType, cols);

  return layout;
}

function validateLayout(layout) {
  var contextName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Layout";

  var subProps = ["x", "y", "w", "h"];
  if (!Array.isArray(layout)) throw new Error(contextName + " must be an array!");
  for (var _i9 = 0, len = layout.length; _i9 < len; _i9++) {
    var item = layout[_i9];
    for (var j = 0; j < subProps.length; j++) {
      if (typeof item[subProps[j]] !== "number") {
        throw new Error("ReactGridLayout: " + contextName + "[" + _i9 + "]." + subProps[j] + " must be a number!");
      }
    }
    if (item.i && typeof item.i !== "string") {
      throw new Error("ReactGridLayout: " + contextName + "[" + _i9 + "].i must be a string!");
    }
    if (item.static !== undefined && typeof item.static !== "boolean") {
      throw new Error("ReactGridLayout: " + contextName + "[" + _i9 + "].static must be a boolean!");
    }
  }
}

function autoBindHandlers(el, fns) {
  fns.forEach(function (key) {
    return el[key] = el[key].bind(el);
  });
}

function log() {
  var _console;

  if (!DEBUG) return;
  // eslint-disable-next-line no-console
  (_console = console).log.apply(_console, arguments);
}

var noop = exports.noop = function noop() {};