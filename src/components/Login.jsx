import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import styles from '../styles/main.css'
import { connect } from 'react-redux';
import {Textfield, Title, Button, Caption, Card, CardMedia, CardHeader, CardTitle, CardSubtitle, CardActions, CardText, Body2} from "react-mdc-web";

class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			username: "",
			password: ""
		}
	}

	render() {
		return (
			<div>
				<Card className="login">
					<CardHeader>
						<CardTitle>A Web-based Decision Support System for Cover Crop Management</CardTitle>
					</CardHeader>
					<CardMedia
						style={{
							backgroundImage: 'url("../images/cover-crop-rep-image.png")',
							width: '450px',
							height: '250px',
						}}/>
					<CardText>
						<Body2>Sign In</Body2>
						<span><Textfield floatingLabel="Username" value={this.state.username}
										 onChange={({target : {value : username}}) => {
											 this.setState({ username })
										 }} /> </span>
						<span><Textfield floatingLabel="Password" type="password"
										 value={this.state.password}
										 onChange={({target : {value : password}}) => {
											 this.setState({ password })
										 }} /> </span>
					</CardText>
					<CardActions>
						<div><Button type="submit" primary raised>Login</Button></div>
						<div><Caption><a className="not-active" href="">Register</a></Caption></div>
						<div><Caption><a className="not-active" href="">Forgot your details?</a></Caption></div>
					</CardActions>
				</Card>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		username: state.login.username,
		password: state.login.password
	}
};

export default connect(mapStateToProps)(Login);

