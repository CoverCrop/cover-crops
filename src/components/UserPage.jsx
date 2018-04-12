import React, {Component} from "react";
import Header from './Header';
import Footer from './Footer';
import {Button, Textfield, Card, CardText, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import UserEvents from './UserEvents';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWarp from "./AuthorizedWarp"
import AnalyzerWrap from "./AnalyzerWrap";

class UserPage extends Component {

	render() {
		return (
			<div>
				<Header selected='user'/>
				<AnalyzerWrap activeTab={2}/>
				<AuthorizedWarp>
					<div className="content">
						<Grid>
							<Cell col={2}>
								{/*TODO: add tabs*/}
							</Cell>
							<Cell col={5}>
								<UserEvents />
							</Cell>
							<Cell col={5}>
								<ViewResultsCC />
							</Cell>
						</Grid>
					</div>
				</AuthorizedWarp>
				<Footer selected='user'/>
			</div>
		);
	}
}

export default UserPage;
