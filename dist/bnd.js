'use strict';

(function (window) {
  'use strict';

  function forEachMatching(sel, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), fn);
  }

  window.Bnd = function (_model, _mapping, _events) {

    function reflectChange(prop, val) {
      var descriptor = _mapping[prop];
      Object.keys(descriptor).filter(function (sel) {
        return !sel.startsWith('__');
      }).forEach(function (sel) {
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
      var descriptor = _mapping[prop];

      var get = descriptor.__get ? function () {
        return descriptor.__get.call(_model);
      } : function () {
        return _model[prop];
      };
      var set = descriptor.__set ? function (val) {
        return reflectChange(prop, descriptor.__set.call(_model, val));
      } : function (val) {
        return reflectChange(prop, _model[prop] = val);
      };
      Object.defineProperty(this, prop, { get: get, set: set });

      reflectChange(prop, get());
    }

    function addEventListeners(key) {
      var _this = this;

      var keyParts = key.split(' ');
      var evtName = keyParts.shift();
      var sel = keyParts.join(' ');

      forEachMatching(sel.join(' '), function (elem) {
        return elem.addEventListener(evtName, function (evt) {
          return _events[key](evt, _this);
        });
      });
    }

    Object.keys(_mapping).forEach(proxyProperty.bind(this));
    Object.keys(_events).forEach(addEventListeners.bind(this));
  };
})(window);