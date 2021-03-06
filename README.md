# React Notification Handler
Notification pop-ups are becoming an increasingly common feature in modern websites. This package supplies a framework for handling common notification functionality, whilst allowing your application to specific functionality/DOM/styling by injecting components. 

What does `React Notification Handler` give you :
* Notification timeouts
* Notification enter and exit animations 
* Notification stacking
* Notification positioning

Additionally this package also comes with a configurable out-of-box notification-box componenet for the case that your application does not require a custom notification box.

Installation: 

```
npm install react-notification-handler --save
```

Import:

```
import NotificationHandler from 'react-notification-handler'
```

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
`React Notification Handler` contains a multitude of functions to integrate it with your react application. These functions should be accessed through a `ref` value placed on the notification handler (this can be seen in the example below).

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
| **survivalTime** | *Number* | The time(milliseconds) before the notification is removed (will remain indefinitely if null) |

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


## Implementation
```javascript
import React from 'react';
import NotificationHandler from 'react-notification-handler'

// An arbitrary function for generating unique keys for notifications
function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


// Custom notification component class
class CustomNotificationBox extends React.Component {
	constructor(props) {
		super(props);

		this.deleteThis = this.deleteThis.bind(this);
		this.alertNotificationKey = this.alertNotificationKey.bind(this);
		this.printNumberOfNotifcations = this.printNumberOfNotifcations.bind(this);
	}

	deleteThis() {
		//this.props.destroy is automatically appended as a property 
		this.props.destory();
	}

	alertNotificationKey() {
		//this.props.notificationKey is automatically appended as a property 
		alert(this.props.notificationKey);
	}

	printNumberOfNotifcations() {
		//this.props.parentRef is automatically appended as a property 
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

// An example application, demonstraiting how to integrate NotificationHandler
class YourApplication extends React.Component {
	constructor(props){
		super(props)

		this.addNotification = this.addNotification.bind(this);
		this.addCustomNotification = this.addCustomNotification.bind(this);
		this.deleteNotification = this.deleteNotification.bind(this);
	}

	deleteNotification() {
		// Removes the notification at the end of the stack
		this.refs.notificationHandler.removeFromEnd();
	}


	addNotification() {
		// onClick function prints the "onClickObject" using alert  
		let onClickFunc = (key, obj) => alert("notification click with data: " + obj.data)

		// Adds a new generic notification to the stack with a 10 second timeout
		this.refs.notificationHandler.pushNotification(guid(), "generic notification message", "mail" , 10000, onClickFunc, { data: "example value" }, true);
	}

	addCustomNotification() {
		// Add custom notification to the stack that does not timeout
		this.refs.notificationHandler.pushCustomNotification(guid(), <CustomNotificationBox customMessage={"HELLO"}/>, null);
	}

	render() {
		return (
			<div>
				<h1> Welcome to my fancy website! </h1>
				<button onClick={this.addNotification}>add generic</button>
				<button onClick={this.addCustomNotification}>add custom</button>
				<button onClick={this.deleteNotification}>delete last</button>
				
				<NotificationHandler 
					ref="notificationHandler"
					position={"bottom-right"}
					addToEnd={true}
					enterAnimation={"slide-right"}
					exitAnimation={"fade"} />       
			</div>
		);
	}
}
```
