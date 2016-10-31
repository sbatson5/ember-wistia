import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import sinon from 'sinon';
import wait from 'ember-test-helpers/wait';

const { Logger, get } = Ember;

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

  service._maybeRecordEmail(video, userEmail);
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

  assert.equal(get(service, 'currentlyPlaying'), 'abc123', 'video is set');
});

test('#getVideo stubs API for testing', function(assert) {
  assert.expect(2);
  const service = this.subject();

  service.getVideo('abc123').catch((error) => {
    assert.equal(error.msg, 'No video was found');
  });

  Logger.log = sinon.spy();
  return wait().then(() => {
    assert.ok(Logger.log.calledWith('This API is disabled in testing for: abc123'));
  });
});
