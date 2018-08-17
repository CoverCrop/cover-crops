import React, {Component} from "react";
import {
	Body1,
	Body2,
	Button,
	Cell,
	Checkbox,
	Dialog,
	DialogBody,
	DialogFooter,
	Fab,
	FormField,
	Grid,
	Icon,
	Title,
	Card,
	CardText,
	CardTitle,
	DatePicker,
	Textfield
} from "react-mdc-web";
import Select from 'react-select';
import config from "../app.config";
import {expfail, expsuccess} from "../app.messages";
import {dictToOptions} from "../public/utils";
import {coverCrops} from "../datawolf.config";

class MyFarmUpdate extends Component {

	constructor(props) {
		super(props);
		this.state ={
			updateValue:this.props.defaultValue,
		};
	}



	render() {
		const {elementType} = this.props;
		const options = Array.isArray(this.props.options)? this.props.options: dictToOptions(this.props.options);
		return (
			<div className="update-box">
				<p>{this.props.title}</p>
				{(() => {
					switch (elementType) {
						case "select":
							return (<Select
								name={this.props.title}
								value={this.state.updateValue}
								options={options}
								onChange={selectedOption => this.setState({ updateValue: selectedOption })}
							/>);
						//	TODO: onchange
						case "date": return	(<DatePicker className="date-picker-cc" selected={this.state.updateValue}
															selectsEnd
															showYearDropdown
															scrollableYearDropdown
						/>);
						case "input": return (<Textfield
							value={this.state.updateValue}
							onChange={({target : {value : updateValue}}) => {
								this.setState({ updateValue })
							}}
						/>);
						default :
							null
					}
				})()}
			</div>
		)
	}
}


export default MyFarmUpdate;

