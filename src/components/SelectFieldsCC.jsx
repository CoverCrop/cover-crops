import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Textfield, Body1, Grid, Cell} from "react-mdc-web";
import CoordinateFieldCC from "./CoordinateFieldCC";
import MapCC from "./MapCC";
import {handleLatFieldChange, handleLongFieldChange, handleCardChange} from "../actions/analysis"

class SelectFieldsCC extends Component {

	constructor(props) {
		super(props);
		this.handleLatFieldChange = this.handleLatFieldChange.bind(this);
		this.handleLongFieldChange = this.handleLongFieldChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleLatFieldChange(e) {
		this.props.handleLatFieldChange(e.target.value)
	}

	handleLongFieldChange(e) {
		this.props.handleLongFieldChange(e.target.value)
	}

	handleSubmit(event){
		event.preventDefault();
		if (this.props.longitude !== "" && this.props.latitude !== "") {
			console.log(this.props.longitude + " " + this.props.latitude);
			let cardData = {
				cardTitle: "Selected Fields",
				cardSubtitle: "Latitude: " + this.props.latitude + "° \n" + "Longitude: " + this.props.longitude + "° "
			};
				this.props.handleCardChange(0, 1, cardData);
		}
		else {
			console.log("Choose coordinates.");
		}
	}

	render(){
		return(
			<form onSubmit={this.handleSubmit}>
				{/*Start: hidden for the time being*/}
				<select hidden multiple size="3" className="mdc-multi-select mdc-list multiple-select-cc" >
					<option className="mdc-list-item">
						Field 1
					</option>
					<option className="mdc-list-item">
						Field 2
					</option>
					<option className="mdc-list-item">
						Field 3
					</option>
					<option className="mdc-list-item">
						Field 4
					</option>
					<option className="mdc-list-item">
						Field 5
					</option>
				</select>
				{/*End: hidden for the time being*/}

				<Grid>
					<Cell col={2}>
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
						<Button type="submit" raised>Continue</Button>
					</Cell>
					<Cell col={10}>
						<MapCC mapId="map"/>
					</Cell>
				</Grid>
			</form>
		)
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectFieldsCC);
