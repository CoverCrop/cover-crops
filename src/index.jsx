// Set up your application entry point here...
///* eslint-disable import/default */

import React from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import App from "./components/App";

import configureStore from "./store/configureStore";

import "./styles/styles.scss";

require("./public/favicon.ico");
require("./images/card_bg.jpg");
require("./images/cover-crop-rep-image.png");
require("./images/map-marker.png");


const store = configureStore();

render(
	<Provider store={store}>
			<App />
	</Provider>, document.getElementById("app")
);
