import React, {Component} from "react";
import {Button, Textfield, Body1, LinearProgress} from "react-mdc-web"

class ProgressBarCC extends Component {

	constructor(props){
		super(props);

		this.state = {
			progress: this.props.progress
		}
	}

	render() {
		return(
			<div>
				<LinearProgress style={{width: 150, height: 10, backgroundColor: "green"}} accent progress={this.state.progress}/>
			</div>
		);
	}

}

export default ProgressBarCC;
