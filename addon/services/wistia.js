import Ember from 'ember';

const {
  Service,
  get,
  run: { later },
  set
} = Ember;

export default Service.extend({
  currentlyPlaying: null,
  isScriptInserted: false,

  addVideo(matcher, userEmail = null) {
    window._wq = window._wq || [];

    window._wq.push({
      [matcher]: (video) => {
        video.bind('pause', () => {
          this.clearCurrentlyPlaying(video);
        });
        video.bind('play', () => {
          this.setCurrentlyPlaying(video);
          this.setAutoPausing(video);
          this.maybeRecordEmail(video, userEmail);
        });
      }
    });
  },

  bindVideoEvent() {
    const arity = arguments.length;
    later(this, () => {
      if (arity === 3) {
        this._bindWithTwoParams(...arguments);
      } else if (arity === 4) {
        this._bindWithThreeParams(...arguments)
      } else {
        this._bindVideoEvent(...arguments);
      }
    }, 500);
  },

  _bindVideoEvent(matcher, bindingEvent, callback) {
    const video = window.Wistia.api(matcher);
    video.bind(bindingEvent, callback);
  },

  _bindWithTwoParams(matcher, bindingEvent, param, callback) {
    const video = window.Wistia.api(videoId);
    const time = video.duration() * 0.7;
    video.bind(bindingEvent, param, callback);
  },

  _bindWithThreeParams(matcher, bindingEvent, first_param, second_param, callback) {
    const video = window.Wistia.api(videoId);
    const time = video.duration() * 0.7;
    video.bind(bindingEvent, first_param, second_param, callback);
  },

  clearCurrentlyPlaying(video) {
    const hashedId = video.hashedId();
    if (get(this, 'currentlyPlaying') === hashedId) {
      set(this, 'currentlyPlaying', null);
    }
  },

  enableScript() {
    const isScriptInserted = get(this, 'isScriptInserted');
    //
    // if (!isScriptInserted) {
    //   set(this, 'isScriptInserted', true);
    //   injectScript('https://fast.wistia.com/assets/external/E-v1.js');
    // }
  },

  getCurrentlyPlaying() {
    return get(this, 'currentlyPlaying');
  },

  maybeRecordEmail(video, userEmail) {
    if (userEmail) {
      video.email(userEmail);
    }
  },

  setAutoPausing(current) {
    const allVideos = window.Wistia.api.all();
    allVideos.forEach((video) => {
      if (video.hashedId() !== current.hashedId()) {
        video.pause();
      }
    });
  },

  setCurrentlyPlaying(video) {
    const hashedId = video.hashedId();
    set(this, 'currentlyPlaying', hashedId);
  }
});
