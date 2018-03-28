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
			passwordRepeat: ""
		};

		this.handleRegistration = this.handleRegistration.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	handleRegistration = async event => {
	};

	handleReset = () => {
		this.setState({
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			passwordRepeat: ""

		});
	};

	validateRegistrationForm() {

		return this.state.email.length > 0 &&
			this.state.password.length > 0 &&
			this.state.password === this.state.passwordRepeat;
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
														required
														value={this.state.password}
														size="40"
														minLength={6}
														helptext="Your password must be contain at least 6 letters."
														helptextValidation
														onChange={({target: {value: password}}) => {
															this.setState({password})
														}}/></div>
										<div><Textfield floatingLabel="Repeat Password" type="password"
														required
														value={this.state.passwordRepeat}
														size="40"
														minLength={6}
														helptext="Your password must be contain at least 6 letters."
														helptextValidation
														onChange={({target: {value: passwordRepeat}}) => {
															this.setState({passwordRepeat})
														}}/></div>
									</CardText>
									<CardActions>
										<Button
											type="submit"
											primary
											raised
											onClick={this.handleRegistration}
											disabled={!this.validateRegistrationForm()}>Register
										</Button>
										<Button
											primary
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
