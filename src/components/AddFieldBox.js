import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import styles2 from "../styles/main.css";
import {Button, Fab, Grid, Cell, Textfield, Caption, Icon, MenuAnchor, Menu, MenuItem, MenuDivider} from 'react-mdc-web';
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";

class AddFieldBox extends Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};
		}

	render() {
		return(
			<div className="add-field-box">
				<div >
				<Fab className="add">
				<Icon name="add"/>
				</Fab>
					<p>Add a Field</p>
				</div>
			</div>

		);
	}
}

const mapStateToProps = (state) => {
	return {

	}
};

const mapDispatchToProps = (dispatch) => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFieldBox);
