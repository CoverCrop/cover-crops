import React, {Component} from "react";
import {IndexLink, Link} from "react-router";
import {Cell, Grid, Title, Textfield, Button, Caption, Body1, Subheading2} from "react-mdc-web";

class Header extends Component {

	render() {
		return (
			<Grid >
				<Cell col={1}/>
				<Cell col={10}>
					<hr/>
					<Grid>
						<Cell col={3}>
							<Title>Cover Crop Project</Title>
						</Cell>

						<Cell col={4}>
							<Subheading2><IndexLink to="/">Home</IndexLink>
								{" | "}
								<Link to="/analysis">Analysis</Link>
								{" | "}
								<Link to="/">Menu 3</Link>
								{" | "}
								<Link to="/">Menu 4</Link>
								{" | "}</Subheading2>
						</Cell>

						<Cell col={5}>
							<span><Textfield floatingLabel="Username"/> </span>
							<span><Textfield floatingLabel="Password" type="password"/> </span>
							<span><Button compact>Login</Button></span>
							<div><Caption><a href="">Forgot username or password?</a></Caption></div>
						</Cell>
					</Grid>
					<hr/>
				</Cell>
				<Cell col={1}/>
			</Grid>
		);
	}
}

export default Header;
