import React, {Component} from "react";
import {
	Body1,
	Body2,
	Button,
	Card,
	CardText,
	CardTitle,
	Cell,
	Checkbox,
	Dialog,
	DialogBody,
	DialogFooter,
	Fab,
	FormField,
	Grid,
	Icon,
	Title
} from "react-mdc-web";
import Select from 'react-select';
import {connect} from "react-redux";
import Fertilizer from "./Fertilizer";

class CropHistory extends Component {

	constructor(props) {
		super(props);
		this.state ={
			year: this.props.cropobj? undefined: this.props.cropobj.keys()[0]
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleSelectYear =(year) =>{
		this.setState({year: year} );
	}

	handleClick(){
		let a = this.fertilizer.postToDatawolf();
		let that = this;
		a.then(function(status) {
			if(status == 200){
				that.setState({isOpen:true})
			}
		});
	}

	render() {
		let years = Object.keys(this.props.cropobj).filter(obj => obj.indexOf("Corn") > 0 || obj.indexOf("Soybean") > 0 );
		let options = years.map(function(key){
			return {value: key, label:key}
		});
		return (
			<div>
				<div className="border-top summary-div myfarm-input">

					<div className="black-bottom">
						<div className="update-box">
							<p>YEAR</p>
							<Select
								name="year"
								value={this.state.year}
								options={options}
								onChange={selectedOption => this.handleSelectYear(selectedOption.value)}
							/>
						</div>
					</div>
					{this.state.year && <Fertilizer year={this.state.year} onRef={ref => (this.fertilizer = ref)}/> }
					{this.state.year && <Button raised onClick={() => this.handleClick()}>UPDATE</Button>}
				</div>
				<Dialog
					open={this.state.isOpen}
					onClose={() => {this.setState({isOpen:false})}}
					className="unlogin"
				>
					<DialogBody>
						<Icon  name="done"/>
						<br />
						<p className="bold-text" key="keyword">Experiment file update success.</p>
					</DialogBody>
					<DialogFooter>
						<Button compact onClick={()=> { this.setState({isOpen: false}) }}>Close</Button>
					</DialogFooter>
				</Dialog>
			</div>

		)
	}
}

const mapStateToProps = (state) => {
	return {
		exptxt: state.user.exptxt,
		cropobj: state.user.cropobj,
	}
};




export default connect(mapStateToProps, null)(CropHistory);

