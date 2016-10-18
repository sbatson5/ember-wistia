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

## Styling
There is no styling set up by default for this component.
However, there are a few classes you can easily leverage to style

`is-playing` is a class applied to any video that is currently playing.
This can be useful for when you have a page with multiple videos and wish to highlight the current one.

`wistia-embed` is the class applied to the div wrapper for the wistia video.
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
You can see the video being run by running `ember s`.
You can also vide examples by visiting [Society of Grownups](https://www.societyofgrownups.com/online-classes).

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
