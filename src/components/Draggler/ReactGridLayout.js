"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require("lodash.isequal");

var _lodash2 = _interopRequireDefault(_lodash);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require("./utils");

var _GridItem = require("./GridItem");

var _GridItem2 = _interopRequireDefault(_GridItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var compactType = function compactType(props) {
  var _ref = props || {},
      verticalCompact = _ref.verticalCompact,
      compactType = _ref.compactType;

  return verticalCompact === false ? null : compactType;
};

var ReactGridLayout = function (_React$Component) {
  _inherits(ReactGridLayout, _React$Component);

  function ReactGridLayout(props, context) {
    _classCallCheck(this, ReactGridLayout);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _initialiseProps.call(_this);

    (0, _utils.autoBindHandlers)(_this, ["onDragStart", "onDrag", "onDragStop", "onResizeStart", "onResize", "onResizeStop"]);
    return _this;
  }

  ReactGridLayout.prototype.componentDidMount = function componentDidMount() {
    this.setState({ mounted: true });
    this.onLayoutMaybeChanged(this.state.layout, this.props.layout);
  };

  ReactGridLayout.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
    var newLayoutBase = void 0;

    if (prevState.activeDrag) {
      return null;
    }

    if (!(0, _lodash2.default)(nextProps.layout, prevState.propsLayout) || nextProps.compactType !== prevState.compactType) {
      newLayoutBase = nextProps.layout;
    } else if (!(0, _utils.childrenEqual)(nextProps.children, prevState.children)) {
      newLayoutBase = prevState.layout;
    }

    if (newLayoutBase) {
      var newLayout = (0, _utils.synchronizeLayoutWithChildren)(newLayoutBase, nextProps.children, nextProps.cols, compactType(nextProps));

      return {
        layout: newLayout,
        compactType: nextProps.compactType,
        children: nextProps.children,
        propsLayout: nextProps.layout
      };
    }

    return null;
  };

  ReactGridLayout.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (!this.state.activeDrag) {
      var newLayout = this.state.layout;
      var _oldLayout = prevState.layout;

      this.onLayoutMaybeChanged(newLayout, _oldLayout);
    }
  };
  ReactGridLayout.prototype.containerHeight = function containerHeight() {
    if (!this.props.autoSize) return;
    var nbRow = (0, _utils.bottom)(this.state.layout);
    var containerPaddingY = this.props.containerPadding ? this.props.containerPadding[1] : this.props.margin[1];
    return nbRow * this.props.rowHeight + (nbRow - 1) * this.props.margin[1] + containerPaddingY * 2 + "px";
  };

  ReactGridLayout.prototype.onDragStart = function onDragStart(i, x, y, _ref2) {
    var e = _ref2.e,
        node = _ref2.node;
    var layout = this.state.layout;

    var l = (0, _utils.getLayoutItem)(layout, i);
    if (!l) return;

    this.setState({
      oldDragItem: (0, _utils.cloneLayoutItem)(l),
      oldLayout: this.state.layout
    });

    return this.props.onDragStart(layout, l, l, null, e, node);
  };

  ReactGridLayout.prototype.onDrag = function onDrag(i, x, y, _ref3) {
    var e = _ref3.e,
        node = _ref3.node;
    var oldDragItem = this.state.oldDragItem;
    var layout = this.state.layout;
    var cols = this.props.cols;

    var l = (0, _utils.getLayoutItem)(layout, i);
    if (!l) return;

    var placeholder = {
      w: l.w,
      h: l.h,
      x: l.x,
      y: l.y,
      placeholder: true,
      i: i
    };

    var isUserAction = true;
    layout = (0, _utils.moveElement)(layout, l, x, y, isUserAction, this.props.preventCollision, compactType(this.props), cols);

    this.props.onDrag(layout, oldDragItem, l, placeholder, e, node);

    this.setState({
      layout: (0, _utils.compact)(layout, compactType(this.props), cols),
      activeDrag: placeholder
    });
  };

  ReactGridLayout.prototype.onDragStop = function onDragStop(i, x, y, _ref4) {
    var e = _ref4.e,
        node = _ref4.node;
    var oldDragItem = this.state.oldDragItem;
    var layout = this.state.layout;
    var _props = this.props,
        cols = _props.cols,
        preventCollision = _props.preventCollision;

    var l = (0, _utils.getLayoutItem)(layout, i);
    if (!l) return;

    var isUserAction = true;
    layout = (0, _utils.moveElement)(layout, l, x, y, isUserAction, preventCollision, compactType(this.props), cols);

    this.props.onDragStop(layout, oldDragItem, l, null, e, node);

    var newLayout = (0, _utils.compact)(layout, compactType(this.props), cols);
    var oldLayout = this.state.oldLayout;

    this.setState({
      activeDrag: null,
      layout: newLayout,
      oldDragItem: null,
      oldLayout: null
    });

    this.onLayoutMaybeChanged(newLayout, oldLayout);
  };

  ReactGridLayout.prototype.onLayoutMaybeChanged = function onLayoutMaybeChanged(newLayout, oldLayout) {
    if (!oldLayout) oldLayout = this.state.layout;

    if (!(0, _lodash2.default)(oldLayout, newLayout)) {
      this.props.onLayoutChange(newLayout);
    }
  };

  ReactGridLayout.prototype.onResizeStart = function onResizeStart(i, w, h, _ref5) {
    var e = _ref5.e,
        node = _ref5.node;
    var layout = this.state.layout;

    var l = (0, _utils.getLayoutItem)(layout, i);
    if (!l) return;

    this.setState({
      oldResizeItem: (0, _utils.cloneLayoutItem)(l),
      oldLayout: this.state.layout
    });

    this.props.onResizeStart(layout, l, l, null, e, node);
  };

  ReactGridLayout.prototype.onResize = function onResize(i, w, h, _ref6) {
    var e = _ref6.e,
        node = _ref6.node;
    var _state = this.state,
        layout = _state.layout,
        oldResizeItem = _state.oldResizeItem;
    var _props2 = this.props,
        cols = _props2.cols,
        preventCollision = _props2.preventCollision;

    var l = (0, _utils.getLayoutItem)(layout, i);
    if (!l) return;

    var hasCollisions = void 0;
    if (preventCollision) {
      var collisions = (0, _utils.getAllCollisions)(layout, _extends({}, l, { w: w, h: h })).filter(function (layoutItem) {
        return layoutItem.i !== l.i;
      });
      hasCollisions = collisions.length > 0;

      if (hasCollisions) {
        var leastX = Infinity,
            leastY = Infinity;
        collisions.forEach(function (layoutItem) {
          if (layoutItem.x > l.x) leastX = Math.min(leastX, layoutItem.x);
          if (layoutItem.y > l.y) leastY = Math.min(leastY, layoutItem.y);
        });

        if (Number.isFinite(leastX)) l.w = leastX - l.x;
        if (Number.isFinite(leastY)) l.h = leastY - l.y;
      }
    }

    if (!hasCollisions) {
      l.w = w;
      l.h = h;
    }

    var placeholder = {
      w: l.w,
      h: l.h,
      x: l.x,
      y: l.y,
      static: true,
      i: i
    };

    this.props.onResize(layout, oldResizeItem, l, placeholder, e, node);

    this.setState({
      layout: (0, _utils.compact)(layout, compactType(this.props), cols),
      activeDrag: placeholder
    });
  };

  ReactGridLayout.prototype.onResizeStop = function onResizeStop(i, w, h, _ref7) {
    var e = _ref7.e,
        node = _ref7.node;
    var _state2 = this.state,
        layout = _state2.layout,
        oldResizeItem = _state2.oldResizeItem;
    var cols = this.props.cols;

    var l = (0, _utils.getLayoutItem)(layout, i);

    this.props.onResizeStop(layout, oldResizeItem, l, null, e, node);
    var newLayout = (0, _utils.compact)(layout, compactType(this.props), cols);
    var oldLayout = this.state.oldLayout;

    this.setState({
      activeDrag: null,
      layout: newLayout,
      oldResizeItem: null,
      oldLayout: null
    });

    this.onLayoutMaybeChanged(newLayout, oldLayout);
  };

  ReactGridLayout.prototype.placeholder = function placeholder() {
    var activeDrag = this.state.activeDrag;

    if (!activeDrag) return null;
    var _props3 = this.props,
        width = _props3.width,
        cols = _props3.cols,
        margin = _props3.margin,
        containerPadding = _props3.containerPadding,
        rowHeight = _props3.rowHeight,
        maxRows = _props3.maxRows,
        useCSSTransforms = _props3.useCSSTransforms,
        transformScale = _props3.transformScale;

    return _react2.default.createElement(
      _GridItem2.default,
      {
        w: activeDrag.w,
        h: activeDrag.h,
        x: activeDrag.x,
        y: activeDrag.y,
        i: activeDrag.i,
        className: "react-grid-placeholder",
        containerWidth: width,
        cols: cols,
        margin: margin,
        containerPadding: containerPadding || margin,
        maxRows: maxRows,
        rowHeight: rowHeight,
        isDraggable: false,
        isResizable: false,
        useCSSTransforms: useCSSTransforms,
        transformScale: transformScale
      },
      _react2.default.createElement("div", null)
    );
  };

  ReactGridLayout.prototype.processGridItem = function processGridItem(child, isDroppingItem) {
    if (!child || !child.key) return;
    var l = (0, _utils.getLayoutItem)(this.state.layout, String(child.key));
    if (!l) return null;
    var _props4 = this.props,
        width = _props4.width,
        cols = _props4.cols,
        margin = _props4.margin,
        containerPadding = _props4.containerPadding,
        rowHeight = _props4.rowHeight,
        maxRows = _props4.maxRows,
        isDraggable = _props4.isDraggable,
        isResizable = _props4.isResizable,
        useCSSTransforms = _props4.useCSSTransforms,
        transformScale = _props4.transformScale,
        draggableCancel = _props4.draggableCancel,
        draggableHandle = _props4.draggableHandle;
    var _state3 = this.state,
        mounted = _state3.mounted,
        droppingPosition = _state3.droppingPosition;

    var draggable = Boolean(!l.static && isDraggable && (l.isDraggable || l.isDraggable == null));
    var resizable = Boolean(!l.static && isResizable && (l.isResizable || l.isResizable == null));

    return _react2.default.createElement(
      _GridItem2.default,
      {
        containerWidth: width,
        cols: cols,
        margin: margin,
        containerPadding: containerPadding || margin,
        maxRows: maxRows,
        rowHeight: rowHeight,
        cancel: draggableCancel,
        handle: draggableHandle,
        onDragStop: this.onDragStop,
        onDragStart: this.onDragStart,
        onDrag: this.onDrag,
        onResizeStart: this.onResizeStart,
        onResize: this.onResize,
        onResizeStop: this.onResizeStop,
        isDraggable: draggable,
        isResizable: resizable,
        useCSSTransforms: useCSSTransforms && mounted,
        usePercentages: !mounted,
        transformScale: transformScale,
        w: l.w,
        h: l.h,
        x: l.x,
        y: l.y,
        i: l.i,
        minH: l.minH,
        minW: l.minW,
        maxH: l.maxH,
        maxW: l.maxW,
        "static": l.static,
        droppingPosition: isDroppingItem ? droppingPosition : undefined
      },
      child
    );
  };

  ReactGridLayout.prototype.render = function render() {
    var _this2 = this;

    var _props5 = this.props,
        className = _props5.className,
        style = _props5.style,
        isDroppable = _props5.isDroppable;


    var mergedClassName = (0, _classnames2.default)("react-grid-layout", className);
    var mergedStyle = _extends({
      height: this.containerHeight()
    }, style);

    return _react2.default.createElement(
      "div",
      {
        className: mergedClassName,
        style: mergedStyle,
        onDrop: isDroppable ? this.onDrop : _utils.noop,
        onDragOver: isDroppable ? this.onDragOver : _utils.noop
      },
      _react2.default.Children.map(this.props.children, function (child) {
        return _this2.processGridItem(child);
      }),
      isDroppable && this.state.droppingDOMNode && this.processGridItem(this.state.droppingDOMNode, true),
      this.placeholder()
    );
  };

  return ReactGridLayout;
}(_react2.default.Component);

