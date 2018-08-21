import React, {Component} from "react";
import Header from './Header';
import ol from 'openlayers';
import {Button, Textfield, Card, CardText, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import MapCC from './MapCC';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import AddFieldBox from "./AddFieldBox"
import {connect} from "react-redux";
import config from "../app.config";
import {getMyFieldList} from "../public/utils";
import {handleLatFieldChange, handleLongFieldChange } from "../actions/analysis";
import {handleUserCLUChange} from "../actions/user"

class AddFieldPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clus:[],
			exist_clu: false,
			markercoordinate: [],
			areafeatures: [
				new ol.Feature({})
			]
		}
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
				let geojson = response.json();
				return geojson;
			}).then(geojson => {

				let features = (new ol.format.GeoJSON()).readFeatures(geojson, {
					dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
				});

				that.setState({areafeatures:features});
				// console.log(geojson)
				let clu_id = geojson.features[0].properties["clu_id"];
				that.props.handleUserCLUChange(clu_id, "");

				getMyFieldList(this.props.email).then(function(clus){
					// console.log(clus.filter(userclu => userclu.clu === clu_id));
					that.setState({exist_clu: (clus.filter(userclu => userclu.clu === clu_id).length >0) });

				})


			}).catch(function (e) {
				console.log("Get CLU failed: " + e);
				that.setState({areafeatures:[
						new ol.Feature({})
					]});
				that.props.handleUserCLUChange(0, "");
			});

	}


	render() {
		let {markercoordinate, areafeatures, exist_clu} = this.state;
		return (
			<AuthorizedWrap>
			<div>
				<Header />
				<AnalyzerWrap activeTab={3}/>

					<div className="choose-clu-div">
						<MapCC mapId="choose-clu"
							   markercoordinate={markercoordinate}
							   areafeatures={areafeatures}
							   handleClick={this.handleClick}
						/>
						<AddFieldBox exist_clu={exist_clu}/>
					</div>

			</div>
			</AuthorizedWrap>
		);
	}
}

const mapStateToProps = (state) => {
	return {
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

