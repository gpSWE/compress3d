export async function importFiles() {

	const files = new Map()

	// Options for FilePicker

	const options = {
		multiple: true,
		types: [
			{
				description: "OBJ",
				accept: {
					"application/object": [ ".obj" ],
				}
			},
		],
	}

	try {
		const directory = await window.showOpenFilePicker( options )

		for await ( const fileHandle of directory ) {

			const file = await fileHandle.getFile()

			// Check for allowed files

			if ( !isValidOBJFile( await file.text() ) ) {

				continue
			}

			files.set( file.name, file )
		}
	}
	catch( e ) {

		// If the user does not cancel importing files

		if ( e.code !== 20 ) {

			console.error( e.message )
		}
	}

	if ( !files.size ) {

		return null
	}

	return files
}

export function formatFileSize( bytes ) {

	const units = [ "Bytes", "KB", "MB", "GB", "TB" ]
	let i = 0

	while ( bytes >= 1024 ) {

		i++
		bytes = bytes / 1024
	}

	return bytes.toFixed( 1 ) + " " + units[ i ]
}

export function isValidOBJFile( fileContents ) {

	const lines = fileContents.split( "\n" )

	const objIndicators = [ "v ", "f ", "vn ", "vt ", "g ", "usemtl ", "mtllib " ]

	for ( let line of lines ) {

		line = line.trim()

		if ( !line || line.startsWith( "#" ) ) {

			continue
		}

		if ( objIndicators.some( indicator => line.startsWith( indicator ) ) ) {

			return true
		}
	}

	return false
}
