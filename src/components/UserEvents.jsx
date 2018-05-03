import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Title, MenuAnchor, Menu, MenuItem, MenuDivider,Textfield, Card, CardText, Body1, Body2, CardActions,
	Fab, Icon, Grid, Cell} from "react-mdc-web";
import "babel-polyfill";
import {datawolfURL, latId, lonId, weatherId, workloadId, resultDatasetId} from "../datawolf.config";
import styles from '../styles/user-page.css';
import { handleResults} from '../actions/analysis';
import { groupBy, getResult, getWeatherName, ConvertDDToDMS} from '../public/utils';

class UserEvents extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sortopen: false,
			events: [],
			selectevent: null,
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
					v.status= v[0].datasets[resultDatasetId] === 'ERROR' || v[1].datasets[resultDatasetId] === 'ERROR' ? 'execution-error' : 'execution-success';
					v.id= k;
					eventfilteredGroup.push(v);
				} else if(v[0]["description"] === "WithoutCoverCrop"){
					// the first event is WithoutCoverCrop, swap it before add to event list
					let tmpv = [v[1], v[0]];
					tmpv.status= v[0].datasets[resultDatasetId] === 'ERROR' || v[1].datasets[resultDatasetId] === 'ERROR' ? 'execution-error' : 'execution-success';
					tmpv.id=k;
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

	viewResult = (id, status, withCoverCropDatasetResultGUID, withoutCoverCropDatasetResultGUID) => {
		if(status ==='execution-success') {
			this.setState({selectevent:id});
			let that = this;
			if ((withCoverCropDatasetResultGUID !== "ERROR" && withCoverCropDatasetResultGUID !== undefined) &&
				(withoutCoverCropDatasetResultGUID !== "ERROR" && withoutCoverCropDatasetResultGUID !== undefined)) {
				getResult(withCoverCropDatasetResultGUID).then(function (withCoverCropResultFile) {
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
	}


	render(){
        let eventsList =  this.state.events.map( event =>
			<Card
				className={(event.id === this.state.selectevent? 'choose-card':'') + " event-list " +(event.status)}
				  key={event[0].id}
				  onClick={() => this.viewResult(event.id, event.status, event[0].datasets[resultDatasetId], event[1].datasets[resultDatasetId])}
			>
				<CardText >
					<h2>{ConvertDDToDMS(event[0].parameters[latId]) + 'N'}</h2>
					<div className="event-list-text">
						<p className="text1 label">In</p>
						<p className="text2 label">Out</p>
						<p className="text3 label">Weather</p>
						<p className="text4 label">Status</p>
						<p className="text5 label">Time</p>

						<p className="text3 experiment-value bold-text">{getWeatherName(event[0].parameters[weatherId])}</p>
						<p className="text4 experiment-value">{event.status.slice(10)}</p>
						<p className="text5 experiment-value">{event[0].date}</p>
					</div>
					{ event.status === 'execution-error'?

							<Icon name="warning" />

						:
							<Icon name="check_circle"/>

					}

				</CardText>
			</Card>
		);
		return(
			<div>
				<div className="event-list-header">
					<Button className="bold-text"
						onClick={() => {
						this.setState({sortopen: true})
					}}>Sort By</Button>
					<MenuAnchor>
						<Menu
							open={this.state.sortopen}
							onClose={()=>{this.setState({sortopen:false})}}
						>
							<MenuItem>
								Runtime
							</MenuItem>
							<MenuItem>
								Runtime2
							</MenuItem>
						</Menu>
					</MenuAnchor>
					<Button className="event-more-options">More Options</Button>
				</div>
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
