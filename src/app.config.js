const devConfig = {
	basePath: "/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	CLUapi: "https://fd-geoserver.ncsa.illinois.edu",
	latestWeatherDate: "2018-01-31"
};

const prodConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	CLUapi: "https://fd-geoserver.ncsa.illinois.edu",
	latestWeatherDate: "2018-01-31"
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
