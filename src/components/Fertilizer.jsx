import React, {Component} from "react";
import {Title} from "react-mdc-web";
import config from "../app.config";
import {convertFullDate, getExperimentSQX} from "../public/utils";
import MyFarmUpdate from "./MyFarmUpdate";
import {FACD, FMCD} from "../experimentFile";
import {connect} from "react-redux";
import {handleExptxtGet} from "../actions/user";

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

			fetch(config.CLUapi + "/api/users/" + email + "/CLUs/" + clu + "/experiment_file_json"  , {
				method: "PATCH",
				body: JSON.stringify(jsonBody),
				headers:{
					'Content-Type': 'application/json',
					"Access-Control-Origin": "http://localhost:3000"
				},
				credentials: "include"
			}).then(response => {return response.json();})
				.then(dataset_json => {
					getExperimentSQX(email, clu).then(exptxt => {
						this.props.handleExptxtGet(exptxt);
					})
				})
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
						defaultValue={this.state.FACD} handler = {this.handler}
						/>
						<MyFarmUpdate elementType="input" title="AMOUNT, lb/acre" cropyear={this.state.year}
						firstField="MF" secondField="FAMN"
						defaultValue={this.state.FAMN} handler = {this.handler}
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

const mapDispatchToProps = (dispatch) => {
	return {
		handleExptxtGet: (exptxt) => {
			dispatch(handleExptxtGet(exptxt));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Fertilizer);

