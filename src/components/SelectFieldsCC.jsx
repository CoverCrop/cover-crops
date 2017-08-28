import React, {Component} from "react";
import {Button, Textfield, Body1} from "react-mdc-web"

class SelectFieldsCC extends Component {

	constructor(props) {
		super(props);
		this.state = {
			latitude: "",
			longitude: ""
		};

		this.handleChangeLat = this.handleChangeLat.bind(this);
		this.handleChangeLong = this.handleChangeLong.bind(this);
	}
	handleChangeLat(obj) {
		this.setState({
			latitude: obj.target.value
		});
	}

	handleChangeLong(obj) {
		this.setState({
			longitude: obj.target.value
		});
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

				<Textfield
					required
					helptext="Latitude value must between -90 and 90"
					helptextValidation
					min="-90"
					max="90"
					type="number"
					step="0.000001"
					value={this.state.latitude}
					onChange={this.handleChangeLat}
					floatingLabel="Latitude"/>
				<Textfield
					required
					helptext="Longitude value must between -90 and 90"
					helptextValidation
					min="-90"
					max="90"
					type="number"
					step="0.000001"
					value={this.state.longitude}
					onChange={this.handleChangeLong}
					floatingLabel="Longitude"/>
			</div>
		)
	}
}

export default SelectFieldsCC;
