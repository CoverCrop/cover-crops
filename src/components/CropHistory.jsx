import React, {Component} from "react";
import {Button, Dialog, DialogBody, DialogFooter, Icon, Title} from "react-mdc-web";
import Select from 'react-select';
import {connect} from "react-redux";
import Fertilizer from "./Fertilizer";
import Planting from "./Planting";
import config from "../app.config";
import {getExperimentSQX} from "../public/utils";
import {handleExptxtGet} from "../actions/user";
import Harvest from "./Harvest";
import Tillage from "./Tillage";
import {CROP, CULTIVARS} from "../experimentFile";

class CropHistory extends Component {

	constructor(props) {
		super(props);
		this.state = {
			year: this.props.cropobj ? undefined : this.props.cropobj.keys()[0],
			isOpen: false,
			flist: [{FMCD: "None", addnew: true}],
			crop: null,
			cultivars: null
		};
		// this.fertilizer is filter by isDefined, cause the fertilizer number
		// is not all the same, and may get undefined error when switching from
		// a long list to a short list
		this.fertilizer = []
	}

	componentDidUpdate(prevProps) {
		if (this.props.clu !== prevProps.clu) {
			this.setState({year: undefined})
		}
		// update for fertilizer, planting and harvest is updated in the child component.
		if (this.props.cropobj != prevProps.cropobj) {
			let year = this.state.year;
			if (year) {
				let flist = [
					...this.props.cropobj[year]["MF"],
					{FMCD: "None", addnew: true}
				];
				this.setState({
					flist: flist,
					// crop: this.props.cropobj[year]["CROP"],
					// cultivars:this.props.cropobj[year]["CU"]
				});
			}
		}
	}

	handleSelectYear = (year) => {
		this.setState({year: year});
		let {cropobj} = this.props;
		let flist = [
			... cropobj[year]["MF"],
			{FMCD: "None", addnew: true}
		];
		this.setState({
			flist: flist,
			crop: cropobj[year]["CROP"],
			cultivars: cropobj[year]["CU"]["CNAME"].trim()
		});
	}

	handleClick = () => {
		let jsonBody = [];
		let {email, clu} = this.props;
		if (this.state.crop === "Fallow") {
			// let newName = this.state.year.slice(0, 5) + "Fallow";
			let newName = this.state.year;
			let tillageJson = this.tillage.getBodyJson();
			tillageJson["TNAME"] = newName;
			jsonBody = [
				{
					"EVENT": "planting",
					"PLNAME": newName,
					"CONTENT": []
				},
				{
					"EVENT": "fertilizer",
					"FERNAME": newName,
					"CONTENT": this.fertilizer.filter(f => f).map(f => f.getBodyJson())
						.filter(jsonBody => jsonBody["FMCD"] !== "None")
				},
				{
					"EVENT": "harvest",
					"HNAME": newName,
					"CONTENT": []
				},
				tillageJson
			]

		} else {
			// crop type is not changed

			let fertilizerJson = {"EVENT": "fertilizer", "FERNAME": this.state.year};
			fertilizerJson["CONTENT"] = this.fertilizer.filter(f => f).map(f => f.getBodyJson())
				.filter(jsonBody => jsonBody["FMCD"] !== "None");
			let plantingJson = this.planting.getBodyJson();
			let harvestJson = this.harvest.getBodyJson();
			let tillageJson = this.tillage.getBodyJson();

			jsonBody = [fertilizerJson, plantingJson, harvestJson, tillageJson];
			if (this.state.year.indexOf(this.state.crop) < 0) {
				// let newName = this.state.year.slice(0, 5) + "Fallow";
				let newName = this.state.year;
				let newName2 = this.state.year.slice(0, 5) + this.state.crop;
				fertilizerJson["FERNAME"] = newName2;
				plantingJson["PLNAME"] = newName2;
				harvestJson["HNAME"] = newName2;
				tillageJson["TNAME"] = newName2;
				jsonBody = [
					{
						"EVENT": "planting",
						"PLNAME": newName,
						"CONTENT": []
					},
					{
						"EVENT": "fertilizer",
						"FERNAME": newName,
						"CONTENT": []
					},
					{
						"EVENT": "harvest",
						"HNAME": newName,
						"CONTENT": []
					},
					{
						"EVENT": "tillage",
						"HNAME": newName,
						"CONTENT": []
					},
					fertilizerJson, plantingJson, harvestJson, tillageJson
				]
			}
		}


		// console.log(jsonBody);
		fetch(config.CLUapi + "/api/users/" + email + "/CLUs/" + clu + "/experiment_file_json", {
			method: "PATCH",
			body: JSON.stringify(jsonBody),
			headers: {
				"Authorization": "Basic eWFuemhhbzNAaWxsaW5vaXMuZWR1OjQ0MjZhc3Jy",

				'Content-Type': 'application/json',
				"Access-Control-Origin": "http://localhost:3000"
			},
			credentials: "include"
		}).then(updateResponse => {
			if (updateResponse.status == 200) {
				//to make sure the response is a json. a is not called but should be kept
				let a = updateResponse.json();
				getExperimentSQX(email, clu).then(exptxt => {
					let newYear = this.state.year.slice(0, 5) + this.state.crop;
					this.setState({year: null })
					this.props.handleExptxtGet(exptxt);

					this.setState({isOpen: true, year: newYear })
				})
			}
		}).catch(error => console.error('Error:', error))
	}

