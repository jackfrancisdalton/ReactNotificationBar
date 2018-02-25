require('normalize.css/normalize.css');
require('styles/App.sass');

import React from 'react';

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

		this.toggleShown = this.toggleShown.bind(this);
	}

	toggleShown() {
		let self = this;
		let toggledValue = !this.state.isActive;

		if(self.state.isActive) {
			self.setState({ isActive: toggledValue })
		} else {
			self.setState({ isActive: toggledValue })
		}
	}

	render() {
		return(
			<div className={"notification-box-positioner" + (this.state.isActive ? " active" : "") }>
				<div className={"notification-container"}>
					<div className="notifcation-box">
						<div className="close-notifications" onClick={this.toggleShown}>X</div>
						<div className="notification-information">
							<div className="notification-icon">
								<img src="http://via.placeholder.com/100x100" />
							</div>
							<div className="notification-information">new email</div>
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
        <button onClick={() => this.refs.notification.toggleShown()}>HIT</button>
        <NotificationBox ref="notification" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
