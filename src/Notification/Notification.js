import React, { Component } from 'react';
import style from './Notification.module.css';
const airports = require('airports')
import PropTypes from 'prop-types';

class Notification extends Component {
  // constructor() {
  //   super();
  // }

  render() {
    return (
      <div className={style.cover}>
        <div className={style.notification}>
          <div className={style.title}>{this.props.title}</div>
          <div className={style.message}>{this.props.message}</div>
          <button onClick={this.props.onFinish} className={style.button}>{this.props.buttonText || 'ok'}</button>
        </div>
      </div>
    );
  }
}

Notification.propTypes = {
  title: PropTypes.node,
  message: PropTypes.node,
  buttonText: PropTypes.node,
  onFinish: PropTypes.func
}

export default Notification;
