import React, {Component} from "react";
import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	Icon,
	Title
} from "react-mdc-web";
import Select from 'react-select';
import {connect} from "react-redux";
import Fertilizer from "./Fertilizer";
import Planting from "./Planting";
import Cultivars from "./Cultivars";
import config from "../app.config";
import {convertFullDate, getExperimentSQX} from "../public/utils";
import {handleExptxtGet} from "../actions/user";
import Harvest from "./Harvest";
import Tillage from "./Tillage";

class CropHistory extends Component {

	constructor(props) {
		super(props);
		this.state = {
			year: this.props.cropobj ? undefined : this.props.cropobj.keys()[0],
			isOpen: false,
			flist: [{FMCD: "None", addnew: true}]
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
			if(year) {
				let flist = [
					...this.props.cropobj[year]["MF"],
					{FMCD: "None", addnew: true}
				];
				this.setState({flist: flist});
			}
		}
	}

	handleSelectYear = (year) => {
		this.setState({year: year});

		let flist = [
			...this.props.cropobj[year]["MF"],
			{FMCD: "None", addnew: true}
		];
		this.setState({flist: flist});
	}

	handleClick = () => {

		let fertilizerJson = {"EVENT": "fertilizer", "FERNAME": this.state.year};
		fertilizerJson["CONTENT"] = this.fertilizer.filter(f => f).map(f => f.getBodyJson())
			.filter(jsonBody => jsonBody["FMCD"] !== "None");
		let plantingJson = this.planting.getBodyJson();
		let harvestJson = this.harvest.getBodyJson();
		let tillageJson = this.tillage.getBodyJson();
		let {email, clu} = this.props;
		let jsonBody = [fertilizerJson, plantingJson, harvestJson, tillageJson];
		// console.log(jsonBody);
		fetch(config.CLUapi + "/api/users/" + email + "/CLUs/" + clu + "/experiment_file_json", {
			method: "PATCH",
			body: JSON.stringify(jsonBody),
			headers: {
				'Content-Type': 'application/json',
				"Access-Control-Origin": "http://localhost:3000"
			},
			credentials: "include"
		}).then(updateResponse => {
			if (updateResponse.status == 200) {
				//to make sure the response is a json. a is not called but should be kept
				let a = updateResponse.json();
				getExperimentSQX(email, clu).then(exptxt => {
					this.props.handleExptxtGet(exptxt);
					this.setState({isOpen: true})
				})
			}
		}).catch(error => console.error('Error:', error))
	}

	addFertilizer = (newFertilizer) => {
		let newObj = {FMCD: "None", addnew: true};
		let that = this;
		this.setState((state) => ({ flist:
				that.fertilizer.filter(f => f).map(f => f.getBodyJson()).slice(0, -1).concat([newFertilizer, newObj])}));

	}

	render() {
		let years = Object.keys(this.props.cropobj).filter(obj => obj.indexOf("Corn") > 0 || obj.indexOf("Soybean") > 0 );
		let options = years.map(function(key){
			return {value: key, label:key}
		});
		let fertilizerUI = this.state.flist.map((crop, index) =>
			<Fertilizer key={index+ "f"} year={this.state.year} crop={crop}
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

					<Cultivars year={this.state.year} onRef={ref => (this.cultivars = ref)}/>

					{this.state.year && <div className="no-bottom-crop" key="fertilizer">
						<Title>Fertilizer </Title>
						<div className="fertilizer-box-div">
						{fertilizerUI}
						</div>
					</div>
					}
					<Planting year={this.state.year} onRef={ref => (this.planting = ref)}/>
					<Harvest year={this.state.year} onRef={ref => (this.harvest = ref)}/>
					<Tillage year={this.state.year} onRef={ref => (this.tillage = ref)}/>
					{this.state.year && <Button raised onClick={() => this.handleClick()}>UPDATE</Button>}
				</div>
				<Dialog
					open={this.state.isOpen}
					onClose={() => {this.setState({isOpen:false})}}
					className="unlogin"
				>
					<DialogBody>
						<Icon  name="done"/>
						<br />
						<p className="bold-text" key="keyword">Experiment file update success.</p>
					</DialogBody>
					<DialogFooter>
						<Button compact onClick={()=> { this.setState({isOpen: false}) }}>Close</Button>
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

