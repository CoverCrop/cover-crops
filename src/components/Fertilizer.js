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

class Fertilizer extends Component {

	constructor(props) {
		super(props);
		this.state ={};
	}

	componentDidMount() {
		this.props.onRef(this)
	}
	componentWillUnmount() {
		this.props.onRef(undefined)
	}

	componentWillReceiveProps(nextProps) {
		let year = nextProps.year;
		if(year){
			let selectcrop = this.props.cropobj[year]["MF"];
			this.setState(selectcrop);
			let fdate = selectcrop["FDATE"];
			console.log(convertFullDate(fdate));
			this.setState({"FDATE":convertFullDate(fdate)});
		}
	}

	postToDatawolf(){
		var jsonBody = this.state;
		let {email, clu, year } =  this.props;
		if(jsonBody["FDATE"]){

			jsonBody["FERNAME"] = year;
			jsonBody["FDATE"] = jsonBody["FDATE"].replace(/-/g, '').substring(0, 8);
			jsonBody["EVENT"] = "fertilizer";

			jsonBody = [jsonBody];
			console.log(jsonBody)

			fetch(config.CLUapi + "/api/users/" + email + "/CLUs/" + clu + "/experiment_file_json"  , {
				method: 'PATCH',
				data: jsonBody,
				headers:{
					'Content-Type': 'application/json',
					"Access-Control-Origin": "http://localhost:3000"
				},
				credentials: "include"
			}).then(res => console.error('Error:', error))
				.catch(error => console.error('Error:', error))
		}
	}

	handler = (field_name, field_value) => {
		this.setState({[field_name] : field_value});
	}

	render() {
		return (

				(this.state.FDATE)?
					<div className="black-bottom">
						<Title>Fertilizer </Title>
						<MyFarmUpdate elementType="select" title="MATERIAL" cropyear={this.state.year}
									  firstField="MF" secondField="FMCD" options={FMCD}
									  defaultValue={this.state.FMCD} handler = {this.handler}
						/>
						<MyFarmUpdate elementType="select" title="APPLICATION" cropyear={this.state.year}
						firstField="MF" secondField="FACD" options={FACD}
						defaultValue={selectcrop["FACD"]} handler = {this.handler}
						/>
						<MyFarmUpdate elementType="input" title="AMOUNT, lb/acre" cropyear={this.state.year}
						firstField="MF" secondField="FAMN"
						defaultValue={selectcrop["FAMN"]} handler = {this.handler}
						/>
						<MyFarmUpdate elementType="date" title="DATE APPLIED" cropyear={this.state.year}
									  firstField="MF" secondField="FDATE"
									  defaultValue={this.state.FDATE} handler = {this.handler}
						/>

					</div> : <p>No data for this year</p>

		)
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		clu: state.user.clu,
		cropobj: state.user.cropobj,
	}
};

export default connect(mapStateToProps, null)(Fertilizer);

