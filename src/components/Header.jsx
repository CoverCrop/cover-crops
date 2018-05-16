import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import styles2 from "../styles/main.css";
import {Button, Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle, Grid, Cell, Textfield, Caption, Icon, MenuAnchor, Menu, MenuItem, MenuDivider} from 'react-mdc-web';
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";

class Header extends Component {

	constructor(props) {
		super(props);

		this.state = {
			open: false
		};

		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout() {
		sessionStorage.removeItem("personId");
		sessionStorage.removeItem("email");
		this.props.handleUserLogout();
	}

	render() {
		return(
			<div>
				<Toolbar>
					<ToolbarRow className="banner">
						<ToolbarSection className="cover-crop" align="start">
							<Link to="/">
								<img src={require("../images/logo.png")}/>
								CoverCrop
							</Link>
						</ToolbarSection>
						<ToolbarSection align="end" >
							<span className="email-address">{this.props.email}</span>

							{this.props.isAuthenticated === false ? null :
								<Button onClick={this.handleLogout}>Logout</Button>}

						</ToolbarSection>
					</ToolbarRow>
				</Toolbar>
				<Grid className="no-bottom-grid">

					<Cell col={5} className="rectangle-2">
						<div>
							<Link to="/analysis" className="cover-crop-analyzer" >CoverCrop Analyzer</Link>
						</div>
					</Cell>
					<Cell col={2}></Cell>
					<Cell col={5} className="rectangle-3">
						<div>
							<Link to="/" className="about-the-project">About the Project</Link>
						</div>
					</Cell>
				</Grid>
			</div>

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
