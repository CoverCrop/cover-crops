import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Textfield, Card, CardText, Body1, Body2, CardActions, FormField, Grid, Cell} from "react-mdc-web";
import "babel-polyfill";
import {datawolfURL, latId, lonId, workloadId, resultDatasetId} from "../datawolf.config";
import styles from '../styles/user-page.css';
import { handleResults} from '../actions/analysis';
import {groupBy} from '../utils';

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserEvents extends Component {

	constructor(props) {
		super(props);
		this.state = {
			events: []
		}
	}

	async getEvents() {
		let eventRequest = await fetch(datawolfURL + "/executions?workloadId="+workloadId, {
			method: 'GET',
			headers: {
				// Add authorization here
				'Content-Type': 'application/json',
				'Access-Control-Origin': 'http://localhost:3000'
			}
		});

		const events = await eventRequest.json();
		const eventGroups = groupBy(events, event => event.title);
		const eventfilteredGroup = [];
		eventGroups.forEach(function(v, k){
			if(v.length === 2){
				eventfilteredGroup.push(v);
			}
		})
        this.setState({events: eventfilteredGroup});
	}

	componentWillMount(){
		this.getEvents();
	}

	async getResult(withCoverCropDatasetResultGUID, withoutCoverCropDatasetResultGUID) {
        //TODO: combine this code with ChartCC.js
		let headers = {
			// Add authorization here
		};

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

			status = "COMPLETED";

			this.props.handleResults(
				"22c3a15e-85db-4d00-8007-920ae65365e4",
				withCoverCropResultFile,
				"22c3a15e-85db-4d00-8007-920ae65365e4",
				withoutCoverCropResultFile
			);
		}
	}

	viewResult = (withCoverCropDatasetResultGUID, withoutCoverCropDatasetResultGUID) => {
		this.getResult(withCoverCropDatasetResultGUID, withoutCoverCropDatasetResultGUID)
	}

	render(){
        let eventsList =  this.state.events.map( event =>

			<Card className="event-list" key={event[0].id}>
				<CardText>
				<Body1>Latitude: {event[0].parameters[latId]}</Body1>
				<Body1>Longitude: {event[0].parameters[lonId]}</Body1>
				<Body1>Date: {event[0].date}</Body1>

				</CardText>
				{event[0].datasets[resultDatasetId] === 'ERROR' || event[1].datasets[resultDatasetId] === 'ERROR' ?
					<CardText>
					<Body1>Execution Error</Body1>
					</CardText> :

					<CardActions>
						<Button compact
								onClick={() => this.viewResult(event[0].datasets[resultDatasetId], event[1].datasets[resultDatasetId])}>View
							Result</Button>
					</CardActions>
				}
			</Card>

		);
		return(
			<div>
				<h1>User Events</h1>
				<br />
				<div className="event-list-parent">
					{eventsList}
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		handleResults: (withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson) => {
			dispatch(handleResults(withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson))
		}
	}
};

export default connect(null, mapDispatchToProps)(UserEvents);
