import React, {Component} from "react";
import Header from './Header';
import Footer from './Footer';
import {Button, Textfield, Card, CardText, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import MapCC from './MapCC';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWrap from "./AuthorizedWrap";
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
			<AuthorizedWrap>
			<div>
				<Header />
				<AnalyzerWrap activeTab={3}/>

					<div className="choose-clu-div">
						<MapCC mapId="choose-clu" selectCLU/>
						<AddFieldBox />
					</div>

			</div>
			</AuthorizedWrap>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		clu: state.analysis.clu
	}
};

export default connect(mapStateToProps, null)(ProfilePage);

