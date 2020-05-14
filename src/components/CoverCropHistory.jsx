import React, {Component} from "react";
import {Button, Dialog, DialogBody, DialogFooter, Icon, Title} from "react-mdc-web";
import Select from "react-select";
import {connect} from "react-redux";
import Planting from "./Planting";
import {getKeycloakHeader, isCoverCrop} from "../public/utils";
import {handleExptxtGet} from "../actions/user";
import Harvest from "./Harvest";
import {COVERCROP, defaultCropYears} from "../experimentFile";
import config from "../app.config";
import {getExperimentSQX} from "../public/utils";

class CoverCropHistory extends Component {

	constructor(props) {
		super(props);
		this.state = {
			year: this.props.cropobj ? undefined : this.props.cropobj.keys()[0],
			isOpen: false,
			covercrop: null,
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.clu !== prevProps.clu) {
			this.setState({year: undefined});
		}
	}

	handleSelectYear = (year) => {
		this.setState({year: year});
		if(this.props.cropobj[year]){
			this.setState({
				covercrop: this.props.cropobj[year]["CROP"]
			});
		} else{
			this.setState({
				covercrop: "None"
			});
		}

	}

	handleSelectCoverCrop = (covercrop) => {
		this.setState({covercrop});
	}

	handleClick = () => {

		let plantingJson = this.planting.getBodyJson();
		let harvestJson = this.harvest.getBodyJson();
		let {email, clu} = this.props;
		let jsonBody = [plantingJson, harvestJson];
		console.log(jsonBody);
		fetch(config.CLUapi + "/users/" + email + "/CLUs/" + clu + "/experiment_file_json", {
			method: "PATCH",
			body: JSON.stringify(jsonBody),
			headers: {
				"Content-Type": "application/json",
				"Authorization": getKeycloakHeader(),
				"Cache-Control": "no-cache"
			}
		}).then(updateResponse => {
			if (updateResponse.status === 200) {
				//to make sure the response is a json. a is not called but should be kept
				let a = updateResponse.json();
				getExperimentSQX(email, clu).then(exptxt => {
					this.props.handleExptxtGet(exptxt);
					this.setState({isOpen: true});
				});
			}
		}).catch(error => console.error("Error:", error));
	};

	render() {
		let years =[];
		for(let key in this.props.cropobj){
			if (isCoverCrop(this.props.cropobj[key])){
				years.push(key);
			}
		}

		let options = defaultCropYears.map(function(key){
			let yearName = years.find(s => s.includes(key)  && (s.includes("Rye")));
			if (yearName){
				return {value: yearName, label:key};
			} else {
				return {value: key +" None", label:key};
			}
		});

		let COVERCROPoptions = COVERCROP.map(function (key) {
			return {value: key, label: key};
		});

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
									value={this.state.covercrop}
									options={COVERCROPoptions}
									onChange={selectedOption => this.handleSelectCoverCrop( selectedOption.value)}
								/>
							</div>
						</div>
					</div>}
					{this.state.covercrop !== "None" &&
					<Planting title="Establishment" year={this.state.year} onRef={ref => (this.planting = ref)}/> }
					{this.state.covercrop !== "None" &&
					<Harvest title="Termination" year={this.state.year} onRef={ref => (this.harvest = ref)}/> }
					{this.state.year && <Button raised onClick={() => this.handleClick()}>UPDATE</Button>}
				</div>
				<Dialog
					open={this.state.isOpen}
					onClose={() => {this.setState({isOpen:false});}}
					className="unlogin"
				>
					<DialogBody>
						<Icon  name="done"/>
						<br />
						<p className="bold-text" key="keyword">Experiment file update success.</p>
					</DialogBody>
					<DialogFooter>
						<Button compact onClick={()=> { this.setState({isOpen: false}); }}>Close</Button>
					</DialogFooter>
				</Dialog>
			</div>

		);
	}
}

const mapStateToProps = (state) => {
	return {
		cropobj: state.user.cropobj,
		email: state.user.email,
		clu: state.user.clu,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleExptxtGet: (exptxt) => {
			dispatch(handleExptxtGet(exptxt));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CoverCropHistory);

