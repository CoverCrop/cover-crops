import React, {Component} from "react";
import {Tabbar, Tab} from "react-mdc-web";
import {connect} from "react-redux";
import {handleUserLogout} from "../actions/user";

class AnalyzerWrap extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const {activeTab} = this.props;
		// Cannot use Link within Tab
		// click tabs will jump to a new page
		return(
			<div>
				<span className="analyzer-line" />
				<div className="analyzer-tab">
					<Tabbar>
						<Tab
							active={activeTab===1}
							href="#/analysis"
						>
							Start a Job
						</Tab>
						<Tab
							active={activeTab===2}
							href="#/history"
						>
							Job History

						</Tab>
						<Tab
							active={activeTab===3}
							href="#/profile"
						>
							My Fields
						</Tab>
						<Tab
							active={activeTab===4}
							href="#/dashboard"
						>
							Dashboard
						</Tab>

					</Tabbar>

				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		isAuthenticated: state.user.isAuthenticated
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		handleUserLogout: () => {
			dispatch(handleUserLogout());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AnalyzerWrap);
