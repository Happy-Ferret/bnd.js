(function(window) {
  'use strict';

  /* jshint esnext:true, -W040 */

  const forEach = Array.prototype.forEach;

  function Bound(model, mapping, events) {
    const selectors = Object.create(null);

    function reflectChange(prop, val) {
      forEach.call(
        document.querySelectorAll(selectors[prop]),
        elem => elem.innerHTML = val);
    }

    function proxyProperty(prop) {
      const descriptor = mapping[prop];
      selectors[prop] = descriptor.selector ?
        descriptor.selector : descriptor;

      const get = descriptor.getter ?
        () => descriptor.getter.call(model) :
        () => model[prop];
      const set = descriptor.setter ?
        val => reflectChange(
          prop, descriptor.setter.call(model, val)) :
        val => reflectChange(
          prop, model[prop] = val);
      Object.defineProperty(this, prop, {get, set});

      reflectChange(prop, get());
    }

    Object.keys(mapping).forEach(proxyProperty.bind(this));
  }

  window.Bound = Bound;

})(this);
