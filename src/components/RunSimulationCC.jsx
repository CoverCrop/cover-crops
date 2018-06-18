import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Textfield, List, ListItem, ListHeader, Body1, Body2,
	Checkbox, Title, Grid, Cell, Card, CardHeader, CardTitle, CardText, FormField} from "react-mdc-web"
import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';
import "babel-polyfill";
import DatePicker from "react-datepicker";
import {datawolfURL, steps, resultDatasetId, getWithCoverCropExecutionRequest, getWithoutCoverCropExecutionRequest,
	weatherPatterns} from "../datawolf.config";
import config from "../app.config";
import {ID, getOutputFileJson, wait, uploadDatasetToDataWolf, calculateDayOfYear} from "../public/utils";
import {handleStartDateChange, handleEndDateChange, handleCardChange, handleResults, handleFlexibleDatesChange,
	handleWeatherPatternChange} from '../actions/analysis';
import styles from "../styles/analysis-page.css"

class RunSimulationCC extends Component {

	constructor(props) {
		super(props);
		this.runSimulation = this.runSimulation.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleFlexibleDatesChange = this.handleFlexibleDatesChange.bind(this);

		this.state = {
			simulationStatus: "",
			runSimulationButtonDisabled: false,
			withstep1: "",
			withstep2: "",
			withstep3: "",
			withstep4: "",
			withstep5: "",
			withoutstep1: "",
			withoutstep2: "",
			withoutstep3: "",
			withoutstep4: "",
			withoutstep5: "",
			selectedFutureWeatherEndDate: false // true, if user selects end date for which we do not have weather data
		};
	}

