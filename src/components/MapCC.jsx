import React, {Component} from "react";
let ol = require('openlayers');
require("openlayers/css/ol.css");

class MapCC extends Component {

	constructor(props) {
		super(props);
		this.defaultCenter = ol.proj.fromLonLat([-88.235667, 40.168313]);
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

		this.props.onMapClick(lonLatCoordinates);
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

export default MapCC;
