import React, {Component} from "react";
import {Cell, Dialog, DialogBody, DialogFooter, Grid, Icon, Button} from "react-mdc-web";
import {connect} from "react-redux";
import {convertDate, cropObjToExptxt, uploadDatasetToDataWolf} from "../public/utils";
import {distribution, drainage_type, FACD, FMCD} from "../experimentFile";
import {handleExptxtChange, handleExptxtGet} from "../actions/user";
import config from "../app.config";
import {expfail, expsuccess} from "../app.messages";


class MyFarmSummary extends Component {
	constructor(props) {
		super(props);
		this.state ={
			file:null,
			isOpen: false,
			message: ""
		};
	}

	async onUpdateSubmit(e){

		// e.preventDefault();

		let newTXT = cropObjToExptxt(this.props.exptxt, this.props.cropobj);
		this.props.handleExptxtChange(newTXT);

		let userExpFile = new File([newTXT],
			"experiment.txt",
			{type: "text/plain;charset=utf-8", lastModified: Date.now()});


		let id = await uploadDatasetToDataWolf(userExpFile);

		console.log("Uploaded File Changed:" + id);

		let updatedUserCLU = Object.assign({}, this.props.selectedCLU);
		updatedUserCLU.expfile = id;
		let headers = {
			'Content-Type': 'application/json',
			'Access-Control-Origin': 'http://localhost:3000'
		};

		const CLUapi = config.CLUapi + "/api/userfield";
		fetch(CLUapi,{
			method: 'POST',
			headers: headers,
			body: JSON.stringify(updatedUserCLU)
		}).then(response => response.json())
			.then((responseJson) => {
				if(responseJson.status_code !== 200){
					this.setState({file:null, message: expfail, isOpen: true });
					console.log("set experiment file failed: " + responseJson.message)
				} else {
					this.setState({file:null, isOpen: true, message: expsuccess });
					console.log(responseJson)
				}
			}).catch(function(e) {
			this.setState({file:null, message: expfail, isOpen: true});
			console.log("set experiment file failed: " + e);

		});
	}


