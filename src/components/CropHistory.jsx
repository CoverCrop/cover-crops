import React, {Component} from "react";
import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	Icon
} from "react-mdc-web";
import Select from 'react-select';
import {connect} from "react-redux";
import Fertilizer from "./Fertilizer";
import Planting from "./Planting";
import config from "../app.config";
import {getExperimentSQX} from "../public/utils";
import {handleExptxtGet} from "../actions/user";
import Harvest from "./Harvest";

class CropHistory extends Component {

	constructor(props) {
		super(props);
		this.state = {
			year: this.props.cropobj ? undefined : this.props.cropobj.keys()[0],
			isOpen: false
		};
	}

	handleSelectYear = (year) => {
		this.setState({year: year});
	}

	handleClick = () => {
		let fertilizerJson = this.fertilizer.getBodyJson();
		let plantingJson = this.planting.getBodyJson();
		let harvestJson = this.harvest.getBodyJson();
		let {email, clu} = this.props;

		let jsonBody = [fertilizerJson, plantingJson, harvestJson];
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
				//to make sure the response is a json. a is not used
				let a = updateResponse.json();
				getExperimentSQX(email, clu).then(exptxt => {
					this.props.handleExptxtGet(exptxt);
					this.setState({isOpen: true})
				})
			}
		}).catch(error => console.error('Error:', error))
	}

	render() {
		let years = Object.keys(this.props.cropobj).filter(obj => obj.indexOf("Corn") > 0 || obj.indexOf("Soybean") > 0 );
		let options = years.map(function(key){
			return {value: key, label:key}
		});
		return (
			<div>
				<div className="border-top summary-div myfarm-input">

					<div className="black-bottom-crop">
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
					<Fertilizer year={this.state.year} onRef={ref => (this.fertilizer = ref)}/>
					<Planting year={this.state.year} onRef={ref => (this.planting = ref)}/>
					<Harvest year={this.state.year} onRef={ref => (this.harvest = ref)}/>
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

