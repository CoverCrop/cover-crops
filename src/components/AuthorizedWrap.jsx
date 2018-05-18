import React, {Component} from "react";
import { connect } from 'react-redux';
import HomePage from "./HomePage";

class AuthorizedWrap extends Component {
	render() {
		let unauthorizedDiv =
			<HomePage message="Please login."/>;
		return (
			<div>
			{this.props.isAuthenticated ? this.props.children : unauthorizedDiv}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.user.isAuthenticated
	}
};

export default connect(mapStateToProps, null)(AuthorizedWrap);

