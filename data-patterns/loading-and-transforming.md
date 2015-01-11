Loading and transforming data
===

# Loading data

### One at a time

The simple say to load data in with d3 is through the `d3.csv` or `d3.json` functions.

````js
d3.csv('data/ebola.csv', function(data){
	console.log(data)
});
````

This will return a json object like this. So loading csvs just turns them into json.

````json
[
  {
	  "report_date": "2014-03-25",
	  "country_name": "Guinea",
	  "cases": "86",
	  "deaths": "60"
  },
  {
	  "report_date": "2014-03-26",
	  "country_name": "Guinea",
	  "cases": "86",
	  "deaths": "62"
  },
  {
    "report_date": "2014-03-27",
    "country_name": "Guinea",
    "cases": "103",
    "deaths": "66"
  },
  {
    "report_date": "2014-03-30",
    "country_name": "Guinea",
    "cases": "112",
    "deaths": "70"
  },
  {
    "report_date": "2014-04-01",
    "country_name": "Guinea",
    "cases": "122",
    "deaths": "80"
  },
  {
    "report_date": "2014-04-02",
    "country_name": "Guinea",
    "cases": "127",
    "deaths": "83"
  }
]
````

We could load the Topojson file similarly with `d3.json`.

### Multiple files

#### Synchronously

What if we want to load all our data? You could convert your data to json ahead of time and then load them with a script tag such as

In a file called ebola.js
````js
var ebola = [
  {
	  "report_date": "2014-03-25",
	  "country_name": "Guinea",
	  "cases": "86",
	  "deaths": "60"
  },
  {
	  "report_date": "2014-03-26",
	  "country_name": "Guinea",
	  "cases": "86",
	  "deaths": "62"
  }
}
````

And then in your index.html
````html

<script src="data/ebola.js"></script>
<script src="data/africa.topojson"></script> <!-- load this from another file similar to `ebola.js` -->
<script src="js/main.js"></script>
````

This will make sure our data is loaded before `main.js` but it will wait for each file to load before proceeding to the next one. It will also expose `ebola` as a global variable, which can collide with other variables down the road. Especially if you use generic names like `data`.

#### Asynchronously

There are a few options to loading things asynchronously and they come down to style and complexity. The `d3.csv`, `d3.json` and normal Ajax calls through jQuery will load asynchronously. The problem, then, is you have to know when all of your calls are finished so you can proceed. It's like throwing out ten boomerangs that might all take different lengths of time to come back to you. It's easy to throw them all out there, but it's hard to catch them.

The most cumbersome way is to build your own checker. This can take many forms but essentially you record when you've gotten something back, you record how many things you should have and you check when each process is done.

````js
var results = [];

function proceed(){
	if (results.length == 2){
		doStuff(results);
	}
}

d3.csv('ebola.csv', function(data){
	results.push(data);
	proceed();
})

d3.csv('ebola.csv', function(data){
	results.push(data);
	proceed();
})
````

Sometimes you don't know how many calls you have to make, however, and, anyway, this is lame because if you update your file, you have to update some magic number. No more insanity! Let's use something else.

##### Queue.js

