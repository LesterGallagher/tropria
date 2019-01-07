import geolib from 'geolib';
import seedrandom from 'seedrandom';

export const getPointsBetweenPath = (originLL, destLL, minDist = 100000) => {
    const bearing = geolib.getBearing(originLL, destLL);
    const distance = geolib.getDistance(originLL, destLL);
    const points = [originLL];
    let tempBearing = bearing;
    let tempLL = originLL;
    let tempDist = distance;
    while (tempDist > minDist) {
        var nextTempLL = geolib.computeDestinationPoint(tempLL, minDist, tempBearing);
        if (tempLL.longitude < 170 && nextTempLL.longitude > 170) {
            points.push(Object.assign({}, nextTempLL, { longitude: nextTempLL.longitude - 360 }));
            points.push(null);
            points.push(Object.assign({}, tempLL, { longitude: tempLL.longitude + 360 }));
        } else if (tempLL.longitude > 170 && nextTempLL.longitude < 170) {
            points.push(Object.assign({}, nextTempLL, { longitude: nextTempLL.longitude + 360 }));
            points.push(null);
            points.push(Object.assign({}, tempLL, { longitude: tempLL.longitude - 360 }));
        }
        tempLL = nextTempLL;
        points.push(tempLL);
        tempBearing = geolib.getBearing(tempLL, destLL);
        tempDist = geolib.getDistance(tempLL, destLL);
    }
    points.push(destLL);
    return points;
};

export const getPathBetweenPoints = points => {
    return points.slice(1)
        .map((next, i) =>
            next 
            && points[i] 
            && ({ prev: points[i], next }))
        .filter(x => x);
}

const seed = '17454 will always love echo-foxtrot-foxtrot-yankee bravo-lima-uniform-echo.';
const myRand = seedrandom(seed);

export const rndArr = arr => arr[Math.floor(myRand() * arr.length)];

export const continentName = code => {
    switch (code) {
        case 'OC': return 'Oceania';
        case 'NA': return 'North America';
        case 'SA': return 'South America';
        case 'EU': return 'Europe';
        case 'AF': return 'Africa';
        case 'AU': return 'Australia';
        case 'AS': return 'Asia';
        default: throw new Error(code + ' does not exist.');
    }
}

export const rndId = () => Math.random().toString(36).replace('.', '');

export const meterToNM = meter => meter * 0.000539956803;

export const meterFormat = meter => {
    if (meter < 1000) return Math.round(meter) + ' M';
    const km = Math.round(meter / 1000);
    if (km < 1000) return km + ' km';
    const s = km.toString(10).split('');
    s.splice(-3, 0, '.');
    return s.join('') + ' km';
}
