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
import {getKeycloakHeader} from "../public/utils";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

class AddFieldBox extends Component {

	constructor(props) {
		super(props);

		this.state = {
			popupOpen: false,
			cluname: ""
		};
		this.handleAddCLU = this.handleAddCLU.bind(this);
	}

	componentDidMount(){
		this.props.handleLatFieldChange("");
		this.props.handleLongFieldChange("");
	}

	handleLatFieldChange = (e) => {
		this.props.handleLatFieldChange(e.target.value);
	};

	handleLongFieldChange = (e) =>  {
		this.props.handleLongFieldChange(e.target.value);
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

	handleAddCLU() {
		const CLUapi = config.CLUapi + "/userfield";
		const {clu, latitude, longitude} = this.props;
		let headers = {
			"Content-Type": "application/json",
			"Authorization": getKeycloakHeader(),
			"Cache-Control": "no-cache"
		};
		let bodyjson = "{\"userid\":\""+ localStorage.getItem("kcEmail") +"\", \"clu\":" + clu
			+ ", \"cluname\":\"" + this.state.cluname + "\", \"lat\":"+ latitude + ", \"lon\":" + longitude
			+ ", \"expfile\": \"\"}";
		fetch(CLUapi,{
			method: "POST",
			headers: headers,
			body: bodyjson
		}).then(response => {
			const postJSONapi = config.CLUapi + "/users/"+ localStorage.getItem("kcEmail") + "/CLUs/" + clu
				+ "/experiment_file_json" + "?use_cropland_data=" + config.useCroplandDataLayer;
			fetch(postJSONapi,{
				method: "POST",
				headers: headers,
			}).then(response => {
				window.location = "/profile";
			});
		}).catch(function(e) {
			console.log("Add CLU failed: " + e );
		});
	}

	render() {
		return(
			<div>

				<Dialog
						open={this.state.popupOpen}
						onClose={this.handlePopupClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
				>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<p>
								We will be creating a new field with crop rotation details populated from USDA
								cropland data layer and other default management data for this region. Please click 'Continue' to proceed.
							</p>
							<br/>
							<p>
								Read more about the cropland data layer&nbsp;
								<a style={{color: "blue", textDecoration: "underline"}}
										href="https://nass.usda.gov/Research_and_Science/Cropland/SARS1a.php" target="_blank">
									here
								</a>
							</p>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
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
					<Grid className="no-padding-grid">
						<Cell col={6}>
							<CoordinateFieldCC
								helptext="Latitude value must between -90 and 90"
								min="-90"
								max="90"
								type="number"
								step="0.000001"
								value={this.props.latitude}
								onChange={this.handleLatFieldChange}
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
								floatingLabel="Longitude"/>
						</Cell>
					</Grid>
					{this.props.exist_clu  && <div className="go-up ">
						<Icon className="warning-message" name="warning"/>
						<p className="exist-message">{existCLUNote}</p>
					</div>}
					<Textfield
						required
						floatingLabel="CLU name"
						onChange={({target : {value : cluname}}) => {
							this.setState({ cluname });
						}}
					/>

				</div>
				<div className="add-field-bottom">
					<Link type="submit" className="cancel-button" to="/profile">Cancel</Link>
					<button type="submit" className="blue-button add-button"
							disabled={this.state.cluname ==="" || this.props.clu ===0}
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
		clu: state.user.clu
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
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFieldBox);
