import React, {Component} from "react";
import { connect } from 'react-redux';

class AuthorizedWarp extends Component {
	render() {
		let unauthorizedDiv =
			<div className="contentcenter">
				<h3>401 Unauthorized. Please click Home and login first.</h3>
			</div>;
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

export default connect(mapStateToProps, null)(AuthorizedWarp);

