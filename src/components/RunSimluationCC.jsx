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
		const datawolfURL = 'https://covercrop.ncsa.illinois.edu/datawolf';

		let headers = {
			// Add authorization here
		};

		const executionRequest = {
			"workflowId" : "e9bdff07-e5f7-4f14-8afc-4abb87c7d5a2",
			"creatorId" : "f864b8d7-8dce-4ed3-a083-dd73e8291181",
			"title" : "dssat-batch-run",
			"parameters" : {
				"687efc8a-9055-4fab-b91b-25c44f0c6724" : this.props.state.latitude,
				"23a0962a-0548-4b85-c183-c17ad45326fc" : this.props.state.longitude,
				"76a57476-094f-4331-f59f-0865f1341108" : this.props.state.latitude,
				"dcceaa12-2bc6-4591-8e14-026c3bad64fd" : this.props.state.longitude
			},
			"datasets" : {
				"323c6613-4037-476c-9b9c-f51ba0940eaf" : "5d1399f9-7068-4bd7-8cf0-aceb52febbf4",
				"7db036bf-019f-4c01-e58d-14635f6f799d" : "3813396e-5ab0-418c-8e8f-34eda231fadf"
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
		await wait(6000);

		// Get Execution Result
		const executionResponse = await fetch(datawolfURL + "/executions/" + executionGUID, {
			method: 'GET',
			headers: headers,
		});

		const analysisResult = await executionResponse.json();
		const datasetResultGUID = analysisResult.datasets["8ba31e5e-f343-4c9b-c41c-656b9f66b417"];

		console.log("result dataset = " + datasetResultGUID);

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
