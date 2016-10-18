import { moduleFor, test } from 'ember-qunit';
import sinon from 'sinon';
import Ember from 'ember';

const { get } = Ember;

let sandbox;

moduleFor('service:wistia', 'Unit | Service | wistia', {
  beforeEach() {
    sandbox = sinon.sandbox.create();

    window._wq =  [];

    sandbox.stub(window._wq, 'push', (object) => {
      window._wq.pushObject(object);
    });
  },

  afterEach() {
    sandbox.restore();
  }
});

test('#addVideo pushes video hash to Wistia window object', function(assert) {
  assert.expect(2);
  const service = this.subject();

  assert.equal(window._wq.length, 0, 'no videos added');

  const video = { hash: 'abc123' };
  service.addVideo(video);

  assert.equal(window._wq.length, 1, 'video was added');
});

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

  assert.equal(get(service, 'currentlyPlaying'), 'abc123', 'video is set');
});
