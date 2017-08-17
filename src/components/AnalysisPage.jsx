import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import {Cell, Grid, Title, Textfield, Card, Fab, CardHeader, CardMedia, CardActions, Button, CardTitle, CardSubtitle, CardText, GridList, Tile, TileTitle, TilePrimary,TileSecondary, TileContent, Icon} from "react-mdc-web";
import "babel-polyfill";

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AnalysisPage extends Component {


	render() {
		return (
			<div>
				<Header selected='analysis'/>
				<Grid >
					<Cell col={12}>
						<Grid>
							<Cell col={2}>
								<Card>
									<CardHeader>
										<CardTitle>Select Field</CardTitle>
										{/*<CardSubtitle>Subtitle</CardSubtitle>*/}
									</CardHeader>
									<CardText>
										Lorem ipsum dolor sit amet, consectetur adipisicing elit.
									</CardText>
									<CardActions>
										<Fab plain mini><Icon name='add'/></Fab>
									</CardActions>
								</Card>
								<div><input type="button" value="Run Analysis" onClick={this.runAnalysis}/></div>
							</Cell>
							<Cell col={10}>
								<h1>Analysis Page</h1>
							</Cell>
						</Grid>
					</Cell>
				</Grid>
				<Footer selected='analysis'/>
			</div>
		);
	}

	async runAnalysis() {
		console.log("hello world");
		const datawolfURL = 'http://covercrop.ncsa.illinois.edu:8888/datawolf';

		const authorization = 'Basic ' + btoa("cmnavarr@illinois.edu:test1234");

		let headers = {
			'Authorization': authorization
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
				'Authorization': authorization,
				'Content-Type': 'application/json'
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
		const filedescriptorGUID = resultDataset.fileDescriptors[0].id;

		// Get - Result File Download
		const filedownloadResponse = await fetch(datawolfURL + "/datasets/" + datasetResultGUID + "/" + filedescriptorGUID + "/file",
			{
				method: 'GET',
				headers: headers,
			});

		const resultFile = await filedownloadResponse.text();
		console.log("result file = "+resultFile);

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
}

export default AnalysisPage;
