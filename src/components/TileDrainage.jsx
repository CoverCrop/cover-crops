import React, {useEffect} from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {drainage_type as DRAINAGE_TYPES, drainage_type_defaults} from "../experimentFile.js";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import config from "../app.config";
import {
	convertCmToInches, convertFeetToMeters, convertInchesToCm,
	convertMetersToFeet,
	getCropObj,
	getExperimentSQX, getFieldObj,
	getKeycloakHeader,
} from "../public/utils";
import DialogContentText from "@material-ui/core/DialogContentText";
import {tdfail, tdsuccess} from "../app.messages";
import {useSelector, useDispatch} from "react-redux";

const TileDrainage = ({selectedCLU, email}) => {

	const store = useSelector(store => store);
	const expObj = store.user.fieldobj;

	const dispatch = useDispatch();
	const [drainageType, setDrainageType] = React.useState("DR002");
	const [depth, setDepth] = React.useState(drainage_type_defaults["DR002"]["depth"]);
	const [spacing, setSpacing] = React.useState(drainage_type_defaults["DR002"]["spacing"]);

	const [updateMsg, setUpdateMessage] = React.useState("");
	const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);

	useEffect(() => {
				if(expObj !== undefined){
					setDrainageType(expObj["FLDT"] ? expObj["FLDT"]: "DR002");
					setDepth(expObj["FLDD"] ?
							(expObj["FLDD"] !== "-99"? convertCmToInches(expObj["FLDD"]): ""):
							drainage_type_defaults["DR002"]["depth"]);
					setSpacing(expObj["FLDS"] ?
							(expObj["FLDS"] !== "-99"? convertMetersToFeet(expObj["FLDS"]): ""):
							drainage_type_defaults["DR002"]["spacing"]);
				}
			}, [expObj]);

	const handleDrainageChange = (event) => {
		setDrainageType(event.target.value);
		setDepth(drainage_type_defaults[event.target.value]["depth"]);
		setSpacing(drainage_type_defaults[event.target.value]["spacing"]);
	};

	const handleDepthChange = (event) => {
		setDepth(event.target.value);
	};

	const handleSpacingChange = (event) => {
		setSpacing(event.target.value);
	};

	const handlePopupClose = () => {
		setUpdateDialogOpen(false);
	};

	const clu = selectedCLU.clu;

	const handleTileDrainageUpdate = (clu, email) => {
		fetch(`${config.CLUapi }/users/${ email }/CLUs/${ clu }/experiment_file_json`, {
			method: "PATCH",
			body: JSON.stringify([{
				"EVENT": "drainage",
				"FLDT": drainageType,
				"CONTENT": [{
					"FLDRS": spacing !== "" ? convertFeetToMeters(spacing): "-99",
					"FLDRD": depth !== "" ? convertInchesToCm(depth): "-99"
				}]
			}]),
			headers: {
				"Content-Type": "application/json",
				"Authorization": getKeycloakHeader(),
				"Cache-Control": "no-cache"
			}
		}).then(updateResponse => {
			if (updateResponse.status === 200) {
				setUpdateDialogOpen(true);
				setUpdateMessage(tdsuccess);
				getExperimentSQX(email, clu).then(exptxt => {
					dispatch({
						type: "GET_EXPERIMENT_TXT",
						exptxt,
						cropobj: getCropObj(exptxt),
						fieldobj: getFieldObj(exptxt)
					});
				});
			}
		}).catch(error => {
			setUpdateDialogOpen(true);
			setUpdateMessage(tdfail);
			console.error("Error:", error);
		});
	};

	return(
		<div>
			<h2 style={{marginLeft: "14px", marginTop: "14px", color: "#455A64"}}> Drainage </h2>
			<br/>
			<div className="update-box-div">
				<div className="update-box update-box-left" style={{display: "flex"}}>

					<FormControl  variant="outlined" style={{minWidth: "200px", paddingRight: "16px", marginLeft: "12px"}}>
						<InputLabel id="simple-select-label">Drainage Type</InputLabel>
						<Select
								labelId="simple-select-label"
								id="demo-simple-select"
								value={drainageType}
								label="Drainage Type"
								onChange={handleDrainageChange}
						>
							{
								Object.entries(DRAINAGE_TYPES).map(([key, value]) => (
										<MenuItem value={key} key={key}> {value}</MenuItem>
										)
								)
							}
						</Select>
					</FormControl>
					<FormControl  style={{minWidth: "140px", paddingRight: "16px",
						display: (drainageType === "DR000")? "none": "block"}}>
						<TextField
								variant="outlined" InputLabelProps={{ shrink: true }}
								id="outlined-number" label="Depth, inch" type="number" value={depth}
								onChange={handleDepthChange}
						/>
					</FormControl>

					<FormControl  style={{minWidth: "140px", display: (drainageType === "DR000")? "none": "block"}}>
						<TextField
								variant="outlined" InputLabelProps={{ shrink: true }}
								id="outlined-number" label="Spacing, ft" type="number" value={spacing}
								onChange={handleSpacingChange}
						/>
					</FormControl>

				</div>
			</div>
			<Button variant="contained"
			        style={{backgroundColor: "rgb(26, 177, 70)", color: "white", margin: "-16px 4px 4px 12px"}}
			        onClick={() => {handleTileDrainageUpdate(clu, email);}}
			> Save </Button>

			<Dialog
					open={updateDialogOpen}
					onClose={handlePopupClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					fullWidth={true}
			>
				<DialogTitle id="alert-dialog-title">&nbsp;</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description"
					                   style={{color: "#455A64", fontWeight: "bold", textAlign: "center"}}>
						{updateMsg}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handlePopupClose} color="primary" autoFocus>
						Close
					</Button>
				</DialogActions>
			</Dialog>

		</div>
	);
};

export default TileDrainage;
