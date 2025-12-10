import {
	ColorSettings,
	RNGCirclesSettings,
	StrokeSettings,
} from '@/model/model.ts';

export interface Preset {
	rngSettings: RNGCirclesSettings;
	colors: ColorSettings;
	strokes: StrokeSettings;
}

const LilaGreenPresetStrokes: StrokeSettings = {
	circleStroke: 0.38,
	radiusStroke: 0.7,
	pathStroke: 3,
	jointPointStroke: 2,
	deletePath: true,
	deletePathDelay: 10,
};

const LilaGreenPresetColors: ColorSettings = {
	rotateCircleColor: false,
	rotateCircleColorDelay: 5,
	radiusColor: [65, 82, 50],
	circleColor: [1, 20, 100],
	jointPointColor: [20, 120, 70],
	backgroundColor: [286, 90, 14],
	pathColor: [132, 71, 70],
};

const LilaGreenPresetProps: RNGCirclesSettings = {
	addViewPortZoom: false,
	numberOfCircles: 40,
	maxSpeed: 0.499,
	minSpeed: -0.499,
	speedDelta: 1,
	maxRadius: 150,
	radiusDelta: 20,
	zoom: 90,
	sortCircles: false,
};

const PinkSolarSystemStrokes: StrokeSettings = {
	circleStroke: 0.4,
	radiusStroke: 0,
	pathStroke: 3,
	jointPointStroke: 4,
	deletePath: true,
	deletePathDelay: 7,
};

const PinkSolarSystemColors: ColorSettings = {
	rotateCircleColor: false,
	rotateCircleColorDelay: 5,
	radiusColor: [0, 0, 0],
	circleColor: [305, 100, 50],
	jointPointColor: [40, 100, 50],
	backgroundColor: [40, 100, 5],
	pathColor: [132, 71, 70],
};
const PinkSolarSystemProperties: RNGCirclesSettings = {
	addViewPortZoom: true,
	numberOfCircles: 99,
	maxSpeed: 0.199,
	minSpeed: -0.199,
	speedDelta: 0,
	maxRadius: 70,
	radiusDelta: 70,
	zoom: 90,
	sortCircles: false,
};

const BlueWormsStrokes: StrokeSettings = {
	circleStroke: 0.0,
	radiusStroke: 0,
	pathStroke: 0,
	jointPointStroke: 2.35,
	deletePath: true,
	deletePathDelay: 0,
};

const BlueWormsColors: ColorSettings = {
	rotateCircleColor: false,
	rotateCircleColorDelay: 5,
	radiusColor: [0, 0, 0],
	circleColor: [305, 100, 50],
	jointPointColor: [189, 86, 58],
	backgroundColor: [234, 86, 47],
	pathColor: [132, 71, 70],
};
const BlueWormsProperties: RNGCirclesSettings = {
	addViewPortZoom: false,
	numberOfCircles: 200,
	maxSpeed: 0.299,
	minSpeed: -0.399,
	speedDelta: 0,
	maxRadius: 10,
	radiusDelta: 100,
	zoom: 90,
	sortCircles: false,
};

const WindyTreeStrokes: StrokeSettings = {
	circleStroke: 0.0,
	radiusStroke: 2,
	pathStroke: 0,
	jointPointStroke: 3.35,
	deletePath: true,
	deletePathDelay: 1,
};

const WindyTreeColors: ColorSettings = {
	rotateCircleColor: false,
	rotateCircleColorDelay: 5,
	radiusColor: [360, 76, 55],
	circleColor: [305, 100, 50],
	jointPointColor: [360, 98, 65],
	backgroundColor: [54, 87, 95],
	pathColor: [132, 71, 70],
};
const WindyTreeProperties: RNGCirclesSettings = {
	addViewPortZoom: false,
	numberOfCircles: 120,
	maxSpeed: 0.299,
	minSpeed: -0.288,
	speedDelta: 0,
	maxRadius: 25,
	radiusDelta: 0,
	zoom: 90,
	sortCircles: false,
};

const SlowGreenCirclesProperties: RNGCirclesSettings = {
	addViewPortZoom: false,
	numberOfCircles: 25,
	maxSpeed: 0.299,
	minSpeed: -0.288,
	speedDelta: 0.8,
	maxRadius: 30,
	radiusDelta: 30,
	zoom: 90,
	sortCircles: true,
};

const SlowGreenCircleStrokes: StrokeSettings = {
	circleStroke: 2,
	radiusStroke: 3,
	pathStroke: 2.49,
	jointPointStroke: 1,
	deletePath: true,
	deletePathDelay: 10,
};

const SlowGreenCirclesColors: ColorSettings = {
	rotateCircleColor: false,
	rotateCircleColorDelay: 5,
	radiusColor: [44, 58.44, 84.9],
	circleColor: [103.57, 51.85, 31.76],
	jointPointColor: [360, 98, 65],
	backgroundColor: [150.86, 49.3, 13.92],
	pathColor: [82.04, 40.83, 47.06],
};

export const presets: Preset[] = [
	{
		rngSettings: LilaGreenPresetProps,
		colors: LilaGreenPresetColors,
		strokes: LilaGreenPresetStrokes,
	},
	{
		rngSettings: PinkSolarSystemProperties,
		colors: PinkSolarSystemColors,
		strokes: PinkSolarSystemStrokes,
	},
	{
		rngSettings: BlueWormsProperties,
		colors: BlueWormsColors,
		strokes: BlueWormsStrokes,
	},
	{
		rngSettings: WindyTreeProperties,
		colors: WindyTreeColors,
		strokes: WindyTreeStrokes,
	},
	{
		rngSettings: SlowGreenCirclesProperties,
		colors: SlowGreenCirclesColors,
		strokes: SlowGreenCircleStrokes,
	},
];
