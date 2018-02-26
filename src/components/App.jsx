import React, {Component} from "react";
import {Router, Route, hashHistory} from 'react-router';
import AnalysisPage from './AnalysisPage';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import UserPage from './UserPage';
import RouteMismatch from './RouteMismatch'
import "material-components-web/dist/material-components-web.min.css";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'material-components-web/dist/material-components-web.min.css';
import {Cell, Grid, Title, Textfield, Button, Caption, Body1, Subheading2} from "react-mdc-web";
import injectTapEventPlugin from 'react-tap-event-plugin';

global.__base = __dirname + "/";
injectTapEventPlugin();

class App extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<Router history={hashHistory}>
					<Route path="/" component={HomePage}/>
					<Route path="/analysis" component={AnalysisPage}/>
					<Route path="/about" component={AboutPage}/>
					<Route path="/history" component={UserPage}/>
					<Route path="*" component={RouteMismatch}/>
				</Router>
			</MuiThemeProvider>
		)
	}
}

export default App;
