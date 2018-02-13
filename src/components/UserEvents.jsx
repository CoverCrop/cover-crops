import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Textfield, Card, CardText, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import "babel-polyfill";
import {datawolfURL, latId, lonId, getWithoutCoverCropExecutionRequest} from "../datawolf.config";
import styles from '../styles/user-page.css';

let wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserEvents extends Component {

	constructor(props) {
		super(props);
		this.state = {
			events: []
		}
	}

	async getEvents() {
		let eventRequest = await fetch(datawolfURL + "/executions?size=10&page=0", {
			method: 'GET',
			headers: {
				// Add authorization here
				'Content-Type': 'application/json',
				'Access-Control-Origin': 'http://localhost:3000'
			}
		});

		const events = await eventRequest.json();
        this.setState({events});
	}

	componentWillMount(){
		this.getEvents();
	}

	render(){
        let eventsList =  this.state.events.map( event =>
			<Card className="event-list" key={event.id}>
				<CardText>
				<Body1>Latitude: {event.parameters[latId]}</Body1>
				<Body1>Longitude: {event.parameters[lonId]}</Body1>
				<Body1>Date: {event.date}</Body1>
				</CardText>
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

export default UserEvents;
