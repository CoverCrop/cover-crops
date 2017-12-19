import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Textfield, Body1, Body2, Checkbox, FormField} from "react-mdc-web"
import 'react-datepicker/dist/react-datepicker.css';
import "babel-polyfill";
import DatePicker from "react-datepicker";
import {datawolfURL} from "../datawolf.config";
import {handleStartDateChange, handleEndDateChange, handleCardChange, handleResults} from '../actions/analysis'

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
			runSimulationButtonDisabled: false
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

		const withCoverCropExecutionRequest = {
			"workflowId" : "e9bdff07-e5f7-4f14-8afc-4abb87c7d5a2",
			"creatorId" : "f864b8d7-8dce-4ed3-a083-dd73e8291181",
			"title" : "dssat-batch-run",
			"parameters" : {
				"687efc8a-9055-4fab-b91b-25c44f0c6724" : this.props.latitude,
				"23a0962a-0548-4b85-c183-c17ad45326fc" : this.props.longitude,
				"76a57476-094f-4331-f59f-0865f1341108" : this.props.latitude,
				"dcceaa12-2bc6-4591-8e14-026c3bad64fd" : this.props.longitude
			},
			"datasets" : {
				// With cover crop
				"323c6613-4037-476c-9b9c-f51ba0940eaf" : this.parameters.soilWithCoverCrop,
				"7db036bf-019f-4c01-e58d-14635f6f799d" : this.parameters.modelWithCoverCrop
			}
		};

		const withoutCoverCropExecutionRequest = {
			"workflowId" : "e9bdff07-e5f7-4f14-8afc-4abb87c7d5a2",
			"creatorId" : "f864b8d7-8dce-4ed3-a083-dd73e8291181",
			"title" : "dssat-batch-run",
			"parameters" : {
				"687efc8a-9055-4fab-b91b-25c44f0c6724" : this.props.latitude,
				"23a0962a-0548-4b85-c183-c17ad45326fc" : this.props.longitude,
				"76a57476-094f-4331-f59f-0865f1341108" : this.props.latitude,
				"dcceaa12-2bc6-4591-8e14-026c3bad64fd" : this.props.longitude
			},
			"datasets" : {
				// With cover crop
				"323c6613-4037-476c-9b9c-f51ba0940eaf" : this.parameters.soilWithoutCoverCrop,
				"7db036bf-019f-4c01-e58d-14635f6f799d" : this.parameters.modelWithoutCoverCrop
			}
		};

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

		// Wait until execution is complete
		// TODO: CCROP-35: Add code to check status of completion rather than waiting for a specified amount of time.
		await wait(12000);

		// Get Execution Result
		const withCoverCropExecutionResponse = await fetch(datawolfURL + "/executions/" + withCoverCropExecutionGUID, {
			method: 'GET',
			headers: headers,
		});

		const withoutCoverCropExecutionResponse = await fetch(datawolfURL + "/executions/" + withoutCoverCropExecutionGUID, {
			method: 'GET',
			headers: headers,
		});

		const withCoverCropAnalysisResult = await withCoverCropExecutionResponse.json();
		const withoutCoverCropAnalysisResult = await withoutCoverCropExecutionResponse.json();

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
			const withCoverCropFileDownloadResponse = await fetch(datawolfURL + "/datasets/" + withCoverCropDatasetResultGUID + "/" + withCoverCropFileDescriptorGUID + "/file",
				{
					method: 'GET',
					headers: headers,
				});

			const withoutCoverCropFileDownloadResponse = await fetch(datawolfURL + "/datasets/" + withoutCoverCropDatasetResultGUID + "/" + withoutCoverCropFileDescriptorGUID + "/file",
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

	render(){
		let isButtonDisabled = this.state.runSimulationButtonDisabled ? "disabled" : "";
		return(
			<div>
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
				</div>
				<div>
					<Body1>Termination Date: </Body1>
					<DatePicker className="date-picker-cc" selected={this.props.endDate}
								selectsStart
								showYearDropdown
								scrollableYearDropdown
								placeholderText="Select an establishment date"
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
				<br/>
				<Button disabled={isButtonDisabled} raised primary onClick={this.runSimulation}>Run Simulation</Button>
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
		handleCardChange: (oldCardIndex, newCardIndex, oldCardData) => {
			dispatch(handleCardChange(oldCardIndex, newCardIndex, oldCardData))
		},
		handleResults: (withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson) => {
			dispatch(handleResults(withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(RunSimulationCC);
