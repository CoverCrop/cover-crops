import React, {Component} from "react";
import Header from "./Header";
import AnalyzerWrap from "./AnalyzerWrap";
import AuthorizedWrap from "./AuthorizedWrap";
import {Grid, Cell, Checkbox, FormField, label, Button} from "react-mdc-web";
import styles from "../styles/dashboard-page.css";

class DashboardPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
			precipitation: 1,
			temperature: 1,
			use_weather_data: false
        };
        this.updateUseWeatherData = this.updateUseWeatherData.bind(this);
        this.setPrecipitation = this.setPrecipitation.bind(this);
        this.setTemperature = this.setTemperature.bind(this);
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

    render() {
    	const wetClasses = this.state.precipitation === 0 ? "wet selected" : "wet";
    	const avgClasses1 = this.state.precipitation === 1 ? "avg selected": "avg";
    	const dryClasses = this.state.precipitation === 2  ? "dry selected" : "dry";
    	const coolClasses = this.state.temperature === 0 ? "cool selected" : "cool";
    	const avgClasses2 = this.state.temperature === 1 ? "avg selected" : "avg";
    	const hotClasses = this.state.temperature === 2 ? "hot selected" : "hot";

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

				</div>
			</AuthorizedWrap>
        );
    }

}

export default DashboardPage;
