import React, {Component} from "react";
import {Link} from "react-router";
import Header from './Header';
import Footer from './Footer';
import {Dialog, DialogBody, DialogFooter, Button, Fab, Icon, Title, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import AddFieldBox from "./AddFieldBox"
import {connect} from "react-redux";
import config from "../app.config";
import {getMyFieldList, uploadUserInputFile} from "../public/utils";

class FieldSummary extends Component {

	constructor(props) {
		super(props);
		this.state ={
			file:null,
			isOpen: false
		};
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onChange = this.onChange.bind(this)
	}

	async onFormSubmit(e){
		e.preventDefault(); // Stop form submit
		// let id = await uploadUserInputFile(this.state.file);
		let id ="4ba6e00c-81da-4275-9072-64b94d995de8";
		console.log(id);
		this.setState({isOpen: true});
	}

	onChange(e) {
		this.setState({file:e.target.files[0]})
	}


	render() {
		return (
			<div>
			<form onSubmit={this.onFormSubmit}>
				<Title>Upload experiment file</Title>
				<input type="file" onChange={this.onChange} />
				<button type="submit">Upload</button>
			</form>
				<Dialog
					open={this.state.isOpen}
					onClose={() => {this.setState({isOpen:false})}}
					className="unlogin"
				>
					<DialogBody>
						<p className="bold-text" key="keyword">Experiment template file added successfully. </p>
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
		clu: state.analysis.clu,
		email: state.user.email
	}
};

export default connect(mapStateToProps, null)(FieldSummary);

