import React, {Component} from "react";
import {Title} from "react-mdc-web";
import {convertFullDate} from "../public/utils";
import MyFarmUpdate from "./MyFarmUpdate";
import {connect} from "react-redux";

class Harvest extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	handler = (field_name, field_value) => {
		this.setState({[field_name]: field_value});
	};
	componentDidMount() {
		this.props.onRef(this);
		let year = this.props.year;
		this.setInitialState(this.props, year);
	}

	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	componentWillReceiveProps(nextProps) {
		let year = nextProps.year;
		if(nextProps.year !== this.props.year) {
			this.setInitialState(nextProps, year);
		}
	}

	setInitialState(nextProps, year) {
		if (year) {
			if (nextProps.cropobj[year]){
				let selectcrop = nextProps.cropobj[year]["MH"];
				this.setState(selectcrop);
				let pdate = selectcrop["HDATE"];
				// console.log(convertFullDate(pdate));
				this.setState({"HDATE": convertFullDate(pdate)});
			}
			else {
				this.setDefault();
			}

		}
	}

	getBodyJson(){
		let jsonBody = {};
		jsonBody["CONTENT"]	= [Object.assign({}, this.state)];
		let {year} = this.props;
		if (jsonBody["CONTENT"][0]["HDATE"]) {

			jsonBody["HNAME"] = year;
			jsonBody["CONTENT"][0]["HPC"] = "100";
			jsonBody["CONTENT"][0]["HSTG"] = "GS000";
			jsonBody["CONTENT"][0]["HDATE"] = jsonBody["CONTENT"][0]["HDATE"].replace(/-/g, "").substring(0, 8);
			jsonBody["EVENT"] = "harvest";
			return jsonBody;

		}
		else {
			return {
				"EVENT": "harvest",
				"HNAME": year,
				"CONTENT": []
			};
		}

	}

	setDefault() {
		let newHarvest = {};
		let pureyear = this.props.year.split(" ")[0];
		// set default date as 09-22
		if ( this.props.type === "cashcrop"){
			// set default date as 09-21
			newHarvest["HDATE"] = new Date(pureyear, 8, 21).toISOString();
		}
		else {
			// for cover crop, set default date as 04-21 of next year
			newHarvest["HDATE"] = new Date(parseInt(pureyear) + 1, 3, 21).toISOString();
		}

		this.setState(newHarvest);
	}


	render() {
		return (
			(this.state.HDATE) ?
				<div className="black-top-crop" key="harvest">
					<Title>{this.props.title} </Title>

					<MyFarmUpdate elementType="date" title="DATE HARVESTED" cropyear={this.state.year}
												firstField="MP" secondField="HDATE"
												defaultValue={this.state.HDATE} handler = {this.handler}
					/>
				</div> : <div />

		);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		clu: state.user.clu,
		cropobj: state.user.cropobj,
	};
};

export default connect(mapStateToProps, null)(Harvest);