A good companion library for loading data in d3 is [queue.js](https://github.com/mbostock/queue). It has its own quirks but for our purposes it works well out of the box. Use it like this


````js
queue()
	.defer(d3.csv, '../data/ebola.csv')
	.defer(d3.json, '../data/africa.topojson')
	.awaitAll(function(err, results){
		var ebola = results[0];
		var africa = results[1];
		console.log(ebola, africa);
	});
````

You can also use `.await`, which will return different objects for each input.


````js
queue()
	.defer(d3.csv, '../data/ebola.csv')
	.defer(d3.json, '../data/africa.topojson')
	.await(function(err, ebola, africa){
		console.log(ebola, africa);
	});
````


# Transforming data

### Simple nesting

Now that you have your data, we need to do stuff with it. Incident level data is great because it's easy to maintain, but we often want to visualize things in groups. We can use `d3.nest()` for that.

You can do a lot nesting data with D3. Here are two resource pages

1. Examples: <http://bl.ocks.org/phoebebright/raw/3176159/>
2. Interactive console: <http://bl.ocks.org/shancarter/raw/4748131/>

`d3.nest()` has two main methods:

1. `.key` which says what we want to group things by
2. `.map` or `.entries`. One of these methods is required as the last call in your nesting operation. `map` will make the result of your nest a dictionary. `entries` will make it an array of objects.

Let's do an example

````js
queue()
	.defer(d3.csv, '../data/ebola.csv')
	.defer(d3.json, '../data/africa.topojson')
	.await(function(err, ebola, africa){
		transformData(ebola);
	});

function transformData(ebolaData){
	
	var ebola_nested = d3.nest()
		.key(function(d) { return d.country_name })
		.entries(ebolaData);

	console.log(ebola_nested)

}

````

This will give us data that looks like

````json
[
  {
    "key": "Guinea",
    "values": [
      {
        "report_date": "2014-03-25",
        "country_name": "Guinea",
        "cases": "86",
        "deaths": "60"
      },
      {
        "report_date": "2014-03-26",
        "country_name": "Guinea",
        "cases": "86",
        "deaths": "62"
      }
	  ]
	},{
    "key": "Liberia",
    "values": [
      {
        "report_date": "2014-03-30",
        "country_name": "Liberia",
        "cases": "7",
        "deaths": "0"
      },
      {
        "report_date": "2014-04-02",
        "country_name": "Liberia",
        "cases": "8",
        "deaths": "5"
      }
    ]
  }
]
````

If you change the last line to `.map(ebolaData)` it will look like a dictionary instead of putting the name under `key` and the values under `values`.

````json
{
  "Guinea": [
    {
      "report_date": "2014-03-25",
      "country_name": "Guinea",
      "cases": "86",
      "deaths": "60"
    },
    {
      "report_date": "2014-03-26",
      "country_name": "Guinea",
      "cases": "86",
      "deaths": "62"
    }
  ],
	"Liberia": [
    {
      "report_date": "2014-03-30",
      "country_name": "Liberia",
      "cases": "7",
      "deaths": "0"
    },
    {
      "report_date": "2014-04-02",
      "country_name": "Liberia",
      "cases": "8",
      "deaths": "5"
    }
  ]
}
````

Why would I want one over the other? Dictionaries are very nice for looking things up quickly because they provide an index. Arrays are good for dealing with each item in the array as being represented as an object in the DOM. 

To look data up in a dictionary you do

````js
var guinea_data = ebola_nested['Guinea'];
`````

And you'll get an array of objects. To do the equivalent in array of objects format (you could also refer to this as more traditional JSON format), you would have to filter, which is more computationally intensive and thus slower. Although with this much data, that's negligable.

It is more verbose though:

````js
var guinea_data = ebola_nested.filter(function(country) { return counry.key == 'Guinea' }).values;
````

You could write a helper function that would look like

````js
function getCountry(countryName){
	return ebola_nested.filter(function(country) { return counry.key == countryName }).values;
}

var guinea_data = getCountry('Guinea');
````

**On the other hand...**

If each of these countries is going to be plotted as an object in the DOM, they should objects in an array because 

1. Arrays are sorted so you can control which is plotted in what order
2. Arrays of objects, philosophically are kind of all siblings. Properties on an object can all be different. So if you want to show that you have a list of items that all have the same data structure but they just differ in category (such as country), an array of objects is the way to go.

**Do I have to choose?**

Nope, you don't. You can compute both, store each, and use them separately where appropriate. If your data is updating or the user is changing values you'll want to work in some syncing but that's a more complicated use case.

### Aggregate nesting

Simple nesting is great for time series data because it collects all the items into categories. But what if you want aggregate counts, like how many total cases and deaths are in each country? You could compute this offline but that's messy. As before, it's easiest and cleanest and most reproducable to store incident data and do aggregates on the client (within reason).

To make aggregate counts, use the rollup method on `d3.nest()`

````js
d3.nest()
	.key(function(d){ return d.country_name })
	.rollup(function(values){
		console.log(values)
		var totals_object = {
			total_cases: d3.sum(values, function(d){ return d.cases }),
			total_deaths: d3.sum(values, function(d){ return d.deaths })
		}
		return totals_object;
	})
	.map(data);
````

The rollup function has access to `values` which is the array of objects we were dealing with before. We create our own object with `total_cases` and `total_deaths` properties and we run the `d3.sum` function on our data to loop through the list for each country and add up the specified property.

It gives us this:

````json
{
  "Guinea": {
    "total_cases": 14026,
    "total_deaths": 9860
  },
  "Liberia": {
    "total_cases": 7002,
    "total_deaths": 3873
  },
  "Sierra Leone": {
    "total_cases": 9881,
    "total_deaths": 4166
  },
  "Nigeria": {
    "total_cases": 85,
    "total_deaths": 21
  }
}
````

And using `entries`

````json
[
  {
    "key": "Guinea",
    "values": {
      "total_cases": 14026,
      "total_deaths": 9860
    }
  },
  {
    "key": "Liberia",
    "values": {
      "total_cases": 7002,
      "total_deaths": 3873
    }
  },
  {
    "key": "Sierra Leone",
    "values": {
      "total_cases": 9881,
      "total_deaths": 4166
    }
  },
  {
    "key": "Nigeria",
    "values": {
      "total_cases": 85,
      "total_deaths": 21
    }
  }
]
````

Neat huh?

# Getting some information out of the data

Now that you've loaded the data, you'll probably want to figure out some things about it. If you're going to graph it, you'll need a scale.

Scales are one of the coolest things in D3. They let you easily translate the number system of your data into the pixel space of the DOM.

Let's do an example, bar charts of aggregate counts by country. The first thing we need to figure out is the min and max of our data. Let's use a linear scale.

#### Simple min and max 

````js
var values = [1,5,3,4,5,32,68,6,7,5,2,33,4,5,7,8];

var max = d3.max(values);

// max = 68

````

Easy right, you put in an array and you get a value. Data doesn't look like that though, we usually have an array of **objects** that have a property we want to identify as the one to find the max of.

#### Min and max of an array of objects

You can do this by passing in an accessor function, similar to how we did with `d3.nest()`

````js

// Cases will always the bigger number so let's make our scale based on that
var cases_scale = d3.scale.linear();
var country_counts;

queue()
	.defer(d3.csv, '../data/ebola.csv')
	.defer(d3.json, '../data/africa.topojson')
	.await(function(err, ebola, africa){
		country_counts = transformData(ebola);
		var min_count = 1; // Always set the min to one
		// Calculate the max through an accessor function
		var max_count = d3.max(country_counts, function(countryCounts) { return countryCounts.values.total_cases; });
		console.log(max_count)
		cases_scale.domain([min_count, max_count])
							 .range([0,1]); // Make the output between zero and one so we can use this as a percentage.

		bakeGraphs();
	});

function transformData(ebolaData){
	return d3.nest()
		.key(function(d){ return d.country_name })
		.rollup(function(values){
			var totals_object = {
				total_cases: d3.sum(values, function(d){ return d.cases }),
				total_deaths: d3.sum(values, function(d){ return d.deaths })
			}
			return totals_object;
		})
		.entries(ebolaData);
}

function bakeGraphs(){
	var body = d3.select('body')
	body.selectAll('.country-bar').data(country_counts).enter()
		.append('div')
			.classed('country-bar', true)
			.style('width', function(d) { return cases_scale(d.total_cases) })
}

````


A library for scales without D3: https://gist.github.com/aubergene/7791133

