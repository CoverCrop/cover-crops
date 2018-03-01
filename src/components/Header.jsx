import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import {Button, Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle, Grid, Cell, Textfield, Caption, Icon, MenuAnchor, Menu, MenuItem, MenuDivider} from 'react-mdc-web';
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";

class Header extends Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};
	}

	render() {
		const active = {color: "#afb5f3"};
		return (
			<Toolbar>
				<ToolbarRow>
					<ToolbarSection className="menu_items" align="start">
						<ToolbarTitle><h2><Link onlyActiveOnIndex to="/">Cover Crop Project</Link></h2></ToolbarTitle>
					</ToolbarSection>
					<ToolbarSection className="menu_items">
						<ToolbarTitle><Link activeStyle={active} onlyActiveOnIndex to="/">HOME</Link></ToolbarTitle>
						<ToolbarTitle><Link activeStyle={active} to="/analysis">ANALYSIS</Link></ToolbarTitle>
						<ToolbarTitle><Link activeStyle={active} to="/about">ABOUT</Link></ToolbarTitle>
					</ToolbarSection>
					<ToolbarSection className="menu_items" align="end">
						{this.props.isAuthenticated === false ? null :
							<span>
								<Icon
									name="person"
									className="user-account-icon"
									onClick={() => {
										this.setState({open: true})
									}}/>
								<MenuAnchor>
									<Menu
										right
										open={this.state.open}
										onClose={() => {
											this.setState({open: false})
										}}>
										<MenuItem>Profile</MenuItem>
										<MenuItem>History</MenuItem>
										<MenuDivider/>
										<MenuItem onClick={() => {
											this.props.handleUserLogout();
											alert("Logout successful!");
										}}>Logout</MenuItem>
									</Menu>
								</MenuAnchor>
							</span>}
					</ToolbarSection>
				</ToolbarRow>
			</Toolbar>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		isAuthenticated: state.user.isAuthenticated
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogout: () => {
			dispatch(handleUserLogout());
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
