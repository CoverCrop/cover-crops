import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import styles2 from "../styles/main.css";
import {Button, Fab, Grid, Cell, Title, Caption, Icon, MenuAnchor, Menu, MenuItem, MenuDivider} from 'react-mdc-web';
import {connect} from "react-redux";
import SelectFieldsCC from "./SelectFieldsCC";
import CoordinateFieldCC from "./CoordinateFieldCC";
import {handleUserLogout} from "../actions/user";
import {handleCardChange, handleLatFieldChange, handleLongFieldChange} from "../actions/analysis";

class AddFieldBox extends Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};
		}

	handleLatFieldChange = (e) => {
		this.props.handleLatFieldChange(e.target.value)
	}

	handleLongFieldChange = (e) =>  {
		this.props.handleLongFieldChange(e.target.value)
	}


	render() {
		return(
			<div>
				<div className="add-field-box add-field-title">

					<Fab >
						<Icon name="add"/>
					</Fab>
					<Title>Add a Field</Title>
					<p>Locate the field by typing an address or click on the map</p>
					<CoordinateFieldCC
						helptext="Latitude value must between -90 and 90"
						min="-90"
						max="90"
						type="number"
						step="0.000001"
						value={this.props.latitude}
						onChange={this.handleLatFieldChange}
						floatingLabel="Latitude"/>
					<CoordinateFieldCC
						helptext="Longitude value must between -180 and 180"
						min="-180"
						max="180"
						type="number"
						step="0.000001"
						value={this.props.longitude}
						onChange={this.handleLongFieldChange}
						floatingLabel="Longitude"/>

				</div>
				<div className="add-field-bottom">
					<Link type="submit" className="cancel-button">Cancel</Link>
					<button type="submit" className="add-button">ADD FILED</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		longitude: state.analysis.longitude,
		latitude: state.analysis.latitude
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleLatFieldChange: (lat) => {
			dispatch(handleLatFieldChange(lat));
		},
		handleLongFieldChange: (lon) => {
			dispatch(handleLongFieldChange(lon));
		},
		handleCardChange: (oldCardIndex, newCardIndex, oldCardData) => {
			dispatch(handleCardChange(oldCardIndex, newCardIndex, oldCardData))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFieldBox);
