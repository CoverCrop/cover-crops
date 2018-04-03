import React, {Component} from "react";
import {Textfield} from "react-mdc-web"

class CoordinateFieldCC extends Component {

	render() {
		return (
			<div>
				<Textfield
					{...this.props}
					required
					helptextValidation
					/>
			</div>
		);
	}
}

export default CoordinateFieldCC;
