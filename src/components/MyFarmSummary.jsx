import React, {Component} from "react";
import {Icon} from "react-mdc-web";
import {convertDate, convertCmToInches, convertMetersToFeet,
	convertKgPerHaToLbPerAcre, convertPerSqMeterToPerAcre, isCashCrop,
	isCoverCrop, getKeycloakHeader} from "../public/utils";
import {drainage_type, CULTIVARS, PLDS, FMCD, FACD} from "../experimentFile";
import config from "../app.config";
import {connect} from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import {soilDataUnavailableMessage} from "../app.messages";
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
		TableContainer
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = () => ({
	table: {
		minWidth: 650
	},
	tableDrainage: {
		maxWidth: 400
	},
	tableSoil: {
		maxWidth: 1000
	},
	tableCover: {
		maxWidth: 800
	},
	tableMainHeadCell: {
		fontWeight: 600,
		maxWidth: 200,
		fontSize: "0.95rem",
		textAlign: "left",
		textTransform: "uppercase",
		padding: "0px 10px",
		border: "none"
	},
	tableHeadCell: {
		fontWeight: 600,
		maxWidth: "120px",
		fontSize: "0.8rem",
		textAlign: "center",
		padding: "2px 4px"
	},
	tableSubHeadCropCell: {
		fontWeight: 600,
		maxWidth: "120px",
		fontSize: "0.8rem",
		textAlign: "center",
		padding: "2px 4px",
		borderRightWidth: 1,
		borderColor: "rgba(224, 224, 224, 1)",
		// borderRightStyle: "solid"
	},
	tableHeadCropCell: {
		fontWeight: 600,
		maxWidth: "120px",
		fontSize: "0.8rem",
		textTransform: "uppercase",
		textAlign: "center",
		padding: "2px 4px",
		borderRightWidth: 1,
		borderColor: "rgba(224, 224, 224, 1)",
		borderRightStyle: "solid"
	},
	tableCell: {
		maxWidth: "120px !important",
		textAlign: "center",
		fontSize: "0.8rem",
		padding: "2px 4px"
	},
	tableCellYear: {
		maxWidth: "120px !important",
		textAlign: "center",
		fontSize: "0.8rem",
		padding: "2px 4px",
		fontWeight: 600
	}
});

class MyFarmSummary extends Component {

	constructor(props) {
		super(props);
		this.state = {
			soilobj: []
		};
	}

