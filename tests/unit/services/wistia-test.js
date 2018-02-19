import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { get } from '@ember/object';
import Ember from 'ember';
import sinon from 'sinon';
import wait from 'ember-test-helpers/wait';

const { Logger } = Ember;

module('Unit | Service | wistia', function(hooks) {
  setupTest(hooks);

  test('#recordEmail tracks email and records tracking', function(assert) {
    assert.expect(1);
    let service = this.owner.lookup('service:wistia');
    let userEmail = 'test@scottisthebest.com';

    let video = {
      email(email) {
        return assert.equal(email, userEmail, 'email is passed to Wistia');
      }
    };

    service._maybeRecordEmail(video, userEmail);
  });

  test('#setCurrentlyPlaying updates currentlyPlaying property', function(assert) {
    assert.expect(2);
    let service = this.owner.lookup('service:wistia');
    assert.notOk(get(service, 'currentlyPlaying'), 'no video is currently playing');

    let video = {
      hashedId() {
        return 'abc123';
      }
    };
    service.setCurrentlyPlaying(video);

    assert.equal(get(service, 'currentlyPlaying'), 'abc123', 'video is set');
  });

  test('#getVideo stubs API for testing', function(assert) {
    assert.expect(2);
    let service = this.owner.lookup('service:wistia');

    service.getVideo('abc123').catch((error) => {
      assert.equal(error.msg, 'No video was found');
    });

    Logger.log = sinon.spy();
    return wait().then(() => {
      assert.ok(Logger.log.calledWith('This API is disabled in testing for: abc123'));
    });
  });
});
