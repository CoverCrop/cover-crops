export const datawolfURL = "https://covercrop.ncsa.illinois.edu/datawolf";
const parameters = {
	soilWithCoverCrop: "26bd9c56-10d5-4669-af6c-f56bc8d0e5d5", // LAW1501.SQX
	modelWithCoverCrop: "e96ec549-031f-4cef-8328-f4d8051773ec", // CH441169-cover.v46
	soilWithoutCoverCrop: "3690d7fb-eba5-48c7-bfbe-a792ff379fb4", // ILAO1501.SQX
	modelWithoutCoverCrop: "ff590fee-b691-42cd-9d8f-ed0205b72d21" // CH441169-nocover.v46
};

export function getWithCoverCropExecutionRequest(lat, long) {
	return {
		"workflowId": "e9bdff07-e5f7-4f14-8afc-4abb87c7d5a2",
		"creatorId": "f864b8d7-8dce-4ed3-a083-dd73e8291181",
		"title": "dssat-batch-run",
		"parameters": {
			"687efc8a-9055-4fab-b91b-25c44f0c6724": lat,
			"23a0962a-0548-4b85-c183-c17ad45326fc": long,
			"76a57476-094f-4331-f59f-0865f1341108": lat,
			"dcceaa12-2bc6-4591-8e14-026c3bad64fd": long
		},
		"datasets": {
			// With cover crop
			"323c6613-4037-476c-9b9c-f51ba0940eaf": parameters.soilWithCoverCrop,
			"7db036bf-019f-4c01-e58d-14635f6f799d": parameters.modelWithCoverCrop
		}
	};
}

export function getWithoutCoverCropExecutionRequest (lat, long) {
	return {
		"workflowId": "e9bdff07-e5f7-4f14-8afc-4abb87c7d5a2",
		"creatorId": "f864b8d7-8dce-4ed3-a083-dd73e8291181",
		"title": "dssat-batch-run",
		"parameters": {
			"687efc8a-9055-4fab-b91b-25c44f0c6724": lat,
			"23a0962a-0548-4b85-c183-c17ad45326fc": long,
			"76a57476-094f-4331-f59f-0865f1341108": lat,
			"dcceaa12-2bc6-4591-8e14-026c3bad64fd": long
		},
		"datasets": {
			// With cover crop
			"323c6613-4037-476c-9b9c-f51ba0940eaf": parameters.soilWithoutCoverCrop,
			"7db036bf-019f-4c01-e58d-14635f6f799d": parameters.modelWithoutCoverCrop
		}
	};
}
