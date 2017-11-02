import React, {Component} from "react";
import {Link} from "react-router";
import styles from "../styles/header.css";
import {Button, Toolbar, ToolbarRow, ToolbarSection, ToolbarTitle, Grid, Cell, Textfield, Caption} from 'react-mdc-web';

class Header extends Component {

	render() {
		return (
			<Toolbar>
				<ToolbarRow>
					<ToolbarSection className="menu_items" align="start">
						<ToolbarTitle><h2><Link onlyActiveOnIndex to="/">Cover Crop Project</Link></h2></ToolbarTitle>
					</ToolbarSection>
					<ToolbarSection>
						<ToolbarTitle className="menu_items">
							<Link onlyActiveOnIndex to="/">HOME</Link>
							<span style={{fontSize: 25}}> | </span>
							<Link onlyActiveOnIndex to="/analysis">ANALYSIS</Link>
							<span style={{fontSize: 25}}> | </span>
							<Link onlyActiveOnIndex to="/about">ABOUT</Link>
						</ToolbarTitle>

					</ToolbarSection>
					<ToolbarSection align="end">
						{/*<span><Textfield floatingLabel="Username"/> </span>*/}
						{/*<span><Textfield floatingLabel="Password" type="password"/> </span>*/}
						{/*<span><Button compact>Login</Button></span>*/}
						{/*<div><Caption><a href="">Forgot username or password?</a></Caption></div>*/}
					</ToolbarSection>
				</ToolbarRow>
			</Toolbar>
		);
	}
}

export default Header;
