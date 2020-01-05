<script>
	// https://svelte.dev/docs#createEventDispatcher
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let radius;
	export let stroke;
	export let color;
	export let x_proportion;
	export let y_proportion;

	// Reactive declarations: https://svelte.dev/docs#3_$_marks_a_statement_as_reactive
	// Calculate the x and y values to make sure the
	// circle does not exceed the bounds of the window
	$: visible_radius = radius + stroke / 2;
	$: xTemp = x_proportion * width;
	$: x = Math.max(visible_radius, Math.min(width - visible_radius, Math.round(xTemp)));
	$: yTemp = y_proportion * height;
	$: y = Math.max(visible_radius, Math.min(height - visible_radius, Math.round(yTemp)));

	let width = 500; // Default values
	let height = 500;

	function down () {
		window.addEventListener( 'mousemove', move );
		window.addEventListener( 'touchmove', move );

		window.addEventListener( 'mouseup', up );
		window.addEventListener( 'touchend', up );
	}

	function up () {
		window.removeEventListener( 'mousemove', move );
		window.removeEventListener( 'touchmove', move );

		window.removeEventListener( 'mouseup', up );
		window.removeEventListener( 'touchend', up );
	}

	function move ( event ) {
		if ( event.type === 'touchmove' ) event = event.changedTouches[0];
		x_proportion = event.clientX / width;
		y_proportion = event.clientY / height;

		// Update the flourish state
		dispatch('drag', {
			x_proportion,
			y_proportion
		});
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<svg {width} {height}>
	<circle
		on:mousedown={down}
		on:touchstart={down}
		cx={x}
		cy={y}
		r={radius}
		fill={color}
		stroke="black"
		stroke-width={stroke}
	></circle>
</svg>
