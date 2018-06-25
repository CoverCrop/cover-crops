import React, {Component} from "react";
import {
	Body1,
	Body2,
	Button,
	Cell,
	Checkbox,
	Dialog,
	DialogBody,
	DialogFooter,
	Fab,
	FormField,
	Grid,
	Icon,
	Title
} from "react-mdc-web";
import config from "../app.config";
import {expfail, expsuccess} from "../app.messages";

class FieldSummary extends Component {

	constructor(props) {
		super(props);
		this.state ={
			file:null,
			isOpen: false,
			message: ""
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	async onFormSubmit(e){
		e.preventDefault();
		// let id = await uploadDatasetToDataWolf(this.state.file);
		let id="d1d7c1ff-313d-4855-9242-a7d7aa5cadf4";
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
			this.fileInput.value = "";
		}).catch(function(e) {
			this.setState({file:null, message: expfail, isOpen: true});
			console.log("set experiment file failed: " + e);
			this.fileInput.value = "";
		});
	}

	onChange(e) {
		this.setState({file:e.target.files[0]})
	}

	componentDidUpdate(prevProps){
		// clear the input when clu is changed
		if(this.props.selectedCLUName !== prevProps.selectedCLUName){
			this.fileInput.value = "";
		}
	}

	render() {
		return (
			<div>
				<form onSubmit={this.onFormSubmit}>
					<h1>Upload Experiment File for {this.props.selectedCLUName}</h1>
					<br />
					<input ref={ref=> this.fileInput = ref}
						   type="file"
						   onChange={this.onChange} />
					<button type="submit">Upload</button>
				</form>
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
		)
	}
}


export default FieldSummary;

