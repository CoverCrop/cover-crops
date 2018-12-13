import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import styles from '../styles/main.css'
import styles2 from '../styles/home-page.css'
import { connect } from 'react-redux';
import {Textfield, Title, Button, Caption, Card, CardMedia, CardHeader, CardTitle, CardSubtitle, CardActions, CardText,
	Body2, Icon, Dialog, DialogBody, DialogFooter} from "react-mdc-web";
import {datawolfURL} from "../datawolf.config";
import {handleUserLogin} from "../actions/user";
import {checkAuthentication} from "../public/utils"
import {Link} from "react-router";
import config from "../app.config";
import {dataWolfGetTokenCallFailed, invalidLoginCredentials, register, unlogin} from "../app.messages";

class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			statusText: "",
			isOpen: this.props.message === "Please login."
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
				this.setState({statusText: ""});

				let jsonData = await loginResponse.json().then(function(data) {
					return data;
				});

				// Get token from Data Wolf
				let keyResponse = await fetch(datawolfURL + "/login/key", {
					method: 'GET',
					headers: {
						"Authorization": "Basic " + hash,
						"Content-Type": "application/json",
						"Access-Control-Origin": "http://localhost:3000"
					}
				});

				// Store token in cookie if request is successful
				if(keyResponse.status === 200) {
					let jsonKeyData = await keyResponse.json().then(function(data) {
						return data;
					});

					// Set 24 hours expiration
					let date = new Date();
					date.setTime(date.getTime() + (24*60*60*1000));

					let expiresString = "expires=" + date.toUTCString();
					let domainString = "domain=localhost";
					let pathString = "path=/";
					let tokenString = "token=" + jsonKeyData["token"];

					document.cookie =  tokenString + ";" + domainString + ";" + pathString + ";" + expiresString;

					// Calling event handler for successful logging in
					this.props.handleUserLogin(this.state.email, jsonData["id"], true);
					sessionStorage.setItem("personId", jsonData["id"]); // Store person ID in session storage for future use
					sessionStorage.setItem("email", jsonData["email"]); // Store email ID in session storage for future use

					const CLUapi = config.CLUapi + "/api/user";
					let serviceLoginResponse = await fetch(CLUapi, {
						method: 'POST',
						headers: {
							"Authorization": "Basic " + hash,
							"Content-Type": "application/json",
							"Access-Control-Origin": "http://localhost:3000"
						}
					});
					console.log(serviceLoginResponse);
				}
				else {
					console.error("Call to get token from Data Wolf did not succeed. Response status: " +
						keyResponse.status);
					this.setState({statusText: dataWolfGetTokenCallFailed});
				}

				// Check for authentication
				// TODO: should we do something when status is not 200?
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
				this.setState({statusText: invalidLoginCredentials});
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

				<br/>
				{/*Display login card only when user is not authenticated*/}
				{this.props.isAuthenticated === true ? null :
					<Card className="login">
						<h2>Login</h2>
						<CardText>
							{this.state.statusText && <div className="login-error">
								<Icon name="warning"/><p>{this.state.statusText}</p>
								</div>}
							<span className="inputbox">
								<Textfield autoFocus floatingLabel="Username" value={this.state.email}
											 onChange={({target: {value: email}}) => {
												 this.setState({email: email})
											 }}/>
							</span>
							<span className="inputbox">
								<Textfield floatingLabel="Password" type="password"
											 value={this.state.password}
											 onChange={({target: {value: password}}) => {
												 this.setState({password})
											 }}/>
							</span>
						</CardText>
						<CardActions>
							<form>

								<Button
									type="submit"
									raised
									onClick={this.handleLogin}
									disabled={!this.validateLoginForm()}>Login
								</Button>


								<p className="forget-password"><a className="not-active" href="">Forgot password?</a></p>
							</form>
						</CardActions>
						<CardText className="register-block">
							<p><Icon name="spa"/>{register}</p>
							<hr />
							<div className="register">
							<p className="bold-text">Don't have an account?</p>
							<p className="bold-text"><Link to="/register">Get Registered!</Link></p>
							</div>
						</CardText>

					</Card>

				}
				<Dialog
					open={this.state.isOpen}
					onClose={() => {this.setState({isOpen:false})}}
					className="unlogin"
				>
				<DialogBody>
					<Icon  name="warning"/>
					<br />
					<p className="bold-text" key="keyword">Please Login or register.</p>
					<br />
					{unlogin.map((p, index) => <p key={index}>{p}</p>)}
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

