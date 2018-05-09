const devConfig = {
	basePath: "/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	CLUapi: "http://localhost:5000"
};

const prodConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	CLUapi: "https://covercrop.ncsa.illinois.edu"
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
