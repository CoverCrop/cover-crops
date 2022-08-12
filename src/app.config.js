import Keycloak from "keycloak-js";

const KEYCLOAK_REALM = "farmdoc";
const KEYCLOAK_CLIENT = "covercrop";

const localConfig = {
	basePath: "/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: "localhost",
	CLUapi: "http://localhost:5000/api",
	datawolfUrl: "http://localhost:8888/datawolf",
	latestWeatherDate: "2022-04-30",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 14,
	coverCropTerminationOffsetDays: 14, // Cover crop termination = Cash crop planting + 14 days
	useCroplandDataLayer: true, // Use Cropland data layer to get crop rotation history
	keycloak: Keycloak({
		realm: KEYCLOAK_REALM,
		clientId: KEYCLOAK_CLIENT,
		url: "https://fd-auth-dev.ncsa.illinois.edu/auth"
	}),
	geoServer: "https://fd-geoserver-dev.ncsa.illinois.edu/geoserver/wms",
	hideDecompOutputs: false,
	hideDashboardSections: false,
	dssatNaValue: "-99"
};

const devConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: ".ncsa.illinois.edu",
	CLUapi: "https://fd-api-dev.ncsa.illinois.edu/covercrop/api",
	datawolfUrl: "https://fd-api-dev.ncsa.illinois.edu/datawolf",
	latestWeatherDate: "2022-04-30",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 14,
	coverCropTerminationOffsetDays: 14, // Cover crop termination = Cash crop planting + 14 days
	useCroplandDataLayer: true, // Use Cropland data layer to get crop rotation history
	keycloak: Keycloak({
		realm: KEYCLOAK_REALM,
		clientId: KEYCLOAK_CLIENT,
		url: "https://fd-auth-dev.ncsa.illinois.edu/auth"
	}),
	geoServer: "https://fd-geoserver-dev.ncsa.illinois.edu/geoserver/wms",
	hideDecompOutputs: false,
	hideDashboardSections: false,
	dssatNaValue: "-99"
};


const prodConfig = {
	basePath: "/covercrops/",
	fragilityServer: "",
	fragilityMappingServer: "",
	semanticServer: "",
	domain: ".ncsa.illinois.edu",
	CLUapi: "https://fd-api.ncsa.illinois.edu/covercrop/api",
	datawolfUrl: "https://fd-api.ncsa.illinois.edu/datawolf",
	latestWeatherDate: "2022-04-30",
	defaultCenterLongLat: [-88.2, 40.14],
	defaultZoom: 14,
	coverCropTerminationOffsetDays: 14, // Cover crop termination = Cash crop planting + 14 days
	useCroplandDataLayer: true, // Use Cropland data layer to get crop rotation history
	keycloak: Keycloak({
		realm: KEYCLOAK_REALM,
		clientId: KEYCLOAK_CLIENT,
		url: "https://fd-auth.ncsa.illinois.edu/auth"
	}),
	geoServer: "https://fd-geoserver.ncsa.illinois.edu/geoserver/wms",
	hideDecompOutputs: false,
	hideDashboardSections: false,
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
