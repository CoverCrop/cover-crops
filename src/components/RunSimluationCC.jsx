import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Textfield, List, ListItem, ListHeader, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web"
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import "babel-polyfill";
import DatePicker from "react-datepicker";
import {datawolfURL, steps, getWithCoverCropExecutionRequest, getWithoutCoverCropExecutionRequest,
	weatherPatterns} from "../datawolf.config";
import {handleStartDateChange, handleEndDateChange, handleCardChange, handleResults, handleFlexibleDatesChange,
	handleWeatherPatternChange} from '../actions/analysis'

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RunSimulationCC extends Component {

	constructor(props) {
		super(props);
		this.runSimulation = this.runSimulation.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleFlexibleDatesChange = this.handleFlexibleDatesChange.bind(this);
		this.parameters = {
			soilWithCoverCrop: "26bd9c56-10d5-4669-af6c-f56bc8d0e5d5", // LAW1501.SQX
			modelWithCoverCrop: "e96ec549-031f-4cef-8328-f4d8051773ec", // CH441169-cover.v46
			soilWithoutCoverCrop: "3690d7fb-eba5-48c7-bfbe-a792ff379fb4", // ILAO1501.SQX
			modelWithoutCoverCrop: "ff590fee-b691-42cd-9d8f-ed0205b72d21" // CH441169-nocover.v46
		};

		this.state = {
			withCoverCropExecutionId: "",
			withCoverCropResultJson: null,
			withoutCoverCropExecutionId: "",
			withoutCoverCropResultJson: null,
			simulationStatus: "",
			runSimulationButtonDisabled: false,
			withstep1: "",
			withstep2: "",
			withstep3: "",
			withstep4: "",
			withoutstep1: "",
			withoutstep2: "",
			withoutstep3: "",
			withoutstep4: "",
		};
	}

	async runSimulation() {

		let status = "STARTED";
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
			// Add authorization here
		};

		let withCoverCropExecutionRequest = getWithCoverCropExecutionRequest(this.props.latitude, this.props.longitude);
		let withoutCoverCropExecutionRequest = getWithoutCoverCropExecutionRequest(this.props.latitude, this.props.longitude);

		let withCoverCropCreateExecutionResponse = await fetch(datawolfURL + "/executions", {
			method: 'POST',
			headers: {
				// Add authorization here
				'Content-Type': 'application/json',
				'Access-Control-Origin': 'http://localhost:3000'
			},
			body: JSON.stringify(withCoverCropExecutionRequest)
		});

		let withoutCoverCropCreateExecutionResponse = await fetch(datawolfURL + "/executions", {
			method: 'POST',
			headers: {
				// Add authorization here
				'Content-Type': 'application/json',
				'Access-Control-Origin': 'http://localhost:3000'
			},
			body: JSON.stringify(withoutCoverCropExecutionRequest)
		});

		const withCoverCropExecutionGUID = await withCoverCropCreateExecutionResponse.text();
		const withoutCoverCropExecutionGUID = await withoutCoverCropCreateExecutionResponse.text();

		console.log("With cover crop execution id = " + withCoverCropExecutionGUID);
		console.log("Without cover crop execution id = " + withoutCoverCropExecutionGUID);


		var withCoverCropAnalysisResult, withoutCoverCropAnalysisResult;
        // check the status until two progresses are finished
        while( this.state.withstep4 === "" || this.state.withstep4 === "WAITING" || this.state.withstep4 === "RUNNING"
			|| this.state.withoutstep4 === "" || this.state.withoutstep4 === "WAITING" || this.state.withoutstep4 === "RUNNING" ){
			await wait(300);
			// Get Execution Result
			const withCoverCropExecutionResponse = await fetch(datawolfURL + "/executions/" + withCoverCropExecutionGUID, {
				method: 'GET',
				headers: headers,
			});

			const withoutCoverCropExecutionResponse = await fetch(datawolfURL + "/executions/" + withoutCoverCropExecutionGUID, {
				method: 'GET',
				headers: headers,
			});
			if(withCoverCropExecutionResponse instanceof Response && withoutCoverCropExecutionResponse instanceof Response){
				withCoverCropAnalysisResult = await withCoverCropExecutionResponse.json();
				withoutCoverCropAnalysisResult = await withoutCoverCropExecutionResponse.json();

				this.setState({withstep1: withCoverCropAnalysisResult.stepState[steps.Weather_Converter]});
				this.setState({withstep2: withCoverCropAnalysisResult.stepState[steps.Soil_Converter]});
				this.setState({withstep3: withCoverCropAnalysisResult.stepState[steps.DSSAT_Batch]});
				this.setState({withstep4: withCoverCropAnalysisResult.stepState[steps.Output_Parser]});
				this.setState({withoutstep1: withoutCoverCropAnalysisResult.stepState[steps.Weather_Converter]});
				this.setState({withoutstep2: withoutCoverCropAnalysisResult.stepState[steps.Soil_Converter]});
				this.setState({withoutstep3: withoutCoverCropAnalysisResult.stepState[steps.DSSAT_Batch]});
				this.setState({withoutstep4: withoutCoverCropAnalysisResult.stepState[steps.Output_Parser]});
			}
		}
		// for debug
		// console.log(withoutCoverCropAnalysisResult)

		const withCoverCropDatasetResultGUID = withCoverCropAnalysisResult.datasets["2623a440-1f16-4110-83c4-5ebf39cb0e35"];
		const withoutCoverCropDatasetResultGUID = withoutCoverCropAnalysisResult.datasets["2623a440-1f16-4110-83c4-5ebf39cb0e35"];

		console.log("With cover crop result dataset = " + withCoverCropDatasetResultGUID);
		console.log("Without cover crop result dataset = " + withoutCoverCropDatasetResultGUID);

		if ((withCoverCropDatasetResultGUID !== "ERROR" && withCoverCropDatasetResultGUID !== undefined) &&
			(withoutCoverCropDatasetResultGUID !== "ERROR" && withoutCoverCropDatasetResultGUID !== undefined)) {

			// Get - Result Dataset
			const withCoverCropResponse = await fetch(datawolfURL + "/datasets/" + withCoverCropDatasetResultGUID, {
				method: 'GET',
				headers: headers,
			});
			const withoutCoverCropResponse = await fetch(datawolfURL + "/datasets/" + withoutCoverCropDatasetResultGUID, {
				method: 'GET',
				headers: headers,
			});

			const withCoverCropResultDataset = await withCoverCropResponse.json();
			const withoutCoverCropResultDataset = await withoutCoverCropResponse.json();

			let withCoverCropFileDescriptorGUID = -1;
			let withoutCoverCropFileDescriptorGUID = -1;

			for (let i = 0; i < withCoverCropResultDataset.fileDescriptors.length; i++) {
				if (withCoverCropResultDataset.fileDescriptors[i].filename === "output.json") {
					withCoverCropFileDescriptorGUID = withCoverCropResultDataset.fileDescriptors[i].id;
					break;
				}
			}

			for (let i = 0; i < withoutCoverCropResultDataset.fileDescriptors.length; i++) {
				if (withoutCoverCropResultDataset.fileDescriptors[i].filename === "output.json") {
					withoutCoverCropFileDescriptorGUID = withoutCoverCropResultDataset.fileDescriptors[i].id;
					break;
				}
			}

			// Get - Result File Download
			const withCoverCropFileDownloadResponse = await fetch(datawolfURL + "/datasets/"
				+ withCoverCropDatasetResultGUID + "/" + withCoverCropFileDescriptorGUID + "/file",
				{
					method: 'GET',
					headers: headers,
				});

			const withoutCoverCropFileDownloadResponse = await fetch(datawolfURL + "/datasets/"
				+ withoutCoverCropDatasetResultGUID + "/" + withoutCoverCropFileDescriptorGUID + "/file",
				{
					method: 'GET',
					headers: headers,
				});

			const withCoverCropResultFile = await withCoverCropFileDownloadResponse.json();
			const withoutCoverCropResultFile = await withoutCoverCropFileDownloadResponse.json();

			//console.log("With Cover Crop Result JSON: ");
			//console.log(withCoverCropResultFile);

			//console.log("Without Cover Crop Result JSON: ");
			//console.log(withoutCoverCropResultFile);

			this.setState({
				withCoverCropResultJson: withCoverCropResultFile,
				withCoverCropExecutionId: withCoverCropExecutionGUID,
				withoutCoverCropResultJson: withoutCoverCropResultFile,
				withoutCoverCropExecutionId: withoutCoverCropExecutionGUID
			});

			//console.log(withCoverCropAnalysisResult);
			//console.log(withoutCoverCropAnalysisResult);

			status = "COMPLETED";
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

			if (this.state.withCoverCropExecutionId !== "" && this.state.withoutCoverCropExecutionId !== "") {
				cardData = {
					cardTitle: "Completed Simulation",
					cardSubtitle: "Execution IDs: " + this.state.withCoverCropExecutionId + " " + this.state.withoutCoverCropExecutionId
				};
				this.props.handleResults(
					this.state.withCoverCropExecutionId,
					this.state.withCoverCropResultJson,
					this.state.withoutCoverCropExecutionId,
					this.state.withoutCoverCropResultJson
				);
				this.props.handleCardChange(1, 2, cardData);
			}
			else {
				console.log("Execution ID wasn't generated.");
			}
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

		}
	}

	handleStartDateChange(date) {
		this.props.handleStartDateChange(date)
	}

	handleEndDateChange(date) {
		this.props.handleEndDateChange(date)
	}

	handleFlexibleDatesChange({target: {checked}}) {
		this.props.handleFlexibleDatesChange(checked)
	}

	handleWeatherPatternChange = (weatherPattern) => {
		this.props.handleWeatherPatternChange(weatherPattern.value);
	}

	toggleDropdown(e) {
		this.setState({ open: !this.state.open })
	}



	render(){
		let isButtonDisabled = this.state.runSimulationButtonDisabled ? "disabled" : "";
	    let options = weatherPatterns.map(w => Object.assign({ value: w, label: w }))
		return(
			<div>
					<Body1>Establishment Date: </Body1>
					<DatePicker className="date-picker-cc" selected={this.props.startDate}
								selectsStart
								showYearDropdown
								scrollableYearDropdown
								placeholderText="Select an establishment date"
								startDate={this.props.startDate}
								endDate={this.props.endDate}
								onSelect={this.handleStartDateChange}/>

					<Body1>Termination Date: </Body1>
					<DatePicker className="date-picker-cc" selected={this.props.endDate}
								selectsStart
								showYearDropdown
								scrollableYearDropdown
								placeholderText="Select an establishment date"
								startDate={this.props.startDate}
								endDate={this.props.endDate}
								onChange={this.handleEndDateChange}/>

				<FormField id="checkbox-label">
					<Checkbox
						onChange={this.handleFlexibleDatesChange}
						checked={this.props.isFlexibleDatesChecked}/>
					<label>Flexible termination dates (+/- two weeks)</label>
				</FormField>

				<Body1> Weather Pattern:</Body1>

				<Select
					className="weather-pattern"
					name="weatherPattern"
					value={this.props.weatherPattern}
					onChange={this.handleWeatherPatternChange}
					options={options}
				/>

				<br/>
				<Button disabled={isButtonDisabled} raised primary onClick={this.runSimulation}>Run Simulation</Button>
				<Grid>
					<Cell col={6}>
						{this.state.withstep1 === "" ? null: <ListHeader>With Cover Crop</ListHeader> }
					<List>
						<div>
							{this.state.withstep1 === "" ? null: <ListItem>Prepare Weather Data: {this.state.withstep1}</ListItem>}
							{this.state.withstep2 === "" ? null: <ListItem>Prepare Soil Data: {this.state.withstep2}</ListItem>}
							{this.state.withstep3 === "" ? null: <ListItem>Run DSSAT Model: {this.state.withstep3}</ListItem>}
							{this.state.withstep4 === "" ? null: <ListItem>Generate Graphs: {this.state.withstep4}</ListItem>}
						</div>
					</List>
					</Cell>
					<Cell col={6}>
						{this.state.withoutstep1 === "" ? null: <ListHeader>Without Cover Crop</ListHeader> }
						<List>
							<div>
								{this.state.withoutstep1 === "" ? null: <ListItem>Prepare Weather Data: {this.state.withoutstep1}</ListItem>}
								{this.state.withoutstep2 === "" ? null: <ListItem>Prepare Soil Data: {this.state.withoutstep2}</ListItem>}
								{this.state.withoutstep3 === "" ? null: <ListItem>Run DSSAT Model: {this.state.withoutstep3}</ListItem>}
								{this.state.withoutstep4 === "" ? null: <ListItem>Generate Graphs: {this.state.withoutstep4}</ListItem>}
							</div>
						</List>

					</Cell>
				</Grid>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		startDate: state.analysis.startDate,
		endDate: state.analysis.endDate,
		longitude: state.analysis.longitude,
		latitude: state.analysis.latitude,
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
