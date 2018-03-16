import React from 'react';
import IconSet from './IconSet'
import style from 'styles/App.sass';
import Validator from './Validator'
import { CSSTransitionGroup } from 'react-transition-group'

function guid() {
	let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16) .substring(1);
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

class NotificationBox  extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isHovered: false
		}

		this.onClickNotification = this.onClickNotification.bind(this);
		this.setHoverState = this.setHoverState.bind(this);
	}

	onClickNotification(e) {
		e.preventDefault();
		this.props.onClick();
	}

	setHoverState(isHovered) {
		this.setState({ isHovered: isHovered })
	}

	destroy(event) {
		event.stopPropagation();
		this.props.destroy()
	}

	render() {
		let icon;
		switch(this.props.icon) {
			case 'Share':
				icon = <IconSet.Share />
				break;
			case 'person':
				icon = <IconSet.Person />
				break;
			case 'notification':
				icon = <IconSet.Notification />
				break;
			case 'check':
				icon = <IconSet.Check />
				break;
			case 'folder':
				icon = <IconSet.Folder />
				break;
			case 'ShoppingCart':
				icon = <IconSet.ShoppingCart />
				break;
			case 'alarm':
				icon = <IconSet.Alarm />
				break;
			case 'mail':
				icon = <IconSet.Mail />
				break;
			case 'attach-horz':
				icon = <IconSet.AttachmentHorizontal />
				break;
			case 'attach-vert':
				icon = <IconSet.AttchmentVerticle />
				break;
			default:
				icon = null
				break;
		}

		return(
			<div onClick={this.onClickNotification}
				onMouseEnter={() => this.setHoverState(true)}
				onMouseLeave={() => this.setHoverState(false)}>
				<div className={'notification-box'}>
					<table>
						<tbody>
							<tr>
								{icon &&
									<td className='left-box'>{icon}</td>
								}
								<td className='middle-box'>{this.props.text}</td>
								{this.props.showCloseButton == true &&
									<td className='right-box'>
										<div className='close-icon' onClick={(event) => this.destroy(event)}>
											<svg version='1.1' xmlns='http://www.w3.org/2000/svg'>
											    <line x1='1' y1='13' x2='13' y2='1' strokeWidth='4'/>
											    <line x1='1' y1='1' x2='13' y2='13' strokeWidth='4'/>
											</svg>
										</div>
									</td>
								}
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

class NotificationHandler extends React.Component {
	constructor(props) {
		super(props)

		this.state = { notifications: [] }

		this.pushNotification = this.pushNotification.bind(this);
		this.pushCustomNotification = this.pushCustomNotification.bind(this);
	}

	// Assign Default Properties
	static defaultProps = {
		position: 'bottom-right',
		addToEnd: false,
		enterAnimation: 'fade',
		leaveAnimation: 'fade',
        customIcon: null,
        icon: null
	}

	// Creates A notification and pushes it to the stack
  	pushNotification(key, message, icon, survivalTime, onClick, onClickObject, showClose) {
  		let keyToAssign = key ? key : guid();

  		if(typeof message != 'string' && message != undefined)
  			throw new TypeError('"message" must be of type string');

  		if((typeof icon != 'string') && icon != undefined)
			throw new TypeError('"icon" must be of type string');

  		if ((typeof survivalTime != 'number') && survivalTime != undefined)
			throw new TypeError('"survivalTime" must be of type number');

  		if ((typeof onClick != 'function') && onClick != undefined)
			throw new TypeError('"onClick" must be of type function');
		
		if ((typeof showClose != 'boolean') && showClose != undefined)
			throw new TypeError('"showClose" must be of type boolean');

  		if(!onClick) {
  			onClick = () => { }
  		}

  		let DOM = (
  			<div className={'notification-container'} key={keyToAssign}>
	  			<NotificationBox text={message}
	  					onClick={() => onClick(keyToAssign, onClickObject)}
	  					destroy={() => this.removeByKey(keyToAssign)}
	  					showCloseButton={showClose}
	  					icon={icon} />
	  		</div>
	  	)

  		// add new notification to stack
  		let updatedArray = this.state.notifications;
  		this.props.addToEnd == true ? updatedArray.push(DOM) : updatedArray.unshift(DOM)
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
  	pushCustomNotification(key, customComponent, survivalTime) {
  		let keyToAssign = key ? key : guid();

  		if(customComponent == undefined)
  			throw new Error('"customComponent" is required, but not passed in')

  		if ((!React.isValidElement(customComponent)) && customComponent != undefined)
			throw new TypeError('"customComponent" must be of type React Component');
		
		if ((typeof survivalTime != 'boolean') && survivalTime != undefined)
			throw new TypeError('"survivalTime" must be of type number');

  		let extendedComponent = React.cloneElement(customComponent, {
  			parentRef: this,
  			destory: () => this.removeByKey(keyToAssign),
  			notificationKey: keyToAssign
  		});

  		let DOM = (
  			<div className={'notification-container'} key={keyToAssign}>
  				{extendedComponent}
  			</div>
  		);

  		// Pushes the notification to the top or bottom depending on position
  		let updatedArray = this.state.notifications;
  		(this.props.addToEnd == true) ? updatedArray.push(DOM) : updatedArray.unshift(DOM)
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

  		if(targetKey == undefined)
  			throw new Error('"targetKey" is required, but not passed in')

  		this.state.notifications.forEach((item, idx) => {
  			if(item.key === targetKey.toString()) {
  				let currentNotifications = this.state.notifications
  				currentNotifications.splice(idx, 1)
  				this.setState({ notifications: currentNotifications })
  			}
  		})
  	}

  	removeByIndex(targetIdx) {

  		if(targetIdx == undefined)
  			throw new Error('"targetIdx" is required, but not passed in')

  		if ((typeof targetIdx == 'number') && targetIdx != undefined)
			throw new TypeError('"targetIdx" must be of type number');

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
		let positionClass;
		switch(this.props.position) {
			case 'top-left':
				positionClass = 'top-left';
				break;
			case 'top-right':
				positionClass = 'top-right';
				break;
			case 'bottom-left':
				positionClass = 'bottom-left';
				break;
			case 'bottom-right':
				positionClass = 'bottom-right';
				break;
			default:
				positionClass = 'bottom-right';
				break;
		}

		return(
			<div className={'notification-box-positioner ' + positionClass}>
				<CSSTransitionGroup
					transitionName={{
						enter: this.props.enterAnimation + '-enter',
						leave: this.props.leaveAnimation + '-leave',
						appear: this.props.enterAnimation + '-enter'
					}}
        			transitionLeave={true}
					transitionEnterTimeout={600}
					transitionLeaveTimeout={600} >
					{this.state.notifications}
				</CSSTransitionGroup>
			</div>
		)
	}
}

NotificationHandler.propTypes = Validator

export default NotificationHandler