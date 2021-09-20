import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import styles2 from "../styles/main.css";
import {Textfield, Button, Fab, Grid, Cell, Title, Icon} from "react-mdc-web";
import {connect} from "react-redux";
import CoordinateFieldCC from "./CoordinateFieldCC";
import {handleCardChange, handleLatFieldChange, handleLongFieldChange} from "../actions/analysis";
import config from "../app.config";
import {existCLUNote} from "../app.messages.js";
import {dictToOptions, getKeycloakHeader, getMyFieldList} from "../public/utils";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {croplandUrl, privacyUrl} from "../public/config";
import {soilDataUnavailableMessage} from "../app.messages";
import {drainage_type} from "../experimentFile";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {TextField} from "@material-ui/core";
// import {transform as olTransform} from "ol/proj";
// import {GeoJSON} from "ol/format";
// import {Feature as OlFeature} from "ol";
import {handleUserCLUChange} from "../actions/user";

class AddFieldBox extends Component {

	constructor(props) {
		super(props);

		this.state = {
			popupOpen: false,
			cluname: "",
			tileDrainage: "DR002",
			exist_clu: false,
			soil_data_unavailable: false
		};
		this.handleAddCLU = this.handleAddCLU.bind(this);
		this.onTileDrainageChange = this.onTileDrainageChange.bind(this);
	}

	handleLatFieldChange = (e) => {
		this.props.handleLatFieldChange(e.target.value);
	};

	handleLongFieldChange = (e) => {
		this.props.handleLongFieldChange(e.target.value);
	};

