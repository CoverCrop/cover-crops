import React, {Component} from "react";
import {Router, Route, hashHistory} from 'react-router'
import AnalysisPage from './AnalysisPage'
import HomePage from './HomePage'
import "material-components-web/dist/material-components-web.min.css";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Cell, Grid, Title, Textfield, Button, Caption, Body1, Subheading2} from "react-mdc-web";
import injectTapEventPlugin from 'react-tap-event-plugin'


global.__base = __dirname + "/";
injectTapEventPlugin();

class App extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<Router history={hashHistory}>
					<Route path="/" component={HomePage}/>
					<Route path="/analysis" component={AnalysisPage}/>
				</Router>
			</MuiThemeProvider>
		)
	}
}

export default App;
