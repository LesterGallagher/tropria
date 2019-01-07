import { rndId } from './helpers'; 
import geolib from 'geolib';
import GameStore from './stores/GameStore';

export default class PlaneRoute {
    constructor(origin, dest) {
        if (!origin || !dest) throw new Error('Origin and destination cannot be falsy');
        this.origin = origin;
        this.dest = dest;
        this.id = rndId();
        this.distance = geolib.getDistance(origin.data, dest.data);
        this.bearing = geolib.getBearing(origin.data, dest.data);
        GameStore.on('update', this.update);
    }

    update = deltaTime => {
        
    }
}