import React, {Component} from "react";
import Table from "./Table";
import {Cell, Grid, Button, Fab, Icon} from "react-mdc-web";

class Mapping extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const data1 = [
			["", "Ford", "Volvo", "Toyota", "Honda"],
			["2016", 10, 11, 12, 13],
			["2017", 20, 11, 14, 13],
			["2018", 30, 15, 12, 123]
		];
		return (
			<div>
				<Grid>
					<Cell col={3}>
						List of parameters from the input file
						<Table container="mapping1" data={data1} rowHeaders={true} colHeaders={true}/>
					</Cell>
					<Cell col={1}>
						{/*Arrow Line / Symbol Centered*/}
						<Icon name="trending_flat"/>
					</Cell>
					<Cell col={3}>
						Required Parameters / Options to Map to
						<Table container="mapping2" data={data1} rowHeaders={true} colHeaders={true}/>
					</Cell>
				</Grid>
				<Button raised primary> Map </Button>
				<Grid>
					<Cell col={4}>
						Mapped Parameters
						<Table container="mapping3" data={data1} rowHeaders={true} colHeaders={true}/>
					</Cell>
					<Cell col={3}>
						Attributes on Parameters
						<Table container="mapping4" data={data1} rowHeaders={true} colHeaders={true}/>
					</Cell>
				</Grid>


			</div>
		);
	}
}

export default Mapping;
