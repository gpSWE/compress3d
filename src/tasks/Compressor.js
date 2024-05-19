import { OBJLoader } from "three/addons/loaders/OBJLoader"
import { DRACOExporter } from "../library/DRACOExporter"
import { BufferAttribute, Mesh } from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils"

const objLoader = new OBJLoader()
const dracoExporter = new DRACOExporter()

self.onmessage = async ( { data: file } ) => {

	const contents = await file.text()

	const obj = objLoader.parse( contents )

	performCompress( obj.children, file.name )
}

function performCompress( meshes, filename ) {

	/*
		If all geometries attributes are not compatible with each other,
		an empty attribute should be added for consistency.
		This is necessary for merging geometries.
	*/

	const geometryAttributes = {}

	for ( let i = 0; i < meshes.length; i++ ) {

		for ( const name in meshes[ i ].geometry.attributes ) {

			const attribute = meshes[ i ].geometry.attributes[ name ]

			geometryAttributes[ name ] = {
				type: getAttributesBufferType( attribute.array ),
				size: attribute.itemSize,
				normalized: attribute.normalized,
			}
		}
	}

	const geometries = []

	for ( let i = 0; i < meshes.length; i++ ) {

		const geometry = meshes[ i ].geometry

		for ( const name in geometryAttributes ) {

			if ( !geometry.attributes[ name ] ) {

				const array = createTypeArray( geometryAttributes[ name ] )
				const size = geometryAttributes[ name ].size
				const normalized = geometryAttributes[ name ].normalized

				const bufferAttribute = new BufferAttribute( array, size, normalized )

				geometry.setAttribute( name, bufferAttribute )
			}
		}

		geometries.push( geometry )
	}

	// Compression

	try {

		const geometry = mergeGeometries( geometries, true )

		const mesh = new Mesh( geometry )

		const buffer = dracoExporter.parse( mesh )

		const blob = new Blob( [ buffer ], { type: "application/octet-stream" } )

		self.postMessage( { blob, filename } )
	}
	catch( err ) {

		console.error( err )
	}
}

function getAttributesBufferType( array ) {

	if ( array instanceof Int8Array ) {

		return "Int8Array"
	}
	else if ( array instanceof Uint8Array ) {

		return "Uint8Array"
	}
	else if ( array instanceof Uint8ClampedArray ) {

		return "Uint8ClampedArray"
	}
	else if ( array instanceof Int16Array ) {

		return "Int16Array"
	}
	else if ( array instanceof Uint16Array ) {

		return "Uint16Array"
	}
	else if ( array instanceof Int32Array ) {

		return "Int32Array"
	}
	else if ( array instanceof Uint32Array ) {

		return "Uint32Array"
	}
	else if ( array instanceof Float32Array ) {

		return "Float32Array"
	}
	else if ( array instanceof Float64Array ) {

		return "Float64Array"
	}

	return "unknown"
}

function createTypeArray( { type } ) {

	if ( type === "Int8Array" ) {

		return new Int8Array( [] )
	}
	else if ( type === "Uint8Array" ) {

		return new Uint8Array( [] )
	}
	else if ( type === "Uint8ClampedArray" ) {

		return new Uint8ClampedArray()
	}
	else if ( type === "Int16Array" ) {

		return new Int16Array( [] )
	}
	else if ( type === "Uint16Array" ) {

		return new Uint16Array( [] )
	}
	else if ( type === "Int32Array" ) {

		return new Int32Array( [] )
	}
	else if ( type === "Uint32Array" ) {

		return new Uint32Array( [] )
	}
	else if ( type === "Float32Array" ) {

		return new Float32Array( [] )
	}
	else if ( type === "Float64Array" ) {

		return new Float64Array( [] )
	}
}