	addFertilizer = (newFertilizer) => {
		let newObj = {FMCD: "None", addnew: true};
		let that = this;
		this.setState((state) => ({
			flist:
				that.fertilizer.filter(f => f).map(f => f.getBodyJson()).slice(0, -1).concat([newFertilizer, newObj])
		}));

	}

	render() {
		let years = Object.keys(this.props.cropobj).filter(obj => obj.indexOf("Corn") > 0 || obj.indexOf("Soybean") > 0);
		let options = years.map(function (key) {
			return {value: key, label: key}
		});
		let CROPoptions = CROP.map(function (key) {
			return {value: key, label: key}
		});
		let CULTIVARSoptions = CULTIVARS.map(function (key) {
			return {value: key, label: key}
		});
		let fertilizerUI = this.state.flist.map((crop, index) =>
			<Fertilizer key={index + "f"} year={this.state.year} crop={crop}
						onRef={ref => (this.fertilizer[index] = ref)}
						addFertilizer={this.addFertilizer}
			/>
		);
		return (
			<div>
				<div className="border-top summary-div myfarm-input">

					<div className="black-bottom-crop" key="selectyear">
						<div className="update-box">
							<p>YEAR</p>
							<Select
								name="year"
								value={this.state.year}
								options={options}
								onChange={selectedOption => this.handleSelectYear(selectedOption.value)}
							/>
						</div>
					</div>

					{this.state.year && <div className="no-bottom-crop" key="cultivars">
						<Title>Cultivars </Title>
						<div className="update-box-div">
							<div className="update-box update-box-left">
								<p>CROP</p>
								<Select
									name="CROP"
									value={this.state.crop}
									options={CROPoptions}
									onChange={selectedOption => this.setState({crop: selectedOption.value})}
								/>
							</div>
							<div className="update-box update-box-left">
								<p>CULTIVARS</p>
								<Select
									name="CULTIVARS"
									value={this.state.cultivars}
									options={CULTIVARSoptions}
									onChange={selectedOption => this.setState({cultivars: selectedOption.value})}
								/>
							</div>
						</div>
					</div>}
					{this.state.crop !== "Fallow" &&
					<Planting year={this.state.year} onRef={ref => (this.planting = ref)}/>}
					{this.state.crop !== "Fallow" &&
					<Harvest year={this.state.year} onRef={ref => (this.harvest = ref)}/>}
					{this.state.year && <div className="black-top-crop" key="fertilizer">
						<Title>Fertilizer </Title>
						<div className="fertilizer-box-div">
							{fertilizerUI}
						</div>
					</div>
					}
					<Tillage year={this.state.year} onRef={ref => (this.tillage = ref)}/>
					{this.state.year && <Button raised onClick={() => this.handleClick()}>UPDATE</Button>}
				</div>
				<Dialog
					open={this.state.isOpen}
					onClose={() => {
						this.setState({isOpen: false})
					}}
					className="unlogin"
				>
					<DialogBody>
						<Icon name="done"/>
						<br/>
						<p className="bold-text" key="keyword">Experiment file update success.</p>
					</DialogBody>
					<DialogFooter>
						<Button compact onClick={() => {
							this.setState({isOpen: false})
						}}>Close</Button>
					</DialogFooter>
				</Dialog>
			</div>

		)
	}
}

const mapStateToProps = (state) => {
	return {
		cropobj: state.user.cropobj,
		email: state.user.email,
		clu: state.user.clu,
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleExptxtGet: (exptxt) => {
			dispatch(handleExptxtGet(exptxt));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CropHistory);

