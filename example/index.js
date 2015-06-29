(function(window) {
  'use strict';

  /* jshint esnext:true, -W040, -W093 */

  window.hello = {
    title: 'bnd.js',
    _desc: 'A tiny two-way binding library.',
    owner: 'Staś Małolepszy',
    getDesc: function() { return '<em>' + this._desc + '</em>'; },
    setDesc: function(val) { return this._desc = val; },
  };

  window.bound = new Bnd(window.hello, {
    title: {
      'h1': 'textContent, title',
      'input': 'placeholder'
    },
    owner: {
      'sup, div.footer': 'textContent'
    },
    desc: {
      'body p': 'innerHTML',
      __get: hello.getDesc,
      __set: hello.setDesc,
    }
  }, {
    'click h1': evt => alert(evt.target.textContent),
    'keyup input': (evt, self) => self.title = evt.target.value
  });

})(this);
