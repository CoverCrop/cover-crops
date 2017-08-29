import React, {Component} from "react";
import SelectFieldsCC from "./SelectFieldsCC";
import RunSimulationCC from "./RunSimluationCC";
import ViewResultsCC from "./ViewResultsCC";

class RightPaneCC extends Component {

	constructor(props) {
		super(props);

		this.handleLatFieldChange = this.handleLatFieldChange.bind(this);
		this.handleLongFieldChange = this.handleLongFieldChange.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);

	}

	handleLatFieldChange(value) {
		this.props.handleLatFieldChange(value)
	}

	handleLongFieldChange(value) {
		this.props.handleLongFieldChange(value)
	}

	handleStartDateChange(date) {
		this.props.handleStartDateChange(date)
	}

	handleEndDateChange(date) {
		this.props.handleEndDateChange(date)
	}

	render(){

		let displayComponent = null;

		// Dynamically select component for the right pane based on the selected card
		switch(this.props.activeCardIndex) {
			case 0:
				displayComponent =
					<SelectFieldsCC
						state={this.props.state}
						handleLatFieldChange={this.handleLatFieldChange}
						handleLongFieldChange={this.handleLongFieldChange}/>;
				break;

			case 1:
				displayComponent =
					<RunSimulationCC
						state={this.props.state}
						handleStartDateChange={this.handleStartDateChange}
						handleEndDateChange={this.handleEndDateChange}/>;
				break;

			case 2:
				displayComponent = <ViewResultsCC/>;
				break;

			case null:
				displayComponent = <SelectFieldsCC/>;
				break;
		}

		return(
			<div>{displayComponent}</div>
		);
	}
}

export default RightPaneCC;
