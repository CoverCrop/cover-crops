import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import {Cell, Grid} from "react-mdc-web";
import LeftPaneCC from "./LeftPaneCC";
import RightPaneCC from "./RightPaneCC";
import AuthorizedWarp from "./AuthorizedWarp"
import AnalyzerWrap from "./AnalyzerWrap";

class AnalysisPage extends Component {

	render() {
		return (
			<div>
				<Header selected='analysis'/>
				<AnalyzerWrap activeTab={1}/>
				<AuthorizedWarp>

		               <RightPaneCC/>

				</AuthorizedWarp>
			</div>
		);
	}
}

export default AnalysisPage;
