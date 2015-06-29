(function(window) {
  'use strict';

  /* global Bnd */
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
      'input[type="text"]': 'placeholder'
    },
    owner: {
      'sup, div.footer': 'textContent'
    },
    desc: {
      'body p': 'innerHTML'
    },
    editingDisabled: {
      'input[type="text"]': 'disabled'
    }
  }, function(self) {
    self.on('click', 'h1', evt => alert(evt.target.textContent));
    self.on('keyup', 'input', (evt, self) => self.title = evt.target.value);
    self.on('change', 'input[type="checkbox"]',
      (evt, self) => self.editingDisabled = evt.target.checked);

    self.def('desc', {
      get: window.hello.getDesc,
      set: window.hello.setDesc
    });

    let editingDisabled = false;
    self.def('editingDisabled', {
      get: () => editingDisabled,
      set: val => editingDisabled = val
    });
  });

})(this);
