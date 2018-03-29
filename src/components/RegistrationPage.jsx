import React, {Component} from "react";
import {
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
import {connect} from "react-redux";

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
			hasMinimumPasswordLength: false
		};

		this.handleRegistration = this.handleRegistration.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.verifyPasswordMatch = this.verifyPasswordMatch.bind(this);
		this.verifyPasswordLength = this.verifyPasswordLength.bind(this);
	}

	handleRegistration = async event => {
	};

	handleReset = () => {
		this.setState({
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			passwordConfirm: "",
			arePasswordsMatching: false,
			hasMinimumPasswordLength: false
		});
	};

	verifyPasswordMatch = () => {
		if (this.state.password !== this.state.passwordConfirm) {
			this.setState({arePasswordsMatching: false});
		}
		else {
			this.setState({arePasswordsMatching: true});
		}
	};

	verifyPasswordLength = () => {
		console.log(this.state.password.length);
		if (this.state.password.length >= 6 ) {
			this.setState({hasMinimumPasswordLength: true});
		}
		else {
			this.setState({hasMinimumPasswordLength: false});
		}
		console.log(this.state.hasMinimumPasswordLength);
	};

	validateRegistrationForm() {

		// Return true if all fields are successfully validated. Else, return false.
		return this.state.firstName.length > 0 &&
			this.state.lastName.length > 0 &&
			this.state.email.length > 0 &&
			this.state.password.length > 0 &&
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
														onKeyUp={this.verifyPasswordLength}/></div>
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
														onKeyUp={this.verifyPasswordMatch}/></div>
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
								</Card>
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
