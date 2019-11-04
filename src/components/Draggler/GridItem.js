"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDraggable = require("react-draggable");

var _reactResizable = require("react-resizable");

var _utils = require("./utils");

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridItem = function (_React$Component) {
  _inherits(GridItem, _React$Component);

  function GridItem() {
    var _temp, _this, _ret;

    _classCallCheck(this, GridItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      resizing: null,
      dragging: null,
      className: ""
    }, _this.onDragStart = function (e, _ref) {
      var node = _ref.node;

      if (!_this.props.onDragStart) return;

      var newPosition = { top: 0, left: 0 };

      // TODO: this wont work on nested parents
      var offsetParent = node.offsetParent;

      if (!offsetParent) return;
      var parentRect = offsetParent.getBoundingClientRect();
      var clientRect = node.getBoundingClientRect();
      var cLeft = clientRect.left / _this.props.transformScale;
      var pLeft = parentRect.left / _this.props.transformScale;
      var cTop = clientRect.top / _this.props.transformScale;
      var pTop = parentRect.top / _this.props.transformScale;
      newPosition.left = cLeft - pLeft + offsetParent.scrollLeft;
      newPosition.top = cTop - pTop + offsetParent.scrollTop;
      _this.setState({ dragging: newPosition });

      var _this$calcXY = _this.calcXY(newPosition.top, newPosition.left),
          x = _this$calcXY.x,
          y = _this$calcXY.y;

      return _this.props.onDragStart && _this.props.onDragStart.call(_this, _this.props.i, x, y, {
        e: e,
        node: node,
        newPosition: newPosition
      });
    }, _this.onDrag = function (e, _ref2) {
      var node = _ref2.node,
          deltaX = _ref2.deltaX,
          deltaY = _ref2.deltaY;

      if (!_this.props.onDrag) return;

      var newPosition = { top: 0, left: 0 };

      if (!_this.state.dragging) throw new Error("onDrag called before onDragStart.");
      newPosition.left = _this.state.dragging.left + deltaX;
      newPosition.top = _this.state.dragging.top + deltaY;
      _this.setState({ dragging: newPosition });

      var _this$calcXY2 = _this.calcXY(newPosition.top, newPosition.left),
          x = _this$calcXY2.x,
          y = _this$calcXY2.y;

      return _this.props.onDrag && _this.props.onDrag.call(_this, _this.props.i, x, y, {
        e: e,
        node: node,
        newPosition: newPosition
      });
    }, _this.onDragStop = function (e, _ref3) {
      var node = _ref3.node;

      if (!_this.props.onDragStop) return;

      var newPosition = { top: 0, left: 0 };

      if (!_this.state.dragging) throw new Error("onDragEnd called before onDragStart.");
      newPosition.left = _this.state.dragging.left;
      newPosition.top = _this.state.dragging.top;
      _this.setState({ dragging: null });

      var _this$calcXY3 = _this.calcXY(newPosition.top, newPosition.left),
          x = _this$calcXY3.x,
          y = _this$calcXY3.y;

      return _this.props.onDragStop && _this.props.onDragStop.call(_this, _this.props.i, x, y, {
        e: e,
        node: node,
        newPosition: newPosition
      });
    }, _this.onResizeStop = function (e, callbackData) {
      _this.onResizeHandler(e, callbackData, "onResizeStop");
    }, _this.onResizeStart = function (e, callbackData) {
      _this.onResizeHandler(e, callbackData, "onResizeStart");
    }, _this.onResize = function (e, callbackData) {
      _this.onResizeHandler(e, callbackData, "onResize");
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  GridItem.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.droppingPosition && prevProps.droppingPosition) {
      this.moveDroppingItem(prevProps);
    }
  };

  GridItem.prototype.moveDroppingItem = function moveDroppingItem(prevProps) {
    var droppingPosition = this.props.droppingPosition;
    var dragging = this.state.dragging;


    if (!droppingPosition || !prevProps.droppingPosition) {
      return;
    }

    if (!this.currentNode) {
      // eslint-disable-next-line react/no-find-dom-node
      this.currentNode = _reactDom2.default.findDOMNode(this);
    }

    var shouldDrag = dragging && droppingPosition.x !== prevProps.droppingPosition.x || droppingPosition.y !== prevProps.droppingPosition.y;

    if (!dragging) {
      this.onDragStart(droppingPosition.e, {
        node: this.currentNode,
        deltaX: droppingPosition.x,
        deltaY: droppingPosition.y
      });
    } else if (shouldDrag) {
      var deltaX = droppingPosition.x - dragging.left;
      var deltaY = droppingPosition.y - dragging.top;

      this.onDrag(droppingPosition.e, {
        node: this.currentNode,
        deltaX: deltaX,
        deltaY: deltaY
      });
    }
  };


  GridItem.prototype.calcColWidth = function calcColWidth() {
    var _props = this.props,
        margin = _props.margin,
        containerPadding = _props.containerPadding,
        containerWidth = _props.containerWidth,
        cols = _props.cols;

    return (containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols;
  };

  
  GridItem.prototype.calcPosition = function calcPosition(x, y, w, h, state) {
    var _props2 = this.props,
        margin = _props2.margin,
        containerPadding = _props2.containerPadding,
        rowHeight = _props2.rowHeight;

    var colWidth = this.calcColWidth();

    var out = {
      left: Math.round((colWidth + margin[0]) * x + containerPadding[0]),
      top: Math.round((rowHeight + margin[1]) * y + containerPadding[1]),
      
      width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * margin[0]),
      height: h === Infinity ? h : Math.round(rowHeight * h + Math.max(0, h - 1) * margin[1])
    };

    if (state && state.resizing) {
      out.width = Math.round(state.resizing.width);
      out.height = Math.round(state.resizing.height);
    }

    if (state && state.dragging) {
      out.top = Math.round(state.dragging.top);
      out.left = Math.round(state.dragging.left);
    }

    return out;
  };

  GridItem.prototype.calcXY = function calcXY(top, left) {
    var _props3 = this.props,
        margin = _props3.margin,
        cols = _props3.cols,
        rowHeight = _props3.rowHeight,
        w = _props3.w,
        h = _props3.h,
        maxRows = _props3.maxRows;

    var colWidth = this.calcColWidth();

   
    var x = Math.round((left - margin[0]) / (colWidth + margin[0]));
    var y = Math.round((top - margin[1]) / (rowHeight + margin[1]));

    // Capping
    x = Math.max(Math.min(x, cols - w), 0);
    y = Math.max(Math.min(y, maxRows - h), 0);

    return { x: x, y: y };
  };

  GridItem.prototype.calcWH = function calcWH(_ref4) {
    var height = _ref4.height,
        width = _ref4.width;
    var _props4 = this.props,
        margin = _props4.margin,
        maxRows = _props4.maxRows,
        cols = _props4.cols,
        rowHeight = _props4.rowHeight,
        x = _props4.x,
        y = _props4.y;

    var colWidth = this.calcColWidth();

   
    var w = Math.round((width + margin[0]) / (colWidth + margin[0]));
    var h = Math.round((height + margin[1]) / (rowHeight + margin[1]));

    w = Math.max(Math.min(w, cols - x), 0);
    h = Math.max(Math.min(h, maxRows - y), 0);
    return { w: w, h: h };
  };

  GridItem.prototype.createStyle = function createStyle(pos) {
    var _props5 = this.props,
        usePercentages = _props5.usePercentages,
        containerWidth = _props5.containerWidth,
        useCSSTransforms = _props5.useCSSTransforms;


    var style = void 0;
    if (useCSSTransforms) {
      style = (0, _utils.setTransform)(pos);
    } else {
      style = (0, _utils.setTopLeft)(pos);
      if (usePercentages) {
        style.left = (0, _utils.perc)(pos.left / containerWidth);
        style.width = (0, _utils.perc)(pos.width / containerWidth);
      }
    }

    return style;
  };

  GridItem.prototype.mixinDraggable = function mixinDraggable(child) {
    return _react2.default.createElement(
      _reactDraggable.DraggableCore,
      {
        onStart: this.onDragStart,
        onDrag: this.onDrag,
        onStop: this.onDragStop,
        handle: this.props.handle,
        cancel: ".react-resizable-handle" + (this.props.cancel ? "," + this.props.cancel : "")
      },
      child
    );
  };

  GridItem.prototype.mixinResizable = function mixinResizable(child, position) {
    var _props6 = this.props,
        cols = _props6.cols,
        x = _props6.x,
        minW = _props6.minW,
        minH = _props6.minH,
        maxW = _props6.maxW,
        maxH = _props6.maxH;

    var maxWidth = this.calcPosition(0, 0, cols - x, 0).width;
    var mins = this.calcPosition(0, 0, minW, minH);
    var maxes = this.calcPosition(0, 0, maxW, maxH);
    var minConstraints = [mins.width, mins.height];
    var maxConstraints = [Math.min(maxes.width, maxWidth), Math.min(maxes.height, Infinity)];
    return _react2.default.createElement(
      _reactResizable.Resizable,
      {
        width: position.width,
        height: position.height,
        minConstraints: minConstraints,
        maxConstraints: maxConstraints,
        onResizeStop: this.onResizeStop,
        onResizeStart: this.onResizeStart,
        onResize: this.onResize
      },
      child
    );
  };

  GridItem.prototype.onResizeHandler = function onResizeHandler(e, _ref5, handlerName) {
    var node = _ref5.node,
        size = _ref5.size;

    var handler = this.props[handlerName];
    if (!handler) return;
    var _props7 = this.props,
        cols = _props7.cols,
        x = _props7.x,
        i = _props7.i,
        maxW = _props7.maxW,
        minW = _props7.minW,
        maxH = _props7.maxH,
        minH = _props7.minH;

    var _calcWH = this.calcWH(size),
        w = _calcWH.w,
        h = _calcWH.h;

    w = Math.min(w, cols - x);
    w = Math.max(w, 1);

    w = Math.max(Math.min(w, maxW), minW);
    h = Math.max(Math.min(h, maxH), minH);

    this.setState({ resizing: handlerName === "onResizeStop" ? null : size });

    handler.call(this, i, w, h, { e: e, node: node, size: size });
  };

  GridItem.prototype.render = function render() {
    var _props8 = this.props,
        x = _props8.x,
        y = _props8.y,
        w = _props8.w,
        h = _props8.h,
        isDraggable = _props8.isDraggable,
        isResizable = _props8.isResizable,
        droppingPosition = _props8.droppingPosition,
        useCSSTransforms = _props8.useCSSTransforms;


    var pos = this.calcPosition(x, y, w, h, this.state);
    var child = _react2.default.Children.only(this.props.children);

    var newChild = _react2.default.cloneElement(child, {
      className: (0, _classnames2.default)("react-grid-item", child.props.className, this.props.className, {
        static: this.props.static,
        resizing: Boolean(this.state.resizing),
        "react-draggable": isDraggable,
        "react-draggable-dragging": Boolean(this.state.dragging),
        dropping: Boolean(droppingPosition),
        cssTransforms: useCSSTransforms
      }),
      style: _extends({}, this.props.style, child.props.style, this.createStyle(pos))
    });

    if (isResizable) newChild = this.mixinResizable(newChild, pos);

    if (isDraggable) newChild = this.mixinDraggable(newChild);

    return newChild;
  };

  return GridItem;
}(_react2.default.Component);

