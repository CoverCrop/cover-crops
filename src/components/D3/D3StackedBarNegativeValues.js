const D3StackedBarNegativeValues = {};

const d3 = require("d3");

const margin =  {top: 30, right: 50, bottom: 50, left: 150};

D3StackedBarNegativeValues.create = function(el, props, state) {
	d3.select(el).append("svg")
		.attr("class", "d3")
		.attr("width", props.width)
		.attr("height", props.height);

	this.update(el, state);
};

D3StackedBarNegativeValues.update = function(el, state, configuration, chart) {
	this._drawBars(el, state);
};

D3StackedBarNegativeValues.destroy = () => {

};

D3StackedBarNegativeValues._scales = function(el, data, state) {
	if(!data) {
		return null;
	}

	const width =  state.width - margin.left - margin.right;
	const height = state.height - margin.top - margin.bottom;
	const x = d3.scaleBand().rangeRound([0, width])
		.padding(0.1);

	const y = d3.scaleLinear().rangeRound([height, 0]);

	const z = d3.scaleOrdinal(["#3DBFC2", "#1AB146"]);

	return {x: x, y:y, z:z};
};

D3StackedBarNegativeValues._drawBars = function(el, state) {
	const {width, height} = state;
	let {data, title} = state;

	const graphWidth = width - margin.left - margin.right;
	const graphHeight = height - margin.top - margin.bottom;

	const svg = d3.select(el).selectAll("svg");

	let g = svg.selectAll("d3-stacked-bar");
	g.remove();

	g = svg.append("g")
		.attr("class", "d3-stacked-bar")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	let parsed_title = title;
	if (title.length > 35) {
		parsed_title = title.substring(0, 35) + "...";
	}
	svg.append("text")
		.attr("x", margin.left)
		.attr("y", margin.top/2)
		.attr("text-anchor", "left")
		.style("font-size", "16px")
		.style("text-decoration", "bold")
		.text(parsed_title)
		.append("svg:title").text(title);

	const series = d3.stack()
		.keys(["nitrogen", "biomass"])
		.offset(d3.stackOffsetDiverging)(data);

	const scales = this._scales(el, data, state);

	scales.y.domain([d3.min(series, stackMin), d3.max(series, stackMax)]);
	scales.x.domain(data.map(function(d) { return d.date;}));

	const redBox = g.append("rect")
		.attr("x", 0)
		.attr("y", scales.y(d3.max(series, stackMax)))
		.attr("width", graphWidth)
		.attr("height", scales.y(15) - scales.y(d3.max(series, stackMax)))
		.attr("fill", "#FBE6E6");

	const yellowBox = g.append("rect")
		.attr("x", 0)
		.attr("y", scales.y(15))
		.attr("width", graphWidth)
		.attr("height", scales.y(10) - scales.y(15))
		.attr("fill", "#FAECD4");

	const grayBox = g.append("rect")
		.attr("x", 0)
		.attr("y", scales.y(10))
		.attr("width", graphWidth)
		.attr("height", scales.y(d3.min(series, stackMin)) - scales.y(10))
		.attr("fill", "#EBEBEB");

	// Adding marker lines
	g.append("line")
		.style("stroke", "white")
		.attr("x1", scales.x(0))
		.attr("x2", graphWidth)
		.attr("y1", scales.y(10))
		.attr("y2", scales.y(10));

	g.append("line")
		.style("stroke", "red")
		.attr("x1", scales.x(0))
		.attr("x2", graphWidth)
		.attr("y1", scales.y(15))
		.attr("y2", scales.y(15));


	const stacked_bars = g.selectAll(".d3-stacked-bar")
		.data(series)
		.enter().append("g")
		.attr("fill", function(d) { return scales.z(d.key); })
		.selectAll("rect")
		.data(function(d) {return d; })
		.enter().append("rect")
		.attr("width", scales.x.bandwidth)
		.attr("x", function(d) { return scales.x(d.data.date);}) // TODO: Update
		.attr("y", function(d) { return scales.y(d[1]); })
		.attr("height", function(d) { return scales.y(d[0]) - scales.y(d[1]); })
		.attr("opacity", function(d) {
			if(scales.x(d.data.date) > scales.x("12-2017")) {
				return 0.27;
			}
		});
		// .attr("fill", function(d) {
		// 	if(d.data.biomass > 15) {
		// 		return "url(#diagonal-stripe-2)";
		// 	}
		// });

	g.append("g")
		.attr("transform", "translate(0, " + scales.y(0)+ ")")
		.call(d3.axisBottom(scales.x).tickFormat("").tickValues([]));

	const leftAxis = g.append("g")
		.call(d3.axisLeft(scales.y));

	leftAxis.append("text")
		.attr("fill", "#000")
		.attr("transform", "translate("+ -30 + "," +
			((graphHeight)/4)  + ")")
		.attr("text-anchor", "end")
		.attr("font-size", "16px")
		.attr("font-weight", "bold")
		.text("Biomass");

	leftAxis.append("text")
		.attr("fill", "#000")
		.attr("transform", "translate("+ -30 + "," +
			(((graphHeight)/4) + 15)  + ")")
		.attr("text-anchor", "end")
		.text("value/unit");
	leftAxis.append("text")
		.attr("fill", "#000")
		.attr("transform", "translate("+ -30 + "," +
			((3 * graphHeight)/4)  + ")")
		.attr("text-anchor", "end")
		.attr("font-size", "16px")
		.attr("font-weight", "bold")
		.text("Nitrogen Loss");

	leftAxis.append("text")
		.attr("fill", "#000")
		.attr("transform", "translate("+ -30 + "," +
			(((3 * graphHeight)/4) + 15)  + ")")
		.attr("text-anchor", "end")
		.text("value/unit");

	function stackMin(serie) {
		return d3.min(serie, function(d) { return d[0]; });
	}

	function stackMax(serie) {
		return d3.max(serie, function(d) { return d[1]; });
	}
};




export default D3StackedBarNegativeValues;
