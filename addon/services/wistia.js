import Ember from 'ember';
import Service from '@ember/service';
import { Promise } from 'rsvp';
import { get, set } from '@ember/object';
import { later } from '@ember/runloop';

const { Logger } = Ember;

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
          this._setAutoPausing(video);
          this._maybeRecordEmail(video, userEmail);
        });
      }
    });
  },

  bindVideoEvent(matcher, ...rest) {
    let Wistia = this._wistiaApi();
    later(this, () => {
      let video = Wistia.api(matcher);
      video.bind(...rest);
    }, 500);
  },

  clearCurrentlyPlaying(video) {
    let hashedId = video.hashedId();
    if (get(this, 'currentlyPlaying') === hashedId) {
      set(this, 'currentlyPlaying', null);
    }
  },

  getCurrentlyPlaying() {
    return get(this, 'currentlyPlaying');
  },

  getVideo(matcher) {
    let Wistia = this._wistiaApi();
    return new Promise(function(resolve, reject) {
      later(this, () => {
        let video = Wistia.api(matcher);
        if (video) {
          resolve(video);
        } else {
          reject({ msg: 'No video was found' });
        }
      }, 500);
    });
  },

  _maybeRecordEmail(video, userEmail) {
    if (userEmail) {
      video.email(userEmail);
    }
  },

  _setAutoPausing(current) {
    let allVideos = window.Wistia.api.all();
    allVideos.forEach((video) => {
      if (video.hashedId() !== current.hashedId()) {
        video.pause();
      }
    });
  },

  setCurrentlyPlaying(video) {
    let hashedId = video.hashedId();
    set(this, 'currentlyPlaying', hashedId);
  },

  _wistiaApi() {
    if (window.Wistia) {
      return window.Wistia;
    } else {
      return {
        api(matcher) {
          return Logger.log(`This API is disabled in testing for: ${matcher}`);
        }
      };
    }
  }
});
