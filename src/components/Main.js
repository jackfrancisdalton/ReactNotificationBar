require('normalize.css/normalize.css');
require('styles/App.sass');

import React from 'react';
import IconSet from './IconSet'

let yeomanImage = require('../images/yeoman.png');

class MultiNotificationBox  extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div></div>
		);
	}
}


class NotificationBox extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isActive: false,
			isVisible: false,
			textContent: "content",
		}

		this.fireNotification = this.fireNotification.bind(this);
	}

	fireNotification() {
		let self = this;

		self.setState({ isActive: true })

		// setTimeout(function() {
		// 	self.setState({ isActive: false })
		// }, self.props.displayTime)
	}

	// fireNotification() {
	// 	let self = this;
	// 	let toggledValue = !this.state.isActive;

	// 	if(self.state.isActive) {
	// 		self.setState({ isActive: toggledValue })
	// 	} else {
	// 		self.setState({ isActive: toggledValue })
	// 	}
	// }

	render() {
		return(
			<div className={"notification-box-positioner" + (this.state.isActive ? " active" : "") }>
				<div className={"notification-container"}>
					<div className="notifcation-box">
						<div className="close-notifications">
							{/*<svg viewPort="0 0 12 12" version="1.1"
							     xmlns="http://www.w3.org/2000/svg">
							    <line x1="1" y1="11" 
							          x2="11" y2="1" 
							          stroke="black" 
							          stroke-width="2"/>
							    <line x1="1" y1="1" 
							          x2="11" y2="11" 
							          stroke="black" 
							          stroke-width="2"/>
							</svg>*/}
						</div>
						<div className="notification-information">
							<div className="notification-information">new email</div>
							<div className="notification-icon">
								<IconSet.Folder	 />
								{/*<img src="http://via.placeholder.com/100x100" />*/}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <button onClick={() => this.refs.notification.fireNotification()}>HIT</button>
        <NotificationBox displayTime={2000} ref="notification" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
