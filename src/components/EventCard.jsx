import React, {Component} from "react";
import {Body1, Body2, Button, Card, CardText, Cell, Checkbox, Content, FormField, Icon, Textfield} from "react-mdc-web";
import {latId, lonId, resultDatasetId, userInputJSONDatasetID, weatherId} from "../datawolf.config";
import {convertDateToUSFormat, getWeatherName, convertDateToUSFormatWithMins} from "../public/utils";
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";

class EventCard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {event} = this.props;
		console.log(event);
		let inDate, outDate;

		let plantingDate = new Date();
		let harvestDate = new Date();
		if (this.props.hasOwnProperty("userInputJson") && this.props["userInputJson"] !== null) {
			let plantingYear = this.props["userInputJson"]["year_planting"];
			let harvestYear = plantingYear + 1;
			let plantingDOY = this.props["userInputJson"]["doy_planting"];
			let harvestDOY = this.props["userInputJson"]["doy_harvest"];
			plantingDate = new Date(plantingYear, 0, plantingDOY);
			harvestDate = new Date(harvestYear, 0, harvestDOY);
			inDate = convertDateToUSFormat(plantingDate);
			outDate = convertDateToUSFormat(harvestDate);
		}
		return (
			<Card
				className={(event.id === this.props.selectevent? "choose-card":"") + " event-list " +(event.status)}
				key={event[0].id}
				onClick={() => this.props.viewResult(event.id, event.status, event[0].datasets[resultDatasetId], event[1].datasets[resultDatasetId], event[0].datasets[userInputJSONDatasetID])}
			>
				<CardText >

					<Grid container spacing={1}>

						<Grid container item xs={12} spacing={3}>
							<Grid item xs={10} >
								<h2>{event[0].parameters[latId] + " " +event[0].parameters[lonId]}</h2>
							</Grid>

							<Grid item xs={2}>
								{ event.status === "execution-error" ?	<Icon className="normalIcon" name="warning" />	:
									<Icon className="normalIcon" name="check_circle"/>}
							</Grid>
						</Grid>


						<Grid container item xs={12} spacing={3} style={{paddingTop: "5px"}}>
							<Grid item xs={5} >
								<span className="eventCardLabelTitle">In</span> <span className="eventCardLabelValue">{inDate} </span>
							</Grid>

							<Grid item xs={7}>
								<span className="eventCardLabelTitle">Status</span> <span className="eventCardLabelValue">{event.status.slice(10)} </span>
							</Grid>
						</Grid>
						<Grid container item xs={12} spacing={3} style={{paddingTop: "3px"}}>
							<Grid item xs={5}>
								<span className="eventCardLabelTitle">Out</span> <span className="eventCardLabelValue">{outDate} </span>
							</Grid>

							<Grid item xs={7}>
								<span className="eventCardLabelTitle">Run Time</span> <span className="eventCardLabelValue">{convertDateToUSFormatWithMins(new Date(event[0].date))} </span>
							</Grid>

						</Grid>
						<Grid container item xs={12} spacing={3} style={{paddingTop: "3px"}}>
							<Grid item xs={5}>
								<span className="eventCardLabelTitle">Weather</span> <span className="eventCardLabelValue">{getWeatherName(event[0].parameters[weatherId])}</span>
							</Grid>

							<Grid item xs={7}>

							</Grid>
						</Grid>
					</Grid>

					{/*{ event.status === "execution-error"?*/}

					{/*	<Icon name="warning" />*/}

					{/*	:*/}
					{/*	<Icon name="check_circle"/>*/}

					{/*}*/}

				</CardText>
			</Card>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		userInputJson: state.analysis.userInputJson
	};
};

export default connect(mapStateToProps, null) (EventCard);
