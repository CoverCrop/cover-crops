import React, {Component} from "react";
import PropTypes from "prop-types";
import D3StackedBarNegativeValues from "./D3/D3StackedBarNegativeValues";

class StackedBarNegativeValues extends Component {

	static PropTypes = {
		data: PropTypes.array,
		title: PropTypes.string
	};

	componentDidMount() {
		const el = this._rootNode;
		D3StackedBarNegativeValues.create(el, {
			width: 1000,
			height: 400
		}, this.getStackedBarNegativeValuesState());
	}

	componentDidUpdate() {
		let el = this._rootNode;
		D3StackedBarNegativeValues.update(el, this.getStackedBarNegativeValuesState());
	}

	componentWillUnmount() {
		D3StackedBarNegativeValues.destroy(this._rootNode);
	}

	getStackedBarNegativeValuesState() {
		return {
			width: 1000,
			height: 400,
			data: this.props.data,
			title: this.props.title
		};
	}

	_setRef(componentNode) {
		this._rootNode = componentNode;
	}

    render() {
        return (
            <div className="stacked-bar-container" ref={this._setRef.bind(this)}/>

        );
    }

}

export default StackedBarNegativeValues;
