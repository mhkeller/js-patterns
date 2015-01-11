// Cases will always the bigger number so let's make our scale based on that
var cases_scale = d3.scale.linear();
var country_counts;

queue()
	.defer(d3.csv, '../data/ebola.csv')
	.await(function(err, ebola){
		country_counts = transformData(ebola);
		var min_count = 1; // Always set the min to one
		// Calculate the max through an accessor function
		var max_count = d3.max(country_counts, function(countryCounts) { return countryCounts.values.total_cases; });
		console.log(max_count)

		cases_scale.domain([1, max_count])
							 .range([0,1]); // Make the output between zero and one so we can use this as a percentage.

		bakeGraphs();
	});

function transformData(ebolaData){
	var ebola_nested = d3.nest()
		.key(function(d){ return d.country_name })
		.rollup(function(values){
			var totals_object = {
				total_cases: d3.sum(values, function(d){ return d.cases }),
				total_deaths: d3.sum(values, function(d){ return d.deaths })
			}
			return totals_object;
		})
		.entries(ebolaData);

	return ebola_nested;
}

function bakeGraphs(){

	var body = d3.select('#wrapper');

	body.selectAll('.country-bar').data(country_counts).enter()
		.append('div')
			.classed('country-bar', true)
			.style('width', function(d) { return cases_scale(d.values.total_cases)*100 + '%' })

}