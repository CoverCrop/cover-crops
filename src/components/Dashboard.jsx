import React, {Component} from "react";
import Header from "./Header";
import {Grid, Cell} from "react-mdc-web";
import UserEvents from "./UserEvents";
import AuthorizedWrap from "./AuthorizedWrap";
import AnalyzerWrap from "./AnalyzerWrap";
import DashboardResults from "./DashboardResults";
import {noJobsFound} from "../app.messages";
import {connect} from "react-redux";
import {faqUrl} from "../public/config";

class Dashboard extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		let dashboardOutput = "";

		if (this.props.isSelectedEventSuccessful === "success"){
			dashboardOutput = <DashboardResults />;
		}
		else if (this.props.isSelectedEventSuccessful === "error"){
			dashboardOutput = (
					<div style={{display: "flex", justifyContent: "center"}}>
						<p className="error-message">
						The selected job did not complete successfully. The most common cause is overlapping
						dates between the cash crop and the cover crop. Please check the field in 'My Farm' to
						verify that the cover crop planting date does not overlap the cash crop harvest date and
						the cover crop termination date does not overlap the next cash crop planting date.
						For additional help, please see the <a href={faqUrl} target="_blank" className="cc-link">FAQ</a>s.
						</p>
					</div>
			);
		}
		else if (this.props.isSelectedEventSuccessful === "noRuns"){
			dashboardOutput = <p className="error-message">{noJobsFound}</p>;
		}
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
								{dashboardOutput}
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
