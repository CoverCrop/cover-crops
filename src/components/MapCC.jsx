import React, {Component} from "react";
import PropTypes from "prop-types";
import config from "../app.config.js";
require("ol/ol.css");
import {
	View as OlView,
	Feature as OlFeature,
	Map as OlMap
} from "ol";
import {Point as OlPoint} from "ol/geom";
import {fromLonLat} from "ol/proj";
import {Style as OlStyle} from "ol/style";
import {
	Icon as OlIcon,
	Stroke as OlStroke,
	Fill as OlFill
} from "ol/style";
import {
	Vector as VectorLayer,
	Tile as LayerTile
} from "ol/layer";
import {
	Vector as VectorSource,
	BingMaps,
	TileWMS
} from "ol/source";

class MapCC extends Component {

	constructor(props) {
		super(props);

		this.defaultCenter = (this.props.defaultCenter !== undefined && this.props.defaultCenter !== null) ?
			this.props.defaultCenter : fromLonLat(config.defaultCenterLongLat);
		this.defaultZoom = (this.props.defaultZoom !== undefined && this.props.defaultZoom !== null) ?
			this.props.defaultZoom : config.defaultZoom;
		this.iconStyle = new OlStyle({
			image: new OlIcon({
				anchor: [0.5, 46],
				anchorXUnits: "fraction",
				anchorYUnits: "pixels",
				opacity: 0.80,
				src: "../images/map-marker.png"
			})
		});

		this.markerSource = new VectorSource({
			features: []
		});
		this.marker = new VectorLayer({
			source: this.markerSource
		});

		this.state = {
			map: new OlMap({
				layers: [
					new LayerTile({
						source: new BingMaps({
							key: "Ahkpb-yLsjXtJQVJmVQ1RT2V4Yt-mmAmxyfYAbDyUY20cNWB2XNJjLVPqxtW3l9Y",
							imagerySet: "AerialWithLabels"
						})
					}),
					new LayerTile({
						source: new TileWMS({
							url: config.geoServer,
							params: {"LAYERS": "covercrop:clu", "TILED": true},
							serverType: "geoserver"
						}),
						opacity: 0.7
					}),
					this.marker
				],
				view: new OlView({
					center: this.defaultCenter,
					zoom: this.defaultZoom,
					minZoom: 0,
					maxZoom: 28
				})
			}),
			areaPolygonLayer: new VectorLayer({
				id: "areaPolygon",
				source: new VectorSource({
					features: [
						new OlFeature({})
					]
				}),
				style:
					new OlStyle({
						stroke: new OlStroke({
							color: "#1AB146",
							width: 4
						}),
						fill: new OlFill({
							color: "rgba(225, 225, 255, 0.4)"
						})
					})
				,
				visible: true
			})

		};
	}

	dropMarker(coordinate) {

		let iconFeature = new OlFeature({
			geometry: new OlPoint(coordinate)
		});
		iconFeature.setStyle(this.iconStyle);

		this.markerSource.clear();
		this.markerSource.addFeature(iconFeature);
	}

	componentDidMount() {
		let {handleClick} = this.props;
		let {areaPolygonLayer} = this.state;
		this.marker.setZIndex(100);

		this.state.map.setTarget(this.props.mapId); // Set target for map
		if(handleClick){
			this.state.map.on("click", handleClick); // Set on click event handler
		}
		this.dropMarker(this.defaultCenter); // Drop default marker
		this.state.map.addLayer(areaPolygonLayer);

		// wait until the map is loaded and update the size.
		let that = this;
		new Promise(resolve => setTimeout(resolve, 500)).then(function (){
			console.log("map extent: " + that.props.extent);
			if (that.props.extent !== undefined && that.props.extent !== null && that.props.extent[0] !== Infinity) {
				// console.log("Inside");
				that.state.map.getView().fit(that.props.extent, that.state.map.getSize());
			}
			that.state.map.updateSize();
		});
	}

	componentDidUpdate() {

		//keep this console for testing infinite loop.
		console.log("drop marker at: " + this.props.markercoordinate);
		this.dropMarker(this.props.markercoordinate);
        // not used currently
		// if(this.props.zoomlevel){
		// 	this.state.map.getView().setZoom(this.props.zoomlevel);
		// }
		let areaPolygonSource = this.state.areaPolygonLayer.getSource();
		areaPolygonSource.clear();
		areaPolygonSource.addFeatures(this.props.areafeatures);
		if(this.props.recenter ){
			this.state.map.getView().setCenter(this.props.markercoordinate);
		} else if(this.props.fitmap && isFinite(areaPolygonSource.getExtent()[1])) {
			// console.log(areaPolygonSource.getExtent());
			this.state.map.getView().fit(areaPolygonSource.getExtent(), this.state.map.getSize());
		}
	}

	render(){
		return(
				<div id={this.props.mapId} className="fullmap"/>
		);
	}
}

MapCC.propTypes = {
	mapId: PropTypes.string.isRequired,
	// the area polygon
	areafeatures: PropTypes.array,
	// the marker coordinate, need to transfrom from lat & lon
	markercoordinate: PropTypes.array,
	// to fit the map based area polygon on whenever map is update
	fitmap: PropTypes.bool,
	// to rencenter the map based on marker whenever map is update, but keep the default zoom level.
	recenter: PropTypes.bool,
	// to zoom into the location where fields are present
	extent: PropTypes.array
};

export default MapCC;
