import React, {Component} from "react";
import {
	Body1,
	Button,
	Card,
	CardActions,
	CardHeader,
	CardSubtitle,
	CardText,
	CardTitle,
	Cell,
	Grid,
	Textfield,
	Title
} from "react-mdc-web";
import Header from "./Header";
import Footer from "./Footer";
import {datawolfURL} from "../datawolf.config";
import {genericRegistrationErrorMessage, userNotActiveMessage} from "../app.messages";

class RegistrationPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			passwordConfirm: "",
			arePasswordsMatching: false,
			hasMinimumPasswordLength: false,
			statusText: ""
		};
	}

	handleRegistration = async event => {
		event.preventDefault();
		this.setState({statusText: ""});

		try {
			let createPersonResponse = await fetch(datawolfURL + "/persons?" +
				"firstName=" + this.state.firstName +
				"&lastName=" + this.state.lastName +
				"&email=" + this.state.email,
				{
					method: 'POST',
					headers: {
						"Content-Type": "text/plain",
						"Access-Control-Origin": "http://localhost:3000"
					}
				});

			if (createPersonResponse.status === 200 || createPersonResponse.status === 204) {

				let personId = await createPersonResponse.text();

				let createAccountResponse = await fetch(datawolfURL + "/login?" +
					"email=" + this.state.email +
					"&password=" + this.state.password,
					{
						method: 'POST',
						headers: {
							"Content-Type": "text/plain",
							"Access-Control-Origin": "http://localhost:3000"
						}
					});

				// Account creation successful
				if (createAccountResponse.status === 200) {
					let responseText = await createAccountResponse.text();

					// User needs to be activated
					if(responseText === "Not Active") {
						console.log("User account not active.");
						this.setState({statusText: userNotActiveMessage});
					}
					// User is already active
					else {
						console.log("User account active.");
						sessionStorage.setItem("personId", personId); // Store person ID in session storage for future use
					}
				}
				// Account creation unsuccessful. User already exists.
				else if (createAccountResponse.status === 500){
					let responseText = await createAccountResponse.text();
					console.log("Status Text: " + responseText);
					this.setState({statusText: responseText});
				}
				else {
					console.log("Registration Step 2 Status: " + createAccountResponse.status);
					let responseText = await createAccountResponse.text();
					this.setState({statusText: genericRegistrationErrorMessage});
				}
			}
			else {
				console.log("Registration Step 1 Status: " + createPersonResponse.status);
				this.setState({statusText: genericRegistrationErrorMessage});
			}
		}
		catch (error) {
			console.error("Error: " + error);
			this.setState({statusText: genericRegistrationErrorMessage});
		}
	};

	handleReset = () => {
		this.setState({
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			passwordConfirm: "",
			arePasswordsMatching: false,
			hasMinimumPasswordLength: false,
			statusText: ""
		});
	};

	verifyPasswords  = () => {

		if (this.state.password !== this.state.passwordConfirm) {
			this.setState({arePasswordsMatching: false});
		}
		else {
			this.setState({arePasswordsMatching: true});
		}

		if (this.state.password.length >= 6 ) {
			this.setState({hasMinimumPasswordLength: true});
		}
		else {
			this.setState({hasMinimumPasswordLength: false});
		}
	};

	validateRegistrationForm() {

		// Return true if all fields are successfully validated. Else, return false.
		return this.state.firstName.length > 0 &&
			this.state.lastName.length > 0 &&
			this.state.email.length > 0 &&
			this.state.password.length >= 6 &&
			this.state.password === this.state.passwordConfirm;
	}

	render() {
		return (
			<div>
				<Header/>
				<div className="content">
					<Grid>
						<Cell col={4}/>
						<Cell col={3}>
							<div>
								<form>
									<Card className="registration">
										<CardHeader>
											<Title>Create an account</Title>
										</CardHeader>
										<CardText>
											<div><Textfield autoFocus floatingLabel="First name"
															required
															value={this.state.firstName}
															size="40"
															onChange={({target: {value: firstName}}) => {
																this.setState({firstName: firstName})
															}}/></div>
											<div><Textfield floatingLabel="Last name" value={this.state.lastName}
															required
															size="40"
															onChange={({target: {value: lastName}}) => {
																this.setState({lastName: lastName})
															}}/></div>
											<div><Textfield floatingLabel="Email ID" value={this.state.email}
															required
															size="40"
															type="email"
															helptext="Please enter a valid email address."
															helptextValidation
															onChange={({target: {value: email}}) => {
																this.setState({email: email})
															}}/></div>
											<div><Textfield floatingLabel="Password" type="password"
															value={this.state.password}
															required
															size="40"
															useInvalidProp
															invalid={!this.state.hasMinimumPasswordLength}
															helptext="Your password must be contain at least 6 letters."
															helptextValidation
															onChange={({target: {value: password}}) => {
																this.setState({password: password})
															}}
															onKeyUp={this.verifyPasswords}/></div>
											<div><Textfield floatingLabel="Confirm Password" type="password"
															required
															value={this.state.passwordConfirm}
															size="40"
															useInvalidProp
															invalid={!this.state.arePasswordsMatching}
															helptext={"Passwords do not match."}
															helptextValidation
															onChange={({target: {value: passwordConfirm}}) => {
																this.setState({passwordConfirm: passwordConfirm})
															}}
															onKeyUp={this.verifyPasswords}/></div>
										</CardText>
										<CardActions>
											<Button
												type="submit"
												raised
												onClick={this.handleRegistration}
												disabled={!this.validateRegistrationForm()}>Register
											</Button>
											<Button
												raised
												onClick={this.handleReset}>Clear
											</Button>
										</CardActions>
										<p className="error-message">{this.state.statusText}</p>
									</Card>
								</form>
							</div>
						</Cell>
						<Cell col={4}/>
					</Grid>
				</div>
				<Footer/>
			</div>
		)
	}
}


export default RegistrationPage;
