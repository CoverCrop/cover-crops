import React, {Component} from "react";
import Header from "./Header";
import {Grid, Cell} from "react-mdc-web";
import UserEvents from "./UserEvents";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import DashboardResults from "./DashboardResults";

class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isSelectedEventSuccessful: true
		};

		this.handleEventClick = this.handleEventClick.bind(this);
	}

	handleEventClick (isSelectedEventSuccessful) {
		this.setState({isSelectedEventSuccessful: isSelectedEventSuccessful});
	}

	render() {
		return (
			<AuthorizedWrap>
				<div>
					<Header selected="user"/>
					<AnalyzerWrap activeTab={4}/>

					<div className="position-relative border-top">
						<Grid className="no-padding-grid">
							<Cell col={4}>
								<UserEvents />
							</Cell>
							<Cell col={8}>
								<DashboardResults />
							</Cell>
						</Grid>
					</div>

				</div>
			</AuthorizedWrap>
		);
	}
}

export default Dashboard;
