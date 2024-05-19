import "./main.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls"

export function setupScene() {

	document.getElementById( "app" ).remove()

	const importButton = document.createElement( "button" )

	importButton.textContent = "Import .compress3d"

	document.body.insertBefore( importButton, document.body.firstElementChild )

	// Scene

	const scene = new THREE.Scene()

	// Camera

	const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100_000 )
	camera.position.set( 3_000, 3_000, 3_000 )
	camera.lookAt( 0, 0, 0 )

	// Renderer

	const renderer = new THREE.WebGLRenderer( { antialias: true } )
	renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( window.innerWidth, window.innerHeight )
	document.body.insertBefore( renderer.domElement, document.body.firstElementChild )

	// Controls

	const controls = new OrbitControls( camera, renderer.domElement )

	// OnResize

	window.addEventListener( "resize", () => {

		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()

		renderer.setSize( window.innerWidth, window.innerHeight )
	} )

	// Lights

	{
		const light = new THREE.AmbientLight( 0xffffff, 1 )
		scene.add( light )
	}

	{
		const light = new THREE.DirectionalLight( 0xffffff, 2 )
		light.position.set( 30, 15, 0 )
		scene.add( light )
	}

	// Render

	renderer.setAnimationLoop( () => {

		renderer.render( scene, camera )
	} )

	// Helpers

	scene.add( new THREE.AxesHelper( 3_000 ) )

	return {
		scene,
		camera,
		renderer,
		controls,
		importButton,
	}
}
