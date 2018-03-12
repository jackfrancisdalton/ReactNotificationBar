require('normalize.css/normalize.css');
require('styles/App.sass');

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
			<div className={"notification-container"}>
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
			<div className={"notification-container"}>
				<div className={"notification-box "}>
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

		// max number of notifications
		// position 
		// notification enttry method

		this.state = {
			notifications: [],
		}

		this.generateNotification = this.generateNotification.bind(this);
		this.addCustomNotification = this.addCustomNotification.bind(this);
	}


	static defaultProps = {
		position: "top-right",
		animation: "slide-right",
		addTo: "top",
	}

  	generateNotification(key, message, survivalTime, triggerFunction) {
  		let self = this;
  		let updatedArray = this.state.notifications;

  		if(this.props.position == "top-right") {
	  		updatedArray.push(<NotificationBox text={message} key={key}/>)
  		} else {
	  		updatedArray.unshift(<NotificationBox text={message} key={key}/>)
  		}

  		//Remove Notification DOM
  		if(survivalTime){
  			setTimeout(function() {
		  		self.state.notifications.forEach(function(item, idx) {
	  				if(item.key == key) {
	  					let currentNotifications = self.state.notifications;
						currentNotifications.splice(idx, 1);
						self.setState({ notifications: currentNotifications })
	  				}
	  			})
	  		}, survivalTime);
  		}
  		

  		this.setState({ notifications: updatedArray })
  	}

  	addCustomNotification(customComponent, key, survivalTime) {
		let self = this;
  		let updatedArray = this.state.notifications;
  		let keyToAssign = key;

  		if(!keyToAssign) 
  			keyToAssign = guid() 

  		let customCompWithKey = React.cloneElement(
			customComponent, 
			{ key: keyToAssign}
		);

  		if(this.props.position == "top-right")
	  		updatedArray.push(customCompWithKey)
  		else
	  		updatedArray.unshift(customCompWithKey)

  		//Remove Notification DOM
  		// if(survivalTime) {
  		// 	setTimeout(function() {
		  // 		self.state.notifications.forEach(function(item, idx) {
	  	// 			if(item.key == key) {
	  	// 				let currentNotifications = self.state.notifications;
				// 		currentNotifications.splice(idx, 1);
				// 		self.setState({ notifications: currentNotifications })
	  	// 			}
	  	// 		})
	  	// 	}, survivalTime);
  		// }

  		this.setState({ notifications: updatedArray })
  	}

  	removeByKey(targetKey) {
  		this.state.notifications.forEach(function(item, idx) {
  			if(item.key === targetKey) {
  				
  				let currentNotifications = this.state.notifications
  				currentNotifications.splice(idx, 1)

  				this.setState({
  					notifications: currentNotifications
  				})
  			}
  		})
  	}



	render() {
		return(
			<div className={"notification-box-positioner " + this.props.position}>
				<CSSTransitionGroup
					transitionName={this.props.animation}
					transitionAppear={true}
        			transitionLeave={true}
        			transitionAppearTimeout={100}
					transitionEnterTimeout={400}
					transitionLeaveTimeout={2000}>
					{this.state.notifications}
				</CSSTransitionGroup>
			</div>
		)
	}
}

class AppComponent extends React.Component {
  constructor(props){
  	super(props)

  	this.addNotification = this.addNotification.bind(this);
  	this.addCustomNotification = this.addCustomNotification.bind(this);
  	this.deleteNotification = this.deleteNotification.bind(this);
  }

  deleteNotification() {
  	this.refs.notificationContainer.deleteNotification();
  }

  addNotification() {
  	this.refs.notificationContainer.generateNotification(guid(), "Hey man how is it going", 8000, null);
  }

  addCustomNotification() {
  	this.refs.notificationContainer.addCustomNotification(<CustomNotificationBox />, guid(), 3000);
  }

  render() {
    return (
      <div className="index">
        <button onClick={this.addNotification}>add</button>
        <button onClick={this.addCustomNotification}>add custom</button>
        <button onClick={this.deleteNotification}>delete</button>
        <NotificationContainer ref="notificationContainer"  />       
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
