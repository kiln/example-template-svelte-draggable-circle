import App from './App.svelte';
import tween from './tween.js';
import * as eases from 'eases-jsnext';

export const state = {
	radius: 30,
	stroke: 1,
	color: "#FF0000",

	// Because Flourish templates are responsive and can change size,
	// we represent the position of the centre of the circle as proportions
	// of the width and height of the whole template.
	x_proportion: 1/2,
	y_proportion: 1/2
};

let lastState;
let currentTween;
let app;

// Initialise the graphic
export function draw() {
	app = new App({
		target: document.body,
		props: state
	});

	lastState = Object.assign( {}, state );

	app.$on('drag', event => {
		if ( currentTween ) currentTween.stop();
		const { detail: newState } = event;
		Object.assign( state, newState );
		app.$set( state );
		lastState = Object.assign( {}, state );
	});
}

// Animate to the new state
export function update() {
	if (state.radius <= 0) throw new Error("Radius must be positive");

	if ( currentTween ) currentTween.stop();

	currentTween = tween( lastState, state, function ( state ) {
		app.$set( state );
		lastState = state;
	}, {
		duration: 400,
		easing: eases.cubicInOut
	});
}
