import React, {Component} from "react";
import Header from './Header';
import Footer from './Footer';
import {Button, Textfield, Card, CardText, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import MapCC from './MapCC';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWarp from "./AuthorizedWarp"
import {connect} from "react-redux";
import config from "../app.config";

class ProfilePage extends Component {

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
		fetch(CLUapi, {headers: headers}).then(response => {
           this.setState({clus: response})
		})
	}

	handleAddCLU =(clu) =>{
		const CLUapi = config.CLUapi + "/api/userfield";
		let headers = {
			'Content-Type': 'application/json',
			'Access-Control-Origin': 'http://localhost:3000'
		};
		fetch(CLUapi,{
			method: 'POST',
			headers: headers,
			credentials: "include",
			body: '{"userid":"'+ sessionStorage.getItem("email") +'", "clu":' + clu + ', "expfile": ""}'
		}).then(response => {
			this.setState({clus: this.state.clus.concat([clu])})
		}).catch(function(e) {
			console.log("Add CLU failed: " + e );
		});
	}
	render() {
		let cluList = this.state.clus.map(c => <p>{c}</p>);
		return (
			<div>
				<Header />
				<AuthorizedWarp>
					<div className="content">
						<Grid>
							<Cell col={2}>
								<p>Select CLU Id: {this.props.clu}</p>
								<Button onClick={this.handleAddCLU(this.props.clu)}>Save</Button>
								{cluList}
							</Cell>
							<Cell col={10}>
								<MapCC mapId="chooseclu"/>
							</Cell>
						</Grid>
					</div>
				</AuthorizedWarp>
				<Footer selected='user'/>
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		clu: state.analysis.clu
	}
};

export default connect(mapStateToProps, null)(ProfilePage);

