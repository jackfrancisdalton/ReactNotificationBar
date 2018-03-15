# React Notification Handler
this package is designed to acheive two goals 
- supply a quick out of the box notification solution 
- supply a framework for notifications that allows complete customisability
- animations built in
- configurable onClick functions 
- Time outs  
- injectable dom 
- support for notification stacking

## Properties 
No properties are required.

| Property | Type | Description |
| -------- | ---- | ----------- |
| position | String | determins where the notifications will be displayed |
| addToEnd | Boolean | if true notifications will be added to the end of the stack |
| enterAnimation | String | defines how the notification will animate in |
| leaveAnimation | String | defines how the notification will animate out |

### Valid property values
* position - `top-left`, `top-right`, `bottom-left`, `bottom-right`
* enterAnimation - `fade`, `pop`, `slide-top`, `slide-right`, `slide-bottom`, `slide-left`
* exitAnimation - `fade`, `pop`, `slide-top`, `slide-right`, `slide-bottom`, `slide-left`

### Default values
```javascript
{
	position: "bottom-right",
	addToEnd: false,		
	enterAnimation: "fade",		
	leaveAnimation: "fade",
    customIcon: null,
    icon: null,
}
```

## Functions 
In order to interact with the notification container several functions can be acessed through the reference of the component.

### pushNotification
Adds a notification to the current stack
Structure: `pushNotification(key, message, icon, survivalTime, onClick, onClickObject, showCloseButton)`

| Property | Type | Description |
| -------- | ---- | ----------- |
| *key* | **Any** | a unique key for targeting the notification (will be set to a guid if not supplied) |
| *message* | **String** | The text to be displayed in the notification |
| *icon* | **String** |  The notification to be displayed (valid values : `share`, `person`, `notification`, `check`, `folder`, `shoppingCart`, `alarm`, `mail`, `attach-horz`, `attach-vert`) |
| *survivaTime* | **Number** | The time(milliseconds) before the notification is removed (will remain indefinitely if null) |
| *onClick* | **function** | Callback function for when the notification is clicked. The function is supplied with the notification `key` and `onClickObject` so should be formatted as such `function(key, onClickObject)`  |
| *onClickObject* | **Object** | An object that is supplied to the onClick function |
| *showCloseButton* | **boolean** | Displays a close button that destories the notification |


### pushCustomNotification
Structure: `pushCustomNotification(key, customComponent, survivalTime, onClick, onClickObject)`

| Property | Type | Description |
| -------- | ---- | ----------- |
| *key* | **Any** | a unique key for targeting the notification (will be set to a guid if not supplied) |
| *customComponent* | **Component** | A custom React component to be injected as the notifications DOM |
| *survivaTime* | **Number** | The time(milliseconds) before the notification is removed (will remain indefinitely if null) |

### removeByKey
Structure: `removeByKey(targetKey)`
Animaites out and destroys the notification based on the key supplied.

### removeByIndex
Structure: `removeByIndex(targetIdx)`
Animaites out and destroys the notification based on the index in the notification stack.

### removeFromEnd
Structure: `removeFromEnd()`
Animaites out and destroys the notification at the end of the notification stack.

### removeFromFront
Structure: `removeFromFront()`
Animaites out and destroys the notification at the front of the notification stack.

### getNotifications
Structure: `getNotifications()`
Returns a copy of the current notification stack.


## Implemntation
```javascript
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
			<div className={"notification-container"} style={{ padding: "50px", display: "block", background: "blue" }}>
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
  	// let onClickFunc = (key, obj) =>  this.refs.notificationContainer.removeByKey(key)
  	let onClickFunc = (key, obj) =>  console.log("BOB")
  	this.refs.notificationContainer.pushNotification(guid(), "Hey man how is spask sdfsdf sdfsdf sdfsdf sdfsdf sdfd ask", null , null, onClickFunc, {data: "TEST"}, true);
  }

  addCustomNotification() {
  	let onClickFunc = (key, obj ) => this.refs.notificationContainer.removeByKey(key)
  	this.refs.notificationContainer.pushCustomNotification(guid(), <CustomNotificationBox />, null, onClickFunc, { data: "TEST"});
  }

  render() {
    return (
      <div className="index">
        <button onClick={this.addNotification}>add</button>
        <button onClick={this.addCustomNotification}>add custom</button>
        <button onClick={this.deleteNotification}>delete</button>
        <NotificationContainer 
        		ref="notificationContainer"
        		addToEnd={true}
        		enterAnimation={"slide-right"}
        		exitAnimation={"fade"} 
        		position={"bottom-lefsdft"}/>       
      </div>
    );
  }
}
```
