import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import {Button, Tabbar, Tab, ToolbarSection, ToolbarTitle, Grid, Cell, Textfield, Caption, Icon, MenuAnchor, Menu, MenuItem, MenuDivider} from 'react-mdc-web';
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";
import MyFarmSummary from "./MyFarmSummary";
import UploadFieldSummary from "./UploadFieldSummary";
import CropHistory from "./CropHistory";

class MyFarmWrap extends Component {

	constructor(props) {
		super(props);
		this.state = {
			activeTab:2
		}
	}

	renderContent(activeTab) {
		switch(activeTab) {
			case 1:
				return <UploadFieldSummary {...this.props} />;
			case 2: return <CropHistory {...this.props} />;
			//case 4
			default:
				return <MyFarmSummary {...this.props} />;
		}
	}

	render() {
		const {activeTab} = this.state;
		// Cannot use Link within Tab
		return(
			<div>

				<div  className="myfarm-tab">
					<Tabbar>
						<Tab
							active={activeTab===1}
							onClick={() => {this.setState({activeTab:1})}}
						>
							Field Profile
						</Tab>
						<Tab
							active={activeTab===2}
							onClick={() => {this.setState({activeTab:2})}}
						>
							Crop History

						</Tab>
						{/*<Tab*/}
							{/*active={activeTab===3}*/}
							{/*onClick={() => {this.setState({activeTab:2})}}*/}
						{/*>*/}
							{/*CoverCrop History*/}
						{/*</Tab>*/}
						<Tab
							active={activeTab===4}
							onClick={() => {this.setState({activeTab:4})}}
						>
							Summary
						</Tab>

					</Tabbar>

				</div>
				{this.renderContent(activeTab)}

			</div>
		);
	}
}


export default connect(null, null)(MyFarmWrap);
