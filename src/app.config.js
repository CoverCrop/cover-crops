const devConfig = {
	basePath: "/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	CLUapi: "https://covercrop.ncsa.illinois.edu",
	latestWeatherDate: "2018-01-31",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 10
};

const prodConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	CLUapi: "https://covercrop.ncsa.illinois.edu",
	latestWeatherDate: "2018-01-31",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 10
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
