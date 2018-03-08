import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Textfield, Card, CardText, Body1, Body2, CardActions, FormField, Grid, Cell} from "react-mdc-web";
import "babel-polyfill";
import {datawolfURL, latId, lonId, weatherId, workloadId, resultDatasetId} from "../datawolf.config";
import styles from '../styles/user-page.css';
import { handleResults} from '../actions/analysis';
import { groupBy, getResult, getWeatherName} from '../public/utils';

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserEvents extends Component {

	constructor(props) {
		super(props);
		this.state = {
			events: [],
			email: sessionStorage.getItem("email")
		}
	}

	async getEvents() {
		let eventRequest = await fetch(datawolfURL + "/executions?email=" + this.state.email, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Origin': 'http://localhost:3000'
			},
			credentials: "include"

		});

		const events = await eventRequest.json();
		const eventGroups = groupBy(events, event => event.title);
		// the list with both executions,  each array is [WithCoverCrop, WithoutCoverCrop]
		const eventfilteredGroup = [];
		eventGroups.forEach(function(v, k){
			if(v.length === 2 && v[0]["description"] !== ""){
				if(v[0]["description"] === "WithCoverCrop"){
					eventfilteredGroup.push(v);
				} else if(v[0]["description"] === "WithoutCoverCrop"){
					let tmpv = [v[1], v[0]];
					eventfilteredGroup.push(tmpv);
				}
			}
		});
        this.setState({events: eventfilteredGroup});
	}

	componentWillMount(){
		this.props.handleResults("", null, "", null);
		this.getEvents();
	}

	viewResult = (withCoverCropDatasetResultGUID, withoutCoverCropDatasetResultGUID) => {
		let that = this;
		if ((withCoverCropDatasetResultGUID !== "ERROR" && withCoverCropDatasetResultGUID !== undefined) &&
			(withoutCoverCropDatasetResultGUID !== "ERROR" && withoutCoverCropDatasetResultGUID !== undefined)) {
			getResult(withCoverCropDatasetResultGUID).then(function (withCoverCropResultFile){
					getResult(withoutCoverCropDatasetResultGUID).then(function (withoutCoverCropResultFile) {
						that.props.handleResults(
							withCoverCropDatasetResultGUID,
							withCoverCropResultFile,
							withoutCoverCropDatasetResultGUID,
							withoutCoverCropResultFile
						);
					})
			})
		}
	}


	render(){
        let eventsList =  this.state.events.map( event =>

			<Card className="event-list" key={event[0].id}>
				<CardText>
				<Body1>Latitude: {event[0].parameters[latId]}</Body1>
				<Body1>Longitude: {event[0].parameters[lonId]}</Body1>
				<Body1>Weather Pattern: {getWeatherName(event[0].parameters[weatherId])}</Body1>
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
