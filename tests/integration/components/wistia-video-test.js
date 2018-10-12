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

    assert.dom('.wistia_embed').hasClass('wistia_async_scottIsAwesome')
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
    assert.dom('.wistia_embed').exists();
    assert.dom('.wistia_embed').hasClass('wistia_async_abc123');

    this.set('matcher', 'newvideo');
    assert.dom('.wistia_embed').doesNotExist();
    return wait().then(() => {
      assert.dom('.wistia_embed').hasClass('wistia_async_newvideo', 'async class is added');
    });
  });
});
