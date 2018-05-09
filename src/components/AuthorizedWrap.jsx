import React, {Component} from "react";
import { connect } from 'react-redux';

class AuthorizedWrap extends Component {
	render() {
		let unauthorizedDiv =
			<script type="text/javascript">
				window.onload = function(e){
					window.location.assign("/")
				}
			</script>;
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

