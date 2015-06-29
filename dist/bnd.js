'use strict';

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function Bnd(_model, _mapping, _events) {
  'use strict';

  /* jshint esnext:true, -W040 */

  var bndSelectors = Object.create(null);

  function forEachMatching(sel, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), fn);
  }

  function reflectChange(prop, val) {
    var sels = bndSelectors[prop];
    if (typeof sels === 'string') {
      forEachMatching(sels, function (elem) {
        return changeAttr(elem, 'textContent', val);
      });
    } else {
      Object.keys(sels).forEach(function (sel) {
        return forEachMatching(sel, function (elem) {
          return changeElement(elem, sels[sel], val);
        });
      });
    }
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
    bndSelectors[prop] = descriptor.sel || descriptor;

    var get = descriptor.get ? function () {
      return descriptor.get.call(_model);
    } : function () {
      return _model[prop];
    };
    var set = descriptor.set ? function (val) {
      return reflectChange(prop, descriptor.set.call(_model, val));
    } : function (val) {
      return reflectChange(prop, _model[prop] = val);
    };
    Object.defineProperty(this, prop, { get: get, set: set });

    reflectChange(prop, get());
  }

  function addEventListeners(key) {
    var _this = this;

    var _key$split = key.split(' ');

    var _key$split2 = _toArray(_key$split);

    var evtName = _key$split2[0];

    var sel = _key$split2.slice(1);

    forEachMatching(sel.join(' '), function (elem) {
      return elem.addEventListener(evtName, function (evt) {
        return _events[key](evt, _this);
      });
    });
  }

  Object.keys(_mapping).forEach(proxyProperty.bind(this));
  Object.keys(_events).forEach(addEventListeners.bind(this));
}