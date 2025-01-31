import React, {Component} from "react";
import SelectFieldsCC from "./SelectFieldsCC";
import RunSimulationCC from "./RunSimulationCC";
import ViewResultsCC from "./ViewResultsCC";
import MapCC from "./MapCC";
import {connect} from "react-redux";
import config from "../app.config";
import {getExtentOfFieldsForUser, getKeycloakHeader} from "../public/utils";
import Spinner from "./Spinner";
import {transform as olTransform} from "ol/proj";
import {Feature as OlFeature} from "ol";
import {GeoJSON} from "ol/format";

class RightPaneCC extends Component {

	constructor(props) {
		super(props);
		this.state = {
			markercoordinate: [],
			areafeatures: [
				new OlFeature({})
			],
			extent: null,
			showModal: false
		};

		this.startShowingModal = this.startShowingModal.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const {
			analysis_longitude,
			analysis_latitude
		} = nextProps;

		// add marker
		let coordinate = olTransform([analysis_longitude, analysis_latitude], "EPSG:4326", "EPSG:3857" );
		this.setState({markercoordinate: coordinate});

		const CLUapi = `${config.CLUapi }/CLUs?lat=${ analysis_latitude }&lon=${ analysis_longitude }&soil=false`;

		if (analysis_latitude !== "") {
			fetch(CLUapi, {
				method: "GET",
				headers: {
					"Authorization": getKeycloakHeader(),
					"Cache-Control": "no-cache"
				}
			}).then(response => {
				let geojson = response.json();
				return geojson;
			}).then(geojson => {

				let features = (new GeoJSON()).readFeatures(geojson, {
					dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"
				});
				this.setState({areafeatures: features});
			}).catch(function (e) {
				console.log(`Get CLU failed: ${ e}`);
			});
		}
	}

	componentDidMount() {
		let currentFieldsExtent = getExtentOfFieldsForUser(this.props.email);
		this.setState({extent: currentFieldsExtent});
	}

	startShowingModal() {
		this.setState({showModal: true});
	}
	render(){
		if (this.state.showModal) {
			return ( <Spinner/> );
		}

		let displayComponent = null;

		return (
			<div className="analysis-map-div">
				<MapCC mapId="analysis-clu"
					markercoordinate={this.state.markercoordinate}
					areafeatures={this.state.areafeatures}
					extent={this.state.extent}
				/>
				<SelectFieldsCC />
				{this.props.clu === 0 ? null : <RunSimulationCC startShowingModal={this.startShowingModal}/>}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		analysis_longitude: state.analysis.longitude,
		analysis_latitude: state.analysis.latitude,
		clu: state.analysis.clu,
		activeCardIndex: state.analysis.activeCardIndex,
		email: state.user.email
	};
};

export default connect(mapStateToProps, null)(RightPaneCC);
