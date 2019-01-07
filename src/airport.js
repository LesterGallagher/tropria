import GameStore from './stores/GameStore';
import seedrandom from 'seedrandom';
import { LL } from './ll';

const seed = '17454 will always love echo-foxtrot-foxtrot-yankee bravo-lima-uniform-echo.';
const myRand = seedrandom(seed);

export default class Airport {
    constructor(data) {
        this.data = data;
        this.waiting = 0;
        this.supplyMultiplier = myRand();
        GameStore.on('update', this.update);
    }

    update = deltaTime => {
        this.waiting += this.supplyMultiplier * deltaTime;
    }
    
    getWaitingPassengers = () => Math.floor(this.waiting);

    getLL = () => {
        return new LL(+this.data.lat, +this.data.lon);
    }
}