import React, {Component} from "react";
import {Toolbar, ToolbarRow, ToolbarSection} from "react-mdc-web";
import NCSALogo from "../images/ncsa-logo.png";
import NRECLogo from "../images/nrec-logo.png";

class Footer extends Component {

	render() {
		return (
			<div>
				<Toolbar>
					<ToolbarRow align="center" className={"footer"}>
						<ToolbarSection align ="start" className="footerCorners" >
								v1.6.0
						</ToolbarSection>
						<ToolbarSection className="footerLogos" >
							<a href="http://www.ncsa.illinois.edu" target="_blank" className={"footerlogo"} rel="noreferrer">
								<img src={NCSALogo} alt="NCSA" title="National Center for Supercomputing Applications"
										style={{width: "160px"}} />
							</a>

							<a href="https://www.illinoisnrec.org/" target="_blank" className={"footerlogo"} rel="noreferrer">
								<img src={NRECLogo} alt="NREC" title="Illinois Nutrient Research & Education Council "
										style={{width: "120px"}} />
							</a>

						</ToolbarSection>

						<ToolbarSection align ="end" className="footerCorners" />

					</ToolbarRow>
				</Toolbar>
			</div>

		);
	}
}

export default Footer;
