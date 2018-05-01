import React, {Component} from "react";
import SelectFieldsCC from "./SelectFieldsCC";
import RunSimulationCC from "./RunSimulationCC";
import ViewResultsCC from "./ViewResultsCC";
import MapCC from "./MapCC"
import { connect } from 'react-redux';
import styles from "../styles/analysis-page.css"

class RightPaneCC extends Component {

	constructor(props) {
		super(props);
	}

	render(){

		let displayComponent = null;

		// Dynamically select component for the right pane based on the selected card
		switch(this.props.activeCardIndex) {
			case 0:
				displayComponent =
					<SelectFieldsCC />;
				break;

			case 1:
				displayComponent =
					<RunSimulationCC />;
				break;

			case 2:
				displayComponent = <ViewResultsCC />;
				break;

			case null:
				displayComponent = <SelectFieldsCC/>;
				break;
		}

		return(
			<div className="analysis-map-div">
				<MapCC mapId="analysis-clu"/>
				<SelectFieldsCC />
				{this.props.clu === 0 ? null : <RunSimulationCC />}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		longitude: state.analysis.longitude,
		latitude: state.analysis.latitude,
		clu: state.analysis.clu,
		activeCardIndex: state.analysis.activeCardIndex
	}
};

export default connect(mapStateToProps)(RightPaneCC);
