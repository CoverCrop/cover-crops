import React, {Component} from "react";
import Header from './Header';
import Footer from './Footer';
import {Button, Textfield, Card, CardText, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import MapCC from './MapCC';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWarp from "./AuthorizedWarp";
import AnalyzerWrap from "./AnalyzerWrap";
import AddFieldBox from "./AddFieldBox"
import {connect} from "react-redux";
import config from "../app.config";

class ProfilePage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clus: []
		}
	}

	render() {
		return (
			<div>
				<Header />
				<AnalyzerWrap activeTab={3}/>
				<AuthorizedWarp>
					<div className="choose-clu-div">
						<MapCC mapId="choose-clu" selectCLU/>
						<AddFieldBox />
					</div>
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

export default connect(mapStateToProps, null)(ProfilePage);

