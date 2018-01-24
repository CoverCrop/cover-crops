import React, {Component} from "react";
import { connect } from 'react-redux';
let ol = require('openlayers');
require("openlayers/css/ol.css");
import {handleLatFieldChange, handleLongFieldChange} from "../actions/analysis"
import config from '../app.config'

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
							url: 'http://covercrop.ncsa.illinois.edu:9999/geoserver/wms',
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
							color: 'rgba(0, 152, 254, 1)',
							width: 2
						}),
						fill: new ol.style.Fill({
							color: 'rgba(0, 0, 255, 0.1)'
						})
					})
				,
				visible: true
			})

		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		this.dropMarker(e.coordinate);

		let lonLatCoordinates = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');

		// Format number to a string with 6 digits after decimal point
		lonLatCoordinates[0] = lonLatCoordinates[0].toFixed(6);
		lonLatCoordinates[1] = lonLatCoordinates[1].toFixed(6);
		this.props.handleLatFieldChange(lonLatCoordinates[1]);
		this.props.handleLongFieldChange(lonLatCoordinates[0]);

		//TODO: move to config.
		const CLUapi = config.CLUapi + "?lat=" + lonLatCoordinates[1]+ "&lon=" + lonLatCoordinates[0] + "&soil=false";

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

		}).catch(function(e) {
			console.log("Get CLU failed: " + e );
			areaPolygonSource.clear();
		});
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
		this.state.map.setTarget(this.props.mapId); // Set target for map
		this.state.map.on("click", this.handleClick); // Set on click event handler
		this.dropMarker(this.defaultCenter); // Drop default marker
		let areaPolygonLayer = this.state.areaPolygonLayer;
		this.state.map.addLayer(areaPolygonLayer);
		areaPolygonLayer.setZIndex(1001);
	}

	render(){
		const mapStyle = {
			width: 900,
			height: 675,
			backgroundColor: '#ebebeb'
		};

		return(
			<div>
				<div style={mapStyle} id={this.props.mapId}/>
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		handleLatFieldChange: (lat) => {
			dispatch(handleLatFieldChange(lat));
		},
		handleLongFieldChange: (lon) => {
			dispatch(handleLongFieldChange(lon));
		}
	}
};

export default connect(null, mapDispatchToProps)(MapCC);
