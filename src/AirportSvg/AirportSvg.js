import React, { Component } from 'react';
import style from './AirportSvg.module.css';
const airports = require('airports')
import GameStore from '../stores/GameStore';
import PopoverSvg from '../PopoverSvg/PopoverSvg';
import config from '../config';

class AirportSvg extends Component {
  constructor(props) {
    super();
    this.airport = props.airport;
    this.state = {
      showContextMenu: false
    };
  }

  componentWillMount = () => {
  }

  componentWillUnmount = () => {
  }
  
  hideContextMenu = () => {
    document.removeEventListener('click', this.hideContextMenu);
    this.setState({ showContextMenu: false });
  }

  handleClick = e => {
    this.setState({ showContextMenu: true });
    e.stopPropagation();
    e.preventDefault();
  }

  addFlightOrigin = () => {
    GameStore.addFlightOrigin(this.airport);
  }

  addFlightDestination = () => {
    GameStore.addFlightDestination(this.airport);
  }

  contextMenu = () => {
    if (!this.state.showContextMenu) return;
    const contextMenuItems = [
      { text: 'begin flight', action: this.addFlightOrigin },
    ];
    if (GameStore.isCreatingNewFlight) contextMenuItems.push({
      text: 'add flight destination', action: this.addFlightDestination
    });
    document.addEventListener('click', this.hideContextMenu);
    return (<g>
      <PopoverSvg items={contextMenuItems} />
    </g>)
  }

  render() {
    return <g
      transform={`translate(${+this.airport.data.lon + 180} ${90 - +this.airport.data.lat})`}>
      <g onClick={this.handleClick}>
        <circle cx="0" cy="0" r="1" className={style.circle} />
        <text y="-1" x="0" className={style.text}>{this.airport.data.iata.toLowerCase()}</text>
      </g>
      {this.contextMenu()}
    </g>
  }
}

export default AirportSvg;
