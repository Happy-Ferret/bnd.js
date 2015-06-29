(function(window) {
  'use strict';

  /* jshint esnext:true, -W040 */

  window.todo = {
    title: 'Hello'
  };

  window.bound = new Bound(window.todo, {
    title: 'p'
  }, {
    'click h1': evt => alert(evt.target),
    'change input': evt => this.title = evt.value
  });

})(this);
