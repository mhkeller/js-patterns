Referencing variables and functions with bracket notation
===

# Intro

This is a short note on different ways to access variables in JavaScript. It can be handy if you find yourself copying and pasting functions and tweaking a couple of variables to make it work in another context. Code gets much easier to maintain if you reuse your functions as much as possible, adhering to the Don't Repeat Yourself (DRY) principle. Without further ado...

# Storing variables on objects

Here's a simple function which will print `"Michael"` into the body of a webpage.

````js
var name = 'Michael';

function init(){
	$('body').html(name);
}

init();

````

You can see `name` is just a free-floating, global variable, which is fine because our app is pretty small. But this could quickly get disorganized if we had ten other variables like `occupation`', `age`, `city` etc.

One option is to group those variables together on an object.

````js
var personInfo = {
	name: 'Michael',
	occupation: 'Reporter'
}

function init(){
	$('body').html(personInfo.name + ' ' +  personInfo.occupation);
}

init();

````

This has the advantage that you aren't polluting your namespace area as much — instead of having a bunch of generically named variables like `name` and `occupation`, now you just have one `personInfo` which isn't as generic. 

You can see we access properties off that object with dot notation. That's a fancy way of saying every time you go down a level in the object, you use a `.`.

You can also use bracket notation and text strings. This block is equivalent to the previous block.

````js
var personInfo = {
	name: 'Michael',
	occupation: 'Reporter'
}

function init(){
	$('body').html(personInfo['name'] + ' ' +  personInfo['occupation']);
}

init();
````

#### The power of bracket notation

Bracket notation becomes incredibly useful when you don't know the variable reference beforehand. That may sound like bad code, but it's actually better code in many ways because it lets you write generic functions that do the same thing without being tied to one specific variable reference.

That may be confusing, so here's an example doing it the messy way and then one doing it the more concise way. 

These two buttons display either the name or occupation on click:

````html
~~~HTML
<div id='name-btn'>Show name</div>
<div id='occupation-btn'>Show occupation</div>
````

````js
~~~JS
var personInfo = {
	name: 'Michael',
	occupation: 'Reporter'
}

$('#name-btn').on('click', function(){
	$('body').html(personInfo['name'])
})

$('#occupation-btn').on('click', function(){
	$('body').html(personInfo['occupation'])
})

````

We have two click callbacks that do essentially the same thing. The only difference is that the variable they show is hardcoded, i.e. one callback function will always access the value stored under `'name'` and the other will always access the value stored under `'occupation'`. 

Let's write this more concisely. Both buttons will call the same function on click, but pass in a reference to the variable they want to show by eyedropping it from an attribute on the `div`.

````html
~~~HTML
<div class='btn' data-field='name'>Show name</div>
<div class='btn' data-field='occupation'>Show occupation</div>
````

````js
~~~JS
var personInfo = {
	name: 'Michael',
	occupation: 'Reporter'
}

$('.click').on('click', function(){
	var $this_button = $(this);
	var variable_name = $this_button.attr('data-field'); // This will be either `'name'` or `'occupation'` as strings
	$('body').html(personInfo[variable_name])
})

````

You can capture the jQuery object of a thing you clicked on but wrapping `this` in a jQuery selector, e.g. `$(this)`. Then we eyedropped (like how you can suck up the color of something in Photoshop or pipette something out of a test tube in chemistry) the data attribute which stored the variable we were interested in. In HTML5 you can make up any tag you want as long as you precede it with `data-`.

The main difference, though, is we used bracket notation with a variable instead of a hardcoded string. This lets us reuse that function and it will access different keys of the `personInfo` object depending on the button that was clicked.

# Storing functions on objects

You can do more than just store strings on objects, you can reference completely different functions. Here's an example:

````html
~~~HTML
<div class='btn' data-action='add'>Add item</div>
<div class='btn' data-action='clear'>Clear all items</div>
````

````js
~~~JS
var actions = {
	add: function(){
		$('body').append('<div class="item"></div>')
	},
	clear: function(){
		$('.item').remove(); // Clear the .item divs.
	}
}

$('.click').on('click', function(){
	var $this_button = $(this);
	var action = $this_button.attr('data-action'); // This will be either `'add'` or `'clear'` as strings
	actions[action]();
})
````
So we're doing the same thing here, except the things we're accessing are functions instead of variables. 

Notice that after the function reference, we added `()` in order to invoke the function. If we didn't do that, the function wouldn't run. You can also use the more expressive syntax `actions[action].call()` method if you like how that looks better.

Or you can save it as a variable like so 

```js
~~~JS
var actions = {
	add: function(){
		$('body').append('<div class="item"></div>')
	},
	clear: function(){
		$('.item').remove(); // Clear the .item divs.
	}
}

$('.click').on('click', function(){
	var $this_button = $(this);
	var action = $this_button.attr('data-action'); // This will be either `'add'` or `'clear'` as strings
	var action_function = actions[action]
	
	// Execute the function
	action_function()
})
```
