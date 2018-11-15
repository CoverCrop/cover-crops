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
import {uploadDatasetToDataWolf, readTable, convertFullDate} from "../public/utils";
import MyFarmUpdate from "./MyFarmUpdate";
import {FACD, FMCD} from "../experimentFile";
import {connect} from "react-redux";
import {handleCropChange} from "../actions/user";
import Fertilizer from "./Fertilizer";

class CropHistory extends Component {

	constructor(props) {
		super(props);
		this.state ={
			year: this.props.cropobj? undefined: this.props.cropobj.keys()[0]
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleSelectYear =(year) =>{
		this.setState({year: year} );
	}

	handleClick(){
		this.fertilizer.postToDatawolf();
	}

	render() {
		let years = Object.keys(this.props.cropobj).filter(obj => obj.indexOf("Corn") > 0 || obj.indexOf("Soybean") > 0 );
		let options = years.map(function(key){
			return {value: key, label:key}
		});
		return (

			<div className="border-top summary-div myfarm-input">

				<div className="black-bottom">
					<div className="update-box">
						<p>YEAR</p>
						<Select
							name="year"
							value={this.state.year}
							options={options}
							onChange={selectedOption => this.handleSelectYear(selectedOption.value)}
						/>
					</div>
				</div>
				<Fertilizer year={this.state.year} onRef={ref => (this.fertilizer = ref)}/>
				{this.state.year && <Button raised onClick={() => this.handleClick()}>UPDATE</Button>}
			</div>


		)
	}
}

const mapStateToProps = (state) => {
	return {
		exptxt: state.user.exptxt,
		cropobj: state.user.cropobj,
	}
};




export default connect(mapStateToProps, null)(CropHistory);

