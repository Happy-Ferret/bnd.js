(function(window) {
  'use strict';

  /* jshint esnext:true, -W040 */

  window.todo = {
    title: 'Bound.js',
    desc: 'Create the world\'s tiniest two-way binding library'
  };

  window.bound = new Bound(window.todo, {
    title: 'h1',
    desc: 'p'
  }, {
    'click h1': evt => alert(evt.target),
    'change input': evt => this.title = evt.value
  });

})(this);
