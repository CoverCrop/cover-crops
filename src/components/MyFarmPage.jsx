import React, {Component} from "react";
import {Link} from "react-router";
import Header from './Header';
import Footer from './Footer';
import {Button, Fab, Icon, Title, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import MapCC from './MapCC';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWarp from "./AuthorizedWarp";
import AnalyzerWrap from "./AnalyzerWrap";
import AddFieldBox from "./AddFieldBox"
import {connect} from "react-redux";
import config from "../app.config";

class MyFarmPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clus: []
		}
	}
	componentDidMount() {
		const CLUapi = config.CLUapi + "/api/userfield?userid=" + sessionStorage.getItem("email");
		let headers = {
			// 'Content-Type': 'application/json',
			'Access-Control-Origin': 'http://localhost:3000'
		};
		// fetch(CLUapi, {headers: headers}).then(response => {
		// 	this.setState({clus: response})
		// })
	}

	render() {
		let cluList = this.state.clus.map(c => <p>{c}</p>);

		return (
			<div>
				<Header />
				<AnalyzerWrap activeTab={3}/>
				<AuthorizedWarp>
					<Grid>
						<Cell col={5} className="add-field-title">
							<Link to="/addfield" >
							<Fab >
								{/*<Link to="/" />*/}
								<Icon name="add" />
							</Fab>
							</Link>
							<Title>Add a Field</Title>

						</Cell>
						<Cell col={7}>

						</Cell>
					</Grid>
				</AuthorizedWarp>
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		clu: state.analysis.clu
	}
};

export default connect(mapStateToProps, null)(MyFarmPage);

