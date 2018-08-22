const devConfig = {
	basePath: "/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	CLUapi: "https://covercrop.ncsa.illinois.edu",
	latestWeatherDate: "2018-01-31",
	defaultCenterLongLat: [-88.243385, 40.116421],
	defaultZoom: 7
};

const prodConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	CLUapi: "https://covercrop.ncsa.illinois.edu",
	latestWeatherDate: "2018-01-31",
	defaultCenterLongLat: [-88.243385, 40.116421],
	defaultZoom: 7
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
