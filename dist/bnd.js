'use strict';

window.Bnd = (function () {
  'use strict';

  function Bnd(_model, _bindings, _presenter) {

    var _getters = {};
    var _setters = {};

    function reflectChange(prop, val) {
      var descriptor = _bindings[prop];
      Object.keys(descriptor).forEach(function (sel) {
        return forEachMatching(sel, function (elem) {
          return changeElement(elem, descriptor[sel], val);
        });
      });
    }

    function changeElement(elem, attrs, val) {
      attrs.split(/,\s*/).forEach(function (attr) {
        return changeAttr(elem, attr, val);
      });
    }

    function changeAttr(elem, attr, val) {
      switch (attr) {
        case 'textContent':
        case 'innerHTML':
          elem[attr] = val;
          break;
        default:
          elem.setAttribute(attr, val);
      }
    }

    function proxyProperty(prop) {
      var get = function get() {
        return _getters[prop] ? _getters[prop].call(_model) : _model[prop];
      };
      var set = function set(val) {
        return reflectChange(prop, _setters[prop] ? _setters[prop].call(_model, val) : _model[prop] = val);
      };
      Object.defineProperty(this, prop, { get: get, set: set });

      reflectChange(prop, get());
    }

    this.define = function (prop, _ref) {
      var get = _ref.get;
      var set = _ref.set;

      if (get) _getters[prop] = get;
      if (set) _setters[prop] = set;
    };

    this.on = function (evtName, sel, handler) {
      var _this = this;

      forEachMatching(sel, function (elem) {
        return elem.addEventListener(evtName, function (evt) {
          return handler(evt, _this);
        });
      });
    };

    _presenter(this);
    Object.keys(_bindings).forEach(proxyProperty.bind(this));
  }

  function forEachMatching(sel, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), fn);
  }

  return Bnd;
})();