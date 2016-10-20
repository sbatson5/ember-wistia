# Ember-wistia
*Simple Ember addon for embedding wistia videos*

## Using this addon

This `ember-cli` addon is for embedding Wistia videos into your application through Wistia's public Javascript API.
First install:

```
ember install ember-wistia
```

## Example
You can see an example of ember-wistia videos at [Society of Grownups](https://www.societyofgrownups.com/online-classes).

## Usage
Out of the box, using `ember-wistia` should be very simple.
Simply use the `wistia-video` component, passing a Wistia `matcher`.
A `matcher` can be found at the end of the URL for your video--it is typically a 10 character alphanumeric code.

```handlebars
{{wistia-video matcher="123example"}}
```

If you want to leverage Wistia's tracking and log which user is viewing your content, you can pass in an email as well.

```handlebars
{{wistia-video matcher="123example" email="test@example.com"}}
```

## Leveraging the Wistia Service
This addon adds videos through an Ember Service.
The default component uses this service but it can be injected into other objects (such as Controllers).

```javascript
wistia: Ember.inject.service()
```

This will allow you to call the public methods on the Wistia service directly.

```javascript
// get the injected wistia service
let wistia = Ember.get(this, 'wistia');

// passes matcher to Wistia Service
wistia.addVideo('123example');

// optionally pass email
let email = 'test@example.com'
wistia.addVideo('123example', email);
```

### Binding Events
*Note*: that you must use the `addVideo` method if you are not using the default component--the service will not be able to find the video otherwise.
One of the best parts of Wistia's API is that you can bind functions to video events.
For example, you can run a function anytime the video is paused.

```javascript
// get the injected wistia service
let wistia = Ember.get(this, 'wistia');

let matcher = '123example';
wistia.bindVideoEvent(matcher, 'pause', () => { console.log('hi') });
```

The `bindVideoEvent` is flexible to handle any bind event found in the Wistia API documentation.
This means it can handle a variable number of parameters:

```javascript
// get the injected wistia service
let wistia = Ember.get(this, 'wistia');

let matcher = '123example';
// fire our function when the video is between 30 and 60 seconds
wistia.bindVideoEvent(matcher, 'betweentimes', 30, 60, () => { console.log('hi') });
```

### Accessing Video Properties
The Wistia Service added in this addon also allows you to fetch the video object created by Wistia.
This can be accessed through the `getVideo` method, which wrapped in an Ember Promise.
For example, if you want to get a video's duration:

```javascript
// get the injected wistia service
let wistia = Ember.get(this, 'wistia');

let matcher = '123example';
let duration;

// getVideo returns a video object
wistia.getVideo(matcher).then((video) => {
  duration = video.duration();
}).catch((error) => {
  // record a message or handle errors when no video is found
  console.log(error.msg);
});
```

For a list of methods that can be called from a Wistia video object, visit the Wistia Player API [Documentation on Methods](https://wistia.com/doc/player-api#methods).

### Building your own Wistia video component
If you find you need more functionality than what is available out of the box, you can create your own Wistia video component.
Rather than creating a component from scratch, it is recommended that you import the component offered by this addon and extend it.
You can see the functionality this component offers by [clicking here](https://github.com/sbatson5/ember-wistia/blob/master/addon/components/wistia-video.js).
If you want to bind video events, it is recommend that you do this in the `didRender` hook as Wistia will look for the matching `div`.
If the page hasn't rendered yet, Wistia may return an error.
Here is an example of extending the `wistia-video` component in your own app:

```javascript
import Ember from 'ember';
import WistiaComponent from 'ember-wistia/components/wistia-video';

export default WistiaComponent.extend({
  didRender() {
    this._super(...arguments);
    const wistia = Ember.get(this, 'wistia');
    const matcher = Ember.get(this, 'matcher');

    wistia.getVideo(matcher).then((video) => {
      // you now have access to the video object returned by Wistia
      video.bind('play', () => { console.log('video is playing!') });
      Ember.set(this, 'duration', video.duration());
    });
  }
});
```

Unless you want to add additional markup, you can safely delete the `template` for this component in your app.

*Note* the default component has no logic in the `didRender` hook by default, so overwriting is not a concern.
If you want to add logic to `init` or `didReceiveAttrs`, be sure to call `this._super(...arguments)` to ensure that the component goes through its normal lifecycle.


## Styling
There is no styling set up by default for this component.
However, there are a few classes you can easily leverage to style.

`is-playing` is a class applied to any video that is currently playing.
This can be useful for when you have a page with multiple videos and wish to highlight the current one.

`wistia_embed` is the class applied to the div wrapper for the wistia video.
To scale this video to its container, I recommend using this style:

```css
.wistia_embed {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
```

This is the style used in the dummy application.
You can see a video being run by running `ember s`.
You can also view some examples by visiting [Society of Grownups](https://www.societyofgrownups.com/online-classes).

## License
[MIT](LICENSE.md)

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
