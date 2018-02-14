import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import styles from '../styles/main.css'
import { connect } from 'react-redux';
import {Textfield, Title, Button, Caption, Card, CardMedia, CardHeader, CardTitle, CardSubtitle, CardActions, CardText, Body2} from "react-mdc-web";
import {datawolfURL} from "../datawolf.config";
import {handleUserLogin} from "../actions/user";

class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: ""
		};

		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin = async event => {
		event.preventDefault();

		try {
			//let loginResponse = await this.loginTest(this.state.email, this.state.password);
			const token = this.state.email + ":" + this.state.password;
			const hash = btoa(token);
			let loginResponse = await fetch(datawolfURL + "/login?email=", {
				method: 'GET',
				headers: {
					"Authorization": "Basic " + hash,
					"Content-Type": "application/json",
					"Access-Control-Origin": "http://localhost:3000"
				}
			});

			console.log(loginResponse);
			if (loginResponse.status >= 200 && loginResponse.status < 300) {

				this.props.handleUserLogin(this.state.email);

				alert("Logged in");

			}
			else if (loginResponse.status === 401) {

				alert("Unauthorized");

			}
			else {

				console.log(loginResponse.status);
			}
		} catch (error) {
			console.error("Error: " + error);
		}
	};

	validateLoginForm() {
		return this.state.email.length > 0 && this.state.password.length > 0;
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
							height: '250px',
							padding: '10px'
						}}/>
					<CardText>
						<Body2>Sign In</Body2>
						<span><Textfield autoFocus floatingLabel="Username" value={this.state.email}
										 onChange={({target : {value : email}}) => {
											 this.setState({ email: email })
										 }} /> </span>
						<span><Textfield floatingLabel="Password" type="password"
										 value={this.state.password}
										 onChange={({target : {value : password}}) => {
											 this.setState({ password })
										 }} /> </span>
					</CardText>
					<CardActions>
						<form>
							<span>
								<Button
									type="submit"
									primary
									raised
									onClick={this.handleLogin}
									disabled={!this.validateLoginForm()}>Login
								</Button>
							</span>
							<span><Caption><a className="not-active" href="">Register</a></Caption></span>
							<span><Caption><a className="not-active" href="">Forgot password?</a></Caption></span>
						</form>
					</CardActions>
				</Card>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		email: state.user.email
	}
};


const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogin: (email) => {
			dispatch(handleUserLogin(email));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

