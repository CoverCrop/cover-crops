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
import {connect} from "react-redux";
import {handleCropChange, setSelectedUserEventStatus} from "../actions/user";
import {handleResults} from "../actions/analysis";

class MyFarmUpdate extends Component {

	constructor(props) {
		super(props);
		// TODO: remove
		this.state ={
			updateValue:this.props.defaultValue,
		};
	}

	render() {
		const {elementType, firstField, secondField, cropobj, handleCropChange, cropyear} = this.props;
		const options = Array.isArray(this.props.options)? this.props.options: dictToOptions(this.props.options);
		const defaultValue = cropobj[cropyear][firstField][secondField];
		return (
			<div className="update-box">
				<p>{this.props.title}</p>
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
							//	TODO: onchange
							case "date":
								return (<DatePicker className="date-picker-cc" selected={this.state.updateValue}
													selectsEnd
													showYearDropdown
													scrollableYearDropdown
								/>);
							case "input":
								return (<Textfield
									value={this.state.updateValue}
									onChange={({target: {value: updateValue}}) => {
										this.setState({updateValue})
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

