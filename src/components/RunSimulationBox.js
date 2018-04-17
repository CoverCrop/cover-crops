import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import styles2 from "../styles/main.css";
import {Button, Fab, Grid, Cell, Title, Caption, Icon, Textfield, Menu, MenuItem, MenuDivider} from 'react-mdc-web';
import {connect} from "react-redux";
import SelectFieldsCC from "./SelectFieldsCC";
import CoordinateFieldCC from "./CoordinateFieldCC";
import {handleUserLogout} from "../actions/user";
import {handleCardChange, handleLatFieldChange, handleLongFieldChange} from "../actions/analysis";

class RunSimulationBox extends Component {

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

	render() {
		return(

				<Textfield
					box
					floatingLabel="E-Mail"
					value={this.state.cluname}
					onChange={({target : {value : email}}) => {
						this.handleLatFieldChange();
						this.handleLongFieldChange();
					}}
					className="search-bg"
				>
					<Icon name="search"/>
				</Textfield>

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

export default connect(mapStateToProps, mapDispatchToProps)(RunSimulationBox);
