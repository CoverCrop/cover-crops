import React, {Component} from "react";
import {Textfield} from "react-mdc-web";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Select from "react-select";
import {dictToOptions, isNumeric, roundResults} from "../public/utils";
import {INCH_LIMIT, LBS_LIMIT, SEEDS_LIMIT, SEEDS_ROUND_TO} from "../experimentFile";

class MyFarmUpdate extends Component {

	constructor(props) {
		super(props);
	}

	validateInchInput = (e, secondField) => {
		let updateValue = e.target.value;
		let roundedVal;

		if(!isNumeric(updateValue)) {
			roundedVal = 1;
		}
		else {
			if (updateValue >= INCH_LIMIT) {
				roundedVal = INCH_LIMIT;
			} else {
				roundedVal = updateValue;
			}
		}

		e.target.value = roundResults(roundedVal, 2);
		this.props.handler(secondField, e.target.value);
	};


	validateLbsInput = (e, secondField) => {
		let updateValue = e.target.value;
		let roundedVal;

		if(!isNumeric(updateValue)) {
			roundedVal = 1;
		}
		else {
			if (updateValue >= LBS_LIMIT) {
				roundedVal = LBS_LIMIT;
			} else {
				roundedVal = updateValue;
			}
		}

		e.target.value = roundResults(roundedVal, 1);
		this.props.handler(secondField, e.target.value);
	};

	validateSeedsInput = (e, secondField) => {
		let updateValue = e.target.value;
		let roundedVal;

		if(!isNumeric(updateValue)) {
			roundedVal = 1000;
		}
		else {
			if (updateValue < 1000) {
				roundedVal = 1000;
			} else if (updateValue >= SEEDS_LIMIT) {
				roundedVal = SEEDS_LIMIT;
			} else {
				roundedVal = Math.round(updateValue / SEEDS_ROUND_TO) * SEEDS_ROUND_TO;
			}
		}
		e.target.value = roundedVal;
		this.props.handler(secondField, e.target.value);
	};

	validateEmptyInput = (e, secondField) => {
		if (!isNumeric(e.target.value)) {
			e.target.value = 1;
			this.props.handler(secondField, e.target.value);
		}
	};


	render() {
		const {elementType, firstField, secondField, defaultValue,
			helpText, helpTextPersistence} = this.props;
		const options = (elementType !== "select" || Array.isArray(this.props.options)) ? this.props.options : dictToOptions(this.props.options);
		// const defaultValue = cropobj[cropyear][firstField][secondField];
		let divClasses = "update-box";
		if (this.props.isLeft) divClasses += " update-box-left";

		return (
			<div>
			{defaultValue != null && <div className={divClasses}>
				<p  className={this.props.elementType}>{this.props.title}</p>

				{(() => {
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
													showYearDropdown
													selected={moment((defaultValue))}
													onChange={moment =>
														this.props.handler(secondField, moment.toISOString())
													}
								/>);
						case "input":
							return (<Textfield
									min="0"
									type="number"
									step="1"
									value={defaultValue}
									onChange={({target: {value: updateValue}}) => {
										this.props.handler(secondField, updateValue);
									}}
									onBlur={(e) => this.validateEmptyInput(e, secondField)}
							/>);
						case "inputInch":
							return (<Textfield
									min="0"
									type="number"
									step="0.01"
									value={defaultValue}
									onChange={({target: {value: updateValue}}) => {
										this.props.handler(secondField, updateValue);
									}}
									onBlur={(e) => this.validateInchInput(e, secondField)}
							/>);
						case "inputLbs":
							return (<Textfield
									min="0"
									type="number"
									step="0.1"
									value={defaultValue}
									onChange={({target: {value: updateValue}}) => {
										this.props.handler(secondField, updateValue);
									}}
									onBlur={(e) => this.validateLbsInput(e, secondField)}
							/>);
						case "inputSeeds":
							return (<Textfield
									min="1000"
									type="number"
									step="1000"
									helptext={helpText}
									helptextPersistent={helpTextPersistence}
									value={defaultValue}
									onChange={({target: {value: updateValue}}) => {
										this.props.handler(secondField, updateValue);
									}}
									onBlur={(e) => this.validateSeedsInput(e, secondField)}
							/>);
							default :
								null;
						}
					})()}

			</div>}
			</div>

		);
	}
}

export default MyFarmUpdate;

