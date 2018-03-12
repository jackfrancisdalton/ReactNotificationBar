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
			<div key={guid()} className={"notification-container"}>
				<div className={"notifcation-box "}>
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

let counter = 0

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
	}

  	generateNotification(text, survivalTime, triggerFunction) {
  		let self = this;
  		let updatedArray = this.state.notifications;
  		let newElementKey = guid();

  		if(this.props.position == "top-right") {
	  		updatedArray.push(<NotificationBox text={counter} key={newElementKey}/>)
  		} else {
	  		updatedArray.unshift(<NotificationBox text={counter} key={newElementKey}/>)
  		}

  		//Remove Notification DOM
  		// setTimeout(function() {
	  	// 	self.state.notifications.forEach(function(item, idx) {
  		// 		if(item.key == newElementKey) {
  		// 			let currentNotifications = self.state.notifications;

				// 	currentNotifications.splice(idx, 1);
				// 	self.setState({ notifications: currentNotifications })
  		// 		}
  		// 	})
  		// }, 3000);

  		this.setState({ notifications: updatedArray })
  		counter += 1;
  	}

  	deleteNotification() {
  		let updatedArray = this.state.notifications.slice();
		updatedArray.splice(0, 1)
  		this.setState({	notifications: updatedArray })
  	}

	componentWillReceiveProps(newProps, oldProps) {
		console.log("props: ", oldProps)
		console.log("newprops: ", newProps)
		// for(var i = 0; i < arrayOne.length; i++) {
		// 	if(arrayTwo.indexOf(arrayOne[i])==-1) {
		// 		doNotMatch.push(arrayOne[i]);
		// 	}
		// }
	}

	render() {
		let displayedNotifications = this.state.notifications;

		let positionClass;

		switch(this.props.position) {
			case "top-left":
				positionClass = "top-left";
				break;
			case "top-right":
				positionClass = "top-right";
				break;
			case "bottom-left":
				positionClass = "bottom-left";
				break;
			case "bottom-left":
				positionClass = "bottom-right";
				break;
			default: 
				positionClass = "bottom-right";
				break;
		}

		return(
			<div className={"notification-box-positioner " + positionClass}>
				<CSSTransitionGroup
					transitionName="fade"
					transitionAppear={true}
        			transitionLeave={true}
        			transitionAppearTimeout={200}
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}>
					{displayedNotifications}
				</CSSTransitionGroup>
			</div>
		)
	}
}

class AppComponent extends React.Component {
  constructor(props){
  	super(props)

  	this.state = {
  		testGroup: []
  	}

  	this.addNotification = this.addNotification.bind(this);
  	this.deleteNotification = this.deleteNotification.bind(this);
  }

  deleteNotification() {
  	this.refs.notificationContainer.deleteNotification();
  }

  addNotification() {
  	this.refs.notificationContainer.generateNotification("BOBOBOB");
  }

  render() {
    return (
      <div className="index">
        <button onClick={this.addNotification}>add</button>
        <button onClick={this.deleteNotification}>delete</button>
        <NotificationContainer ref="notificationContainer" position={"top-right"} />       
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
