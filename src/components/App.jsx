import React, {Component} from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {createBrowserHistory} from "history";
import AnalysisPage from "./AnalysisPage";
import AddFieldPage from "./AddFieldPage";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import UserPage from "./UserPage";
import MyFarmPage from "./MyFarmPage";
import RouteMismatch from "./RouteMismatch";
import "material-components-web/dist/material-components-web.min.css";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {handleUserLogin} from "../actions/user";
import {connect} from "react-redux";
import Dashboard from "./Dashboard";
import Login from "./Login";
import {isIE} from "react-device-detect";
import configureStore, {history} from "../store/configureStore";
import { ConnectedRouter } from "connected-react-router";


global.__base = `${__dirname }/`;
const theme = createMuiTheme();

class App extends Component {

	componentWillMount() {
		this.props.handleUserLogin(localStorage.getItem("kcEmail"),
			localStorage.getItem("dwPersonId"), localStorage.getItem("kcEmail") !== null);
	}

	render() {
		sessionStorage.setItem("isIE", JSON.stringify(isIE));
		if (sessionStorage.getItem("firstVisit") == null){
			sessionStorage.setItem("firstVisit", "true");
		}

		return (
			<MuiThemeProvider theme={theme}>
				<ConnectedRouter history={history}>
				 	<Router>
					  <Switch>
						  <Route exact path="/" component={HomePage}/>
						  <Route exact path="/login" component={Login}/>
						  <Route exact path="/analysis" component={AnalysisPage}/>
						  <Route exact path="/addfield" component={AddFieldPage}/>
						  <Route exact path="/profile" component={MyFarmPage}/>
						  <Route exact path="/about" component={AboutPage}/>
						  <Route exact path="/history" component={UserPage}/>
						  <Route exact path="/dashboard" component={Dashboard}/>
						  <Route path="*" component={RouteMismatch}/>
					  </Switch>
				  </Router>
				</ConnectedRouter>
			</MuiThemeProvider>
		);
	}
}


const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogin: (email, userId, isAuthenticated) => {
			dispatch(handleUserLogin(email, userId, isAuthenticated));
		}
	};
};

export default connect(null, mapDispatchToProps)(App);
