import React, {Component} from "react";
import Header from './Header';
import ol from 'openlayers';
import {Body1, Body2, Button, Card, CardText, Cell, Checkbox, FormField, Grid, Textfield} from "react-mdc-web";
import MapCC from './MapCC';
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import AddFieldBox from "./AddFieldBox"
import {connect} from "react-redux";
import config from "../app.config";
import {getCLUGeoJSON, getExtentOfFieldsForUser, getMyFieldList} from "../public/utils";
import {handleLatFieldChange, handleLongFieldChange, handleUserCLUChange} from "../actions/analysis";


class AddFieldPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clus: [],
			markercoordinate: [],
			areafeatures: [
				new ol.Feature({})
			],
			extent: null
		};
	}

	componentDidMount() {

		let currentExtent = getExtentOfFieldsForUser(this.props.email);
		// if (!ol.extent.isEmpty(currentExtent)) {
		// 	this.setState({defaultCenter: ol.extent.getCenter(currentExtent)})
		// }
		this.setState({extent: currentExtent});
	}

	handleClick = (e) => {
            this.setState({markercoordinate: e.coordinate});
			let lonLatCoordinates = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');

			// Format number to a string with 6 digits after decimal point
			lonLatCoordinates[0] = lonLatCoordinates[0].toFixed(6);
			lonLatCoordinates[1] = lonLatCoordinates[1].toFixed(6);
			this.props.handleLatFieldChange(lonLatCoordinates[1]);
			this.props.handleLongFieldChange(lonLatCoordinates[0]);

			const CLUapi = config.CLUapi + "/api/CLUs?lat=" + lonLatCoordinates[1] + "&lon=" + lonLatCoordinates[0] + "&soil=false";

			// let areaPolygonSource = this.state.areaPolygonLayer.getSource();
			let that = this;
			fetch(CLUapi).then(response => {
				return response.json();
			}).then(geojson => {

				let features = (new ol.format.GeoJSON()).readFeatures(geojson, {
					dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
				});

				this.setState({areafeatures:features});
				// console.log(geojson)
				that.props.handleUserCLUChange(geojson.features[0].properties["clu_id"], "");

			}).catch(function (e) {
				console.log("Get CLU failed: " + e);
				this.setState({areafeatures:[
						new ol.Feature({})
					]});
				that.props.handleUserCLUChange(0, "");
			});
	};


	render() {
		return (
			<AuthorizedWrap>
			<div>
				<Header />
				<AnalyzerWrap activeTab={3}/>

					<div className="choose-clu-div">
						<MapCC mapId="choose-clu"
							   markercoordinate={this.state.markercoordinate}
							   areafeatures={this.state.areafeatures}
							   handleClick={this.handleClick}
							   extent={this.state.extent}
						/>
						<AddFieldBox />
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
	}
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
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFieldPage);

