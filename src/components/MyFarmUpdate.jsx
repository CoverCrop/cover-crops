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
import {convertDayString, convertFullDate, dictToOptions} from "../public/utils";
import {connect} from "react-redux";
import {handleCropChange} from "../actions/user";

class MyFarmUpdate extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {elementType, firstField, secondField, cropobj, handleCropChange, cropyear} = this.props;
		const options = (elementType !== "select" || Array.isArray(this.props.options))? this.props.options: dictToOptions(this.props.options);
		const defaultValue = cropobj[cropyear][firstField][secondField];
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
									onChange={selectedOption => handleCropChange(cropobj, cropyear, firstField, secondField, selectedOption.value)}
								/>);

							case "date":
								return (<DatePicker className="date-picker-cc"
													selected={moment(convertFullDate(defaultValue))}
													onChange={moment =>
														handleCropChange(cropobj, cropyear, firstField, secondField, convertDayString(moment))
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
										handleCropChange(cropobj, cropyear, firstField, secondField, updateValue)
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

const mapStateToProps = (state) => {
	return {
		exptxt: state.user.exptxt,
		cropobj: state.user.cropobj,
		fieldobj: state.user.fieldobj
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleCropChange: (cropobj, cropyear, firstField, secondField, updateValue) => {
			dispatch(handleCropChange(cropobj, cropyear, firstField, secondField, updateValue))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MyFarmUpdate);

