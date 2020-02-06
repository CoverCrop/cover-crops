const devConfig = {
	basePath: "/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: "localhost",
	CLUapi: "http://localhost:5000",
	latestWeatherDate: "2019-09-30",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 10,
	coverCropTerminationOffsetDays: 14 // Cover crop termination = Cash crop planting + 14 days
};

const prodConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: ".ncsa.illinois.edu",
	CLUapi: "https://fd-postgres.ncsa.illinois.edu",
	latestWeatherDate: "2019-09-30",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 10,
	coverCropTerminationOffsetDays: 14 // Cover crop termination = Cash crop planting + 14 days
};

const config = getConfig();

function getConfig() {
	if (process.env.NODE_ENV === "production") {
		return prodConfig;
	} else {
		return devConfig;
	}
}

export default config;
