import React, {Component} from "react";
import { connect } from 'react-redux';
import ol from 'openlayers';
import styles from "../styles/main.css";
import styles2 from "../styles/user-page.css";
require("openlayers/css/ol.css");
import {handleLatFieldChange, handleLongFieldChange, handleCLUChange, handleUserCLUChange} from "../actions/analysis";
import config from '../app.config';

class MapCC extends Component {

	constructor(props) {
		super(props);
		this.defaultCenter = ol.proj.fromLonLat([-88.263340, 40.026498]);
		this.defaultZoom = 16;

		this.iconStyle = new ol.style.Style({
			image: new ol.style.Icon(({
				anchor: [0.5, 46],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				opacity: 0.80,
				src: "../images/map-marker.png"
			}))
		});

		this.markerSource = new ol.source.Vector({
			features: []
		});
		this.marker = new ol.layer.Vector({
			source: this.markerSource
		});

		this.state = {
			map: new ol.Map({
				layers: [
					new ol.layer.Tile({
						source: new ol.source.BingMaps({
							key: 'Ahkpb-yLsjXtJQVJmVQ1RT2V4Yt-mmAmxyfYAbDyUY20cNWB2XNJjLVPqxtW3l9Y',
							imagerySet: 'AerialWithLabels'
						})
					}),
					new ol.layer.Tile({
						source: new ol.source.TileWMS({
							url: 'http://fd-geoserver.ncsa.illinois.edu:8080/geoserver/wms',
							params: {'LAYERS': 'covercrop:clu', 'TILED': true},
							serverType: 'geoserver'
						}),
						opacity: 0.7
					}),
					this.marker
				],
				view: new ol.View({
					center: this.defaultCenter,
					zoom: this.defaultZoom,
					maxZoom: 19
				})
			}),
			areaPolygonLayer: new ol.layer.Vector({
				id: "areaPolygon",
				source: new ol.source.Vector({
					features: [
						new ol.Feature({})
					]
				}),
				style:
					new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: '#1AB146',
							width: 4
						}),
						fill: new ol.style.Fill({
							color: 'rgba(225, 225, 255, 0.4)'
						})
					})
				,
				visible: true
			})

		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		// function for add user field page
		if(this.props.selectCLU) {
			// console.log(e.coordinate)
			this.dropMarker(e.coordinate);

			let lonLatCoordinates = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');

			// Format number to a string with 6 digits after decimal point
			lonLatCoordinates[0] = lonLatCoordinates[0].toFixed(6);
			lonLatCoordinates[1] = lonLatCoordinates[1].toFixed(6);
			this.props.handleLatFieldChange(lonLatCoordinates[1]);
			this.props.handleLongFieldChange(lonLatCoordinates[0]);

			const CLUapi = config.CLUapi + "/api/CLUs?lat=" + lonLatCoordinates[1] + "&lon=" + lonLatCoordinates[0] + "&soil=false";

			let areaPolygonSource = this.state.areaPolygonLayer.getSource();
			let that = this;
			fetch(CLUapi).then(response => {
				let geojson = response.json();
				return geojson;
			}).then(geojson => {

				let features = (new ol.format.GeoJSON()).readFeatures(geojson, {
					dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
				});

				areaPolygonSource.clear();
				areaPolygonSource.addFeatures(features);
				// console.log(geojson)
				that.props.handleUserCLUChange(geojson.features[0].properties["clu_id"], "");

			}).catch(function (e) {
				console.log("Get CLU failed: " + e);
				areaPolygonSource.clear();
				that.props.handleUserCLUChange(0, "");
			});
		}
	}

	dropMarker(coordinate) {

		let iconFeature = new ol.Feature({
			geometry: new ol.geom.Point(coordinate)
		});
		iconFeature.setStyle(this.iconStyle);

		this.markerSource.clear();
		this.markerSource.addFeature(iconFeature);
	}

	componentDidMount(e) {
		this.marker.setZIndex(100);

		this.state.map.setTarget(this.props.mapId); // Set target for map
		this.state.map.on("click", this.handleClick); // Set on click event handler

		this.dropMarker(this.defaultCenter); // Drop default marker
		let {areaPolygonLayer} = this.state;
		this.state.map.addLayer(areaPolygonLayer);
		areaPolygonLayer.setZIndex(1001);
		let that = this;
		new Promise(resolve => setTimeout(resolve, 200)).then(function (){
			that.state.map.updateSize();
		})
	}

	componentDidUpdate() {
		// function for analysis page
		if(!this.props.selectCLU){
			const {
				analysis_longitude,
				analysis_latitude
			} = this.props;
            // add marker
			let coordinate = ol.proj.transform([analysis_longitude, analysis_latitude], 'EPSG:4326', 'EPSG:3857' );
			// console.log(coordinate)
			this.dropMarker(coordinate);
			this.state.map.getView().setCenter(coordinate);
			let lonLatCoordinates = [analysis_longitude, analysis_latitude];
            //TODO use "api/CLUs/id"
            //add CLU polygon
			const CLUapi = config.CLUapi + "/api/CLUs?lat=" + lonLatCoordinates[1] + "&lon=" + lonLatCoordinates[0] + "&soil=false";

			let areaPolygonSource = this.state.areaPolygonLayer.getSource();
			fetch(CLUapi).then(response => {
				let geojson = response.json();
				return geojson;
			}).then(geojson => {

				let features = (new ol.format.GeoJSON()).readFeatures(geojson, {
					dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
				});

				areaPolygonSource.clear();
				areaPolygonSource.addFeatures(features);
				// console.log(geojson)
            //TODO: change center
			}).catch(function (e) {
				console.log("Get CLU failed: " + e);
				areaPolygonSource.clear();
			});
		}
	}

	render(){
		const mapStyle = {
			width: 900,
			height: 675,
			backgroundColor: '#ebebeb'
		};

		return(
				<div id={this.props.mapId} className="fullmap"/>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		analysis_longitude: state.analysis.longitude,
		analysis_latitude: state.analysis.latitude,
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

export default connect(mapStateToProps, mapDispatchToProps)(MapCC);
