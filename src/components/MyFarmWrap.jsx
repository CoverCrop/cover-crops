import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import {Button, Tabbar, Tab, ToolbarSection, ToolbarTitle, Grid, Cell, Textfield, Caption, Icon, MenuAnchor, Menu, MenuItem, MenuDivider} from 'react-mdc-web';
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";

class MyFarmWrap extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {activeTab} = this.props;
		// Cannot use Link within Tab
		return(
			<div>

				<div className="analyzer-tab">
					<Tabbar>
						<Tab
							active={activeTab===1}
						>
							Field Profile
						</Tab>
						<Tab
							active={activeTab===2}
						>
							Crop History

						</Tab>
						<Tab
							active={activeTab===3}
						>
							CoverCrop History
						</Tab>
						<Tab
							active={activeTab===4}
							href="#/profile"
						>
							Summary
						</Tab>

					</Tabbar>

				</div>
			</div>
		);
	}
}


export default connect(null, null)(MyFarmWrap);
