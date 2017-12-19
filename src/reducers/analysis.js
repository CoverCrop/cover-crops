const initCards = [
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


const defaultState = {
	activeCardIndex: 0,
	latitude: "",
	longitude: "",
	startDate: 0,
	endDate: 0,
	cards: initCards,
	withCoverCropResultJson: null,
	withCoverCropExecutionId: "",
	withoutCoverCropResultJson: null,
	withoutCoverCropExecutionId: "",
	isFlexibleDatesChecked: false
};

const analysis = (state = defaultState, action) => {
	switch(action.type) {
		case 'SWITCH_CARD':
			return Object.assign({}, state, {
				activeCardIndex: action.selectedCardIndex
			});
		case 'CHANGE_LAT':
			return Object.assign({}, state, {
				latitude: action.lat
			});
		case 'CHANGE_LONG':
			return Object.assign({}, state, {
				longitude: action.long
			});
		case 'CHANGE_START_DATE':
			return Object.assign({}, state, {
				startDate: action.date
			});
		case 'CHANGE_END_DATE':
			return Object.assign({}, state, {
				endDate: action.date
			});
		case 'ADD_RESULT':
			return Object.assign({}, state, {
				withCoverCropExecutionId: withCoverCropExecutionId,
				withCoverCropResultJson: withCoverCropResultJson,
				withoutCoverCropExecutionId: withoutCoverCropExecutionId,
				withoutCoverCropResultJson: withoutCoverCropResultJson
			});
		case 'CHANGE_CARD': {
			// let newState =
			let newCards = state.cards.map((card, index) => {
				if (index === action.oldCardIndex) {
					// Copy the object before mutating
					return {
						cardTitle: action.oldCardData.cardTitle,
						cardSubtitle: action.oldCardData.cardSubtitle,
					}
				} else{
					return card;
				}
			});
			return Object.assign({}, state, {
				activeCardIndex: action.newCardIndex,
				cards: newCards
			});
		}
		default:
			return state
	}
};

export default analysis;
