function Bnd(_model, _mapping, _events) {
  'use strict';

  /* jshint esnext:true, -W040 */

  const bndSelectors = Object.create(null);

  function forEachMatching(sel, fn) {
    Array.prototype.forEach.call(
      document.querySelectorAll(sel), fn);
  }

  function reflectChange(prop, val) {
    const sels = bndSelectors[prop];
    if (typeof sels === 'string') {
      forEachMatching(sels, elem => changeAttr(elem, 'textContent', val));
    } else {
      Object.keys(sels).forEach(
        sel => forEachMatching(
          sel, elem => changeElement(elem, sels[sel], val)));
    }
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
    bndSelectors[prop] = descriptor.sel || descriptor;

    const get = descriptor.get ?
      () => descriptor.get.call(_model) :
      () => _model[prop];
    const set = descriptor.set ?
      val => reflectChange(
        prop, descriptor.set.call(_model, val)) :
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
