import React, {Component} from "react";
import { connect } from 'react-redux';
import {Button, Title, MenuAnchor, Menu, MenuItem, MenuDivider,Textfield, Card, CardText, Body1, Body2, CardActions,
	Fab, Icon, Grid, Cell} from "react-mdc-web";
import "babel-polyfill";
import {
	datawolfURL, latId, lonId, weatherId, workflowId, resultDatasetId,
	userInputJSONDatasetID, eventPageSize
} from "../datawolf.config";
import styles from '../styles/history-page.css';
import { handleResults} from '../actions/analysis';
import {groupBy, getOutputFileJson, sortByDateInDescendingOrder} from '../public/utils';
import {setSelectedUserEventStatus} from "../actions/user";
import EventCard from "./EventCard";
import Spinner from "./Spinner";

class UserEvents extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sortopen: false,
			events: [],
			selectevent: null,
			pagenumber:1,
			totalpage:0,
			runStatus: "INIT"
		}
	}

	async getEvents() {
		let eventRequest = await fetch(datawolfURL + "/executions?email=" + this.props.email, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Origin': 'http://localhost:3000'
			},
			credentials: "include"

		});

		const events = await eventRequest.json();
		events.sort(sortByDateInDescendingOrder);

		const eventGroups = groupBy(events, event => event.title);
		// the list with both executions,  each array is [WithCoverCrop, WithoutCoverCrop]
		const eventfilteredGroup = [];
		eventGroups.forEach(function(v, k){
			if(v.length === 2 && v[0]["description"] !== "" && v[0]["workflowId"] === workflowId){
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
        this.setState({events: eventfilteredGroup, totalpage: Math.ceil(eventfilteredGroup.length/eventPageSize) });
	}

	componentWillMount(){
		// avoid displaying selectedEventNotSuccessful while the history page is loading
		this.props.setSelectedUserEventStatus(true);
		this.setState({runStatus: "LOADING"});
		this.getEvents().then(function success() {
			console.log("Fetched events.");

			if (this.state.events.length > 0) {
				let event = this.state.events[0];
				this.setState({selectevent: event.id});

				// If the latest simulation is successful, view results
				if (event.status === "execution-success") {
					this.props.setSelectedUserEventStatus(true);
					this.viewResult(event.id, event.status, event[0].datasets[resultDatasetId],
						event[1].datasets[resultDatasetId], event[0].datasets[userInputJSONDatasetID])
				}
				// Else, set status to display an error message in the chart display area
				else {
					this.props.setSelectedUserEventStatus(false);
				}
			}
			this.setState({runStatus: "LOADED_EVENTS"});
		}.bind(this));

	}

	viewResult = (id, status, withCoverCropDatasetResultGUID, withoutCoverCropDatasetResultGUID, withCoverCropUserInputJSONDatasetId) => {

		this.setState({runStatus: "LOADING"});
		this.setState({selectevent:id});
		const outputFilename = "output.json";

		if(status ==='execution-success') {
			this.props.setSelectedUserEventStatus(true);

			let that = this;
			if ((withCoverCropDatasetResultGUID !== "ERROR" && withCoverCropDatasetResultGUID !== undefined) &&
				(withoutCoverCropDatasetResultGUID !== "ERROR" && withoutCoverCropDatasetResultGUID !== undefined)) {
				getOutputFileJson(withCoverCropDatasetResultGUID, outputFilename).then(function (withCoverCropResultFile) {
					getOutputFileJson(withoutCoverCropDatasetResultGUID, outputFilename).then(function (withoutCoverCropResultFile) {
						getOutputFileJson(withCoverCropUserInputJSONDatasetId).then(function (userInputJson) {
							that.props.handleResults(
								withCoverCropDatasetResultGUID,
								withCoverCropResultFile,
								withoutCoverCropDatasetResultGUID,
								withoutCoverCropResultFile,
								userInputJson
							);
							that.setState({runStatus: "LOADED_RESULT"});
						})
					})
				})
			}
		}
		else if(status ==='execution-error')
		{
			this.props.setSelectedUserEventStatus(false);
		}
	};

	handlePageChange = (pagenumber) => {
		let selectEvent =  this.state.events[(pagenumber-1) * eventPageSize];
		this.setState({pagenumber, selectevent: selectEvent.id });
		this.viewResult(selectEvent.id, selectEvent.status, selectEvent[0].datasets[resultDatasetId],
			selectEvent[1].datasets[resultDatasetId], selectEvent[0].datasets[userInputJSONDatasetID])

	};


	render(){

		let spinner;
		if(this.state.runStatus === "INIT" || this.state.runStatus === "LOADING"){
			spinner = <Spinner/>;
		}

		let {pagenumber, totalpage} = this.state;
        let eventsList =  this.state.events.slice((pagenumber-1) * eventPageSize, pagenumber*eventPageSize).map( event =>
			<EventCard event={event} selectevent={this.state.selectevent} viewResult={this.viewResult}/>
		);

        //pageArray has max 5 element.
		let pageArray = [...Array(totalpage+1).keys()].slice(1);
		if(pageArray.length > 5){
			if(pagenumber < 4) {
				pageArray = pageArray.slice(0, 5);
			} else if(pagenumber > totalpage -3){
				pageArray = pageArray.slice(totalpage -5, totalpage);
			} else{
				pageArray = pageArray.slice(pagenumber - 3, pagenumber + 2);
			}
		}

		let pageComponentArray= pageArray.map(p =>
			<Button className={(p === pagenumber? 'pagination-select':'') + " pagination-button"}
					key={p}
					onClick={() => this.handlePageChange(p)}
			>{p}</Button>
		);

		let pagination = (<div className="pagination-div">
			<Button className="pagination-button" key="left" onClick={() => this.handlePageChange(pagenumber-1)}
					disabled={pagenumber === 1}
			>
				<Icon name="keyboard_arrow_left" />
			</Button>
			{pageComponentArray}
			<Button className="pagination-button" key="right" onClick={() => this.handlePageChange(pagenumber+1)}
			disabled={pagenumber === totalpage}
			>
				<Icon name="keyboard_arrow_right" />
			</Button>
		</div>);
		return(
			<div>
				{spinner}
				<div className="event-list-header" key="event-list-header">
					{/*<Button className="bold-text"*/}
					{/*	onClick={() => {*/}
					{/*	this.setState({sortopen: true})*/}
					{/*}}>Sort By</Button>*/}
					{/*<MenuAnchor>*/}
					{/*	<Menu*/}
					{/*		open={this.state.sortopen}*/}
					{/*		onClose={()=>{this.setState({sortopen:false})}}*/}
					{/*	>*/}
					{/*		<MenuItem>*/}
					{/*			Runtime*/}
					{/*		</MenuItem>*/}
					{/*		<MenuItem>*/}
					{/*			Runtime2*/}
					{/*		</MenuItem>*/}
					{/*	</Menu>*/}
					{/*</MenuAnchor>*/}
					{/*<Button className="event-more-options">More Options</Button>*/}
				</div>
				<div className="event-list-parent" key="event-list-parent">
					{eventsList}
					{pagination}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email
	}
};


const mapDispatchToProps = (dispatch) => {
	return {
		handleResults: (withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson, userInputJson) => {
			dispatch(handleResults(withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson, userInputJson))
		},
		setSelectedUserEventStatus: (isSelectedEventSuccessful) => {
			dispatch(setSelectedUserEventStatus(isSelectedEventSuccessful))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEvents);