	downloadExpFile = () => {
		let expFileUrl = `${config.CLUapi }/users/${ this.props.selectedCLU.userid
		}/CLUs/${ this.props.selectedCLU.clu }/experiment_file_sqx?download=true`;

		fetch(expFileUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": getKeycloakHeader(),
				"Cache-Control": "no-cache"
			}
		}).then(response => {
			if (response.status === 200) {
				response.blob().then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement("a");
					a.href = url;
					a.download = `experiment_file_${ this.props.selectedCLU.clu }.sqx`;
					a.click();
				});
			}
			else {
				//TODO: Handle error. Add error handling to show errors
				console.log(`${"API failed when trying to download the experiment " +
						"file. API URL: "}${ expFileUrl}`);
			}
		});
	};
	async getInfo() {
		let that = this;

		fetch(`${config.CLUapi }/soils?lat=${ that.props.lat }&lon=${ that.props.lon}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": getKeycloakHeader(),
				"Cache-Control": "no-cache"
			}
		}).then(res => res.json())
			.catch(error => console.error("Error:", error))
			.then(soilobj => {
				this.setState({soilobj});
			});
	}

	componentWillMount() {
		this.getInfo();
	}

	componentWillReceiveProps() {
		this.getInfo();
	}


	render() {

		const { classes } = this.props;

		let {cropobj, fieldobj} = this.props;
		let {soilobj} = this.state;
		let naValue = config.dssatNaValue;

		// cropComponent will get a warning about div but has no choice.
		let cropComponent = cropobj && Object.values(cropobj)
			.filter(obj => isCashCrop(obj)).map(obj =>
				(<TableBody>
					<TableRow key={obj["YEAR"]}>
						<TableCell className={classes.tableCellYear} rowSpan={obj["MF"].length}>{obj["YEAR"]}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{obj["CROP"]}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{CULTIVARS[obj["CU"]["CR"]]}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{PLDS[obj["MP"]["PLDS"]]}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{convertPerSqMeterToPerAcre(obj["MP"]["PPOP"])}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{convertCmToInches(obj["MP"]["PLRS"])}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{convertCmToInches(obj["MP"]["PLDP"])}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{convertDate(obj["MP"]["PDATE"])}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{convertDate(obj["MH"]["HDATE"])}</TableCell>
						<TableCell className={classes.tableCell}>{obj["MF"].length > 0 && FMCD[obj["MF"][0]["FMCD"]]}</TableCell>
						<TableCell className={classes.tableCell}>{obj["MF"].length > 0 && FACD[obj["MF"][0]["FACD"]]}</TableCell>
						<TableCell className={classes.tableCell}>{obj["MF"].length > 0 && convertDate(obj["MF"][0]["FDATE"])}</TableCell>
						<TableCell className={classes.tableCell}>{obj["MF"].length > 0 && convertKgPerHaToLbPerAcre(obj["MF"][0]["FAMN"])}</TableCell>
						<TableCell className={classes.tableCell}>{obj["MF"].length > 0 && convertCmToInches(obj["MF"][0]["FDEP"])}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{obj["MT"] != null && Object.keys(obj["MT"]).length > 0 && obj["MT"]["TIMPL"]}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{obj["MT"] != null && Object.keys(obj["MT"]).length > 0 && convertDate(obj["MT"]["TDATE"])}</TableCell>
						<TableCell className={classes.tableCell} rowSpan={obj["MF"].length}>{obj["MT"] != null && Object.keys(obj["MT"]).length > 0 && convertCmToInches(obj["MT"]["TDEP"])}</TableCell>
					</TableRow>
					{
						obj["MF"].slice(1).map(MFObj =>
							(<TableRow key={`${obj["YEAR"] }-${ MFObj["FDATE"]}`}>
								<TableCell className={classes.tableCell}>{FMCD[MFObj["FMCD"]]}</TableCell>
								<TableCell className={classes.tableCell}>{FACD[MFObj["FACD"]]}</TableCell>
								<TableCell className={classes.tableCell}>{convertDate(MFObj["FDATE"])}</TableCell>
								<TableCell className={classes.tableCell}>{convertKgPerHaToLbPerAcre(MFObj["FAMN"])}</TableCell>
								<TableCell className={classes.tableCell}>{convertCmToInches(MFObj["FDEP"])}</TableCell>
							</TableRow>))
					}
				</TableBody>)
			);

		// TODO: combine with cropComponent
		let covercropComponent = cropobj && Object.values(cropobj).filter(obj => isCoverCrop(obj)).map(obj =>
			(<TableRow key={obj["YEAR"]}>
				<TableCell className={classes.tableCellYear}>{obj["YEAR"]}</TableCell>
				<TableCell className={classes.tableCell}>{obj["CROP"]}</TableCell>
				<TableCell className={classes.tableCell}>{CULTIVARS[obj["CU"]["CR"]]}</TableCell>
				<TableCell className={classes.tableCell}>{PLDS[obj["MP"]["PLDS"]]}</TableCell>
				<TableCell className={classes.tableCell}>{convertPerSqMeterToPerAcre(obj["MP"]["PPOP"])}</TableCell>
				<TableCell className={classes.tableCell}>{convertCmToInches(obj["MP"]["PLDP"])}</TableCell>
				<TableCell className={classes.tableCell}>{convertDate(obj["MP"]["PDATE"])}</TableCell>
				<TableCell className={classes.tableCell}>{convertDate(obj["MH"]["HDATE"])}</TableCell>
			</TableRow>)
		);

		let soilComponent = soilobj && soilobj.map( obj =>
			(<TableRow key={obj["depth_bottom"]}>
				<TableCell className={classes.tableCell}>{convertCmToInches(obj["depth_bottom"])}</TableCell>
				<TableCell className={classes.tableCell}>{obj["claytotal_r"]}</TableCell>
				<TableCell className={classes.tableCell}>{obj["silttotal_r"]}</TableCell>
				<TableCell className={classes.tableCell}>{obj["sandtotal_r"]}</TableCell>
				<TableCell className={classes.tableCell}>{(obj["om_r"] * 0.58).toFixed(2)}</TableCell>
				<TableCell className={classes.tableCell}>{obj["ph1to1h2o_r"]}</TableCell>
				<TableCell className={classes.tableCell}>{obj["cec7_r"]}</TableCell>
				<TableCell className={classes.tableCell}> -- </TableCell>

			</TableRow>)
		);

		let fieldComponent = fieldobj && (<TableRow>
			<TableCell className={classes.tableCell}>{drainage_type[fieldobj["FLDT"]]}</TableCell>
			<TableCell className={classes.tableCell}>{fieldobj["FLDD"] !== naValue ? convertCmToInches(fieldobj["FLDD"]) : "NA"}</TableCell>
			<TableCell className={classes.tableCell}>{fieldobj["FLDS"] !== naValue ? convertMetersToFeet(fieldobj["FLDS"]) : "NA"}</TableCell>
		</TableRow>);

		return (

			<div>

				<div className="border-top summary-div">
					<p className="myfarm-summary-header">
						<span className="south-field">{`${this.props.selectedCLUName }   `}</span>
						<span>
							<IconButton onClick={this.downloadExpFile}>
								<Icon name="file_download"/>
							</IconButton>
						</span>

					</p>
					<div className="table-header">
						FIELD PROFILE
					</div>
					<div>
						<Table className={classes.tableDrainage}>
							<TableHead>
								<TableRow>
									<TableCell colSpan={8} className={classes.tableMainHeadCell}>
										Drainage
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className={classes.tableHeadCell}>TYPE, in</TableCell>
									<TableCell className={classes.tableHeadCell}>DEPTH, %</TableCell>
									<TableCell className={classes.tableHeadCell}>SPACING, %</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{fieldComponent}
							</TableBody>
						</Table>
						<hr className="dotted-hr"/>
						<TableContainer>
							<Table className={classes.tableSoil}>
								<TableHead>
									<TableRow>
										<TableCell colSpan={8} className={classes.tableMainHeadCell}>
											Soil
										</TableCell>
									</TableRow>
									<TableRow>
											<TableCell className={classes.tableHeadCell}>DEPTH, in</TableCell>
											<TableCell className={classes.tableHeadCell}>CLAY, %</TableCell>
											<TableCell className={classes.tableHeadCell}>SILT, %</TableCell>
											<TableCell className={classes.tableHeadCell}>SAND, %</TableCell>
											<TableCell className={classes.tableHeadCell}>ORGANIC CARBON, %</TableCell>
											<TableCell className={classes.tableHeadCell}>pH in WATER</TableCell>
											<TableCell className={classes.tableHeadCell}>CATION EXCHANGE CAPACITY, cmol/kg</TableCell>
											<TableCell className={classes.tableHeadCell}>TOTAL NITROGEN, %</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{soilComponent}
								</TableBody>
							</Table>
						</TableContainer>

						{this.state.soilobj.length === 0 && (
							<div className="soil-unavailable-message-div">
								<Icon className="warning-message" name="warning"/>
								<div className="soil-unavailable-message">{soilDataUnavailableMessage}</div>
							</div>
						)}

					</div>

					<div className="table-header">
						CROP HISTORY
					</div>
					<div>

						<Table className={classes.table}>
							<TableHead>
								<TableRow >
									<TableCell className={classes.tableHeadCropCell}>YEAR</TableCell>
									<TableCell colSpan={2} className={classes.tableHeadCropCell}>Cultivar</TableCell>
									<TableCell colSpan={5} className={classes.tableHeadCropCell}>Planting</TableCell>
									<TableCell className={classes.tableHeadCropCell}>Harvest</TableCell>
									<TableCell colSpan={5} className={classes.tableHeadCropCell}>Fertilizer</TableCell>
									<TableCell colSpan={3} className={classes.tableHeadCropCell} style={{borderRightStyle: "none"}}>Tillage</TableCell>
								</TableRow>

								<TableRow>
									<TableCell className={classes.tableSubHeadCropCell}/>
									<TableCell className={classes.tableHeadCell}>Crop</TableCell>
									<TableCell className={classes.tableSubHeadCropCell}>CULTIVAR</TableCell>
									<TableCell className={classes.tableHeadCell}>Distribution</TableCell>
									<TableCell className={classes.tableHeadCell}>POP, seeds/acre</TableCell>
									<TableCell className={classes.tableHeadCell}>Row Spacing, in</TableCell>
									<TableCell className={classes.tableHeadCell}>Depth, in</TableCell>
									<TableCell className={classes.tableSubHeadCropCell}>Date</TableCell>
									<TableCell className={classes.tableSubHeadCropCell}>Date</TableCell>
									<TableCell className={classes.tableHeadCell}>Material</TableCell>
									<TableCell className={classes.tableHeadCell}>Application</TableCell>
									<TableCell className={classes.tableHeadCell}>Date</TableCell>
									<TableCell className={classes.tableHeadCell}>Amount, lb/acre</TableCell>
									<TableCell className={classes.tableSubHeadCropCell}>Depth, in</TableCell>
									<TableCell className={classes.tableHeadCell}>Implement</TableCell>
									<TableCell className={classes.tableHeadCell}>Date</TableCell>
									<TableCell className={classes.tableHeadCell}>Depth, in</TableCell>
								</TableRow>

							</TableHead>
							{cropComponent}
						</Table>
					</div>

					<div className="table-header">
						COVER CROP HISTORY
					</div>
					<div>
						<Table className={classes.tableCover}>
							<TableHead>
								<TableRow>
									<TableCell className={classes.tableHeadCropCell}>YEAR</TableCell>
									<TableCell colSpan={2} className={classes.tableHeadCropCell}>Cultivar</TableCell>
									<TableCell colSpan={4} className={classes.tableHeadCropCell}>Planting</TableCell>
									<TableCell className={classes.tableHeadCropCell} style={{borderRightStyle: "none"}}>Termination</TableCell>

								</TableRow>
								<TableRow>
									<TableCell className={classes.tableSubHeadCropCell}/>
									<TableCell className={classes.tableHeadCell}>Crop</TableCell>
									<TableCell className={classes.tableSubHeadCropCell}>CULTIVAR</TableCell>
									<TableCell className={classes.tableHeadCell}>Distribution</TableCell>
									<TableCell className={classes.tableHeadCell}>POP, seeds/acre</TableCell>
									<TableCell className={classes.tableHeadCell}>Depth, in</TableCell>
									<TableCell className={classes.tableSubHeadCropCell}>Date </TableCell>
									<TableCell className={classes.tableHeadCell}>Date</TableCell>

								</TableRow>
							</TableHead>
							<TableBody>
								{covercropComponent}
							</TableBody>

						</Table>
					</div>
				</div>
			</div>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		cropobj: state.user.cropobj,
		fieldobj: state.user.fieldobj,
	};
};

export default connect(mapStateToProps, null)(withStyles(styles)(MyFarmSummary));

