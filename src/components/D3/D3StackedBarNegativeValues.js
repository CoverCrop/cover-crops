const D3StackedBarNegativeValues = {};

const d3 = require("d3");

const margin =  {top: 30, right: 200, bottom: 50, left: 70};

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

	const width = el.offsetWidth - margin.left - margin.right;
	const height = el.offsetHeight - margin.top - margin.bottom;
	const x = d3.scaleBand().rangeRound([0, width])
		.padding(0.1)
		.align(0.1);

	const y = d3.scaleLinear().rangeRound([height, 0]);

	// TODO: Need to update to graph colors
	const z = d3.scaleOrdinal(d3.schemeCategory10);

	return {x: x, y:y, z:z};
};

D3StackedBarNegativeValues._drawBars = function(el, state) {
	const {width, height} = state;
	let {data} = state;
};




export default D3StackedBarNegativeValues;
