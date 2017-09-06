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
		
		const datawolfURL = 'https://covercrop.ncsa.illinois.edu/datawolf';

		const authorization = 'Basic ' + btoa("cmnavarr@illinois.edu:test1234");

		let headers = {
			'Authorization': authorization
		};

		const executionRequest = {
			"workflowId" : "e9bdff07-e5f7-4f14-8afc-4abb87c7d5a2",
			"creatorId" : "f864b8d7-8dce-4ed3-a083-dd73e8291181",
			"title" : "dssat-batch-run",
			"parameters" : {
				"687efc8a-9055-4fab-b91b-25c44f0c6724" : "field-latitude",
				"23a0962a-0548-4b85-c183-c17ad45326fc" : "field-longitude",
				"76a57476-094f-4331-f59f-0865f1341108" : "field-latitude",
				"dcceaa12-2bc6-4591-8e14-026c3bad64fd" : "field-longitude"
			},
			"datasets" : {
				"323c6613-4037-476c-9b9c-f51ba0940eaf" : "5d1399f9-7068-4bd7-8cf0-aceb52febbf4",
				"7db036bf-019f-4c01-e58d-14635f6f799d" : "3813396e-5ab0-418c-8e8f-34eda231fadf"
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
		await wait(6000);

		// Get Execution Result
		const executionResponse = await fetch(datawolfURL + "/executions/" + executionGUID, {
			method: 'GET',
			headers: headers,
		});

		const analysisResult = await executionResponse.json();
		const datasetResultGUID = analysisResult.datasets["8ba31e5e-f343-4c9b-c41c-656b9f66b417"];

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
