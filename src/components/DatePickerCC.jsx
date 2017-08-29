import React, {Component} from "react";
import {Button, Textfield, Body1} from "react-mdc-web"
import DatePicker from "react-datepicker";

class DatePickerCC extends Component {

	render() {
		if (this.props.startDate) {
			return (
				<div>
					<Body1>{this.props.label}</Body1>
					<DatePicker className="date-picker-cc" selected={this.props.state.startDate}
								selectsStart
								showYearDropdown
								scrollableYearDropdown
								placeholderText={this.props.placeholderText}
								startDate={this.props.state.startDate}
								endDate={this.props.state.endDate}
								onChange={this.props.onChange}/>
				</div>
			);
		}
		else if (this.props.endDate){
			return (
				<div>
					<Body1>{this.props.label}</Body1>
					<DatePicker className="date-picker-cc" selected={this.props.state.endDate}
								selectsEnd
								showYearDropdown
								scrollableYearDropdown
								placeholderText={this.props.placeholderText}
								startDate={this.props.state.startDate}
								endDate={this.props.state.endDate}
								onChange={this.props.onChange}/>
				</div>
			);
		}
	}
}

export default DatePickerCC;
