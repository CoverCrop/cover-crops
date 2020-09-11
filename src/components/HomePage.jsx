import React, {Component} from "react";
import Header from "./Header";
import styles from "../styles/main.css";
import styles2 from "../styles/home-page.css";
import {Cell, Grid} from "react-mdc-web";
import {privacyUrl, faqUrl, nrecUrl} from "../public/config";

class HomePage extends Component {

	render() {
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
				Funding for this project has been provided primarily by the Illinois Nutrient Research & Education Council
				(<a href={nrecUrl} target="_blank" className="cc-link">NREC</a>).
				The project team greatly appreciates the financial, technical and other support from NREC and Illinois farmers.
				Initial seed funding for the project was also provided by the McKnight Foundation and the University of Illinois.
				Additional features for the tool are forthcoming thanks to funding from the Walton Family Foundation.”
			</p>

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
						<Grid>
							<Cell col={6}>
								{welcome}
							</Cell>
							<Cell col={6}>
								{howwork}
							</Cell>
						</Grid>
				</div>
			</div>
		);
	}
}

export default HomePage;
