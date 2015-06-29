window.Bnd = (function() {
  'use strict';

  function Bnd(_model, _bindings, _presenter) {

    const _getters = {};
    const _setters = {};

    function reflectChange(prop, val) {
      const descriptor = _bindings[prop];
      Object.keys(descriptor).forEach(
        sel => forEachMatching(
          sel, elem => changeElement(elem, descriptor[sel], val)));
    }

    function changeElement(elem, attrs, val) {
      attrs.split(/,\s*/).forEach(attr => changeAttr(elem, attr, val));
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
      const get = () => _getters[prop] ?
        _getters[prop].call(_model) : _model[prop];
      const set = val => reflectChange(prop, _setters[prop] ?
        _setters[prop].call(_model, val) : _model[prop] = val);
      Object.defineProperty(this, prop, {get, set});

      reflectChange(prop, get());
    }

    this.define = function(prop, {get, set}) {
      if (get) _getters[prop] = get;
      if (set) _setters[prop] = set;
    };

    this.on = function(evtName, sel, handler) {
      forEachMatching(
        sel, elem => elem.addEventListener(
          evtName, evt => handler(evt, this)));
    };

    _presenter(this);
    Object.keys(_bindings).forEach(proxyProperty, this);

  }

  function forEachMatching(sel, fn) {
    Array.prototype.forEach.call(
      document.querySelectorAll(sel), fn);
  }

  return Bnd;

})();
