import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('wistia-video', 'Integration | Component | wistia video', {
  integration: true
});

test('it has a css class prefixed with wistia_async', function(assert) {
  assert.expect(1);

  this.render(hbs`{{wistia-video matcher="scottIsAwesome"}}`);

  const videoDiv = this.$().find('.wistia_embed').eq(0);
  assert.ok(videoDiv.hasClass('wistia_async_scottIsAwesome'), 'async class is added');
});
