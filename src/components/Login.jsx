import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import styles from '../styles/main.css'
import { connect } from 'react-redux';
import {Textfield, Title, Button, Caption, Card, CardMedia, CardHeader, CardTitle, CardSubtitle, CardActions, CardText, Body2} from "react-mdc-web";
import {datawolfURL} from "../datawolf.config";
import {handleUserLogin} from "../actions/user";
import {checkAuthentication} from "../public/utils"

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
			let loginResponse = await fetch(datawolfURL + "/login?email=" + this.state.email, {
				method: 'GET',
				headers: {
					"Authorization": "Basic " + hash,
					"Content-Type": "application/json",
					"Access-Control-Origin": "http://localhost:3000"
				},
				credentials: 'include'
			});

			console.log(loginResponse);
			if (loginResponse.status === 200) {

				let jsonData = await loginResponse.json().then(function(data) {
					return data;
				});

				this.props.handleUserLogin(this.state.email, jsonData["id"], true);
				sessionStorage.setItem("personId", jsonData["id"]); // Store person ID in session storage for future use
				sessionStorage.setItem("email", jsonData["email"]); // Store email ID in session storage for future use

				// Check for authentication
				checkAuthentication().then(function (checkAuthResponse) {
					if (checkAuthResponse.status === 200) {
						console.log("Person Valid");
					}
					else if (checkAuthResponse.status === 401) {
						console.log("Unauthorized");
					}
					else {
						console.log("Unknown");
					}
				});
			}

			else if (loginResponse.status === 401) {

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
				</Card>
				<br/>
				{/*Display login card only when user is not authenticated*/}
				{this.props.isAuthenticated === true ? null :
					<Card className="login">
						<CardText>
							<Body2>Sign In</Body2>
							<span><Textfield autoFocus floatingLabel="Username" value={this.state.email}
											 onChange={({target: {value: email}}) => {
												 this.setState({email: email})
											 }}/> </span>
							<span><Textfield floatingLabel="Password" type="password"
											 value={this.state.password}
											 onChange={({target: {value: password}}) => {
												 this.setState({password})
											 }}/> </span>
						</CardText>
						<CardActions>
							<form>
							<span>
								<Button
									type="submit"
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
				}
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		isAuthenticated: state.user.isAuthenticated
	}
};


const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogin: (email, userId, isAuthenticated) => {
			dispatch(handleUserLogin(email, userId, isAuthenticated));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

