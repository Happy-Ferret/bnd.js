function Bnd(model, mapping, events) {
  'use strict';

  /* jshint esnext:true, -W040 */

  const selectors = Object.create(null);

  function forEach(sel, fn) {
    Array.prototype.forEach.call(
      document.querySelectorAll(sel), fn);
  }

  function reflectChange(prop, val) {
    forEach(selectors[prop], elem => elem.innerHTML = val);
  }

  function proxyProperty(prop) {
    const descriptor = mapping[prop];
    selectors[prop] = descriptor.sel || descriptor;

    const get = descriptor.get ?
      () => descriptor.get.call(model) :
      () => model[prop];
    const set = descriptor.set ?
      val => reflectChange(
        prop, descriptor.set.call(model, val)) :
      val => reflectChange(
        prop, model[prop] = val);
    Object.defineProperty(this, prop, {get, set});

    reflectChange(prop, get());
  }

  function addEventListeners(key) {
    const [evtName, ...sel] = key.split(' ');
    forEach(sel.join(' '), elem => elem.addEventListener(
      evtName, evt => events[key](evt, this)));
  }

  Object.keys(mapping).forEach(proxyProperty.bind(this));
  Object.keys(events).forEach(addEventListeners.bind(this));
}
