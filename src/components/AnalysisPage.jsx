import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import {Cell, Grid} from "react-mdc-web";
import LeftPaneCC from "./LeftPaneCC";
import RightPaneCC from "./RightPaneCC";

class AnalysisPage extends Component {

	render() {
		return (
			<div>
				<Header selected='analysis'/>
				<div className="content">
					<Grid >
						<Cell col={2}>
							<LeftPaneCC />
						</Cell>
						<Cell col={10}>
							<RightPaneCC />
						</Cell>
					</Grid>
					</div>
				<Footer selected='analysis'/>
			</div>
		);
	}
}

export default AnalysisPage;
