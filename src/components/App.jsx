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
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Cell, Grid, Title, Textfield, Button, Caption, Body1, Subheading2} from "react-mdc-web";
import injectTapEventPlugin from 'react-tap-event-plugin'
import {isUserAuthenticated} from "../public/utils";
import RegistrationPage from "./RegistrationPage";

global.__base = __dirname + "/";
injectTapEventPlugin();

class App extends Component {
	render() {

		const PrivateRoute = ({component: Component, ...rest}) => (

			<Route
				{...rest}
				render={props =>
					isUserAuthenticated()  ? (
						<Component {...props} />
					) : (
						<Redirect
							to={{
								pathname: "/home"
							}}
						/>
					)
				}
			/>
		);

		return (
			<MuiThemeProvider>
				<Router history={hashHistory}>
					<Route path="/" component={HomePage}/>
					<PrivateRoute path="/analysis" component={AnalysisPage}/>
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

export default App;
