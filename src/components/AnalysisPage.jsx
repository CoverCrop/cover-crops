import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import SelectFieldsCC from './SelectFieldsCC'
import RunSimulationCC from './RunSimluationCC'
import ViewResultsCC from './ViewResultsCC'
import CoverCropCard from './CoverCropCard'
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
			activeCard: this.cardFields[0],
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(selectedCardIndex){

		this.setState({
			activeCard: this.cardFields[selectedCardIndex]
		});
	}

	render() {

		let displayComponent = null;

		switch(this.state.activeCard.cardId) {
			case "selectField":
				displayComponent = <SelectFieldsCC/>;
				break;

			case "runSimulation":
				displayComponent = <RunSimulationCC/>;
				break;

			case "viewResults":
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
								<CoverCropCard
									cardId={this.cardFields[0].cardId}
									onClick={this.handleClick.bind(this, 0)}
									cardTitle={this.cardFields[0].cardTitle}
									cardSubtitle={this.cardFields[0].cardSubtitle}/>
								<br/>
								<br/>
								<CoverCropCard
									cardId={this.cardFields[1].cardId}
									onClick={this.handleClick.bind(this, 1)}
									cardTitle={this.cardFields[1].cardTitle}
									cardSubtitle={this.cardFields[1].cardSubtitle}/>
								<br/>
								<br/>
								<CoverCropCard
									cardId={this.cardFields[2].cardId}
									onClick={this.handleClick.bind(this, 2)}
									cardTitle={this.cardFields[2].cardTitle}
									cardSubtitle={this.cardFields[2].cardSubtitle}/>
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
