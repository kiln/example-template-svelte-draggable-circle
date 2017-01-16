import * as d3 from "d3";
import smoothResize from "@flourish/smooth-resize";

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

var svg, circle;
var w = window.innerWidth,
    h = window.innerHeight;

// Clamp the x and y coordinates so the whole circle is visible, including the stroke
function clampX(x) {
	var visible_radius = state.radius + state.stroke / 2;
	return Math.max(visible_radius, Math.min(w - visible_radius, Math.round(x)));
}
function clampY(y) {
	var visible_radius = state.radius + state.stroke / 2;
	return Math.max(visible_radius, Math.min(h - visible_radius, Math.round(y)));
}

// This is used by both the draw() and update() functions, taking advantage of the fact
// that D3 selections and transitions both have an .attr() method.
function setAttributesFromState(selection_or_transition) {
	var x = clampX(w * state.x_proportion),
	    y = clampY(h * state.y_proportion);

	selection_or_transition
		.attr("transform", "translate(" + x + "," + y + ")")
		.attr("r", state.radius)
		.attr("fill", state.color)
		.attr("stroke", "black")
		.attr("stroke-width", state.stroke);
}

export function draw() {
	svg = d3.select(document.body).append("svg").attr("width", w).attr("height", h);

	// Create the SVG circle, and set up the drag handler
	circle = svg.append("circle")
		.call(d3.drag().on("drag", function() {
			state.x_proportion = clampX(d3.event.x) / w;
			state.y_proportion = clampY(d3.event.y) / h;

			setAttributesFromState(circle);
		}));

	// Initialise the circle’s attributes from the state
	setAttributesFromState(circle);
}

// Keep the centre of the circle in the same relative position as the window is resized
smoothResize(function(width, height) {
	// Update the 'w' and 'h' variables, and resize the SVG
	svg.attr("width", w = width).attr("height", h = height);

	// Check 'circle' is defined to deal with the unlikely case
	// the window is resized before draw() has been called
	if (circle) setAttributesFromState(circle);
});

// Animate to the new state
export function update() {
	setAttributesFromState(circle.transition());
}
