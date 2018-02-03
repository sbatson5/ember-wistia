import Ember from 'ember';

const { Controller, get, set } = Ember;

export default Controller.extend({
  originalMatcher: 'ndf5tllia5',
  newMatcher: '3a7rcvkcqd',

  init() {
    this._super(...arguments);
    set(this, 'matcher', get(this, 'originalMatcher'));
  },

  actions: {
    switchVideo() {
      let originalMatcher = get(this, 'originalMatcher');
      let newMatcher = get(this, 'newMatcher');
      let updatedMatcher = get(this, 'matcher') == originalMatcher ? newMatcher : originalMatcher;
      set(this, 'matcher', updatedMatcher);
    }
  }
});
