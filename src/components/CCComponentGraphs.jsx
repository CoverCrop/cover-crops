import React, {Component} from "react";
import CCGraph from "./CCGraph";

class CCComponentGraphs extends Component {

	render() {
		let graphInfo = [
			{
				"date": "2019-01-01",
				"with-cc": 79.712177364702,
				"no-cc": 45,
			},
			{
				"date": "2019-02-01",
				"with-cc": 239.712177364702,
				"no-cc": 66,
			},
			{
				"date": "2019-03-01",
				"with-cc": 311,
				"no-cc": 88,
			},
			{
				"date": "2019-04-01",
				"with-cc": 470,
				"no-cc": 230,
			},
			{
				"date": "2019-05-01",
				"with-cc": 530,
				"no-cc": 340,
			},
			{
				"date": "2019-06-01",
				"with-cc": 620,
				"no-cc": 560,
			}
		];

		return (
				<div>
					<span style={{width: "50%", float: "left"}}>
						<CCGraph xlabel="date" ylabel="lbs/acre" title="Nitrogen Uptake" graphInfo={graphInfo}/>
					</span>

					<span style={{width: "50%", float: "right"}}>
						<CCGraph xlabel="date" ylabel="lbs/acre" title="Nitrogen Loss" graphInfo={graphInfo}/>
					</span>

				</div>
		);
	}
}

export default CCComponentGraphs;
