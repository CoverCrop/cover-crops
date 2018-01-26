import React, {Component} from "react";
import Header from './Header'
import Footer from './Footer'
import styles from '../styles/main.css'
import {Cell, Grid, Title, Textfield, Card, CardHeader, CardMedia, CardTitle, CardText, GridList, Tile, TileTitle, TilePrimary,TileSecondary, TileContent, Icon} from "react-mdc-web";
import Login from "./Login";

class HomePage extends Component {

	render() {
		return (
			<div>
				<Header selected='home'/>
				<div className="content">
						<Grid>
							<Cell col={8}>
								<h1>Welcome to Cover Crop Project</h1>
								<br/>
								<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ante eros, hendrerit vel
									felis vel, sollicitudin condimentum dui. Nullam at consequat dui. Donec laoreet est a elit
									congue, scelerisque tempus velit pulvinar. Aenean in eleifend ipsum. Quisque lacinia ex non
									enim venenatis ullamcorper. Proin a efficitur massa. Sed eget feugiat urna, ut vestibulum
									urna.</p>

								<p>Etiam blandit magna ligula, a mollis nunc facilisis sit amet. Vestibulum ante ipsum primis in
									faucibus orci luctus et ultrices posuere cubilia Curae; Quisque in lobortis dolor.
									Pellentesque eu tellus id erat laoreet vehicula. Donec in quam viverra, facilisis felis ut,
									dignissim nibh. Aenean quis magna vitae est rutrum pretium id mattis ligula. Maecenas ut mi
									et nibh varius tempus id sed diam. Nunc ac gravida erat. Donec euismod malesuada pretium.
									Phasellus ante ligula, egestas et posuere quis, tempor vehicula arcu.</p>

								<p>Fusce risus nisi, gravida vitae libero eu, rhoncus accumsan leo. Ut convallis ex felis, vel
									placerat velit imperdiet quis. Fusce vulputate dignissim erat, quis rhoncus nibh rutrum sit
									amet. Pellentesque vel lectus at orci lacinia tincidunt. Pellentesque tempor velit in massa
									feugiat, id sollicitudin velit rutrum. In a neque ac quam ornare congue. Vestibulum
									scelerisque, est suscipit porta ullamcorper, lorem tellus lobortis dolor, at fringilla
									tortor mi iaculis libero. Aliquam erat volutpat. Proin facilisis ipsum sit amet tempus
									auctor.</p>

								<p>Pellentesque egestas imperdiet leo, scelerisque efficitur mi porta ut. Praesent hendrerit
									pellentesque sem, et vehicula elit fringilla non. In ac vestibulum eros, malesuada volutpat
									arcu. Nulla facilisi. Mauris aliquet, lorem quis viverra elementum, arcu lorem consectetur
									libero, non hendrerit dolor risus id odio. Phasellus viverra lacus aliquam, interdum magna
									non, porttitor enim. Morbi tempus magna sapien, quis dignissim nunc sodales et. Quisque
									lobortis, ligula nec interdum rhoncus, urna est dignissim magna, et consectetur nulla massa
									non turpis.</p>

								<p>Fusce volutpat eget diam non fermentum. Nulla sit amet elit imperdiet mi luctus viverra
									euismod pulvinar magna. Cras tempus orci volutpat odio consectetur fermentum. Aenean auctor
									ex vel ornare pulvinar. Mauris fermentum, lacus eu pellentesque scelerisque, ante arcu
									ultrices nulla, eu vehicula neque eros id metus. Ut tincidunt eros erat, eu aliquet tellus
									auctor quis. Fusce ac volutpat tortor. Quisque non massa ac quam pharetra posuere et quis
									eros. Maecenas congue, nibh in porttitor fermentum, libero nulla mollis enim, vitae ornare
									enim leo vel lacus.</p>
							</Cell>
							<Cell col={4}>
								<Login/>
							</Cell>
						</Grid>

						{/*<GridList captionIconAlign="start">*/}
						{/*<Tile>*/}
						{/*<TilePrimary>*/}
						{/*<TileContent src= "../../public/card_bg.jpg"/>*/}
						{/*</TilePrimary>*/}
						{/*<TileSecondary>*/}
						{/*<Icon name="school"/>*/}
						{/*<TileTitle>NCSA</TileTitle>*/}
						{/*</TileSecondary>*/}
						{/*</Tile>*/}
						{/*<Tile>*/}
						{/*<TilePrimary>*/}
						{/*<TileContent src= "../../public/card_bg.jpg"/>*/}
						{/*</TilePrimary>*/}
						{/*<TileSecondary>*/}
						{/*<Icon name="school"/>*/}
						{/*<TileTitle>Institution 2</TileTitle>*/}
						{/*</TileSecondary>*/}
						{/*</Tile>*/}
						{/*<Tile>*/}
						{/*<TilePrimary>*/}
						{/*<TileContent src= "../../public/card_bg.jpg"/>*/}
						{/*</TilePrimary>*/}
						{/*<TileSecondary>*/}
						{/*<Icon name="school"/>*/}
						{/*<TileTitle>Institution 2</TileTitle>*/}
						{/*</TileSecondary>*/}
						{/*</Tile>*/}
						{/*<Tile>*/}
						{/*<TilePrimary>*/}
						{/*<TileContent src= "../../public/card_bg.jpg"/>*/}
						{/*</TilePrimary>*/}
						{/*<TileSecondary>*/}
						{/*<Icon name="school"/>*/}
						{/*<TileTitle>Institution 2</TileTitle>*/}
						{/*</TileSecondary>*/}
						{/*</Tile>*/}
						{/*</GridList>*/}
						<Grid>
							<Cell col={2}>
								<Card>
									<CardHeader>
										<CardTitle>Institution 1</CardTitle>
									</CardHeader>
									<CardMedia
										style={{
											backgroundImage: 'url("../images/card_bg.jpg")',
											height: 'auto',
											backgroundSize: 'cover',
										}}
									/>
								</Card>
							</Cell>
							<Cell col={2}>
								<Card>
									<CardHeader>
										<CardTitle>Institution 2</CardTitle>
									</CardHeader>
									<CardMedia
										style={{
											backgroundImage: 'url("../images/card_bg.jpg")',
											height: 'auto',
											backgroundSize: 'cover',
										}}
									/>
								</Card>
							</Cell>
							<Cell col={2}>
								<Card>
									<CardHeader>
										<CardTitle>Institution 3</CardTitle>
									</CardHeader>
									<CardMedia
										style={{
											backgroundImage: 'url("../images/card_bg.jpg")',
											height: 'auto',
											backgroundSize: 'cover',
										}}
									/>
								</Card>
							</Cell>
						</Grid>
					</div>
				<Footer selected='home'/>
			</div>
		);
	}
}

export default HomePage;
