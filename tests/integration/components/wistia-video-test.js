import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

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

  const videoDiv = this.$().find('.wistia_embed:eq(0)');
  assert.ok(videoDiv.hasClass('wistia_async_scottIsAwesome'), 'async class is added');
});

test('`videoInitialize` method is fired once component renders', function(assert) {
  assert.expect(1);

  this.set('videoInitialize', () => {
    assert.ok(true, 'initialize function is called');
  });

  this.render(hbs`{{wistia-video matcher="scottIsAwesome" videoInitialize=videoInitialize}}`);
});
