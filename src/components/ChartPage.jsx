import React, {Component} from "react";
import {Cell, Grid, Title, Textfield, Card, Fab, CardHeader, CardMedia, CardActions, Button, CardTitle, CardSubtitle, CardText, GridList, Tile, TileTitle, TilePrimary,TileSecondary, TileContent, Icon} from "react-mdc-web";
import "babel-polyfill";
import {Line} from 'react-chartjs-2';

class ChartPage extends Component {

	render() {
		var options = {
			scales: {
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Date"
					},
					gridLines: {
						lineWidth: 2
					},
					time: {
						unit: "month",
						unitStepSize: 1,
						displayFormats: {
							millisecond: 'YYYY MMM DD',
							second: 'YYYY MMM DD',
							minute: 'YYYY MMM DD',
							hour: 'YYYY MMM DD',
							day: 'YYYY MMM DD',
							week: 'YYYY MMM DD',
							month: 'YYYY MMM DD',
							quarter: 'YYYY MMM DD',
							year: 'YYYY MMM DD',
						}
					}
				}],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Crop grain and cover crop weights (lb/acre)'
					}
				}]
			}
		}
		const data = {
			labels: ['2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01', '2012-07-01','2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01', '2013-01-01', '2013-02-01'],
			datasets: [
				{
					label: 'Cover crop',
					fill: false,
					lineTension: 0.1,
					backgroundColor: 'rgba(0,0,0,1)',
					borderColor: 'rgba(0,0,0,1)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(75,192,192,1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(75,192,192,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: [65, 59, 80, 81, 56, 55,]
				},

				{
					label: 'No cover crop',
					fill: false,
					lineTension: 0.1,
					backgroundColor: 'rgba(75,192,192,0.4)',
					borderColor: 'rgba(75,192,192,1)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(75,192,192,1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(75,192,192,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: [130, 118, 160, 192, 106, 110, 80, 130, 118, 160, 192, 106, 110, 80, 130, 118, 160, 192, 106, 110, 80]
				}
			]
		};

		return (
			<div>
				<h2>PlantGro Example</h2>
				<Line data={data} options={options} />
			</div>
		)
	}

}

export default ChartPage;
