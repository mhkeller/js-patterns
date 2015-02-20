Eyedropping
===

Eyedropping is a technique where grab a data value stored on an HTML element and then use it to determine your next step in JavaScript. A simple example is used in tab-navigation for determining which elements to show or hide. Here's a [jsFiddle](http://jsfiddle.net/mhkeller/t5o99zrd/) showing what I mean.

Here's the code

````html
~~~HTML

<ul id="tabs">
    <li data-which="tab-1">Tab 1</li>
    <li data-which="tab-2">Tab 2</li>
</ul>

<ul id="content-groups">
    <li data-which="tab-1">Tab 1 is the coolest tab around.</li>
    <li data-which="tab-2">No way! Tab 2 is the best.</li>
</ul>
````

````js
~~~JS

// On click...
$('#tabs li').on('click', function(){
  // Eyedrop the data attribute of the tab we just clicked on
  var which = $(this).attr('data-which');
    
  // Remove the class `active` from any tabs that might have it
  $('#tabs li.active').removeClass('active');
  // Add the `active` class to what we just clicked on
  $(this).addClass('active')
  
  // Hide all content group items
  $('#content-groups li').hide();
  // Show the content group item that has the eyedropped value as its `data-which` value.
  // Note: So far we've been doing CSS selectors just by class, id or html tag name.
  // This example also uses the data-attribute as the selector. Read more about that here: http://stackoverflow.com/questions/4146502/jquery-selectors-on-custom-data-attributes-on-html5
  $('#content-groups li[data-which="'+which+'"]').show();
});

// Set the initial state
$('li[data-which="tab-1"]').trigger('click');
````

What we're doing here is storing data on the tab `li` elements and showing the corresponding content group item on click.

Tabs are a great use-case but really any scenario where you have a list of items that then display more information could employ this technique.

Another technique would be to use a data bind in a library like D3. That's a more advanced concept though and plays more into overall architecture. 
