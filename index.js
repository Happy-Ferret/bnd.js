(function(window) {
  'use strict';

  /* jshint esnext:true, -W040, -W093 */

  window.todo = {
    title: 'bnd.js',
    _desc: 'Create the world\'s tiniest two-way binding library.',
    getDesc: function() { return '<em>' + this._desc + '</em>'; },
    setDesc: function(val) { return this._desc = val; },
  };

  window.bound = new Bnd(window.todo, {
    title: 'h1',
    desc: {
      sel: 'p, div',
      get: todo.getDesc,
      set: todo.setDesc,
    }
  }, {
    'click h1': evt => alert(evt.target.textContent),
    'keyup input': (evt, self) => self.title = evt.target.value
  });

})(this);
