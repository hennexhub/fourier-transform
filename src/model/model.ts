export interface RNGCirclesSettings {
    numberOfCircles: number;
    maxSpeed: number;
    minSpeed: number;
    speedDelta: number;
    maxRadius: number;
    radiusDelta: number;
    zoom: number;
    addViewPortZoom: boolean;
    sortCircles: boolean;
}

export interface StrokeSettings {
    circleStroke: number;
    radiusStroke: number;
    pathStroke: number;
    jointPointStroke: number;
    deletePath: boolean;
    deletePathDelay: number;
}


export interface ColorSettings {
    rotateCircleColor: boolean;
    rotateCircleColorDelay: number;
    radiusColor: number[];
    circleColor: Array<number>;
    pathColor: Array<number>;
    jointPointColor: Array<number>;
    backgroundColor: Array<number>;

}

export interface Point {
    x: number;
    y: number;
}

export interface ViewPort {
    minX: number;
    minY: number;
    height: number;
    width: number;
}

export interface FourierTransform {
    radius: number;
    frequency: number;
    phase: number;
}

export interface ICircle {
    centerX: number;
    centerY: number;
    radius: number;
    angle: number;
}


