import React, {Component} from "react";
import {Button, Title, Textfield} from "react-mdc-web";
import {connect} from "react-redux";

class Cultivars extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.props.onRef(this);
		console.log("this");
		console.log(this);
		let year = this.props.year;
		this.setInitialState(this.props, year);
	}

	componentWillUnmount() {
		this.props.onRef(undefined);
	}

	componentWillReceiveProps(nextProps) {
		let year = nextProps.year;
		this.setInitialState(nextProps, year);
	}

	setInitialState(nextProps, year) {
		if (year) {
			let selectcrop = nextProps.cropobj[year]? nextProps.cropobj[year]: {};
			//this.setState(selectcrop);
			let cname = selectcrop["CU"];
			this.setState({"CNAME": cname});
		}
	}

//Not needed unless we allow user to update cultivar
	getBodyJson(){
		var jsonBody= {};
		jsonBody["CONTENT"][0]	= [Object.assign({}, this.state)];
		let {email, clu, year } =  this.props;
		let requestStatus = false;
		if(jsonBody["CONTENT"][0]["CU"]) {

			jsonBody["HNAME"] = year;
			jsonBody["EVENT"] = "cultivars";
			return jsonBody

		} else {
			return {
				"CU":""
			};
		}

	}


	render() {
		return (
			(this.state.CNAME) ?
				<div className="black-bottom-crop" key="cultivars">
					<Title>Cultivars </Title>
					<p  className="input">CULTIVAR</p>
					<Textfield type="text" value={this.state.CNAME} disabled={true}/>
				</div> : <div>

				</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		email: state.user.email,
		clu: state.user.clu,
		cropobj: state.user.cropobj,
	}
};

export default connect(mapStateToProps, null)(Cultivars);
