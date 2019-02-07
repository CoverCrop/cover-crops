import React, {Component} from "react";
import {Title} from "react-mdc-web";
import config from "../app.config";
import {convertFullDate, getExperimentSQX} from "../public/utils";
import MyFarmUpdate from "./MyFarmUpdate";
import {defaultFertilizer, FACD, FMCD} from "../experimentFile";
import {connect} from "react-redux";
import {handleExptxtGet} from "../actions/user";

class Fertilizer extends Component {

	constructor(props) {
		super(props);
		this.state ={FMCD: null};
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
			let selectcrop = this.props.cropobj[year]["MF"][0];
			this.setState({FMCD: "None"});

			if(selectcrop){
				this.setState(selectcrop);
				let fdate = selectcrop["FDATE"];
				console.log(convertFullDate(fdate));
				this.setState({"FDATE":convertFullDate(fdate)});
			}
			else{
				this.setState({"FDATE":null});
			}
		}
	}

	getBodyJson(){
		var jsonBody= {};
		jsonBody["CONTENT"]	= [Object.assign({}, this.state)];
		let {email, clu, year } =  this.props;
		if(jsonBody["CONTENT"][0]["FMCD"] === "None"){
			jsonBody["CONTENT"] = []
		} else {
			jsonBody["CONTENT"][0]["FDATE"] = jsonBody["CONTENT"][0]["FDATE"].replace(/-/g, '').substring(0, 8);
		}
		jsonBody["FERNAME"] = year;

		jsonBody["EVENT"] = "fertilizer";

		return jsonBody;
	}


	handler = (field_name, field_value) => {
		this.setState({[field_name] : field_value});
		// add fertilizer
		if(field_name === "FMCD" && field_value !=="None" && !this.state.FDATE){
			let pureyear = this.props.year.split(" ")[0];
			let newFertilizer = Object.assign({}, defaultFertilizer);
			// set default date as 04-02
			newFertilizer["FDATE"] = new Date(pureyear, 3, 2).toISOString();
			newFertilizer["FERNAME"] = this.props.year;
			this.setState(newFertilizer);
		}
		// delete fertilizer
		if(field_name === "FMCD" && field_value ==="None"){
			this.setState({FDATE:undefined})
		}
	}

	render() {
		return (
			(this.state.FMCD) ?
			<div className="black-bottom-crop">
				<Title>Fertilizer </Title>
				<MyFarmUpdate elementType="select" title="MATERIAL" cropyear={this.state.year}
							  firstField="MF" secondField="FMCD" options={FMCD}
							  defaultValue={this.state.FMCD} handler = {this.handler}
				/>
				{this.state.FDATE? <div>
					<MyFarmUpdate elementType="select" title="APPLICATION" cropyear={this.state.year}
								  firstField="MF" secondField="FACD" options={FACD}
								  defaultValue={this.state.FACD} handler={this.handler}
					/>
					<div className="update-box-div">
						< MyFarmUpdate isLeft elementType="input" title="AMOUNT, lb/acre" cropyear={this.state.year}
									   firstField="MF" secondField="FAMN"
									   defaultValue={this.state.FAMN} handler = {this.handler}
						/>
						<MyFarmUpdate isLeft elementType="input" title="DEPTH, in" cropyear={this.state.year}
									  firstField="MF" secondField="FDEP"
									  defaultValue={this.state.FDEP} handler = {this.handler}
						/>
					</div>
					<MyFarmUpdate elementType="date" title="DATE APPLIED" cropyear={this.state.year}
								  firstField="MF" secondField="FDATE"
								  defaultValue={this.state.FDATE} handler = {this.handler}
					/>

				</div>: null}
			</div> :<div></div>
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

