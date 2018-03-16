# React Notification Handler
Notification pop-ups are becoming an increasingly common feature in modern websites. This package aims to supply a framework for handling common notification functionality, whilst not limiting specific functionality/DOM/styling your implementation requires. 

What does `React Notification Handler` give you :
* Notification timeouts
* Notification enter and exit animations 
* Multiple notification stacks
* Responsive support
* Notification positioning

Additionally this package also comes with a configurable out-of-box notification-box componenet for the case that your application does not require a custom notification box.

## Properties 
| Property | Type | Description |
| -------- | ---- | ----------- |
| **position** | *String* | Determins which corner notifications will be displayed |
| **addToEnd** | *Boolean* | If `true` notifications will be added to the end of the notification stack |
| **enterAnimation** | *String* | Specifies how notifications will animate in |
| **leaveAnimation** | *String* | Specifies how notifications will animate out |

Property options: 
* `position` : `top-left`, `top-right`, `bottom-left`, `bottom-right`
* `enterAnimation` : `fade`, `pop`, `slide-top`, `slide-right`, `slide-bottom`, `slide-left`
* `exitAnimation` : `fade`, `pop`, `slide-top`, `slide-right`, `slide-bottom`, `slide-left`

### Default Property Values
```javascript
{
	position: "bottom-right",
	addToEnd: false,
	enterAnimation: "fade",
	leaveAnimation: "fade"
}
```

## Functions 
`React Notification Handler` contains a multitude of functions to integrate it with your react application.

### pushNotification
Generates and push an out-of-box notification box based on the properties passed into the function.

Function arguments: `pushNotification(key, message, icon, survivalTime, onClick, onClickObject, showCloseButton)`

| Property | Type | Description |
| -------- | ---- | ----------- |
| **key** | *Any* | A unique key for referencing the notification (a random guid will be used if no key is supplied) |
| **message** | *String* | The text to be displayed in the notification |
| **icon** | *String* |  The notification to be displayed (valid options : `share`, `person`, `notification`, `check`, `folder`, `shoppingCart`, `alarm`, `mail`, `attach-horz`, `attach-vert`) |
| **survivaTime** | *Number* | The time(milliseconds) before the notification is removed (notification will remain indefinitely if null) |
| **onClick** | *function* | Callback function for when the notification is clicked. The function is supplied with the notification `key` and `onClickObject` so should be formatted as such `function(key, onClickObject)`  |
| **onClickObject** | *Object* | An object that is supplied to the onClick function |
| **showCloseButton** | *boolean* | Displays a close button that destories the notification |


### pushCustomNotification
Adds a custom notification box to the stack based on your injected React componenet.

Function arguments: `pushCustomNotification(key, customComponent, survivalTime)`

| Property | Type | Description |
| -------- | ---- | ----------- |
| **key** | *Any* | a unique key for targeting the notification (will be set to a guid if not supplied) |
| **customComponent** | *Component* | A custom React component to be injected as the notifications pop-up DOM |
| **survivaTime** | *Number* | The time(milliseconds) before the notification is removed (will remain indefinitely if null) |

As flexability is the aim of injecting custom components, `React Notification Handler` automatically appendeds 3 properties to your component:
* `parentRef` : `this` value from `React Notification Handler` exposing all props/state/functions.
* `destory` : A function that takes no arguments and destroys the specific notification when called.  
* `notificationKey` : The key assigned to your custom notification.

### removeByKey
Animates out and then destroys the notification based on the key supplied.

Function arguments: `removeByKey(targetKey)`

### removeByIndex
Animates out and then destroys the notification based on the index in the notification stack.

Function arguments: `removeByIndex(targetIdx)`

### removeFromEnd
Animates out and then destroys the notification at the end of the stack.

Function arguments: `removeFromEnd()`

### removeFromFront
Animates out and then destroys the notification at the start of the stack.

Function arguments: `removeFromFront()`

### getNotifications
Returns a copy of the current notification stack.

Function arguments: `getNotifications()`


## Implemntation
```javascript
import React from 'react';
import { NotificationContainer } from 'NotificationContainer'

// Function for generating unique keys for notifications
function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


// Custom notification component class
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

class YourApplication extends React.Component {
	constructor(props){
		super(props)

		this.addNotification = this.addNotification.bind(this);
		this.addCustomNotification = this.addCustomNotification.bind(this);
	}

	addNotification() {
		// onClick function prints the "onClickObject" using alert  
		let onClickFunc = (key, obj) => alert("notification click with data: " + obj.data)

		// Adds a new generic notification to the stack with a 10 second timeout
		this.refs.notificationContainer.pushNotification(guid(), "generic notification", "mail" , 10000, onClickFunc, { data: "example value" }, true);
	}

	addCustomNotification() {
		// Add custom notification to the stack that does not timeout
		this.refs.notificationContainer.pushCustomNotification(guid(), <CustomNotificationBox customMessage={"HELLO"}/>, null);
	}

	render() {
		return (
			<div>
				<h1> Welcome to my fancy website! </h1>
				<button onClick={this.addNotification}>add</button>
				<button onClick={this.addCustomNotification}>add custom</button>

				<NotificationContainer 
					ref="notificationContainer"
					position={"bottom-right"}
					addToEnd={true}
					enterAnimation={"slide-right"}
					exitAnimation={"fade"} />       
			</div>
		);
	}
}
```
