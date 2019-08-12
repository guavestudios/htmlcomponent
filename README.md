# htmlcomponent

A microlib that empowers you to reference a component in HTML.<br>
It does this by a common way to mark the components and with an interface to pass the dom and some options directly from HTML to JS.<br>
The basic function syntax works by default with multiple instances of one component.<br>
HTMLComponent Spec without the need to drop browser support.
<br>
So no more `.js--slider-top` referencing in your HTML.

# Basic Usage

```html
<div data-hc="app/main">just html</div>

<script src="htmlcomponent.min.js"></script>
<script>
	var components = {};
	components["app/main"] = function(dom, opts) {
		dom.innerHTML = "simple component";
	};
	htmlcomponent.setStaticLoader(components);
	htmlcomponent.query(document);
</script>
```

Result will be:

```html
<div data-hci="app/main">simple component</div>
```

## Usage with Options

```html
<div data-hc="app/mainopts" data-hcd='{"name": "SuperComponent"}'>just html</div>

<script src="htmlcomponent.min.js"></script>
<script>
	var components = {};
	components["app/mainopts"] = function(dom, opts) {
		dom.innerHTML = "my name is "+opts.name;
	};
	htmlcomponent.setStaticLoader(components);
	htmlcomponent.query(document);
</script>
```

Result will be:

```html
<div data-hci="app/mainopts">my name is SuperComponent</div>
```

## Usage with options as a json script

```html
<div data-hc="app/mainopts">
	<script type="application/json" data-hc>
		{
			"name": "SuperComponent",
			"bigdata": [
				1,
				2,
				3 //you get it
			]
		}
	</script>
	just html
</div>

<script src="htmlcomponent.min.js"></script>
<script>
	var components = {};
	components["app/mainopts"] = function(dom, opts) {
		dom.innerHTML = "my name is "+opts.name;
	};
	htmlcomponent.setStaticLoader(components);
	htmlcomponent.query(document);
</script>
```

## Usage with SystemJS or any other promise based loader

```html
<div data-hc="app/main">
	just html
</div>

<script src="system.js">
<script src="config.js">
<script src="htmlcomponent.min.js"></script>
<script>
	//this is the default behavior so the next line is optional
	htmlcomponent.config.promiseLoader = System.import.bind(System)
	htmlcomponent.query(document);
</script>
```

```javascript
//main.js amdstlye
define(function() {
	return function(dom, opts) {
		dom.innerHTML = "my name is "+opts.name;
	}
});
```

## Use in a build/integration environment

It provides a component searcher, that crawls through your template files
and writes them to a grunt config variable to be used later on.
There is a grunt-task that can generate you a static map of your components.<br>
With this basic utilitys you will be able to use SystemJS builder to pack your components
in a single static file where the components are protected from uglify and rollup.
(yeah, the have the tendency to kick seemingly unused code over board)

# Compatiblity

htmlcomponent does nothing else so you can use any library you want.

# FAQ

## But why not jQuery selecting in the DOM jungle?

Because WebComponents are the way to go. https://www.webcomponents.org/

## But this library does only bind a specific DOM Element to a javascript function and pass options...

The answer is: 2kb<br>
Yeah, if you want more features from WebComponents https://www.webcomponents.org/
