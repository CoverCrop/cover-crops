import React, {Component} from "react";
import Header from "./Header";
import styles from "../styles/main.css";
import styles2 from "../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import {welcometext, browserWarning} from "../app.messages";
import {privacyUrl, faqUrl} from "../public/config";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class HomePage extends Component {

	state = {
		IEPopup: false
	};

	componentDidMount() {
		if (sessionStorage.getItem("firstVisit") === "true"){
			if (sessionStorage.getItem("isIE") === "true") {
				this.handleIEPopupOpen();
			}
			sessionStorage.setItem("firstVisit", "false");
		}
	}

	handleIEPopupOpen = () => {
		this.setState({IEPopup: true});
	};

	handleIEPopupClose = () => {
		this.setState({IEPopup: false});
	};

	render() {
        let welcome = (<div>
			<h1 className="secondary-color">Welcome to the Cover Crop Project</h1>
			<br/>
			{welcometext.map((paragraph, index) => <p key={index} className="paras">{paragraph}</p> )}
			<br/>
			<p>
				<a href={privacyUrl} target="_blank" className="cc-link"> Privacy Policy </a>
			</p>
					<br/>
			<p>
				Need Help? Check out our&nbsp;
				<a href={faqUrl} target="_blank" className="cc-link">FAQ</a>s
			</p>

			</div>);


		let howwork = (<div>
				<h1 className="secondary-color">How does the simulation work?</h1>
				<br/>
				<img src={require("../images/cover-crop-rep-image.png")} width="100%" />
			</div>);

		return (
			<div >
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

				<Header selected="home"/>
				<span className="home-line" />

				<div className="home-content"
							style={{backgroundSize: "cover", backgroundPosition: "center"}}>
					{window.innerWidth > 1300 ?
						<Grid>
							<Cell col={6}>

								{welcome}
							</Cell>
							<Cell col={6}>
								{howwork}
							</Cell>
						</Grid> :
						<Grid>
							<Cell col={6}>
								{welcome}
								<br />
								{howwork}
							</Cell>
							<Cell col={6} />
						</Grid>}
				</div>
			</div>
		);
	}
}

export default HomePage;
