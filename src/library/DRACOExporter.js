import { Color } from "three"

/**
 * Export draco compressed files from threejs geometry objects.
 *
 * Draco files are compressed and usually are smaller than conventional 3D file formats.
 *
 * The exporter receives a options object containing
 *  - decodeSpeed, indicates how to tune the encoder regarding decode speed (0 gives better speed but worst quality)
 *  - encodeSpeed, indicates how to tune the encoder parameters (0 gives better speed but worst quality)
 *  - encoderMethod
 *  - quantization, indicates the presision of each type of data stored in the draco file in the order (POSITION, NORMAL, COLOR, TEX_COORD, GENERIC)
 */

import DracoEncoderModule from "three/addons/libs/draco/draco_encoder"

class DRACOExporter {

	parse( object, options = {} ) {

		options = Object.assign( {
			decodeSpeed: 5,
			encodeSpeed: 5,
			encoderMethod: DRACOExporter.MESH_EDGEBREAKER_ENCODING,
			quantization: [ 16, 8, 8 ],
		}, options )

		const geometry = object.geometry

		const dracoEncoder = DracoEncoderModule()
		const encoder = new dracoEncoder.Encoder()

		const builder = new dracoEncoder.MeshBuilder()
		const dracoObject = new dracoEncoder.Mesh()

		const vertices = geometry.getAttribute( "position" )
		builder.AddFloatAttributeToMesh( dracoObject, dracoEncoder.POSITION, vertices.count, vertices.itemSize, vertices.array )

		const faces = new ( vertices.count > 65535 ? Uint32Array : Uint16Array )( vertices.count )

		for ( let i = 0; i < faces.length; i++ ) {

			faces[ i ] = i
		}

		builder.AddFacesToMesh( dracoObject, vertices.count, faces )

		// Normal

		{
			const normals = geometry.getAttribute( "normal" )

			if ( normals ) {

				builder.AddFloatAttributeToMesh( dracoObject, dracoEncoder.NORMAL, normals.count, normals.itemSize, normals.array )
			}
		}

		// Color

		{
			const colors = geometry.getAttribute( "color" )

			if ( colors ) {

				const array = createVertexColorSRGBArray( colors )

				builder.AddFloatAttributeToMesh( dracoObject, dracoEncoder.COLOR, colors.count, colors.itemSize, array )
			}
		}

		// Compress using draco encoder

		const encodedData = new dracoEncoder.DracoInt8Array()

		// Sets the desired encoding and decoding speed for the given options from 0 (slowest speed, but the best compression) to 10 (fastest, but the worst compression).

		encoder.SetSpeedOptions( options.encodeSpeed, options.decodeSpeed )

		// Sets the desired encoding method for a given geometry.

		if ( options.encoderMethod !== undefined ) {

			encoder.SetEncodingMethod( options.encoderMethod )
		}

		// Sets the quantization (number of bits used to represent) compression options for a named attribute.
		// The attribute values will be quantized in a box defined by the maximum extent of the attribute values.

		for ( let i = 0; i < 5; i ++ ) {

			if ( options.quantization[ i ] !== undefined ) {

				encoder.SetAttributeQuantization( i, options.quantization[ i ] )
			}
		}

		const length = encoder.EncodeMeshToDracoBuffer( dracoObject, encodedData )

		dracoEncoder.destroy( dracoObject )

		if ( length === 0 ) {

			throw new Error( "THREE.DRACOExporter: Draco encoding failed." )
		}

		//Copy encoded data to buffer.
		const outputData = new Int8Array( new ArrayBuffer( length ) )

		for ( let i = 0; i < length; i ++ ) {

			outputData[ i ] = encodedData.GetValue( i )
		}

		dracoEncoder.destroy( encodedData )
		dracoEncoder.destroy( encoder )
		dracoEncoder.destroy( builder )

		return outputData
	}
}

function createVertexColorSRGBArray( attribute ) {

	// While .drc files do not specify colorspace, the only "official" tooling
	// is PLY and OBJ converters, which use sRGB. We"ll assume sRGB is expected
	// for .drc files, but note that Draco buffers embedded in glTF files will
	// be Linear-sRGB instead.

	const _color = new Color()

	const count = attribute.count
	const itemSize = attribute.itemSize
	const array = new Float32Array( count * itemSize )

	for ( let i = 0, il = count; i < il; i++ ) {

		_color.fromBufferAttribute( attribute, i ).convertLinearToSRGB()

		array[ i * itemSize ] = _color.r
		array[ i * itemSize + 1 ] = _color.g
		array[ i * itemSize + 2 ] = _color.b

		if ( itemSize === 4 ) {

			array[ i * itemSize + 3 ] = attribute.getW( i )
		}
	}

	return array
}

// Encoder methods

DRACOExporter.MESH_EDGEBREAKER_ENCODING = 1
DRACOExporter.MESH_SEQUENTIAL_ENCODING = 0

// Geometry type

DRACOExporter.POINT_CLOUD = 0
DRACOExporter.TRIANGULAR_MESH = 1

// Attribute type

DRACOExporter.INVALID = - 1
DRACOExporter.POSITION = 0
DRACOExporter.NORMAL = 1
DRACOExporter.COLOR = 2
DRACOExporter.TEX_COORD = 3
DRACOExporter.GENERIC = 4

export { DRACOExporter }
