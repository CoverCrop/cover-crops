import React, {Component} from "react";
import {Button, Textfield, Body1, Grid, Cell} from "react-mdc-web";
import CoordinateFieldCC from "./CoordinateFieldCC";
let ol = require('openlayers');
require("openlayers/css/ol.css");

class MapCC extends Component {

	constructor(props) {
		super(props);
		this.defaultCenter = ol.proj.fromLonLat([-88.241919, 40.116726]); //[-9822960.723442, 4882854.694628];
		this.defaultZoom = 12;

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
						})
					})
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
		console.log(e);
	}

	componentDidMount(e){
		this.state.map.setTarget(this.props.mapId);
	}

	render(){
		return(
			<div onClick={this.handleClick} id={this.props.mapId}/>
		)
	}

}

export default MapCC;
