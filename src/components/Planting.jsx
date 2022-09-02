import React, {Component} from "react";
import {Title} from "react-mdc-web";
import {
	convertFullDate,
	convertPerSqMeterToPerAcre,
	convertPerAcreToPerSqMeter, convertCmToInches, convertInchesToCm,
} from "../public/utils";
import MyFarmUpdate from "./MyFarmUpdate";
import {defaultCashcropPlanting, defaultCovercropPlanting, PLDS} from "../experimentFile";
import {connect} from "react-redux";

class Planting extends Component {

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
			// Display current planting and harvest dates only for cash or cover crops.
			if (nextProps.cropobj[year] && year.includes("Fallow") === false){
				let selectcrop = nextProps.cropobj[year]["MP"] ;
				this.setState(selectcrop);
				let pdate = selectcrop["PDATE"];
				this.setState({"PDATE": convertFullDate(pdate)});

				this.setState({"PPOP": convertPerSqMeterToPerAcre(selectcrop["PPOP"]).toString()});
				this.setState({"PLRS": convertCmToInches(selectcrop["PLRS"]).toString()});
				this.setState({"PLDP": convertCmToInches(selectcrop["PLDP"]).toString()});
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
		if (jsonBody["CONTENT"][0]["PDATE"]) {

			jsonBody["PLNAME"] = year;
			jsonBody["CONTENT"][0]["PPOP"] = convertPerAcreToPerSqMeter(jsonBody["CONTENT"][0]["PPOP"]);
			jsonBody["CONTENT"][0]["PPOE"] = jsonBody["CONTENT"][0]["PPOP"];
			jsonBody["CONTENT"][0]["PDATE"] = jsonBody["CONTENT"][0]["PDATE"].replace(/-/g, "").substring(0, 8);

			jsonBody["CONTENT"][0]["PLRS"] = convertInchesToCm(jsonBody["CONTENT"][0]["PLRS"]);
			jsonBody["CONTENT"][0]["PLDP"] = convertInchesToCm(jsonBody["CONTENT"][0]["PLDP"]);

			jsonBody["EVENT"] = "planting";
			return jsonBody;

		}
		else {
			return {
				"EVENT": "planting",
				"HNAME": year,
				"CONTENT": []
			};
		}

	}

	setDefault(){
		let newPlanting;
		let pureyear = this.props.year.split(" ")[0];
		// set default date as 04-22
		if (this.props.type === "cashcrop") {
			newPlanting = Object.assign({}, defaultCashcropPlanting);
			// set default date as 04-22
			newPlanting["PDATE"] = new Date(pureyear, 3, 22).toISOString();
			this.setState({helpText: ""});
		}
		else { //covercrop
			newPlanting = Object.assign({}, defaultCovercropPlanting);
			// set default date as 09-22
			newPlanting["PDATE"] = new Date(pureyear, 8, 22).toISOString();
			this.setState({helpText: "For cereal rye, 1 lb ≈ 18000 seeds"});
		}
		this.setState(newPlanting);
	}


	render() {
		return (
			(this.state.PDATE) ?
				<div className="black-top-crop" key="planting">
					<Title>{this.props.title} </Title>

					<MyFarmUpdate elementType="select" title="DISTRIBUTION" cropyear={this.state.year}
												firstField="MP" secondField="PLDS" options={PLDS}
												defaultValue={this.state.PLDS} handler = {this.handler}
					/>

					<div className="update-box-div">
						<MyFarmUpdate isLeft elementType="inputInch" title="ROW SPACING, inch" cropyear={this.state.year}
												firstField="MP" secondField="PLRS"
												defaultValue={this.state.PLRS} handler = {this.handler}
						/>
						<MyFarmUpdate isLeft elementType="inputInch" title="DEPTH, inch" cropyear={this.state.year}
												firstField="MP" secondField="PLDP"
												defaultValue={this.state.PLDP} handler = {this.handler}
						/>
						<MyFarmUpdate isLeft elementType="inputSeeds" title="POP, seeds/acre" cropyear={this.state.year}
												firstField="MP" secondField="PPOP" helpText={this.state.helpText} helpTextPersistence={true}
												defaultValue={this.state.PPOP} handler = {this.handler}
						/>
					</div>
					<div>
						<MyFarmUpdate elementType="date" title="DATE PLANTED" cropyear={this.state.year}
												firstField="MP" secondField="PDATE"
												defaultValue={this.state.PDATE} handler = {this.handler}
						/>
					</div>

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

export default connect(mapStateToProps, null)(Planting);
