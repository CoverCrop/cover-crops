import React, {Component} from "react";
import {Link} from "react-router";
import Header from './Header';
import Footer from './Footer';
import {Card, CardText, CardTitle, Button, Fab, Icon, Title, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import MapCC from './MapCC';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import AddFieldBox from "./AddFieldBox"
import {connect} from "react-redux";
import config from "../app.config";
import {getMyFieldList, wait} from "../public/utils";

class MyFarmPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clus: [],
			openclu: 0
		}
	}



	componentWillMount() {
		let that = this;

		getMyFieldList(this.props.email).then(function(clus){
			// console.log(clus)
			that.setState({clus})
		}, function(err) {
			console.log(err);
		})
	}

	render() {
		const {openclu} = this.state;
		const that = this;
		//TODO: add map for openclu
		let cluList = this.state.clus.map((c, i) => {
			if (openclu === i){
				return <div className="select-my-field" key={c.clu}>
					<Card onClick={() => {that.setState({openclu: i})}}>
						<CardText>
							<CardTitle>{c.cluname}</CardTitle>
							{c.lat + " " + c.lon}
						</CardText>
					</Card>
				</div>

			} else {
				return <div className="unselect-my-field" key={c.clu}>
					<Card onClick={() => {that.setState({openclu: i})}}>
						<CardText>
							<CardTitle>{c.cluname}</CardTitle>
							{c.lat + " " + c.lon}
						</CardText>
					</Card>
				</div>
			}
		}
	)

		return (
			<AuthorizedWrap>
				<div>
					<Header />
					<AnalyzerWrap activeTab={3}/>

					<Grid>
						<Cell col={4} >
							<div  className="add-field-title">
								<Link to="/addfield" >
									<Fab >
										<Icon name="add" />
									</Fab>
								</Link>
								<Title>Add a Field</Title>
							</div>
							<div className="myfield-list">
								<Title>My Fields</Title>
								{cluList}
							</div>
						</Cell>
						<Cell col={8} className="border-left">
							Field Profile Holder
						</Cell>
					</Grid>

				</div>
			</AuthorizedWrap>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		clu: state.analysis.clu,
		email: state.user.email
	}
};

export default connect(mapStateToProps, null)(MyFarmPage);

