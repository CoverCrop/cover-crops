import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import {Cell, Grid} from "react-mdc-web";
import LeftPaneCC from "./LeftPaneCC";
import RightPaneCC from "./RightPaneCC";

class AnalysisPage extends Component {

	constructor(props) {
		super(props);
		this.initCards = [
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
			longitude: "",
			startDate: 0,
			endDate: 0,
			cards: this.initCards
		};

		this.handleCardClick= this.handleCardClick.bind(this);
		this.handleLatFieldChange = this.handleLatFieldChange.bind(this);
		this.handleLongFieldChange = this.handleLongFieldChange.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleCardChange = this.handleCardChange.bind(this);
	}

	handleCardClick(selectedCardIndex){

		this.setState({
			activeCardIndex: selectedCardIndex
		});
	}

	handleLatFieldChange(value) {
		this.setState({
			latitude: value
		});
	}

	handleLongFieldChange(value) {
		this.setState({
			longitude: value
		});
	}

	handleStartDateChange(date) {
		this.setState({
			startDate: date
		});
	}

	handleEndDateChange(date) {
		this.setState({
			endDate: date
		});
	}

	handleCardChange(oldCardIndex, newCardIndex, oldCardData) {
		let updatedCards = this.initCards;
		let card = updatedCards[oldCardIndex];
		card.cardTitle = oldCardData.cardTitle;
		card.cardSubtitle = oldCardData.cardSubtitle;
		updatedCards[oldCardIndex] = card;

		this.setState({
			activeCardIndex: newCardIndex,
			cards: updatedCards
		});
	}

	render() {
		return (
			<div>
				<Header selected='analysis'/>
				<Grid >
					<Cell col={12}>
					<Grid >
						<Cell col={2}>
							<LeftPaneCC
								cards={this.state.cards}
								activeCardIndex={this.state.activeCardIndex}
								handleCardClick={this.handleCardClick}/>
						</Cell>
						<Cell col={10}>
							<RightPaneCC
								activeCardIndex={this.state.activeCardIndex}
								state={this.state}
								handleLatFieldChange={this.handleLatFieldChange}
								handleLongFieldChange={this.handleLongFieldChange}
								handleStartDateChange={this.handleStartDateChange}
								handleEndDateChange={this.handleEndDateChange}
								handleCardChange={this.handleCardChange}
							/>
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
