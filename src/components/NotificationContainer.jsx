import React from 'react';
import IconSet from './IconSet'
import { CSSTransitionGroup } from 'react-transition-group'

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

		this.onClickNotification = this.onClickNotification.bind(this);
	}

	onClickNotification(value) {
		this.props.onClick();
	}

	render() {
		let icon;

		switch(this.props.icon) {
			case "Share":
				icon = <IconSet.Share />
				break;
			case "person":
				icon = <IconSet.Person />
				break;
			case "notification":
				icon = <IconSet.Notification />
				break;
			case "check":
				icon = <IconSet.Check />
				break;
			case "folder":
				icon = <IconSet.Folder />
				break;
			case "ShoppingCart":
				icon = <IconSet.ShoppingCart />
				break;
			case "alarm":
				icon = <IconSet.Alarm />
				break;
			case "mail":
				icon = <IconSet.Mail />
				break;
			case "attach-horz":
				icon = <IconSet.AttachmentHorizontal />
				break;
			case "attach-vert":
				icon = <IconSet.AttchmentVerticle />
				break;
			default: 
				icon = <IconSet.Notification />
				break;
		}

		return (
			<div onClick={() => this.onClickNotification()}>
				<div className={"notification-box"}>
					<table>
						<tr>
							<td className="left-box">{this.props.text}</td>
							<td className="middle-box">{icon}</td>
							{/*<td className="right-box">
								<svg viewPort="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
								    <line x1="1" y1="11"
								          x2="11" y2="1"
								          stroke="black"
								          stroke-width="2"/>
								    <line x1="1" y1="1"
								          x2="11" y2="11"
								          stroke="black"
								          stroke-width="2"/>
								</svg>
							</td>*/}
						</tr>
					</table>
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

        customIcon: null,
        icon: null,
	}

	// Creates A notification and pushes it to the stack
  	generateNotification(key, message, icon, survivalTime, onClick, onClickObject) {
  		let updatedArray = this.state.notifications;
  		let keyToAssign = key ? key : guid();
  		if(!onClick) {
  			onClick = function() {}
  		}

  		let DOM = (
  			<div className={"notification-container"} key={keyToAssign}>
	  			<NotificationBox text={message} onClick={() => onClick(keyToAssign, onClickObject)} icon={icon} />
	  		</div>
	  	)

  		// add new notification to stack
  		this.props.reverseAppenedOrder == true ? updatedArray.push(DOM) : updatedArray.unshift(DOM)
  		this.setState({ notifications: updatedArray })

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
  	}

	// Creates A custom notification and pushes it to the stack
  	addCustomNotification(key, customComponent, survivalTime, onClick, onClickObject) {
  		let updatedArray = this.state.notifications;
  		let keyToAssign = key ? key : guid();
  		if(!onClick) {
  			onClick = function() {}
  		}

  		let DOM = (
  			<div className={"notification-container"} onClick={() => onClick(keyToAssign, onClickObject)} key={keyToAssign}>
  				{customComponent}
  			</div>
  		);

  		// Pushes the notification to the top or bottom depending on position
  		(this.props.reverseAppenedOrder == true) ? updatedArray.push(DOM) : updatedArray.unshift(DOM)	  		
  		this.setState({ notifications: updatedArray })

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
  		return this.state.notifications
  	}

	render() {
		return(
			<div className={"notification-box-positioner " + this.props.position}>
				<CSSTransitionGroup
					transitionName={{ 
						enter: this.props.enterAnimation + "-enter",
						leave: this.props.leaveAnimation + "-leave",
						appear: this.props.enterAnimation + "-enter"
					}}
        			transitionLeave={true}
					transitionEnterTimeout={this.props.enterAnimationTime}
					transitionLeaveTimeout={this.props.leaveAnimationTime} >
					{this.state.notifications}
				</CSSTransitionGroup>
			</div>
		)
	}
}

export { NotificationContainer }