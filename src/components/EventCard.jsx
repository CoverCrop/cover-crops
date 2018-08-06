import React, {Component} from "react";
import {Body1, Body2, Button, Card, CardText, Cell, Checkbox, Content, FormField, Icon, Textfield} from "react-mdc-web";
import {latId, lonId, resultDatasetId, userInputJSONDatasetID, weatherId} from "../datawolf.config";
import {getWeatherName} from "../public/utils";

class EventCard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {event} = this.props;
		return (
			<Card
				className={(event.id === this.props.selectevent? 'choose-card':'') + " event-list " +(event.status)}
				key={event[0].id}
				onClick={() => this.props.viewResult(event.id, event.status, event[0].datasets[resultDatasetId], event[1].datasets[resultDatasetId], event[0].datasets[userInputJSONDatasetID])}
			>
				<CardText >
					<h2>{event[0].parameters[latId] + ' ' +event[0].parameters[lonId]}</h2>
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
	}
}

export default EventCard;
