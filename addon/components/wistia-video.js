import Ember from 'ember';
import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { assert } from '@ember/debug';
import layout from '../templates/components/wistia-video';

const { Logger, } = Ember;

export default Component.extend({
  layout,
  matcher: null,
  email: null,
  wistia: service(),
  classNames: ['video-wrapper'],
  classNameBindings: ['isPlaying'],
  hideVideo: false,
  videoInitialize() {},

  isPlaying: computed('matcher', function() {
    let wistia = get(this, 'wistia');
    return wistia.getCurrentlyPlaying() === get(this, 'matcher');
  }),

  init() {
    this._super(...arguments);
    let wistia = get(this, 'wistia');
    let email = get(this, 'email');
    let matcher = get(this, 'matcher');
    set(this, 'currentMatcher', matcher);
    wistia.addVideo(matcher, email);
  },

  didReceiveAttrs() {
    assert('You have not passed in a Wistia matcher', get(this, 'matcher'));
    this._super(...arguments);
  },

  didUpdateAttrs() {
    let matcher = get(this, 'matcher');
    if (matcher !== get(this, 'currentMatcher')) {
      this._rerenderWistiaVideo(matcher);
    }
    this._super(...arguments);
  },

  didRender() {
    let videoInitialize = get(this, 'videoInitialize');
    let wistia = get(this, 'wistia');
    let matcher = get(this, 'matcher');

    wistia.getVideo(matcher).then((video) => {
      videoInitialize(video, matcher);
    }).catch((error) => {
      Logger.log(error.msg);
    });
  },

  _rerenderWistiaVideo(newMatcher) {
    set(this, 'currentMatcher', newMatcher);
    set(this, 'hideVideo', true);
    next(() => {
      set(this, 'hideVideo', false);
    });
  }
});
