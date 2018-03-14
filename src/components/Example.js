import normalize from 'normalize.css/normalize.css';
import style from 'styles/App.sass';
import React from 'react';
import { NotificationContainer } from './NotificationContainer.jsx'

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
  	let onClickFunc = (key, obj) => {
  		console.log("PRINT: ", obj)
  		this.refs.notificationContainer.removeByKey(key)
  	}

  	this.refs.notificationContainer.generateNotification(guid(), "Hey man how is it going", "check", null, onClickFunc, {data: "TEST"});
  }

  addCustomNotification() {
  	let onClickFunc = (key, obj ) => {
  		console.log("PRINT: ", obj)
  		this.refs.notificationContainer.removeByKey(key)
  	}

  	this.refs.notificationContainer.addCustomNotification(guid(), <CustomNotificationBox />, null, onClickFunc, { data: "TEST"});
  }

  render() {
    return (
      <div className="index">
        <button onClick={this.addNotification}>add</button>
        <button onClick={this.addCustomNotification}>add custom</button>
        <button onClick={this.deleteNotification}>delete</button>
        <NotificationContainer 
        		ref="notificationContainer"
        		enterAnimation={"slide-right"} 
        		position={"top-right"}/>       
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
