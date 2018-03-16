import React from 'react';
import normalize from 'normalize.css/normalize.css'
import NotificationHandler from './components/NotificationHandler.jsx'

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

    this.deleteThis = this.deleteThis.bind(this);
    this.alertNotificationKey = this.alertNotificationKey.bind(this);
    this.printNumberOfNotifcations = this.printNumberOfNotifcations.bind(this);
	}

  deleteThis() {
    this.props.destory();
  }

  alertNotificationKey() {
    alert(this.props.notificationKey);
  }

  printNumberOfNotifcations() {
    alert(this.props.parentRef.state.notifications.length)
  }

	render() {

		return (
			<div className={"notification-container"}>
				<h3>Custom Notification Wahoo!</h3>
        <button onClick={this.alertNotificationKey}>show key</button>
        <button onClick={this.deleteThis}>delete this</button>
        <button onClick={this.printNumberOfNotifcations}>show notification count</button>
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
  	let onClickFunc = (key, obj) =>  console.log("passed information:" + obj.data)
  	this.refs.notificationContainer.pushNotification(guid(), 'my custom notification', null , null, onClickFunc, {data: "TEST"}, true);
  }

  addCustomNotification() {
  	this.refs.notificationContainer.pushCustomNotification(guid(), <CustomNotificationBox />, null);
  }

  render() {
    return (
      <div className="index">
        <button onClick={this.addNotification}>add</button>
        <button onClick={this.addCustomNotification}>add custom</button>
        <button onClick={this.deleteNotification}>delete</button>
        <NotificationHandler 
        		ref="notificationContainer"
        		addToEnd={true}
        		enterAnimation={"slide-right"}
        		exitAnimation={"fade"} 
        		position={"bottom-lefsdft"}/>       
      </div>
    );
  }
}

export default AppComponent;
