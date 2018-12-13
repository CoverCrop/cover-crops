import React, {Component} from "react";
import Header from "./Header";
import AnalyzerWrap from "./AnalyzerWrap";
import AuthorizedWrap from "./AuthorizedWrap";
import StackedBarNegativeValues from "./StackedBarNegativeValues";
import {Grid, Cell, Checkbox, FormField, label, Button, Icon} from "react-mdc-web";
import {getMyFieldList} from "../public/utils";
import styles from "../styles/dashboard-page.css";

class DashboardPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
			precipitation: 1,
			temperature: 1,
			use_weather_data: false,
			show_fields_menu: true,
	        fetch_error: false,
	        clus: []
        };
        this.updateUseWeatherData = this.updateUseWeatherData.bind(this);
        this.setPrecipitation = this.setPrecipitation.bind(this);
        this.setTemperature = this.setTemperature.bind(this);
    }

    componentDidMount() {
    	let that = this;
	    getMyFieldList(this.props.email).then(function(clus){
		    that.setState({clus: clus.reverse(), fetchError: false});
	    }, function(err) {
		    console.log(err);
		    that.setState({fetchError: true});
	    })
    }

	updateUseWeatherData() {
        this.setState({use_weather_data: !this.state.use_weather_data});
	}

	setPrecipitation(selected) {
		this.setState({precipitation: selected});
	}

	setTemperature(selected) {
        this.setState({temperature: selected});
    }

    updateShowFieldsMenu() {
		this.setState({show_fields_menu: !this.state.show_fields_menu});
    }

    render() {
		const wetClasses = this.state.precipitation === 0 ? "wet selected" : "wet";
		const avgClasses1 = this.state.precipitation === 1 ? "avg selected": "avg";
		const dryClasses = this.state.precipitation === 2  ? "dry selected" : "dry";
		const coolClasses = this.state.temperature === 0 ? "cool selected" : "cool";
		const avgClasses2 = this.state.temperature === 1 ? "avg selected" : "avg";
		const hotClasses = this.state.temperature === 2 ? "hot selected" : "hot";



		const data = [
			{date: "01-2016", biomass: 0, nitrogen: -5},
			{date: "02-2016", biomass: 0, nitrogen: -10},
			{date: "03-2016", biomass: 1, nitrogen: -11},
			{date: "04-2016", biomass: 1, nitrogen: -12},
			{date: "05-2016", biomass: 5, nitrogen: -13},
			{date: "06-2016", biomass: 5, nitrogen: -20},
			{date: "07-2016", biomass: 5, nitrogen: -25},
			{date: "08-2016", biomass: 5, nitrogen: -24},
			{date: "09-2016", biomass: 5, nitrogen: -20},
			{date: "10-2016", biomass: 6, nitrogen: -10},
			{date: "11-2016", biomass: 6, nitrogen: -9},
			{date: "12-2016", biomass: 6, nitrogen: -10},
			{date: "01-2017", biomass: 7, nitrogen: -9},
			{date: "02-2017", biomass: 8, nitrogen: -7},
			{date: "03-2017", biomass: 9, nitrogen: -7},
			{date: "04-2017", biomass: 10, nitrogen: -7},
			{date: "05-2017", biomass: 12, nitrogen: -7},
			{date: "06-2017", biomass: 12, nitrogen: -7},
			{date: "07-2017", biomass: 14, nitrogen: -7},
			{date: "08-2017", biomass: 15, nitrogen: -2},
			{date: "09-2017", biomass: 15, nitrogen: -2},
			{date: "10-2017", biomass: 15, nitrogen: -2},
			{date: "11-2017", biomass: 16, nitrogen: 0},
			{date: "12-2017", biomass:  18, nitrogen: 2},
			{date: "01-2018", biomass: 20, nitrogen: 10},
			{date: "02-2018", biomass: 21, nitrogen: 10},
			{date: "03-2018", biomass:  22, nitrogen: 10},
			{date: "04-2018", biomass:  23, nitrogen: 10},
		];
        return (
			<AuthorizedWrap>
				<div>
					<Header />
					<AnalyzerWrap activeTab={3}/>

					<h2 className="title_dashboard">
						Weather
					</h2>
					<Grid>
						<Cell col={3} className="filters_dashboard">
							<div className="headers_dashboard"> Precipitation </div>
							<Button raised compact className={wetClasses} onClick={() => this.setPrecipitation(0)}> WET </Button>
							<Button raised compact className={avgClasses1} onClick={() => this.setPrecipitation(1)}> AVG </Button>
							<Button raised compact className={dryClasses} onClick={() => this.setPrecipitation(2)}> DRY </Button>
						</Cell>
						<Cell col={3} className="filters_dashboard">
							<div className="headers_dashboard"> Temperature </div>
							<Button raised compact className={coolClasses} onClick={() => this.setTemperature(0)}> COOL </Button>
							<Button raised compact className={avgClasses2} onClick={() => this.setTemperature(1)}> AVG </Button>
							<Button raised compact className={hotClasses} onClick={() => this.setTemperature(2)}> HOT </Button>
						</Cell>

						<Cell col={3} >
							<FormField id="use_weather_checkbox">
								<Checkbox onChange={this.updateUseWeatherData} checked={this.state.use_weather_data}/>
								<label> Use actual weather data averages when possible </label>
							</FormField>
						</Cell>
					</Grid>
					<div className="dashboard_divider"> Show/Hide fields<Icon name="arrow_drop_down"/></div>
					<StackedBarNegativeValues title="East Field" data = {data}/>

				</div>
			</AuthorizedWrap>
        );
    }

}

export default DashboardPage;
