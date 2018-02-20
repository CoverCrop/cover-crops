import React, {Component} from "react";
import Header from './Header';
import Footer from './Footer';
import {Button, Textfield, Card, CardText, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import UserEvents from './UserEvents';

class UserPage extends Component {

	render() {
		return (
			<div>
				<Header selected='user'/>
				<div className="content">
					<Grid>
						<Cell col={2}>
							place holder for tabs
						</Cell>
						<Cell col={10}>
							<UserEvents />
						</Cell>
					</Grid>

				</div>
				<Footer selected='user'/>
			</div>
		);
	}
}

export default UserPage;
