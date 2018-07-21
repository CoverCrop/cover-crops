import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import {Button, Tabbar, Tab, ToolbarSection, ToolbarTitle, Grid, Cell, Textfield, Caption, Icon, MenuAnchor, Menu, MenuItem, MenuDivider} from 'react-mdc-web';
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";
import MyFarmSummary from "./MyFarmSummary";
import UploadFieldSummary from "./UploadFieldSummary";

class MyFarmWrap extends Component {

	constructor(props) {
		super(props);
		this.state = {
			activeTab:1
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
						{/*<Tab*/}
							{/*active={activeTab===2}*/}
							{/*onClick={() => {this.setState({activeTab:2})}}*/}
						{/*>*/}
							{/*Crop History*/}

						{/*</Tab>*/}
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
				{/*TODO: use switch when there are 4 tabs*/}
				{activeTab === 1 ?
					<UploadFieldSummary {...this.props} />:
						<MyFarmSummary {...this.props} />}

			</div>
		);
	}
}


export default connect(null, null)(MyFarmWrap);