	handleCoordinatesBlur = () => {
		let {latitude, longitude} = this.props;
		if (!(latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180)) {
			return;
		}

		// Format number to a string with 6 digits after decimal point
		latitude = Number(latitude).toFixed(6);
		longitude = Number(longitude).toFixed(6);
		this.props.handleLatFieldChange(latitude);
		this.props.handleLongFieldChange(longitude);

		const CLUapi = `${config.CLUapi }/CLUs?lat=${latitude}&lon=${longitude}&soil=false`;
		const soilApi = `${config.CLUapi }/soils?lat=${latitude}&lon=${longitude}`;

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

			// TODO: Try to set this and zoom to the clu on map?.
			// let features = (new GeoJSON()).readFeatures(geojson, {
			// 	dataProjection: "EPSG:4326", featureProjection: "EPSG:3857"
			// });

			// that.setState({areafeatures: features});

			let clu_id = geojson.features[0].properties["clu_id"];
			that.props.handleUserCLUChange(clu_id, "");
			getMyFieldList(this.props.email).then(function(clus){
				that.setState({exist_clu: (clus.filter(userclu => userclu.clu === clu_id).length > 0)});
			});
		}).catch(function (e) {
			console.log(`Get CLU failed: ${ e}`);
			// that.setState({areafeatures: [
			// 		new OlFeature({})
			// 	]});
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
				that.setState({soil_data_unavailable: true});
			}
			else {
				//Soil data available
				that.setState({soil_data_unavailable: false});
			}
		});
	};

	handlePopupOpen = () => {
		this.setState({popupOpen: true});
	};
	handlePopupClose = () => {
		this.setState({popupOpen: false});
	};
	handleContinue = () => {
		this.handleAddCLU();
	}
	onTileDrainageChange = (event, option) => {
		this.setState({
			tileDrainage: option.value
		});
	}
	componentDidMount(){
		this.props.handleLatFieldChange("");
		this.props.handleLongFieldChange("");
	}


	handleAddCLU() {
		const CLUapi = `${config.CLUapi }/userfield`;
		const {clu, latitude, longitude} = this.props;
		let headers = {
			"Content-Type": "application/json",
			"Authorization": getKeycloakHeader(),
			"Cache-Control": "no-cache"
		};
		let bodyjson = `{"userid":"${ localStorage.getItem("kcEmail") }", "clu":${ clu
			 }, "cluname":"${ this.state.cluname }", "lat":${ latitude }, "lon":${ longitude
			 }, "expfile": ""}`;
		fetch(CLUapi, {
			method: "POST",
			headers: headers,
			body: bodyjson
		}).then(response => {
			const postJSONapi = `${config.CLUapi }/users/${ localStorage.getItem("kcEmail") }/CLUs/${ clu
				 }/experiment_file_json` + `?use_cropland_data=${ config.useCroplandDataLayer }&tile_drainage=${ this.state.tileDrainage}`;
			fetch(postJSONapi, {
				method: "POST",
				headers: headers,
			}).then(response => {
				window.location = "/profile";
			});
		}).catch(function(e) {
			console.log(`Add CLU failed: ${ e}` );
		});
	}

	render() {
		let options = dictToOptions(drainage_type);
		let exist_clu = this.props.exist_clu || this.state.exist_clu;
		let soil_data_unavailable = this.props.soil_data_unavailable || this.state.soil_data_unavailable;

		return (
			<div className="add-field-div">

				<Dialog
						open={this.state.popupOpen}
						onClose={this.handlePopupClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
				>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<p>
								We will be creating a new field with crop rotation details populated from USDA&nbsp;
								<a className="cc-link" href={croplandUrl} target="_blank" rel="noreferrer">
									Cropland Data Layer
								</a>
								&nbsp;and other default management data for this region.
								Please update your actual cash crop and cover crop details using the "My Farm" section.
								Please click 'Continue' to proceed.
							</p>
							<br/>

							<p>
								Read about our&nbsp;
								<a className="cc-link" href={privacyUrl} target="_blank" rel="noreferrer">
									Privacy Policy
								</a>
							</p>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handlePopupClose} color="primary" autoFocus>
							Cancel
						</Button>
						<Button onClick={this.handleContinue} color="primary" autoFocus>
							Continue
						</Button>
					</DialogActions>
				</Dialog>


				<div className="add-field-box add-field-title">

					<Fab >
						<Icon name="add"/>
					</Fab>
					<Title>Add a Field</Title>
					<p>Locate the field by typing an address or click on the map</p>
					<div className="warning-div">
						{exist_clu && (
							<div className="warning-message-div">
								<Icon className="warning-message" name="warning"/>
								<p className="exist-message">{existCLUNote}</p>
							</div>
						)}
						{soil_data_unavailable && (
							<div className="warning-message-div">
								<Icon className="warning-message" name="warning"/>
								<p className="exist-message">{soilDataUnavailableMessage}</p>
							</div>
						)}
					</div>
					<Grid style={{height: "100px", padding: "0px"}}>
						<Cell col={6}>
							<CoordinateFieldCC
								helptext="Latitude value must between -90 and 90"
								min="-90"
								max="90"
								type="number"
								step="0.000001"
								value={this.props.latitude}
								onChange={this.handleLatFieldChange}
								onBlur={this.handleCoordinatesBlur}
								floatingLabel="Latitude"/>
						</Cell>
						<Cell col={6}>
							<CoordinateFieldCC
								helptext="Longitude value must between -180 and 180"
								min="-180"
								max="180"
								type="number"
								step="0.000001"
								value={this.props.longitude}
								onChange={this.handleLongFieldChange}
								onBlur={this.handleCoordinatesBlur}
								floatingLabel="Longitude"/>
						</Cell>
					</Grid>


					<Textfield
								required
								style={{width: "250px"}}
								floatingLabel="CLU name"
								onChange={({target: {value: cluname}}) => {
									this.setState({cluname});
								}}
					/>

					<Autocomplete options={options}
													disableClearable={true}
													getOptionLabel={(option) => option.label}
													style={{width: "250px", marginTop: "30px"}}
													defaultValue={options[0]}
													onChange={this.onTileDrainageChange}
													renderInput={(params) =>
														<TextField {...params} label="Tile Drainage" required={true} variant="outlined" InputLabelProps={{shrink: true}}/>
													}
					/>
				</div>
				<div className="add-field-bottom">
					<Link type="submit" className="cancel-button" to="/profile">Cancel</Link>
					<button type="submit" className="blue-button add-button"
							disabled={this.state.cluname === "" || this.props.clu === 0 || this.state.tileDrainage.trim() === ""}
							onClick={this.handlePopupOpen}
					>ADD FIELD</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		longitude: state.analysis.longitude,
		latitude: state.analysis.latitude,
		clu: state.user.clu,
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
		handleCardChange: (oldCardIndex, newCardIndex, oldCardData) => {
			dispatch(handleCardChange(oldCardIndex, newCardIndex, oldCardData));
		},
		handleUserCLUChange: (clu, cluname) => {
			dispatch(handleUserCLUChange(clu, cluname));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFieldBox);
