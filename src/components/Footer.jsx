import React, {Component} from "react";
import {IndexLink, Link} from "react-router";
import {Cell, Grid, Title, Textfield, Button, Caption, Body1, Subheading2} from "react-mdc-web";

class Footer extends Component {

	render() {
		return (
			<Grid>
				<Cell col={12}>
					<hr/>
					<Grid/>
					<hr/>
				</Cell>
			</Grid>
		);
	}
}

export default Footer;
