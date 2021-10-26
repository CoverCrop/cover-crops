import React, {Component} from "react";
import Header from "./Header";
import styles from "../styles/main.css";
import styles2 from "../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import {privacyUrl, faqUrl, nrecUrl, dssatUrl, subxUrl, iswsUrl} from "../public/config";
import {loginMessage, usageMessage} from "../app.messages";
import Footer from "./Footer";
import repImg from "../images/cover-crop-rep-image.png";

class HomePage extends Component {

	render() {
		let notificationDiv = null;
		notificationDiv = (<div className="notification_div">
			<span className="isa_warning">
				{(localStorage.getItem("isAuthenticated") === "true") ? usageMessage : loginMessage}
			</span>
		</div>);

		let welcome = (<div>
			<h1 className="secondary-color">Welcome to the Cover Crop Project</h1>
			<br/>
			<p className="paras">
				The cover crop project seeks to provide farmers with a practical web-based decision support tool designed
				to help manage cover crops in their fields.  The project makes use of existing research to demonstrate the
				potential for cover crops, as well as providing useful information for decision making and management of this
				practice.  It will also seek to apply future research on cover crops as results are incorporated into updates
				and new iterations of the tool.  This remains a work in progress with a goal towards adapting with the science.
			</p>

			<p className="paras">
				To date, extensive research has found that adopting cover crops in the fallow season of commercial row crop
				production can improve soil health by, among other things, improving soil organic matter, carbon, as well as
				water retention and some weed suppression. Importantly, cover crops are a critical practice for the Illinois
				Nutrient Loss Reduction Strategy and the voluntary efforts to reduce nutrient losses from farm fields. The
				growing cover crop will scavenge unused inorganic nitrogen and store it in the plant’s biomass, reducing losses;
				it also provides a cover to protect against soil erosion and export of other nutrients from fields.
			</p>

			<p className="paras">
				This project proceeds from an understanding that better information and functional assistance with decision
				making can increase the successful adoption of this important practice. The tool will provide farmers,
				researchers, extension educators and others in the industry with data and information about cover crops in
				a practical, visualized format. The information the tool provides is integrated into common cropping systems
				and the first iteration uses cereal rye added to a corn-soybean rotation for fields in Illinois. At this time,
				fields outside of Illinois are not included in the tool but can be added in future releases and as data becomes
				available.
			</p>

			<p className="paras">
				Funding for this project has been provided primarily by the Illinois Nutrient Research & Education
				Council (<a href={nrecUrl} target="_blank" className="cc-link" rel="noreferrer">NREC</a>).
				The project team greatly appreciates the financial, technical and other support from
				NREC and Illinois farmers. The latest release adds to the dashboard, providing the user with
				information about the decomposition of the terminated cover crop. This first-of-its-kind
				functionality was generously funded by the Walton Family Foundation. Finally, initial seed funding
				for the project was also provided by the McKnight Foundation and the University of Illinois.
			</p>

			<p className="paras">
				The cover crop tool uses the Decision Support System for Agrotechnology Transfer
				(<a href={dssatUrl} target="_blank" className="cc-link" rel="noreferrer">DSSAT</a>),
				which is an open source modeling program for dynamic crop growth simulation for over 42 crops.
				DSSAT simulates crop growth using a range of models and data inputs for soil, plant and weather dynamics.
				It has been adapted for using in simulating cereal rye cover crops and incorporates commercial cropping
				practices, USDA soils data for the selected field and weather data. We use 30-day forecasts of air temperature,
				precipitation, wind speed, humidity, and solar radiation from state-of-the-art climate forecast models as part
				of the Subseasonal Experiment (<a href={subxUrl} target="_blank" className="cc-link" rel="noreferrer">SubX</a>)
				and historical weather data from Illinois State Water Survey
				(<a href={iswsUrl} target="_blank" className="cc-link" rel="noreferrer">ISWS</a>).
				The forecasts provide realistic representations of weather conditions used for forward-looking DSSAT
				simulations. From the DSSAT model simulation, estimates for cover crop biomass, carbon-to-nitrogen ratio
				and nitrogen data (uptake, loss and loss reduction) are visualized.
			</p>

			<br/>
			<p>
				<a href={privacyUrl} target="_blank" className="cc-link" rel="noreferrer"> Privacy Policy </a>
			</p>
			<br/>
			<p>
				Need Help? Check out our&nbsp;
				<a href={faqUrl} target="_blank" className="cc-link" rel="noreferrer">FAQ</a> section
			</p>

		</div>);


		let howwork = (<div>
			<h1 className="secondary-color">How does the simulation work?</h1>
			<br/>
			<img src={repImg} width="100%" />
		</div>);

		return (
			<div >
				<Header selected="home"/>
				<span className="home-line" />

				{notificationDiv}

				<div className="home-content"
							style={{backgroundSize: "cover", backgroundPosition: "center"}}>
					<Grid>
						<Cell col={6}>
							{welcome}
						</Cell>
						<Cell col={6}>
							{howwork}
						</Cell>
					</Grid>
				</div>

				<Footer/>
			</div>
		);
	}
}

export default HomePage;
