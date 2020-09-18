import React, {Component} from "react";
import {browserHistory, Link} from "react-router";
import styles from "../styles/header.css";
import styles2 from "../styles/main.css";
import {Button, Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";
import config from "../app.config";
import {
	clearKeycloakStorage,
	checkForTokenExpiry
} from "../public/utils";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {browserWarning} from "../app.messages";
import DialogActions from "@material-ui/core/DialogActions";

const keycloak = config.keycloak;

class Header extends Component {

	state = {
		IEPopup: false
	};

	constructor(props) {
		super(props);

		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleRegister = this.handleRegister.bind(this);
	}

	componentDidMount(): void {
		if (sessionStorage.getItem("firstVisit") === "true"){
			if (sessionStorage.getItem("isIE") === "true") {
				this.handleIEPopupOpen();
			}
			sessionStorage.setItem("firstVisit", "false");
		}

		if (localStorage.getItem("isAuthenticated") === "true") {
			// if authenticated flag is set, re-check for token expiry. Reload page if expired
			if (checkForTokenExpiry()) {
				clearKeycloakStorage();
				window.location.reload();
			}
			else { // If token is not expired, set the timer to check for expiry
				let interval = setInterval( function(){
					if (localStorage.getItem("isAuthenticated") === "true") {
						if (checkForTokenExpiry()) {
							clearKeycloakStorage();
							browserHistory.push("/");
						}
					}
					else { // clear timer once isAuthenticated is set to false in storage
						clearInterval(interval);
						// browserHistory.push("/");
					}
				}, 15000);
			}
		}
	}

	handleIEPopupOpen = () => {
		this.setState({IEPopup: true});
	};

	handleIEPopupClose = () => {
		this.setState({IEPopup: false});
	};

	handleLogin(){
		browserHistory.push("/login");
	}

	handleRegister(){
		keycloak.init().success(function(){
			keycloak.register({});
		});
	}

	handleLogout(){
		clearKeycloakStorage();
		this.props.handleUserLogout();
		keycloak.init().success(function(){
			keycloak.logout({redirectUri: browserHistory.push("/")});
		});
	}

	render() {
		return(
			<div>

				<Dialog
						open={this.state.IEPopup}
						onClose={this.handleIEPopupClose}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title" >
						<span style={{fontWeight: "bolder"}}> Unsupported Browser Detected</span>
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							{browserWarning}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleIEPopupClose} color="primary" autoFocus>
							Continue
						</Button>
					</DialogActions>
				</Dialog>

				<Toolbar>
					<ToolbarRow className="banner">
						<ToolbarSection className="cover-crop" align="start">
							<Link to="/">
								<img src={require("../images/logo.png")}/>
								CoverCrop
							</Link>
						</ToolbarSection>
						<ToolbarSection align="end" >
							<span className="email-address">{this.props.email}</span>

							{this.props.isAuthenticated === false ? <span> <Button onClick={this.handleLogin}>Login</Button>
									<Button onClick={this.handleRegister} style={{height: "40px"}}>Register</Button> </span> :
								<Button onClick={this.handleLogout}>Logout</Button>}

						</ToolbarSection>
					</ToolbarRow>
				</Toolbar>
				<div className="header-tab" >
					<div className="rectangle-2">
						<Link to="/analysis" className="cover-crop-analyzer" >CoverCrop Analyzer</Link>

					</div>

					{this.props.selected === "home" && <div className="triangle-bottomright" /> }
					{this.props.selected === "home" ? <div className="rectangle-3-onselect">
							<Link to="/" className="about-the-project-onselect">About the Project</Link>
						</div> :
						<Link to="/" className="about-the-project">About the Project</Link>

					}
				</div>
			</div>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		isAuthenticated: state.user.isAuthenticated
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogout: () => {
			dispatch(handleUserLogout());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
