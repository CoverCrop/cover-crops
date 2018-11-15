import React, {Component} from "react";
import {
	Button,
	Checkbox,
	Dialog,
	DialogBody,
	DialogFooter,
	Textfield,
	Title
} from "react-mdc-web";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Select from 'react-select';
import {convertFullDate, dictToOptions} from "../public/utils";
import {connect} from "react-redux";
import {handleCropChange} from "../actions/user";

class MyFarmUpdate extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {elementType, firstField, secondField, cropobj, cropyear, defaultValue} = this.props;
		const options = (elementType !== "select" || Array.isArray(this.props.options))? this.props.options: dictToOptions(this.props.options);
		// const defaultValue = cropobj[cropyear][firstField][secondField];
		return (
			<div className="update-box">
				<p  className={this.props.elementType}>{this.props.title}</p>
				{defaultValue &&
					(() => {
						switch (elementType) {
							case "select":
								return (<Select
									name={this.props.title}
									value={defaultValue}
									options={options}
									onChange={selectedOption => this.props.handler(secondField, selectedOption.value)}
								/>);

							case "date":
								return (<DatePicker className="date-picker-cc"
													selected={moment((defaultValue))}
													onChange={moment =>
														this.props.handler(secondField, moment.toISOString())
													}
								/>);
								// TODO: a bug when all the text are removed
							case "input":
								return (<Textfield
									min="0"
									type="number"
									step="1"
									value={defaultValue}
									onChange={({target: {value: updateValue}}) => {
										this.props.handler(secondField, updateValue)
									}}
								/>);
							default :
								null
						}
					})()
				}
			</div>
		)
	}
}

export default MyFarmUpdate;

