import React, { Component } from 'react';
import style from './PlaneRouteSvg.module.css';
const airports = require('airports')
console.log(airports);
import { getPointsBetweenPath, getPathBetweenPoints } from '../helpers';

const airportsById = Object.assign(...airports.map(x => ({ [x.iata]: x })));

class PlaneRouteSvg extends Component {
  constructor(props) {
    super();
  }

  componentWillMount() {
    this.setPath();
  }

  setPath() {
    const { origin, dest } = this.props;
    const originAp = origin.data;
    const destAp = dest.data;
    const origLL = { latitude: +originAp.lat, longitude: +originAp.lon };
    const destLL = { latitude: +destAp.lat, longitude: +destAp.lon };
    const points = getPointsBetweenPath(origLL, destLL);
    const path = getPathBetweenPoints(points);
    this.setState({ path, points, originAp, destAp, origLL, destLL });
  }

  render() {
    const mid = this.state.points[Math.floor(this.state.path.length / 2)];
    const { path, originAp, destAp } = this.state;
    return (
      <g>
        <g>
          {path.map(({ prev, next }, key) => (
            <line className={style.line} 
              key={key}
              x1={prev.longitude + 180}
              y1={90 - prev.latitude}
              x2={next.longitude + 180}
              y2={90 - next.latitude} />
          ))}
        </g>
        <text className={style.text} x={ mid.longitude + 180}
            y={90 - mid.latitude - 1}>{
                originAp.iata.toLowerCase()} - {destAp.iata.toLowerCase()}</text>
      </g>
    );
  }
}

export default PlaneRouteSvg;