ReactGridLayout.displayName = "ReactGridLayout";
ReactGridLayout.propTypes = {
  className: _propTypes2.default.string,
  style: _propTypes2.default.object,

  width: _propTypes2.default.number,
  autoSize: _propTypes2.default.bool,
  cols: _propTypes2.default.number,

  draggableCancel: _propTypes2.default.string,
  draggableHandle: _propTypes2.default.string,

  verticalCompact: function verticalCompact(props) {
    if (props.verticalCompact === false && process.env.NODE_ENV !== "production") {
      console.warn(
      // eslint-disable-line no-console
      "`verticalCompact` on <ReactGridLayout> is deprecated and will be removed soon. " + 'Use `compactType`: "horizontal" | "vertical" | null.');
    }
  },
  compactType: _propTypes2.default.oneOf(["vertical", "horizontal"]),

  layout: function layout(props) {
    var layout = props.layout;
    if (layout === undefined) return;
    (0, _utils.validateLayout)(layout, "layout");
  },

  margin: _propTypes2.default.arrayOf(_propTypes2.default.number),
  containerPadding: _propTypes2.default.arrayOf(_propTypes2.default.number),
  rowHeight: _propTypes2.default.number,

  maxRows: _propTypes2.default.number,

  isDraggable: _propTypes2.default.bool,
  isResizable: _propTypes2.default.bool,
  preventCollision: _propTypes2.default.bool,
  useCSSTransforms: _propTypes2.default.bool,
  transformScale: _propTypes2.default.number,
  isDroppable: _propTypes2.default.bool,

  onLayoutChange: _propTypes2.default.func,

  onDragStart: _propTypes2.default.func,
  onDrag: _propTypes2.default.func,
  onDragStop: _propTypes2.default.func,
  onResizeStart: _propTypes2.default.func,
  onResize: _propTypes2.default.func,
  onResizeStop: _propTypes2.default.func,
  onDrop: _propTypes2.default.func,

  droppingItem: _propTypes2.default.shape({
    i: _propTypes2.default.string.isRequired,
    w: _propTypes2.default.number.isRequired,
    h: _propTypes2.default.number.isRequired
  }),

  children: function children(props, propName) {
    var children = props[propName];

    var keys = {};
    _react2.default.Children.forEach(children, function (child) {
      if (keys[child.key]) {
        throw new Error('Duplicate child key "' + child.key + '" found! This will cause problems in ReactGridLayout.');
      }
      keys[child.key] = true;
    });
  }
};
ReactGridLayout.defaultProps = {
  autoSize: true,
  cols: 12,
  className: "",
  style: {},
  draggableHandle: "",
  draggableCancel: "",
  containerPadding: null,
  rowHeight: 150,
  maxRows: Infinity, // infinite vertical growth
  layout: [],
  margin: [10, 10],
  isDraggable: true,
  isResizable: true,
  isDroppable: false,
  useCSSTransforms: true,
  transformScale: 1,
  verticalCompact: true,
  compactType: "vertical",
  preventCollision: false,
  droppingItem: {
    i: "__dropping-elem__",
    h: 1,
    w: 1
  },
  onLayoutChange: _utils.noop,
  onDragStart: _utils.noop,
  onDrag: _utils.noop,
  onDragStop: _utils.noop,
  onResizeStart: _utils.noop,
  onResize: _utils.noop,
  onResizeStop: _utils.noop,
  onDrop: _utils.noop
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.state = {
    activeDrag: null,
    layout: (0, _utils.synchronizeLayoutWithChildren)(this.props.layout, this.props.children, this.props.cols,
    compactType(this.props)),
    mounted: false,
    oldDragItem: null,
    oldLayout: null,
    oldResizeItem: null,
    droppingDOMNode: null,
    children: []
  };

  this.onDragOver = function (e) {
    var droppingItem = _this3.props.droppingItem;
    var layout = _this3.state.layout;
    var _e$nativeEvent = e.nativeEvent,
        layerX = _e$nativeEvent.layerX,
        layerY = _e$nativeEvent.layerY;

    var droppingPosition = { x: layerX, y: layerY, e: e };

    if (!_this3.state.droppingDOMNode) {
      _this3.setState({
        droppingDOMNode: _react2.default.createElement("div", { key: droppingItem.i }),
        droppingPosition: droppingPosition,
        layout: [].concat(layout, [_extends({}, droppingItem, {
          x: 0,
          y: 0,
          static: false,
          isDraggable: true
        })])
      });
    } else if (_this3.state.droppingPosition) {
      var shouldUpdatePosition = _this3.state.droppingPosition.x != layerX || _this3.state.droppingPosition.y != layerY;
      shouldUpdatePosition && _this3.setState({ droppingPosition: droppingPosition });
    }

    e.stopPropagation();
    e.preventDefault();
  };

  this.onDrop = function () {
    var _props6 = _this3.props,
        droppingItem = _props6.droppingItem,
        cols = _props6.cols;
    var layout = _this3.state.layout;

    var _ref8 = layout.find(function (l) {
      return l.i === droppingItem.i;
    }) || {},
        x = _ref8.x,
        y = _ref8.y,
        w = _ref8.w,
        h = _ref8.h;

    var newLayout = (0, _utils.compact)(layout.filter(function (l) {
      return l.i !== droppingItem.i;
    }), compactType(_this3.props), cols);

    _this3.setState({
      layout: newLayout,
      droppingDOMNode: null,
      activeDrag: null,
      droppingPosition: undefined
    });

    _this3.props.onDrop({ x: x, y: y, w: w, h: h });
  };
};

exports.default = ReactGridLayout;