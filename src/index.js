import React, { Component } from 'react'
import App from './App';
import styles from './index.module.css'

export default class Tropria extends Component {

  render() {
    return (
      <div className={styles.root}>
        <App />
      </div>
    )
  }
}