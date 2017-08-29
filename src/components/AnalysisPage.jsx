import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import SelectFieldsCC from './SelectFieldsCC'
import RunSimulationCC from './RunSimluationCC'
import ViewResultsCC from './ViewResultsCC'
import CoverCropCard from './CoverCropCard'
import styles from '../styles/main.css'
import {Cell, Grid, Title, Textfield, Card, Fab, CardHeader, CardMedia, CardActions, Button, CardTitle, CardSubtitle, CardText, GridList, Tile, TileTitle, TilePrimary,TileSecondary, TileContent, Icon} from "react-mdc-web";

class AnalysisPage extends Component {

	constructor(props) {
		super(props);
		this.cardFields = [
			{
				cardId: "selectField",
				cardTitle: "Select Field",
				cardSubtitle: "Choose field(s) on which you want to perform simulation."
			},
			{
				cardId: "runSimulation",
				cardTitle: "Run Simulation",
				cardSubtitle: "Choose appropriate parameters and run simulation of selected fields."
			},
			{
				cardId: "viewResults",
				cardTitle: "View Results",
				cardSubtitle: "View results and visualizations of running simulation."
			}
		];
		this.state = {
			activeCardIndex: 0,
			latitude: "",
			longitude: ""
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleSelectFieldsChange= this.handleSelectFieldsChange.bind(this);
	}

	renderCard(cardIndex){

		// Active Card
		if (cardIndex === this.state.activeCardIndex){

			return <CoverCropCard
				className="cover-crop-card-active"
				cardId={this.cardFields[cardIndex].cardId}
				onClick={this.handleClick.bind(this, cardIndex)}
				cardTitle={this.cardFields[cardIndex].cardTitle}
				cardSubtitle={this.cardFields[cardIndex].cardSubtitle}/>;
		}
		// Previously visited card
		else if (cardIndex < this.state.activeCardIndex){
			return <CoverCropCard
				className="cover-crop-card-disabled"
				cardId={this.cardFields[cardIndex].cardId}
				onClick={this.handleClick.bind(this, cardIndex)}
				cardTitle={this.cardFields[cardIndex].cardTitle}
				cardSubtitle={this.cardFields[cardIndex].cardSubtitle}/>;
		}
		// Unvisited card
		else {
			return <CoverCropCard
				className="cover-crop-card"
				cardId={this.cardFields[cardIndex].cardId}
				onClick={this.handleClick.bind(this, cardIndex)}
				cardTitle={this.cardFields[cardIndex].cardTitle}
				cardSubtitle={this.cardFields[cardIndex].cardSubtitle}/>;
		}
	}

	handleClick(selectedCardIndex){

		this.setState({
			activeCardIndex: selectedCardIndex
		});
	}

	handleSelectFieldsChange(e) {
		if (e.target.id === "textfield-Latitude") {
			this.setState({
				latitude: e.target.value
			});
		}
		else if (e.target.id === "textfield-Longitude") {
			this.setState({
				longitude: e.target.value
			});
		}
	}

	render() {

		let displayComponent = null;

		switch(this.state.activeCardIndex) {
			case 0:
				displayComponent = <SelectFieldsCC state={this.state} onChange={this.handleSelectFieldsChange} />;
				break;

			case 1:
				displayComponent = <RunSimulationCC/>;
				break;

			case 2:
				displayComponent = <ViewResultsCC/>;
				break;

			case null:
				displayComponent = <SelectFieldsCC/>;
				break;
		}

		return (
			<div>
				<Header selected='analysis'/>
				<Grid >
					<Cell col={12}>
						<Grid>
							<Cell col={2}>
								{this.renderCard(0)}
								<br/>
								<br/>
								{this.renderCard(1)}
								<br/>
								<br/>
								{this.renderCard(2)}
								<br/>
								<br/>
							</Cell>
							<Cell col={10}>
								{displayComponent}
							</Cell>
						</Grid>
					</Cell>
				</Grid>
				<Footer selected='analysis'/>
			</div>
		);
	}
}

export default AnalysisPage;
