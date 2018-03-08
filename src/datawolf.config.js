export const datawolfURL = "https://covercrop.ncsa.illinois.edu/datawolf";

export const steps ={
	Weather_Converter: "8b37a10e-59cb-47c9-a9eb-3eb846094f9d",
	Output_Parser: "bc582ce7-6279-4b5a-feaf-73fd9538ff28",
	Soil_Converter: "a40f102e-2930-46f8-e916-4dfa82cd36d1",
	DSSAT_Batch: "bde73f42-df16-4001-fe25-125cee503d36",
};

const parameters = {
	soilWithCoverCrop: "26bd9c56-10d5-4669-af6c-f56bc8d0e5d5", // LAW1501.SQX
	modelWithCoverCrop: "e96ec549-031f-4cef-8328-f4d8051773ec", // CH441169-cover.v46
	soilWithoutCoverCrop: "3690d7fb-eba5-48c7-bfbe-a792ff379fb4", // ILAO1501.SQX
	modelWithoutCoverCrop: "ff590fee-b691-42cd-9d8f-ed0205b72d21" // CH441169-nocover.v46
};

export function getWithCoverCropExecutionRequest(id, lat, long, personId, weatherPattern) {
	return {
		"workflowId": "e9bdff07-e5f7-4f14-8afc-4abb87c7d5a2",
		"creatorId": personId,
		"title": id,
		"description":"WithCoverCrop",
		"parameters": {
			"d23f88b5-5e2e-42ca-d524-d9a9822d2d2f": lat,
			"4dad32a9-cc4d-4508-8d71-66c622a40cda": long,
			"76a57476-094f-4331-f59f-0865f1341108": lat,
			"dcceaa12-2bc6-4591-8e14-026c3bad64fd": long,
			"a4752f34-ed85-404f-89c4-917f52bca992": weatherPattern.charAt(0)
		},
		"datasets": {
			// With cover crop
			"323c6613-4037-476c-9b9c-f51ba0940eaf": parameters.soilWithCoverCrop,
			"7db036bf-019f-4c01-e58d-14635f6f799d": parameters.modelWithCoverCrop
		}
	};
}

export function getWithoutCoverCropExecutionRequest (id, lat, long, personId, weatherPattern) {
	return {
		"workflowId": "e9bdff07-e5f7-4f14-8afc-4abb87c7d5a2",
		"creatorId": personId,
		"title": id,
		"description":"WithoutCoverCrop",
		"parameters": {
			"d23f88b5-5e2e-42ca-d524-d9a9822d2d2f": lat,
			"4dad32a9-cc4d-4508-8d71-66c622a40cda": long,
			"76a57476-094f-4331-f59f-0865f1341108": lat,
			"dcceaa12-2bc6-4591-8e14-026c3bad64fd": long,
			"a4752f34-ed85-404f-89c4-917f52bca992": weatherPattern.charAt(0)
		},
		"datasets": {
			// Without cover crop
			"323c6613-4037-476c-9b9c-f51ba0940eaf": parameters.soilWithoutCoverCrop,
			"7db036bf-019f-4c01-e58d-14635f6f799d": parameters.modelWithoutCoverCrop
		}
	};
}

// the fist weather pattern is the Default.
export const weatherPatterns = ["Average", "Hot", "Cold", "Dry", "Wet"];

export const latId = "76a57476-094f-4331-f59f-0865f1341108";
export const lonId = "dcceaa12-2bc6-4591-8e14-026c3bad64fd";
export const weatherId = "a4752f34-ed85-404f-89c4-917f52bca992";
export const resultDatasetId = "2623a440-1f16-4110-83c4-5ebf39cb0e35";
export const workloadId = "e9bdff07-e5f7-4f14-8afc-4abb87c7d5a2";
