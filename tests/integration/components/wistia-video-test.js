import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import Service from '@ember/service';
import { Promise } from 'rsvp';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

module('Integration | Component | wistia-video', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    let stubbedWistia = Service.extend({
      addVideo() {},
      getCurrentlyPlaying() {},
      getVideo: function() {
        return new Promise((resolve) => {
          resolve({});
        });
      }
    });
    this.owner.register('service:wistia', stubbedWistia);
  });

  test('it has a css class prefixed with wistia_async', async function(assert) {
    assert.expect(1);

    await render(hbs`{{wistia-video matcher="scottIsAwesome"}}`);

    let videoDiv = this.$().find('.wistia_embed:eq(0)');
    assert.ok(videoDiv.hasClass('wistia_async_scottIsAwesome'), 'async class is added');
  });

  test('`videoInitialize` method is fired once component renders', async function(assert) {
    assert.expect(1);

    this.set('videoInitialize', () => {
      assert.ok(true, 'initialize function is called');
    });

    await render(hbs`{{wistia-video matcher="scottIsAwesome" videoInitialize=videoInitialize}}`);
  });

  test('updating the `matcher` will rerender the wistia div', async function(assert) {
    assert.expect(4);
    this.set('matcher', 'abc123');

    await render(hbs`{{wistia-video matcher=matcher}}`);
    assert.ok(this.$('.wistia_embed:eq(0)').length, 'video hidden for remainder of run loop');
    assert.ok(this.$('.wistia_embed:eq(0)').hasClass('wistia_async_abc123'), 'async class is added');

    this.set('matcher', 'newvideo');
    assert.notOk(this.$('.wistia_embed:eq(0)').length, 'video hidden for remainder of run loop');
    return wait().then(() => {
      assert.ok(this.$('.wistia_embed:eq(0)').hasClass('wistia_async_newvideo'), 'async class is added');
    });
  });
});
