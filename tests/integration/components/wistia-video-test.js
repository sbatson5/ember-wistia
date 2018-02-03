import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

const {
  Service,
  RSVP: { Promise }
} = Ember;

moduleForComponent('wistia-video', 'Integration | Component | wistia video', {
  integration: true,
  beforeEach() {
    const stubbedWistia = Service.extend({
      addVideo() {},
      getCurrentlyPlaying() {},
      getVideo: function() {
        return new Promise((resolve) => {
          resolve({});
        });
      }
    });
    this.register('service:wistia', stubbedWistia);
    this.inject.service('wistia', { as: 'wistia' });
  }
});

test('it has a css class prefixed with wistia_async', function(assert) {
  assert.expect(1);

  this.render(hbs`{{wistia-video matcher="scottIsAwesome"}}`);

  let videoDiv = this.$().find('.wistia_embed:eq(0)');
  assert.ok(videoDiv.hasClass('wistia_async_scottIsAwesome'), 'async class is added');
});

test('`videoInitialize` method is fired once component renders', function(assert) {
  assert.expect(1);

  this.set('videoInitialize', () => {
    assert.ok(true, 'initialize function is called');
  });

  this.render(hbs`{{wistia-video matcher="scottIsAwesome" videoInitialize=videoInitialize}}`);
});

test('updating the `matcher` will rerender the wistia div', function(assert) {
  assert.expect(4);
  this.set('matcher', 'abc123');

  this.render(hbs`{{wistia-video matcher=matcher}}`);
  assert.ok(this.$('.wistia_embed:eq(0)').length, 'video hidden for remainder of run loop');
  assert.ok(this.$('.wistia_embed:eq(0)').hasClass('wistia_async_abc123'), 'async class is added');

  this.set('matcher', 'newvideo');
  assert.notOk(this.$('.wistia_embed:eq(0)').length, 'video hidden for remainder of run loop');
  return wait().then(() => {
    assert.ok(this.$('.wistia_embed:eq(0)').hasClass('wistia_async_newvideo'), 'async class is added');
  });
});
