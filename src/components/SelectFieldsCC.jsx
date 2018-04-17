import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Textfield, Body1, Grid, Cell, Icon} from "react-mdc-web";
import RunSimulationBox from "./RunSimulationBox";
import MapCC from "./MapCC";
import {handleLatFieldChange, handleLongFieldChange, handleCardChange} from "../actions/analysis"
import styles from '../styles/analysis-page.css';

class SelectFieldsCC extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cluname: ""
		}
	}
	//TODO: add search function.
	handleLatFieldChange = () => {
		this.props.handleLatFieldChange(40.029428)
	}

	handleLongFieldChange = () =>  {
		this.props.handleLongFieldChange(-88.259290)
	}

	handleSubmit = (event) =>{
		// event.preventDefault();
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

    //TODO: div is pop up, text is too bottom.
    //TODO: the click on Icon is not working.
    //TODO: add polygon.
	render() {
		return(
			<div className="search-bg">
				<Textfield
					box
					trailingIcon
					value={this.state.cluname}
					onChange={({target : {value : cluname}}) => {
						this.setState({ cluname })
						if(cluname.length === 5){
							this.handleLatFieldChange();
							this.handleLongFieldChange();
							this.handleSubmit();
						}
					}}
				>
					<Icon name="search" />
				</Textfield>
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectFieldsCC);
