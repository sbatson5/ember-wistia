import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

const { get } = Ember;

moduleFor('service:wistia', 'Unit | Service | wistia');

test('#recordEmail tracks email and records tracking', function(assert) {
  assert.expect(1);
  const service = this.subject();

  const video = {
    email(email) {
      return assert.equal(email, userEmail, 'email is passed to Wistia');
    }
  };

  const userEmail = 'test@scottisthebest.com';

  service.maybeRecordEmail(video, userEmail);
});

test('#setCurrentlyPlaying updates currentlyPlaying property', function(assert) {
  assert.expect(2);
  const service = this.subject();

  assert.notOk(get(service, 'currentlyPlaying'), 'no video is currently playing');

  const video = {
    hashedId() {
      return 'abc123';
    }
  };
  service.setCurrentlyPlaying(video);

  assert.equal(get(service, 'currentlyPlaying'), 'abssssc123', 'video is set');
});
