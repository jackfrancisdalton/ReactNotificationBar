import normalize from 'normalize.css/normalize.css';
import style from 'styles/App.sass';

import { CSSTransitionGroup } from 'react-transition-group'
import React from 'react';
import IconSet from './IconSet'

let yeomanImage = require('../images/yeoman.png');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}



class CustomNotificationBox  extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isActive: false,
			isVisible: false,
			textContent: "content",
		}
	}

	render() {

		return (
			<div className={"notification-container"} style={{ display: "block", background: "blue" }}>
				<div>BOB</div>
			</div>
		);
	}
}

class NotificationBox  extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isActive: false,
			isVisible: false,
			textContent: "content",
		}

		// this.fireNotification = this.fireNotification.bind(this);

	}

	render() {
		return (
			<div>
				<div className={"notification-box"}>
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
						<div className="notification-information">{this.props.text}</div>
						<div className="notification-icon">
							<IconSet.Mail />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class NotificationContainer extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			notifications: [],
		}

		this.generateNotification = this.generateNotification.bind(this);
		this.addCustomNotification = this.addCustomNotification.bind(this);
	}


	// Assign Default Properties
	static defaultProps = {
		position: "bottom-right",
		reverseAppenedOrder: false,
		
		enterAnimation: "fade",
        enterAnimationTime: 1000,
		
		leaveAnimation: "fade",
        leaveAnimationTime: 1000,
	}


	// Creates A notification and pushes it to the stack
  	generateNotification(key, message, onClick, survivalTime) {
  		let updatedArray = this.state.notifications;
  		let keyToAssign = key ? key : guid();
  		let DOM = <div className={"notification-container"} key={keyToAssign}><NotificationBox text={message} onClick={this.onClick} /></div>

  		// add new notification to stack
  		if(this.props.reverseAppenedOrder == true) {
	  		updatedArray.push(DOM)
  		} else {
	  		updatedArray.unshift(DOM)
  		}

  		// Initialise timeout for removing notification if surivival time is supplied
  		if(survivalTime){
  			setTimeout(() => {
		  		this.state.notifications.forEach((item, idx) => {
	  				if(item.key == key) {
	  					let currentNotifications = this.state.notifications;
						currentNotifications.splice(idx, 1);
						this.setState({ notifications: currentNotifications })
	  				}
	  			})
	  		}, survivalTime);
  		}

  		this.setState({ notifications: updatedArray })
  	}

	// Creates A custom notification and pushes it to the stack
  	addCustomNotification(key, customComponent, survivalTime) {
  		let updatedArray = this.state.notifications;
  		let keyToAssign = key ? key : guid();
  		let DOM = <div className={"notification-container"} key={keyToAssign}>{customComponent}</div>

  		// Pushes the notification to the top or bottom depending on position
  		if(this.props.reverseAppenedOrder == true) {
	  		updatedArray.push(DOM)
  		} else {
	  		updatedArray.unshift(DOM)
  		}

  		// Initialise timeout for removing notification if surivival time is supplied
  		if(survivalTime) {
  			setTimeout(() => {
		  		this.state.notifications.forEach((item, idx) => {
	  				if(item.key == key) {
	  					let currentNotifications = this.state.notifications;
						currentNotifications.splice(idx, 1);
						this.setState({ notifications: currentNotifications })
	  				}
	  			})
	  		}, survivalTime);
  		}

  		this.setState({ notifications: updatedArray })
  	}

  	removeByKey(targetKey) {
  		this.state.notifications.forEach((item, idx) => {
  			if(item.key === targetKey.toString()) {
  				let currentNotifications = this.state.notifications
  				currentNotifications.splice(idx, 1)
  				this.setState({ notifications: currentNotifications })
  			}
  		})
  	}

  	removeByIndex(targetIdx) {
  		this.state.notifications.forEach((item, idx) => {
  			if(idx === targetIdx) {
  				let currentNotifications = this.state.notifications
  				currentNotifications.splice(idx, 1)
  				this.setState({ notifications: currentNotifications })
  			}
  		})
  	}

  	removeFromEnd() {
  		let currentNotifications = this.state.notifications
		currentNotifications.splice((this.state.notifications.length - 1), 1)
		this.setState({ notifications: currentNotifications })
  	}

  	removeFromFront() {
		let currentNotifications = this.state.notifications
		currentNotifications.splice(0, 1)
		this.setState({ notifications: currentNotifications })
  	}

  	getNotifications() {
  		return this.state.notifications.length
  	}

	render() {
		let enterAnimation = this.props.enterAnimation
		let leaveAnimation = this.props.leaveAnimation

		return(
			<div className={"notification-box-positioner " + this.props.position}>
				<CSSTransitionGroup
					transitionName={ { 
						enter: enterAnimation + "-enter",
						leave: leaveAnimation + "-leave",
						appear: enterAnimation + "-enter"
					} }
        			transitionLeave={true}
					transitionEnterTimeout={this.props.enterAnimationTime}
					transitionLeaveTimeout={this.props.leaveAnimationTime}>
					{this.state.notifications}
				</CSSTransitionGroup>
			</div>
		)
	}
}

let counter = 0;

class AppComponent extends React.Component {
  constructor(props){
  	super(props)

  	this.addNotification = this.addNotification.bind(this);
  	this.addCustomNotification = this.addCustomNotification.bind(this);
  	this.deleteNotification = this.deleteNotification.bind(this);
  }

  deleteNotification() {
  	this.refs.notificationContainer.removeFromEnd();
  }

  addNotification() {
  	// this.refs.notificationContainer.generateNotification(guid(), "Hey man how is it going", null, null);
  	this.refs.notificationContainer.generateNotification(counter, "Hey man how is it going", null, null);
  	counter++;
  }

  addCustomNotification() {
  	this.refs.notificationContainer.addCustomNotification(guid(), <CustomNotificationBox />, null);
  }

  render() {
    return (
      <div className="index">
        <button onClick={this.addNotification}>add</button>
        <button onClick={this.addCustomNotification}>add custom</button>
        <button onClick={this.deleteNotification}>delete</button>
        <NotificationContainer ref="notificationContainer" />       
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
