import React, {Component} from "react";
import Header from "./Header";
import MapCC from "./MapCC";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import AddFieldBox from "./AddFieldBox";
import {connect} from "react-redux";
import config from "../app.config";
import {
	getExtentOfFieldsForUser,
	getKeycloakHeader,
	getMyFieldList,
} from "../public/utils";
import {handleLatFieldChange, handleLongFieldChange} from "../actions/analysis";
import {handleUserCLUChange, handleUserExistCLU, handleUserSoilUnavailableChange} from "../actions/user";
import {transform as olTransform} from "ol/proj";
import {Feature as OlFeature} from "ol";
import {GeoJSON} from "ol/format";

class AddFieldPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clus: [],
			exist_clu: false,
			soil_data_unavailable: false,
			markercoordinate: [],
			areafeatures: [
				new OlFeature({})
			],
			extent: null
		};
	}

	handleClick = (e) => {
		this.setState({markercoordinate: e.coordinate});
		let lonLatCoordinates = olTransform(e.coordinate, "EPSG:3857", "EPSG:4326");

		// Format number to a string with 6 digits after decimal point
		lonLatCoordinates[0] = lonLatCoordinates[0].toFixed(6);
		lonLatCoordinates[1] = lonLatCoordinates[1].toFixed(6);
		this.props.handleLatFieldChange(lonLatCoordinates[1]);
		this.props.handleLongFieldChange(lonLatCoordinates[0]);


		const CLUapi = `${config.CLUapi }/CLUs?lat=${ lonLatCoordinates[1] }&lon=${ lonLatCoordinates[0] }&soil=false`;
		const soilApi = `${config.CLUapi }/soils?lat=${ lonLatCoordinates[1] }&lon=${ lonLatCoordinates[0]}`;

		// let areaPolygonSource = this.state.areaPolygonLayer.getSource();
		let that = this;
		fetch(CLUapi, {
			method: "GET",
			headers: {
				"Authorization": getKeycloakHeader(),
				"Cache-Control": "no-cache"
			}
		}).then(response => {
			return response.json();
		}).then(geojson => {

			let features = (new GeoJSON()).readFeatures(geojson, {
				dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"
			});

			that.setState({areafeatures: features});
			// console.log(geojson)
			let clu_id = geojson.features[0].properties["clu_id"];
			that.props.handleUserCLUChange(clu_id, "");
			// TODO, remove this API and save the clus in redux.
			getMyFieldList(this.props.email).then(function(clus){
				that.props.handleUserExistCLU(clus.filter(userclu => userclu.clu === clu_id).length > 0);
			});


		}).catch(function (e) {
			console.log(`Get CLU failed: ${ e}`);
			that.setState({areafeatures: [
				new OlFeature({})
			]});
			that.props.handleUserCLUChange(0, "");
		});

		// Call to check if soil data is available.
		fetch(soilApi, {
			method: "GET",
			headers: {
				"Authorization": getKeycloakHeader(),
				"Cache-Control": "no-cache"
			}
		}).then(response => {
			return response.json();
		}).then(soilJson => {
			if (soilJson.length === 0) {
				//Soil data unavailable
				this.props.handleUserSoilUnavailableChange(true);
			}
			else {
				//Soil data available
				this.props.handleUserSoilUnavailableChange(false);

			}
		});
	};
	componentDidMount() {

		let currentExtent = getExtentOfFieldsForUser(this.props.email);
		// if (!ol.extent.isEmpty(currentExtent)) {
		// 	this.setState({defaultCenter: ol.extent.getCenter(currentExtent)})
		// }
		this.setState({extent: currentExtent});
	}


	render() {
		let {markercoordinate, areafeatures} = this.state;
		return (
			<AuthorizedWrap history={this.props.history}>
				<div>
					<Header history={this.props.history}/>
					<AnalyzerWrap activeTab={3}/>

					<div className="choose-clu-div">
						<MapCC mapId="choose-clu" markercoordinate={markercoordinate} areafeatures={areafeatures}
										handleClick={this.handleClick} extent={this.state.extent}
						/>
						<AddFieldBox/>
					</div>

				</div>
			</AuthorizedWrap>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		clu: state.analysis.clu,
		email: state.user.email
	};
};


const mapDispatchToProps = (dispatch) => {
	return {
		handleLatFieldChange: (lat) => {
			dispatch(handleLatFieldChange(lat));
		},
		handleLongFieldChange: (lon) => {
			dispatch(handleLongFieldChange(lon));
		},
		handleUserCLUChange: (clu, cluname) => {
			dispatch(handleUserCLUChange(clu, cluname));
		},
		handleUserSoilUnavailableChange: (soilAvailable) => {
			dispatch(handleUserSoilUnavailableChange(soilAvailable));
		},
		handleUserExistCLU: (exist_clu) => {
			dispatch(handleUserExistCLU(exist_clu));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFieldPage);

