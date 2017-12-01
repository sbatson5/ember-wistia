# Ember-wistia
*Simple Ember addon for embedding wistia videos*

## Using this addon

This `ember-cli` addon is for embedding Wistia videos into your application through Wistia's public Javascript API.
First install:

```
ember install ember-wistia
```

## Example
You can see an example of ember-wistia videos at [Society of Grownups](https://www.societyofgrownups.com/courses).

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

Additionally, you can pass an action into the default component called `videoInitialize` that will be fired once the video has loaded.
This method returns the `video` object as well as the `matcher` passed in, allowing you to directly fire methods on the video object.
For example, we can define an action in our controller:

```javascript
// controller.js in your app
actions: {
  someAction(video, matcher) {
    video.bind('play', () => { console.log('Action fired') });
  }
}
```

You can then pass that in as a closure action into the component:

```handlebars
{{wistia-video matcher="123example" videoInitialize=(action "someAction")}}
```

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
You can also view some examples by visiting [Society of Grownups](https://www.societyofgrownups.com/courses).

## License
[MIT](LICENSE.md)

## Installation

* `git clone` this repository
* `npm install`

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
