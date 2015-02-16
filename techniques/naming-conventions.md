Naming conventions
===

One of the intimidating things about programming, especially JavaScript programming, is few requirements exist in terms of architecture or structure. This lack of one prescribed way of doing things is also very freeing, but also leave you in the dark about *the best* way something should work.

Figuring out the best way to do something is a longterm struggle. But here we'll discuss an important technique you might employ for organizaing your JavaScript application: naming conventions.

Very broadly, a naming convention is simply an organized system for naming things such as files or data objects. Naming conventions aren't unique to programming and are employed whenever you want a system for naming items so that when you encounter a new element, you know where it falls in a series. This pattern could be as simple as naming image files in a slide show `image-1.jpg`, `image-2.jpg`, `image-3.jpg` (an example we'll do) or product codes in a grocery where fruits might start with an `F` followed by something like the position along the aisle so employees can easily know where to restock them.

#### An example, slideshows

Here's an example of a slideshow with hardcoded everything.

````html
~~~HTML

<div id="slideshow-image-canvas"></div>
<ul id="thumbnail-drawer">
	<li data-which="german-shephard.jpg">German Shephard</li>
	<li data-which="labrador.jpg">Labrador</li>
	<li data-which="rottweiler.jpg">Rottweiler</li>
	<li data-which="pyrenees-wolf-mix.jpg">Pyrnees Mix</li>
</ul>
````

````js
~~~JS

$('$thumbnail-drawer li').on('click', function(){
		var image_name = $(this).attr('data-which');
		
		var image_markup = '<img src="images/'+image_name+'"/>';
		
		$('#slideshow-image-canvas').html(image_markup);
});
````

This will work fine but we've hardcoded all of our image path's into the markup. We also don't have a next button. 

If we we want to make a slideshow that can handle a flexible number of images, we would want to standardize our file system more. Look at this example

````html
~~~HTML
<div id="slideshow-image-canvas"></div>
<div class="button" data-which="prev">Previous</div>
<div class="button" data-which="next">Next</div>
````

````js
~~~JS

var current_index = 0;

$('.button').on('click', function(){
	var which = $(this).attr('data-which');
	
	if (which == 'next') {
		current_index = current_index + 1;
	} else {
		current_index = current_index - 1;
	}
	
	var image_markup = '<img src="images/image-'+current_index+'.jpg"/>';
	
	$('#slideshow-image-canvas').html(image_markup);
});

````

Now, as long as we name all the files `image-<NUMBER>.jpg`, we won't have to change our code at all. It's generally more desirable when your content is not dependent on your code. That is to say, a change in your content shouldn't require a change in the code.
