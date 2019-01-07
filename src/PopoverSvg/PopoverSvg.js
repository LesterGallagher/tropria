import React, { Component } from 'react';
import style from './PopoverSvg.module.css';
const airports = require('airports')
import PropTypes from 'prop-types';
import config from '../config';

const width = config.popoverWidth
const height = config.popoverHeight;

class PopoverSvg extends Component {
  // constructor() {
  //   super();
  // }

  render() {
    return (<g>{this.props.items.map((item, i) => (
      <g key={i} onClick={item.action} transform={`translate(0 ${i * height})`}>
        <rect className={style.item} width={width} height={height}>
        </rect>
        <text className={style.text} x="2" y="6">{item.text}</text>
      </g>)
    )}</g>);
  }
}

PopoverSvg.propTypes = {
  items: PropTypes.array,
}

export default PopoverSvg;
