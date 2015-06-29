(function(window) {
  'use strict';

  /* jshint esnext:true, -W040 */

  window.todo = {
    title: 'bnd.js',
    desc: 'Create the world\'s tiniest two-way binding library.',
    //getDesc: function() { return this.desc; },
    setDesc: function(val) { return this.desc = val; },
  };

  window.bound = bnd(window.todo, {
    title: 'h1',
    desc: {
      sel: 'p',
      //get: todo.getDesc,
      set: todo.setDesc,
    }
  }, {
    'click h1': evt => alert(evt.target),
    'change input': evt => this.title = evt.value
  });

})(this);
