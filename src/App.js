import React, { Component } from 'react';
import logo from './logo.svg';
import style from './App.module.css';
import worldMap from './world-map.svg';
import PlaneRouteSvg from './PlaneRouteSvg/PlaneRouteSvg';
import AirportSvg from './AirportSvg/AirportSvg';
import Notification from './Notification/Notification';
import GameStore from './stores/GameStore';
const airports = require('airports')
import { meterFormat } from './helpers';

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      airports: GameStore.airports,
      routes: GameStore.routes,
      airplanes: GameStore.airplanes,
      paused: GameStore.paused
    };
  }

  componentWillMount = () => {
    GameStore.on('change', this.handleGameStoreChange);
  }

  componentWillUnmount = () => {
    GameStore.removeListener('change', this.handleGameStoreChange);
  }

  handleGameStoreChange = () => {
    this.setState({
      airports: GameStore.airports,
      routes: GameStore.routes,
      airplanes: GameStore.airplanes,
      paused: GameStore.paused
    });
  }

  pausedNotification = () => {
    if (!this.state.paused) return null;
    else return <Notification
      title={<h2>{GameStore.paused.title}</h2>}
      message={GameStore.pause.message}
      buttonText="continue"
      onFinish={GameStore.unPause} />
  }

  render() {
    const airportsSvgJsx = this.state.airports.map(airport => <AirportSvg
      key={airport.data.iata}
      airport={airport} />);
    const airportsJsx = this.state.airports.map(airport => (<div
      key={airport.data.iata}>
      <p title={`${airport.data.name}`}>
        {airport.data.iata.toLowerCase()} /
        {airport.getWaitingPassengers()}
      </p>
    </div>));
    const routesSvgJsx = this.state.routes.map(flight => (
      <PlaneRouteSvg key={flight.id} {...flight} />
    ));

    const routesJsx = this.state.routes.map(flight => (
      <div
        key={flight.id}
        title={`from: ${flight.origin.data.name}, to: ${flight.dest.data.name}`}>
        {flight.origin.data.iata.toLowerCase()} - {flight.dest.data.iata.toLowerCase()} /
        {meterFormat(flight.distance)} /
        {Math.round(flight.bearing)}°
      </div>
    ));

    const airplanesJsx = this.state.airplanes.map(airplane => (
      <div key={airplane.id}>
        <p>
          <select value={airplane.route ? airplane.route.id : 'idle'}
            onChange={e => airplane.setRoute(this.state.routes.find(route => route.id === e.target.value))}>
            <option key="idle" value="idle">idle</option>
            {this.state.routes.map(route => (<option key={route.id} value={route.id}>
              {route.origin.data.iata.toLowerCase()} - {route.dest.data.iata.toLowerCase()}</option>))}
          </select>
          {airplane.location.getLocationStr().toLowerCase()} - {airplane.model.name.toLowerCase()}</p>
      </div>
    ));


    return (
      <div className={style.app}>
        <svg className={style.gameSvg} viewBox="0 0 360 180" style={{ backgroundImage: `url(${worldMap})` }}>>
          <g>
            {airportsSvgJsx}
          </g>
          <g>
            {routesSvgJsx}
          </g>
        </svg>
        <div className={style.dashboard}>
          <div className={style.col}>
            <h1>Tropria</h1>
            <h2>Online</h2>
            <p>Planes: 5</p>
            <button onClick={GameStore.pause}>||</button>
          </div>
          <div className={style.col}>
            <h3>Routes</h3>
            {routesJsx}
          </div>
          <div className={style.col}>
            <h3>Airports</h3>
            {airportsJsx}
          </div>
          <div className={style.col}>
            <h3>Airplanes</h3>
            {airplanesJsx}
          </div>
        </div>
        {this.pausedNotification()}
        {/* <Notification title={<h2>New Airport: LHR</h2>} message={<p>Blababl lorum ipsum</p>} /> */}
      </div>
    );
  }
}

export default App;
