import React, {Component} from "react";
import {Router, Route, hashHistory, Redirect} from 'react-router'
import AnalysisPage from './AnalysisPage'
import AddFieldPage from './AddFieldPage'
import HomePage from './HomePage'
import AboutPage from './AboutPage'
import UserPage from './UserPage';
import MyFarmPage from "./MyFarmPage";
import RouteMismatch from './RouteMismatch'
import "material-components-web/dist/material-components-web.min.css";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core';
import {Cell, Grid, Title, Textfield, Button, Caption, Body1, Subheading2} from "react-mdc-web";
import RegistrationPage from "./RegistrationPage";
import {handleUserLogin} from "../actions/user";
import {connect} from "react-redux";

global.__base = __dirname + "/";
const theme = createMuiTheme();

class App extends Component {

	componentWillMount() {
		console.log('App did mount');
		this.props.handleUserLogin(sessionStorage.getItem("email"),
			sessionStorage.getItem("personId"), sessionStorage.getItem("email") !== null)
	}

	render() {

		return (
			<MuiThemeProvider theme={theme}>
				<Router history={hashHistory}>
					<Route path="/" component={HomePage}/>
					<Route path="/analysis" component={AnalysisPage}/>
					<Route path="/addfield" component={AddFieldPage}/>
					<Route path="/profile" component={MyFarmPage}/>
					<Route path="/about" component={AboutPage}/>
					<Route path="/history" component={UserPage}/>
					<Route path="/register" component={RegistrationPage}/>
					<Route path="*" component={RouteMismatch}/>
				</Router>
			</MuiThemeProvider>
		)
	}
}


const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogin: (email, userId, isAuthenticated) => {
			dispatch(handleUserLogin(email, userId, isAuthenticated));
		}
	}
};

export default connect(null, mapDispatchToProps)(App);
