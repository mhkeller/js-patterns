queue()
	.defer(d3.csv, '../data/ebola.csv')
	.defer(d3.json, '../data/africa.topojson')
	.await(function(err, ebola, africa){
		// console.log(ebola, africa);
		transformData(ebola);
	});
var ebola_nested

function transformData(ebola){
	
	ebola_nested = d3.nest()
    .key(function(d){ return d.country_name })
    .rollup(function(values){
        console.log(values)
        var totals_object = {
            total_cases: d3.sum(values, function(d){ return d.cases }),
            total_deaths: d3.sum(values, function(d){ return d.deaths })
        }
        return totals_object;
    })
    .map(ebola);

	console.log(ebola_nested)

}