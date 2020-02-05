import React, {Component} from "react";
import Header from "./Header";
import {Grid, Cell} from "react-mdc-web";
import UserEvents from "./UserEvents";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import DashboardResults from "./DashboardResults";
import {selectedEventNotSuccessful} from "../app.messages";
import {connect} from "react-redux";

class Dashboard extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<AuthorizedWrap>
				<div>
					<Header selected="user"/>
					<AnalyzerWrap activeTab={2}/>

					<div className="position-relative border-top" style={{marginLeft: 10}}>
						<Grid className="no-padding-grid">
							<Cell col={2}>
								<UserEvents />
							</Cell>
							<Cell col={10}>
								{this.props.isSelectedEventSuccessful ? <DashboardResults /> : <p className="error-message">{selectedEventNotSuccessful}</p>}
							</Cell>
						</Grid>
					</div>

				</div>
			</AuthorizedWrap>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isSelectedEventSuccessful: state.user.isSelectedEventSuccessful
	};
};

export default connect(mapStateToProps, null)(Dashboard);