GridItem.propTypes = {
  children: _propTypes2.default.element,

  cols: _propTypes2.default.number.isRequired,
  containerWidth: _propTypes2.default.number.isRequired,
  rowHeight: _propTypes2.default.number.isRequired,
  margin: _propTypes2.default.array.isRequired,
  maxRows: _propTypes2.default.number.isRequired,
  containerPadding: _propTypes2.default.array.isRequired,

  x: _propTypes2.default.number.isRequired,
  y: _propTypes2.default.number.isRequired,
  w: _propTypes2.default.number.isRequired,
  h: _propTypes2.default.number.isRequired,

  minW: function minW(props, propName) {
    var value = props[propName];
    if (typeof value !== "number") return new Error("minWidth not Number");
    if (value > props.w || value > props.maxW) return new Error("minWidth larger than item width/maxWidth");
  },

  maxW: function maxW(props, propName) {
    var value = props[propName];
    if (typeof value !== "number") return new Error("maxWidth not Number");
    if (value < props.w || value < props.minW) return new Error("maxWidth smaller than item width/minWidth");
  },

  minH: function minH(props, propName) {
    var value = props[propName];
    if (typeof value !== "number") return new Error("minHeight not Number");
    if (value > props.h || value > props.maxH) return new Error("minHeight larger than item height/maxHeight");
  },

  maxH: function maxH(props, propName) {
    var value = props[propName];
    if (typeof value !== "number") return new Error("maxHeight not Number");
    if (value < props.h || value < props.minH) return new Error("maxHeight smaller than item height/minHeight");
  },

  i: _propTypes2.default.string.isRequired,

  onDragStop: _propTypes2.default.func,
  onDragStart: _propTypes2.default.func,
  onDrag: _propTypes2.default.func,
  onResizeStop: _propTypes2.default.func,
  onResizeStart: _propTypes2.default.func,
  onResize: _propTypes2.default.func,

  isDraggable: _propTypes2.default.bool.isRequired,
  isResizable: _propTypes2.default.bool.isRequired,
  static: _propTypes2.default.bool,

  useCSSTransforms: _propTypes2.default.bool.isRequired,
  transformScale: _propTypes2.default.number,

  className: _propTypes2.default.string,
  handle: _propTypes2.default.string,
  cancel: _propTypes2.default.string,
  droppingPosition: _propTypes2.default.shape({
    x: _propTypes2.default.number.isRequired,
    y: _propTypes2.default.number.isRequired
  })
};
GridItem.defaultProps = {
  className: "",
  cancel: "",
  handle: "",
  minH: 1,
  minW: 1,
  maxH: Infinity,
  maxW: Infinity,
  transformScale: 1
};
exports.default = GridItem;