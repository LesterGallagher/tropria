import { EventEmitter } from 'events';
const airports = require('airports')
import PlaneRoute from '../plane-route';
import Airport from '../airport';
import config from '../config';
import seedrandom from 'seedrandom';
import Airplane from '../airplane';
import models from '../data/models';
import { rndArr } from '../helpers';

const largeAirports = airports
    .filter(airport => airport.size === 'large')
    .filter(airport => airport.type ===  'airport')
    .filter(airport => airport.name);
const seed = '17454 will always love echo-foxtrot-foxtrot-yankee bravo-lima-uniform-echo.';
const myRand = seedrandom(seed);
largeAirports.sort((a, b) => myRand() > .5 ? 1 : -1);

class GameStore extends EventEmitter {
    constructor() {
        super();
        this.airplanes = [];
        this.routes = [];
        this.airports = [];
        this.paused = false;
        this.time = 0;
        this.message = null;
        this.isCreatingNewFlight = false;
        this.newFlightOrigin = null;
        this.interval = setInterval(this.update, config.fps);

        setTimeout(this.start, 0);
    }

    start = () => {
        this.newAirport();
        this.newAirport();
        this.newPlane();
        this.newPlane();
        this.unPause();
    }

    update = () => {
        if (this.paused) return;

        const deltaTime = config.speed / config.fps;
        this.time += deltaTime;
        if (this.time > this.airports.length * 100) {
            this.newAirport();
        }
        this.emit('update', deltaTime);
        this.emit('change');
    }

    pause = () => {
        this.paused = { title: 'Paused', message: 'The game is paused' };
        this.emit('change');
    }

    unPause = () => {
        this.paused = false;
        this.emit('change');
    }

    addFlightOrigin = airport => {
        this.isCreatingNewFlight = true;
        this.newFlightOrigin = airport;
        this.emit('change');
    }

    addFlightDestination = airport => {
        const flight = new PlaneRoute(this.newFlightOrigin, airport);
        this.routes.push(flight);
        this.isCreatingNewFlight = false;
        this.newFlightOrigin = null;
        this.emit('change');
    }

    newAirport = () => {
        const airport = new Airport(largeAirports.shift()); 
        this.paused = {
            title: 'New airport: ' + airport.data.iata,
            message: 'A new airport has been unlocked.'
        };
        this.airports.push(airport);
        this.emit('change');
    }

    newPlane = () => {
        const plane = new Airplane(rndArr(models), this.airports[0]);
        this.paused = {
            title: 'New airplane: ' + plane.model.name,
            message: 'A new airplane has been unlocked.'
        };
        this.airplanes.push(plane);
        this.emit('change');
    }
}

export default new GameStore();