	render() {

		let {cropobj, fieldobj} = this.props;
		// TODO: filter based on year? remove 2019?

		let cropComponent = Object.values(cropobj).filter(obj => obj["CROP"] !== "Fallow" && obj["CROP"] !== "Rye").map(obj =>
			<tr key={obj["YEAR"]}>
				<td>{obj["YEAR"]}</td>
				<td>{obj["CROP"]}</td>
				<td>{obj["CU"]}</td>
				<td>{distribution[obj["MP"]["PLDS"]]}</td>
				<td>{convertDate(obj["MP"]["PDATE"])}</td>
				<td>{obj["MP"]["PPOP"]}</td>
				<td>{obj["MP"]["PLDP"]}</td>
				<td>{convertDate(obj["MH"]["HDATE"])}</td>
				<td>{FMCD[obj["MF"]["FMCD"]]}</td>
				<td>{FACD[obj["MF"]["FACD"]]}</td>
				<td>{convertDate(obj["MF"]["FDATE"])}</td>
				<td>{obj["MF"]["FAMN"]}</td>
				<td>{obj["MF"]["FDEP"]}</td>
			</tr>
		);
		// TODO: combine with cropComponent
		let covercropComponent = Object.values(cropobj).filter(obj => obj["CROP"] === "Fallow" || obj["CROP"] === "Rye").map(obj =>
			<tr key={obj["YEAR"]}>
				<td>{obj["YEAR"]}</td>
				<td>{obj["CROP"]}</td>
				<td>{obj["CU"]}</td>
				<td>{distribution[obj["MP"]["PLDS"]]}</td>
				<td>{convertDate(obj["MP"]["PDATE"])}</td>
				<td>{obj["MP"]["PPOP"]}</td>
				<td>{obj["MP"]["PLDP"]}</td>
				<td>{convertDate(obj["MH"]["HDATE"])}</td>
			</tr>
		);

		return (

			<div>

				<div className="border-top summary-div">
					<p className="myfarm-summary-header">
						<span className="south-field">{this.props.selectedCLUName + "   "}</span>
						<span >
						<a className="download-exp" href="https://covercrop.ncsa.illinois.edu/datawolf/datasets/dd80f5be-76b9-4a57-ae34-7a8da2ccb7ec/943f6da6-6bb6-41f5-b65d-a336d5edfddc/file">
						<Icon name="file_download"></Icon>
						</a>
						</span>

					</p>
					<button type="submit" className="blue-button"
							disabled={!this.props.isExperimentUpdate}
							onClick={() => this.onUpdateSubmit()}
					>UPDATE EXPERIMENT</button>
					<Button type="submit" className="cancel-button"
							disabled={!this.props.isExperimentUpdate}
							onClick={() => this.props.handleExptxtGet(this.props.exptxt)}
					>CANCEL</Button>


					<div className="table-header">
						FIELD PROFILE
					</div>
					<div className="summary-table">
						<table>

							<thead>
							<tr>
								<th>DRAINAGE</th>
								<th></th>
								<th></th>

							</tr>
							</thead>
							<tbody>
							<tr>
								<td>TYPE</td>
								<td>DEPTH/in</td>
								<td>SPACING/ft</td>
							</tr>
							<tr>
								<td>{drainage_type[fieldobj["FLDT"]]}</td>
								<td>{fieldobj["FLDD"]}</td>
								<td>{fieldobj["FLDS"]}</td>
							</tr>
							</tbody>
						</table>
					</div>

					<div className="table-header">
						CROP HISTORY
					</div>
					<div>
						<table>
							<thead>
							<tr>
								<th></th>
								<th>Cultivar</th>
								<th></th>
								<th>Planting</th>
								<th></th>
								<th></th>
								<th></th>
								<th>Harvest</th>
								<th>Fertilizer</th>

							</tr>
							<tr>
								<td>YEAR</td>
								<td>CROP</td>
								<td>CULTIVAR</td>
								<td>Distribution</td>
								<td>Date</td>
								<td>POP, seeds/acre</td>
								<td>Depth, in</td>
								<td>Date</td>
								<td>Material</td>
								<td>Application</td>
								<td>Date</td>
								<td>Amount</td>
								<td>Depth, in</td>
							</tr>
							</thead>
							<tbody>
							{cropComponent}
							</tbody>

						</table>
					</div>

					<div className="table-header">
						COVER CROP HISTORY
					</div>
					<div>
						<table>
							<thead>
							<tr>
								<th></th>
								<th>Cultivar</th>
								<th></th>
								<th>Establishment</th>
								<th></th>
								<th></th>
								<th></th>
								<th>Termination</th>

							</tr>
							<tr>
								<td>YEAR</td>
								<td>CROP</td>
								<td>CULTIVAR</td>
								<td>Distribution</td>
								<td>Date</td>
								<td>POP, seeds/acre</td>
								<td>Depth, in</td>
								<td>Date</td>
							</tr>
							</thead>
							<tbody>
							{covercropComponent}
							</tbody>

						</table>
					</div>
				</div>
				<Dialog
					open={this.state.isOpen}
					onClose={() => {this.setState({isOpen:false})}}
					className="unlogin"
				>
					<DialogBody>
						<p className="bold-text" key="keyword"> {this.state.message}</p>
					</DialogBody>
					<DialogFooter>
						<Button compact onClick={()=> { this.setState({isOpen: false}) }}>Close</Button>
					</DialogFooter>
				</Dialog>
			</div>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		exptxt: state.user.exptxt,
		cropobj: state.user.cropobj,
		fieldobj: state.user.fieldobj,
		isExperimentUpdate: state.user.isExperimentUpdate
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleExptxtChange: (exptxt) => {
			dispatch(handleExptxtChange(exptxt))
		},
		handleExptxtGet: (exptxt) => {
			dispatch(handleExptxtGet(exptxt))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(MyFarmSummary);
