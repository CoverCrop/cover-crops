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
	CardTitle
} from "react-mdc-web";
import Select from 'react-select';

import config from "../app.config";
import {expfail, expsuccess} from "../app.messages";
import {uploadDatasetToDataWolf,readTable} from "../public/utils";
import MyFarmUpdate from "./MyFarmUpdate";
import {FMCD } from "../experimentFile";
import {connect} from "react-redux";

class CropHistory extends Component {

	constructor(props) {
		super(props);
		//TODO: use the first one.
		this.state ={
			selectcrop: this.props.cropobj["2017 Corn"],
			year: "2017 Corn"
		};
	}



	render() {
		let years = Object.keys(this.props.cropobj).filter(obj => obj.indexOf("Corn") > 0 || obj.indexOf("Soybean") > 0 );
		let options = years.map(function(key){
			return {value: key, label:key}
		});
		console.log(this.state.selectcrop)
		let {selectcrop} = this.state;

		return (

			<div className="border-top summary-div myfarm-input">

					<div className="black-bottom">
						<p>YEAR</p>
						<Select
							name="year"
							value={this.state.year}
							options={options}
							onChange={selectedOption => this.setState({
								year: selectedOption.value,
								selectcrop: this.props.cropobj[selectedOption.value]
							})
							}
						/>
					</div>
				{selectcrop && <div>
					<div className="black-bottom">
						<Title>Fertilizer </Title>
						<MyFarmUpdate elementType="select"  title="MATERIAL" defaultValue={selectcrop["MF"]["FMCD"]} options={FMCD}/>
						<Select
							name="year"
							value={this.state.year}
							options={options}
							onChange={selectedOption => this.setState({
								year: selectedOption.value,
								selectcrop: this.props.cropobj[selectedOption.value]
							})
							}
						/>
					</div>
				</div>
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

export default connect(mapStateToProps, null)(CropHistory);

