import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import {Cell, Grid, Title, Textfield, Card, Fab, CardHeader, CardMedia, CardActions, Button, CardTitle, CardSubtitle, CardText, GridList, Tile, TileTitle, TilePrimary,TileSecondary, TileContent, Icon} from "react-mdc-web";

class AnalysisPage extends Component {

	render() {
		return (
			<div>
				<Header selected='analysis'/>
				<Grid >
					<Cell col={12}>
						<Grid>
							<Cell col={2}>
								<Card>
									<CardHeader>
										<CardTitle>Select Field</CardTitle>
										{/*<CardSubtitle>Subtitle</CardSubtitle>*/}
									</CardHeader>
									<CardText>
										Lorem ipsum dolor sit amet, consectetur adipisicing elit.
									</CardText>
									<CardActions>
										<Fab plain mini><Icon name='add'/></Fab>
									</CardActions>
								</Card>
							</Cell>
							<Cell col={10}>
								<h1>Analysis Page</h1>
							</Cell>
						</Grid>
					</Cell>
				</Grid>
				<Footer selected='analysis'/>
			</div>
		);
	}
}

export default AnalysisPage;
