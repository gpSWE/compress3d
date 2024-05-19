import * as THREE from "three"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader"
import { setupScene } from "./setup-scene"

export function test() {

	const { scene, importButton } = setupScene()

	const dcrLoader = new DRACOLoader()
	dcrLoader.setDecoderConfig( { type: "js" } )
	dcrLoader.setDecoderPath( "https://www.gstatic.com/draco/v1/decoders/" )

	importButton.onclick = async () => {

		// Options for FilePicker

		const options = {
			multiple: false,
			types: [
				{
					description: "Compress3D",
					accept: {
						"application/octet-stream": [ ".compress3D" ],
					}
				},
			],
		}

		try {
			const directory = await window.showOpenFilePicker( options )

			if ( !directory[ 0 ] ) {

				return
			}

			const file = await directory[ 0 ].getFile()

			const buffer = await file.arrayBuffer()

			dcrLoader.parse( buffer, geometry => {

				const material = new THREE.MeshPhongMaterial( { flatShading: true } )
				const mesh = new THREE.Mesh( geometry, material )
				scene.add( mesh )

			}, err => alert( err ) )
		}
		catch( e ) {

			// If the user does not cancel importing files

			if ( e.code !== 20 ) {

				console.error( e.message )
			}
		}
	}
}
