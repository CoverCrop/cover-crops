import React, {Component} from "react";
import {Button, Textfield, Body1} from "react-mdc-web"
import 'react-datepicker/dist/react-datepicker.css';
import "babel-polyfill";
import DatePickerCC from "./DatePickerCC";

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RunSimulationCC extends Component {

	constructor(props) {
		super(props);
		this.runSimulation = this.runSimulation.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
	}

	async runSimulation() {
		console.log("hello world");
		const datawolfURL = 'http://covercrop.ncsa.illinois.edu:8888/datawolf';

		let headers = {
			// Add authorization here
		};

		const executionRequest = {
			"workflowId" : "105304d1-1fd8-49bc-8d2f-392cf9df7c6a",
			"creatorId" : "f864b8d7-8dce-4ed3-a083-dd73e8291181",
			"title" : "test-dssat-run-2",
			"parameters" : {"862bcb76-7697-4f6a-df1f-adbebe5d9005": "1"},
			"datasets" : {
				"07e5ba37-c33d-4a80-a713-744328066cdb" : "9f1e56b0-2e92-4b0b-94b4-c39f4344c509",
				"9ebd5ee1-8f2f-475a-e559-e4656a3d91fd" : "2b9e4ec5-8328-4179-9b40-d1b5440c86ed",
				"8736b559-5ca5-4b22-a409-eba0f3f579c4" : "8fa3cc39-51c7-4ecc-879d-d0b7c96d7a42"
			}
		};

		let createExecutionResponse = await fetch(datawolfURL + "/executions", {
			method: 'POST',
			headers: {
				// Add authorization here
				'Content-Type': 'application/json',
				'Access-Control-Origin': 'http://localhost:3000'
			},
			body: JSON.stringify(executionRequest)
		});

		const executionGUID = await createExecutionResponse.text();
		console.log("execution id = "+executionGUID);

		// Wait until execution is complete
		await wait(4000);

		// Get Execution Result
		const executionResponse = await fetch(datawolfURL + "/executions/" + executionGUID, {
			method: 'GET',
			headers: headers,
		});

		const analysisResult = await executionResponse.json();
		const datasetResultGUID = analysisResult.datasets["34d4fe3c-47d6-4991-df82-1bdae7534ded"];

		console.log("result dataset = "+datasetResultGUID);

		// Get - Result Dataset
		const response = await fetch(datawolfURL + "/datasets/" + datasetResultGUID, {
			method: 'GET',
			headers: headers,
		});

		const resultDataset = await response.json();
		const fileDescriptorGUID = resultDataset.fileDescriptors[0].id;

		// Get - Result File Download
		const fileDownloadResponse = await fetch(datawolfURL + "/datasets/" + datasetResultGUID + "/" + fileDescriptorGUID + "/file",
			{
				method: 'GET',
				headers: headers,
			});

		const resultFile = await fileDownloadResponse.text();
		console.log("result file = " + resultFile);

		// this.setState({
		// 	text: resultFile,
		// });

		console.log(analysisResult);

		// const datasetGet = await fetch(datawolfURL + '/workflows', {
		// 	method: 'GET',
		// 	headers: headers
		// });
		//
		// const datasets = await datasetGet.json();
		//
		// console.log(datasets);
	}

	handleStartDateChange(date) {
		this.props.handleStartDateChange(date)
	}

	handleEndDateChange(date) {
		this.props.handleEndDateChange(date)
	}

	render(){
		return(
			<div>
				<DatePickerCC
					label="Start Date: "
					state={this.props.state}
					startDate
					placeholderText="Select a start date"
					onChange={this.handleStartDateChange}/>
				<DatePickerCC
					label="End Date: "
					state={this.props.state}
					endDate
					placeholderText="Select an end date"
					onChange={this.handleEndDateChange}/>
				<br/>
				<Button raised primary onClick={this.runSimulation}>Run Simulation</Button>
			</div>
		)
	}
}
export default RunSimulationCC;
