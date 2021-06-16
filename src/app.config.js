import Keycloak from "keycloak-js";


const prodDomain = "covercrop.ncsa.illinois.edu";
const devDomain = "covercrop-dev.ncsa.illinois.edu";

const localConfig = {
	basePath: "/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: "localhost",
	CLUapi: "http://localhost:5000/api",
	latestWeatherDate: "2020-07-31",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 14,
	coverCropTerminationOffsetDays: 14, // Cover crop termination = Cash crop planting + 14 days
	useCroplandDataLayer: true, // Use Cropland data layer to get crop rotation history
	keycloak: Keycloak("http://localhost:3000/keycloak.json"),
	geoServer: "https://fd-geoserver.ncsa.illinois.edu/geoserver/wms",
	hideDecompOutputs: false,
	hideDashboardSections: true,
	dssatNaValue: "-99"
};

const devConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: ".ncsa.illinois.edu",
	CLUapi: "https://fd-api-dev.ncsa.illinois.edu/covercrop/api",
	latestWeatherDate: "2020-07-31",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 14,
	coverCropTerminationOffsetDays: 14, // Cover crop termination = Cash crop planting + 14 days
	useCroplandDataLayer: true, // Use Cropland data layer to get crop rotation history
	keycloak: Keycloak(`https://${ devDomain }/keycloak.json`),
	geoServer: "https://fd-geoserver.ncsa.illinois.edu/geoserver/wms",
	hideDecompOutputs: false,
	hideDashboardSections: true,
	dssatNaValue: "-99"
};


const prodConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: ".ncsa.illinois.edu",
	CLUapi: "https://fd-api.ncsa.illinois.edu/covercrop/api",
	latestWeatherDate: "2020-07-31",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 14,
	coverCropTerminationOffsetDays: 14, // Cover crop termination = Cash crop planting + 14 days
	useCroplandDataLayer: true, // Use Cropland data layer to get crop rotation history
	keycloak: Keycloak(`https://${ prodDomain }/keycloak.json`),
	geoServer: "https://fd-geoserver.ncsa.illinois.edu/geoserver/wms",
	hideDecompOutputs: false,
	hideDashboardSections: true,
	dssatNaValue: "-99"
};

const config = getConfig();

function getConfig() {

	if (process.env.REACT_APP_ENV === "production") {
		return prodConfig;
	}
	else if (process.env.REACT_APP_ENV === "development"){
		return devConfig;
	}
	else {
		return localConfig;
	}
}

export default config;
