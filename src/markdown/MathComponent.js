import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';

const MathPlugin = React.createClass({
	propTypes: {
		svg: PropTypes.string,
		children: PropTypes.string
	},
	getInitialState: function() {
		this.lastURL = undefined;
		return {};
	},
	preloader: function() {
		let result;
		if (this.lastURL) {
			result = <span>{this.lastURL}</span>;
		} else {
			result = <span>loading</span>;
		}
		return result;
	},
	loadedImage: function() {
		this.lastURL = this.props.children;
	},
	render: function() {
		const equation = this.props.children;

    //the renderer sometimes nests math components, so you may need to loop through multiple versions
    if (!(typeof equation === 'string' || equation instanceof String)) {
      return <span>{equation}</span>;
    }

    const urlRequest = "https://chart.googleapis.com/chart?cht=tx&chl=" + encodeURIComponent(equation);
	   // const urlRequest = 'https://dry-retreat-1640.herokuapp.com/mathtest?equation=' + encodeURIComponent(equation);
		// const imgProps = {style: {height: '1.5em'}};
		return (
			<ImageLoader onLoad={this.loadedImage} src={urlRequest} wrapper={React.DOM.span} preloader={this.preloader}>
				{equation}
			</ImageLoader>
		);
	}
});


export default MathPlugin;