	async runSimulation() {
		let that = this;
		let status = "STARTED";
		let personId = sessionStorage.getItem("personId"); // Read person Id from session storage
		this.setState({
			simulationStatus: status,
			runSimulationButtonDisabled: true
		});

		// Update status
		let cardData = {
			cardTitle: this.props.cards[1].cardTitle,
			cardSubtitle: "Status: " + status
		};
		this.props.handleCardChange(1, 1, cardData);

		let headers = {
			'Content-Type': 'application/json',
			'Access-Control-Origin': 'http://localhost:3000'
		};

		let id = ID();
		let { latitude, longitude, weatherPattern, startDate, endDate} = this.props;
		let objStartDate = startDate.toDate();
		let objEndDate = endDate.toDate();
		let plantingYear = objStartDate.getFullYear();
		let plantingDoy = calculateDayOfYear(objStartDate);
		let harvestDoy = calculateDayOfYear(objEndDate);

		let withCoverCropDatasetId = await uploadDatasetToDataWolf(plantingYear, plantingDoy, harvestDoy, true);
		let withoutCoverCropDatasetId = await uploadDatasetToDataWolf(plantingYear, plantingDoy, harvestDoy, false);

		let withCoverCropExecutionRequest = getWithCoverCropExecutionRequest(id, latitude, longitude, personId, weatherPattern, withCoverCropDatasetId);
		let withoutCoverCropExecutionRequest = getWithoutCoverCropExecutionRequest(id, latitude, longitude, personId, weatherPattern, withoutCoverCropDatasetId);

		let withCoverCropCreateExecutionResponse = await fetch(datawolfURL + "/executions", {
			method: 'POST',
			headers: headers,
			credentials: "include",
			body: JSON.stringify(withCoverCropExecutionRequest)
		});

		let withoutCoverCropCreateExecutionResponse = await fetch(datawolfURL + "/executions", {
			method: 'POST',
			headers: headers,
			credentials: "include",
			body: JSON.stringify(withoutCoverCropExecutionRequest)
		});

		const withCoverCropExecutionGUID = await withCoverCropCreateExecutionResponse.text();
		const withoutCoverCropExecutionGUID = await withoutCoverCropCreateExecutionResponse.text();

		console.log("With cover crop execution id = " + withCoverCropExecutionGUID);
		console.log("Without cover crop execution id = " + withoutCoverCropExecutionGUID);


		let withCoverCropAnalysisResult, withoutCoverCropAnalysisResult;
		// check the status until two progresses are finished
		while( this.state.withstep5 === "" || this.state.withstep5 === "WAITING" || this.state.withstep5 === "RUNNING"
		|| this.state.withoutstep5 === "" || this.state.withoutstep5 === "WAITING" || this.state.withoutstep5 === "RUNNING" ){
			await wait(300);
			// Get Execution Result
			const withCoverCropExecutionResponse = await fetch(datawolfURL + "/executions/" + withCoverCropExecutionGUID, {
				method: 'GET',
				headers: headers,
				credentials: "include"
			});

			const withoutCoverCropExecutionResponse = await fetch(datawolfURL + "/executions/" + withoutCoverCropExecutionGUID, {
				method: 'GET',
				headers: headers,
				credentials: "include"
			});
			if(withCoverCropExecutionResponse instanceof Response && withoutCoverCropExecutionResponse instanceof Response){
				withCoverCropAnalysisResult = await withCoverCropExecutionResponse.json();
				withoutCoverCropAnalysisResult = await withoutCoverCropExecutionResponse.json();

				this.setState({withstep1: withCoverCropAnalysisResult.stepState[steps.Weather_Converter]});
				this.setState({withstep2: withCoverCropAnalysisResult.stepState[steps.Soil_Converter]});
				this.setState({withstep3: withCoverCropAnalysisResult.stepState[steps.Generate_Exp]});
				this.setState({withstep4: withCoverCropAnalysisResult.stepState[steps.DSSAT_Batch]});
				this.setState({withstep5: withCoverCropAnalysisResult.stepState[steps.Output_Parser]});
				this.setState({withoutstep1: withoutCoverCropAnalysisResult.stepState[steps.Weather_Converter]});
				this.setState({withoutstep2: withoutCoverCropAnalysisResult.stepState[steps.Soil_Converter]});
				this.setState({withoutstep3: withoutCoverCropAnalysisResult.stepState[steps.Generate_Exp]});
				this.setState({withoutstep4: withoutCoverCropAnalysisResult.stepState[steps.DSSAT_Batch]});
				this.setState({withoutstep5: withoutCoverCropAnalysisResult.stepState[steps.Output_Parser]});
			}
		}
		// for debug
		// console.log(withCoverCropAnalysisResult);
		// console.log(withoutCoverCropAnalysisResult);

		const withCoverCropDatasetResultGUID = withCoverCropAnalysisResult.datasets[resultDatasetId];
		const withoutCoverCropDatasetResultGUID = withoutCoverCropAnalysisResult.datasets[resultDatasetId];
		const outputFilename = "output.json";

		console.log("With cover crop result dataset = " + withCoverCropDatasetResultGUID);
		console.log("Without cover crop result dataset = " + withoutCoverCropDatasetResultGUID);

		if ((withCoverCropDatasetResultGUID !== "ERROR" && withCoverCropDatasetResultGUID !== undefined) &&
			(withoutCoverCropDatasetResultGUID !== "ERROR" && withoutCoverCropDatasetResultGUID !== undefined)) {

			getOutputFileJson(withCoverCropDatasetResultGUID, outputFilename).then(function (withCoverCropResultFile){
				getOutputFileJson(withoutCoverCropDatasetResultGUID, outputFilename).then(function (withoutCoverCropResultFile) {

					status = "COMPLETED";
					that.setState({
						simulationStatus: status,
						runSimulationButtonDisabled: false
					});

					// Update status
					cardData = {
						cardTitle: that.props.cards[1].cardTitle,
						cardSubtitle: "Status: " + status
					};
					that.props.handleCardChange(1, 1, cardData);

					if (withCoverCropExecutionGUID !== "" && withoutCoverCropExecutionGUID !== "") {
						cardData = {
							cardTitle: "Completed Simulation",
							cardSubtitle: "Execution IDs: " + withCoverCropExecutionGUID + " " + withoutCoverCropExecutionGUID
						};
						that.props.handleResults(
							withCoverCropExecutionGUID,
							withCoverCropResultFile,
							withoutCoverCropExecutionGUID,
							withoutCoverCropResultFile
						);
						// that.props.handleCardChange(1, 2, cardData);
						window.location = '/#/history';
					}
					else {
						console.log("Execution ID wasn't generated.");
					}
				})
			})

		}
		else {
			status = "ERROR";
			console.log("Error occurred while running workflow");
			this.setState({
				simulationStatus: status,
				runSimulationButtonDisabled: false
			});

			// Update status
			cardData = {
				cardTitle: this.props.cards[1].cardTitle,
				cardSubtitle: "Status: " + status
			};
			this.props.handleCardChange(1, 1, cardData);
			window.location = '/#/history';
		}
	}

