import App from './App.html';
import tween from './tween.js';
import * as eases from 'eases-jsnext';

export var state = {
	radius: 30,
	stroke: 1,
	color: "#FF0000",

	// Because Flourish templates are responsive and can change size,
	// we represent the position of the centre of the circle as proportions
	// of the width and height of the whole template.
	x_proportion: 1/2,
	y_proportion: 1/2
};

var lastState = Object.assign( {}, state );
var currentTween;
var app;

// Initialise the graphic
export function draw() {
	app = new App({
		target: document.body,
		data: lastState
	});

	app.on( 'drag', function ( newState ) {
		if ( currentTween ) currentTween.stop();
		Object.assign( state, newState );
		app.set( state );
		lastState = Object.assign( {}, state );
	});
}

// Animate to the new state
export function update() {
	if (state.radius <= 0) throw new Error("Radius must be positive");

	if ( currentTween ) currentTween.stop();
	currentTween = tween( lastState, state, function ( state ) {
		app.set( state );
		lastState = state;
	}, {
		duration: 400,
		easing: eases.cubicInOut
	});
}
