import React, {Component} from "react";
import {Button, Textfield, Body1, Grid, Cell} from "react-mdc-web"
import CoordinateFieldCC from "./CoordinateFieldCC";

class SelectFieldsCC extends Component {

	constructor(props) {
		super(props);
		this.handleLatFieldChange = this.handleLatFieldChange.bind(this);
		this.handleLongFieldChange = this.handleLongFieldChange.bind(this);
	}

	handleLatFieldChange(e) {
		this.props.handleLatFieldChange(e.target.value)
	}

	handleLongFieldChange(e) {
		this.props.handleLongFieldChange(e.target.value)
	}

	render(){
		return(
			<div>
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
					<Cell col={12}>
						<Cell col={2}>
							<CoordinateFieldCC
								helptext="Latitude value must between -90 and 90"
								helptextValidation
								min="-90"
								max="90"
								type="number"
								step="0.000001"
								value={this.props.state.latitude}
								onChange={this.handleLatFieldChange}
								floatingLabel="Latitude"/>
							<CoordinateFieldCC
								required
								helptext="Longitude value must between -180 and 180"
								helptextValidation
								min="-180"
								max="180"
								type="number"
								step="0.000001"
								value={this.props.state.longitude}
								onChange={this.handleLongFieldChange}
								floatingLabel="Longitude"/>
						</Cell>
						<Cell col={10}>
							{/*Placeholder for map*/}
						</Cell>
					</Cell>
				</Grid>
			</div>
		)
	}
}

export default SelectFieldsCC;
