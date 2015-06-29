function Bnd(_model, _mapping, _events) {
  'use strict';

  function forEachMatching(sel, fn) {
    Array.prototype.forEach.call(
      document.querySelectorAll(sel), fn);
  }

  function reflectChange(prop, val) {
    const descriptor = _mapping[prop];
    Object.keys(descriptor).filter(
      sel => !sel.startsWith('__')).forEach(
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
    const descriptor = _mapping[prop];

    const get = descriptor.__get ?
      () => descriptor.__get.call(_model) :
      () => _model[prop];
    const set = descriptor.__set ?
      val => reflectChange(
        prop, descriptor.__set.call(_model, val)) :
      val => reflectChange(
        prop, _model[prop] = val);
    Object.defineProperty(this, prop, {get, set});

    reflectChange(prop, get());
  }

  function addEventListeners(key) {
    const [evtName, ...sel] = key.split(' ');
    forEachMatching(sel.join(' '), elem => elem.addEventListener(
      evtName, evt => _events[key](evt, this)));
  }

  Object.keys(_mapping).forEach(proxyProperty.bind(this));
  Object.keys(_events).forEach(addEventListeners.bind(this));
}
