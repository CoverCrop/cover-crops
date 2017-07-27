import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import {Cell, Grid, Title, Textfield, Card, CardHeader, CardMedia, CardTitle, CardText, GridList, Tile, TileTitle, TilePrimary,TileSecondary, TileContent, Icon} from "react-mdc-web";

class AnalysisPage extends Component {

	render() {
		return (
			<div>
				<Header selected='analysis'/>
				<Grid >
					<Cell col={1}/>
					<Cell col={10}>
						<h1>Analysis Page</h1>
					</Cell>
					<Cell col={1}/>
				</Grid>
				<Footer selected='analysis'/>
			</div>
		);
	}
}

export default AnalysisPage;
