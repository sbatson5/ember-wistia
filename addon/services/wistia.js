import Ember from 'ember';

const {
  Service,
  get,
  run: { later },
  set
} = Ember;

export default Service.extend({
  currentlyPlaying: null,

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

  bindVideoEvent(matcher, ...rest) {
    later(this, () => {
      const video = window.Wistia.api(matcher);
      video.bind(...rest);
    }, 500);
  },

  clearCurrentlyPlaying(video) {
    const hashedId = video.hashedId();
    if (get(this, 'currentlyPlaying') === hashedId) {
      set(this, 'currentlyPlaying', null);
    }
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