	handleStartDateChange(date) {
		this.props.handleStartDateChange(date)
	}

	handleEndDateChange(date) {

		// Set selectedFutureWeatherEndDate to true if selected termination date if greater than the latest date for
		// which we have weather data
		let endDateString = date.toDate().toISOString().split("T")[0]; // Get YYYY-MM-DD format date string
		this.setState({selectedFutureWeatherEndDate: new Date(endDateString) > new Date(config.latestWeatherDate)});

		this.props.handleEndDateChange(date)
	}

	handleFlexibleDatesChange({target: {checked}}) {
		this.props.handleFlexibleDatesChange(checked)
	}

	handleWeatherPatternChange(weatherPattern){
		this.props.handleWeatherPatternChange(weatherPattern);
	}

	toggleDropdown(e) {
		this.setState({ open: !this.state.open })
	}

	render(){
		let isButtonDisabled = this.state.runSimulationButtonDisabled ? "disabled" : "";
		let weatherbuttons = weatherPatterns.map(w =>
			<Button dense raised={this.props.weatherPattern === w}
					onClick={()=>{ this.props.handleWeatherPatternChange(w) }}
					key={w}
			>{w}</Button>);

		return(
			<div className="run-simulate">
				<div className="black-bottom">
					<Title>Field</Title>
					<Card>
						<CardText>
							<CardTitle>{this.props.cluname}</CardTitle>
							{this.props.latitude} {this.props.longitude}
						</CardText>
					</Card>
				</div>
				<div className="black-bottom select-date">
					<Title>Select Cover Crop Dates</Title>
					<div className="select-date-div">
						<Body1>Establishment </Body1>
						<DatePicker className="date-picker-cc" selected={this.props.startDate}
									selectsStart
									showYearDropdown
									scrollableYearDropdown
									placeholderText="Select an establishment date"
									startDate={this.props.startDate}
									endDate={this.props.endDate}
									onSelect={this.handleStartDateChange}/>
					</div>
					<div className="select-date-div">
						<Body1 >Termination </Body1>
						<DatePicker className="date-picker-cc" selected={this.props.endDate}
									selectsEnd
									showYearDropdown
									scrollableYearDropdown
									placeholderText="Select a termination date"
									startDate={this.props.startDate}
									endDate={this.props.endDate}
									onChange={this.handleEndDateChange}/>

					</div>
					<FormField id="checkbox-label">
						<Checkbox
							onChange={this.handleFlexibleDatesChange}
							checked={this.props.isFlexibleDatesChecked}/>
						<label>Flexible termination dates (+/- two weeks)</label>
					</FormField>
				</div>
				{this.state.selectedFutureWeatherEndDate === false ? null : <div className="black-bottom weather-pattern-div">
					<Title> Weather Pattern</Title>

					{weatherbuttons}
				</div>}
				<div className="run-button">
					<Button disabled={isButtonDisabled} raised onClick={this.runSimulation} >Run Simulation</Button>

				</div></div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		startDate: state.analysis.startDate,
		endDate: state.analysis.endDate,
		longitude: state.analysis.longitude,
		latitude: state.analysis.latitude,
		cluname: state.analysis.cluname,
		weatherPattern: state.analysis.weatherPattern,
		cards: state.analysis.cards,
		isFlexibleDatesChecked: state.analysis.isFlexibleDatesChecked
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleStartDateChange: (date) => {
			dispatch(handleStartDateChange(date));
		},
		handleEndDateChange: (date) => {
			dispatch(handleEndDateChange(date));
		},
		handleWeatherPatternChange: (weatherPattern) => {
			dispatch(handleWeatherPatternChange(weatherPattern));
		},
		handleFlexibleDatesChange: (checked) =>{
			dispatch(handleFlexibleDatesChange(checked))
		},
		handleCardChange: (oldCardIndex, newCardIndex, oldCardData) => {
			dispatch(handleCardChange(oldCardIndex, newCardIndex, oldCardData))
		},
		handleResults: (withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson) => {
			dispatch(handleResults(withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(RunSimulationCC);
