import React, {Component} from "react";
import {Textfield} from "react-mdc-web"

class CoordinateFieldCC extends Component {

	render() {
		return (
			<div>
				<Textfield
					required
					helptext={this.props.helptext}
					helptextValidation
					min={this.props.min}
					max={this.props.max}
					type={this.props.type}
					step={this.props.step}
					value={this.props.value}
					onChange={this.props.onChange}
					floatingLabel={this.props.floatingLabel}/>
			</div>
		);
	}
}

export default CoordinateFieldCC;
