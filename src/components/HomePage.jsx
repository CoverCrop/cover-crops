import React, {Component} from "react";
import Header from './Header'
import styles from '../styles/main.css';
import styles2 from '../styles/home-page.css'
import {Cell, Grid, Title, Textfield, Card, CardHeader, CardMedia, CardTitle, CardText, GridList, Tile, TileTitle, TilePrimary,TileSecondary, TileContent, Icon} from "react-mdc-web";
import Login from "./Login";
import {welcometext} from "../app.messages";

class HomePage extends Component {

	render() {
        let welcome = <div>
			<h1 className="secondary-color">Welcome to the Cover Crop Project</h1>
			<br/>
			{welcometext.map((paragraph, index) => <p key={index} className="secondary-color">{paragraph}</p>)}
			</div>;


		let howwork =
        	<div>
				<h1 className="secondary-color">How does the simulation work?</h1>
				<br/>
				<img src={require("../images/cover-crop-rep-image.png")} width="100%" />
			</div>;

		return (
			<div >
				<Header selected='home'/>
				<span className="home-line"> </span>

				<div className="home-content"
					 style={{backgroundImage: 'url("../images/ground.jpg")',
						 backgroundSize: 'cover',
					backgroundPosition: 'center',

					 }}>
					{window.innerWidth > 1300 ?
						<Grid>
							<Cell col={4}>

								{welcome}
							</Cell>
							<Cell col={4}>
								{howwork}
							</Cell>
							<Cell col={4}>
								<Login message={this.props.message}/>
							</Cell>
						</Grid> :
						<Grid>
							<Cell col={6}>
								{welcome}
								<br />
								{howwork}
							</Cell>
							<Cell col={6}>
								<Login message={this.props.message}/>
							</Cell>
						</Grid>}
				</div>
			</div>
		);
	}
}

export default HomePage;
