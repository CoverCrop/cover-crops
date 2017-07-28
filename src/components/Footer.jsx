import React, {Component} from "react";
import {IndexLink, Link} from "react-router";
import {Cell, Grid, Title, Textfield, Button, Caption, Body1, Subheading2} from "react-mdc-web";

class Footer extends Component {

	render() {
		return (
			<Grid >
				<Cell col={1}/>
				<Cell col={10}>
					<hr/>
					<Grid/>
					<hr/>
				</Cell>
				<Cell col={1}/>
			</Grid>
		);
	}
}

export default Footer;
