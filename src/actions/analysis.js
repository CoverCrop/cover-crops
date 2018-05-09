export const handleCardClick = (selectedCardIndex) => ({
	type: "SWITCH_CARD",
	selectedCardIndex
});

export const handleLatFieldChange = (lat) => ({
	type: "CHANGE_LAT",
	lat
});

export const handleLongFieldChange = (long) => ({
	type: "CHANGE_LONG",
	long
});

export const handleStartDateChange = (date) => ({
	type: "CHANGE_START_DATE",
	date
});

export const handleEndDateChange = (date) => ({
	type: "CHANGE_END_DATE",
	date
});

export const handleCLUChange = (clu, cluname) => ({
	type: "CHANGE_CLU",
	clu,
	cluname
});

export const handleUserCLUChange = (clu, cluname) => ({
	type: "CHANGE_USER_CLU",
	clu,
	cluname
});

export const handleWeatherPatternChange = (weatherPattern) => ({
	type: "CHANGE_WEATHER",
	weatherPattern
});

export const handleFlexibleDatesChange = (checked) => ({
	type: "SET_FLEXIBLEDATES",
	checked
});

export const handleCardChange = (oldCardIndex, newCardIndex, oldCardData) => ({
	type: "CHANGE_CARD",
	oldCardIndex,
	newCardIndex,
	oldCardData

});

export const handleResults = (withCoverCropExecutionId, withCoverCropResultJson, withoutCoverCropExecutionId, withoutCoverCropResultJson) => ({
	type: "ADD_RESULT",
	withCoverCropExecutionId,
	withCoverCropResultJson,
	withoutCoverCropExecutionId,
	withoutCoverCropResultJson
});



