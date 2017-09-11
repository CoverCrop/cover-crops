import React, {Component} from "react";
import {Button, Textfield, Body1} from "react-mdc-web"

class ViewResultsCC extends Component {

	constructor(props) {
		super(props);
		this.displayResults = this.displayResults.bind(this);
	}

	displayResults() {

		let result = [];
		let resultArray = this.props.state.resultText.split("\n*DSSAT");

		for (let item in resultArray) {
			console.log(item);
			result.push(<p>item</p>);
		}

		//console.log(result);

		return result;
	}

	render(){

		// let resultParas = [];
		// let splitString = "*DSSAT";
		// let resultArray = this.props.state.resultText.split(splitString);
        //
		// for (let i=0; i < resultArray.length; i++) {
		// 	if (i === 0) {
		// 		resultParas.push(<p key={i}>{resultArray[i]}<br/><br/></p>);
		// 	}
		// 	else {
		// 		resultParas.push(<p key={i}>{splitString} {resultArray[i]}<br/><br/></p>);
		// 	}
		// }

		return(
			<div>
				<h1>Results</h1>
				<br/>
				<pre>{this.props.state.resultText}</pre>
			</div>
		)
	}
}

export default ViewResultsCC;
