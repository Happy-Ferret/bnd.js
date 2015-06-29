(function(window) {
  'use strict';

  /* jshint esnext:true, -W040 */

  function Bound(model, mapping, events) {
    function getProperty(prop) {
      return model[prop];
    }

    function setProperty(prop, val) {
      reflectChange(prop, model[prop] = val);
    }

    function reflectChange(prop, val) {
      Array.prototype.forEach.call(
        document.querySelectorAll(mapping[prop]),
        elem => elem.innerHTML = val);
    }

    function proxyProperty(prop) {
      reflectChange(prop, model[prop]);
      const get = () => getProperty(prop);
      const set = val => setProperty(prop, val);
      Object.defineProperty(this, prop, {get, set});
    }

    Object.keys(mapping).forEach(proxyProperty.bind(this));
  }

  window.Bound = Bound;

})(this);
