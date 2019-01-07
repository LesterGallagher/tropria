import { rndId } from './helpers';
import geolib from 'geolib';
import GameStore from './stores/GameStore';

class AirplaneLocation {
    setLanded = airport => {
        this.landed = true;
        this.landedAirport = airport;
        this.ll = airport.getLL();
        this.waiting = 20;
        GameStore.on('update', this.update);
    }

    setFlying = destination => {
        this.destination = destination;
        this.waiting = false;
    }

    getLocationStr = () => {
        return this.landed ? this.landedAirport.data.iata : 'flying';
    }

    isAtAirport = airport => {
        return this.landed && this.landedAirport === airport;
    }

    update = deltaTime => {
        if (this.waiting !== false) this.waiting -= deltaTime;
    }
}

export default class Airplane {
    constructor(model, airport) {
        this.model = model;
        this.id = rndId();
        this.route = null;
        this.location = new AirplaneLocation(airport);
        this.location.setLanded(airport);
        this.goingToOrigin = true;
        GameStore.on('update', this.update);
    }

    setRoute = (route) => {
        console.log(route);
        this.route = route;
    }

    getDestination = () => {
        if (this.route === null) throw new Error('No route');

        return this.goingToOrigin ? this.route.origin : this.route.dest;
    }

    update = deltaTime => {
        if (this.route === null) return // todo: change; fly back to hub

        this.location.update(deltaTime);
        if (this.location.isAtAirport(this.route.origin)) {
            this.goingToOrigin = false;
            if (this.location.waiting < 0) this.location.setFlying(this.route.destination);
        } else if (this.location.isAtAirport(this.route.dest)) {
            this.goingToOrigin = true;
            if (this.location.waiting < 0) this.location.setFlying(this.route.origin);
        } else if (this.location.landed === false) {
            const destination = this.getDestination();
            const targetLL = destination.getLL();
            const bearing = geolib.getBearing(this.location.ll, targetLL);
            const distance = geolib.getDistance(this.location.ll, targetLL);
            this.location.ll = geolib.computeDestinationPoint(
                this.location.ll, Math.min(distance, deltaTime * this.model.speed, bearing));
            if (distance < 1) {
                this.location.setLanded(destination);
            }
        }
    }
}