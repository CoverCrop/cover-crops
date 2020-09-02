import React, {Component} from "react";
import Header from "./Header";
import styles from "../styles/main.css";
import styles2 from "../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import {welcometext} from "../app.messages";
import {privacyUrl, faqUrl} from "../public/config";

class HomePage extends Component {

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
