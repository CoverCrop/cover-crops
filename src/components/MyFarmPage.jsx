import React, {Component} from "react";
import {Link} from "react-router";
import Header from './Header';
import Footer from './Footer';
import {Card, CardText, CardTitle, Button, Fab, Icon, Title, Body1, Body2, Checkbox, FormField, Grid, Cell} from "react-mdc-web";
import styles from '../styles/main.css';
import styles2 from '../styles/main.css';
import ViewResultsCC from "./ViewResultsCC";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import AddFieldBox from "./AddFieldBox"
import {connect} from "react-redux";
import config from "../app.config";
import {getMyFieldList} from "../public/utils";
import FieldSummary from "./FieldSummary";
import {addFieldHelper} from "../app.messages";
import MapCC from "./MapCC";
import ol from "openlayers";


class MyFarmPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			clus: [],
			areafeatures: [],
			openclu: 0,
			fetchError: false
		}
	}

	componentWillMount() {
		let that = this;

		getMyFieldList(this.props.email).then(function(clus){
			// console.log(clus)
			that.setState({clus, fetchError: false});
			that.handleCLUChange(0);
		}, function(err) {
			console.log(err);
			that.setState({fetchError: true});
		})
	}

	handleCLUChange = (cluIndex) =>{
		this.setState({openclu: cluIndex});
		let {clus} = this.state;
		const CLUapi = config.CLUapi + "/api/CLUs?lat=" + clus[cluIndex].lat + "&lon=" + clus[cluIndex].lon + "&soil=false";
		let that = this;
			fetch(CLUapi).then(response => {
				let geojson = response.json();
				return geojson;
			}).then(geojson => {

				let features = (new ol.format.GeoJSON()).readFeatures(geojson, {
					dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'
				});
				that.setState({areafeatures:features});
			}).catch(function (e) {
				console.log("Get CLU failed: " + e);
				that.setState({areafeatures:[
						new ol.Feature({})
					]});
			});

	}

	render() {
		const {openclu, clus, fetchError} = this.state;
		const that = this;
		let selectCLU = clus[0];

		let cluList = clus.map((c, i) => {
			if (openclu === i){
				selectCLU = c;
				return <div className="select-my-field" key={c.clu}>
					<Card onClick={() => {this.handleCLUChange(i)}}>
						<CardText>
							<CardTitle>{c.cluname}</CardTitle>
							{c.lat + " " + c.lon}
						</CardText>
					</Card>
					<div className='minimap'>
						<MapCC mapId={c.cluname}
							   markercoordinate={ ol.proj.transform([c.lon, c.lat], 'EPSG:4326', 'EPSG:3857' )}
							   areafeatures={this.state.areafeatures}
							   fitmap
							   zoomlevel="15"
						/>
					</div>
				</div>


			} else {
				return <div className="unselect-my-field" key={c.clu}>
					<Card onClick={() => {this.handleCLUChange(i)}}>
						<CardText>
							<CardTitle>{c.cluname}</CardTitle>
							{c.lat + " " + c.lon}
						</CardText>
					</Card>
				</div>
			}
		}
	);
		let addField = 	<div  className="add-field-title">
			<Link to="/addfield" >
				<Fab >
					<Icon name="add" />
				</Fab>
			</Link>
			<Title>Add a Field</Title>
		</div>;

		return (
			<AuthorizedWrap>
				<div>
					<Header />
					<AnalyzerWrap activeTab={3}/>

					<Grid>
						<Cell col={4} >
							{this.state.clus.length === 0 ?
								<div className="add-help">
									<p>{addFieldHelper}</p>
									<br />
									{addField}
								</div>:
								<div>
									{addField}
							<div className="myfield-list">
								<Title>My Fields</Title>

								{this.state.fetchError?
									<div>
										<p className="error-message">Failed to get your farm list.</p>
									</div> : cluList}
							</div>
								</div>}
						</Cell>
						<Cell col={8} >
							<FieldSummary
								selectedCLU={selectCLU}
								selectedCLUName={selectCLU? selectCLU.cluname: ""}
							/>
						</Cell>
					</Grid>

				</div>
			</AuthorizedWrap>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		email: state.user.email
	}
};

export default connect(mapStateToProps, null)(MyFarmPage);

