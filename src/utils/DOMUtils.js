import { formatFileSize, getFilename } from "./FileUtils"

export function DOMRenderFileList( files ) {

	const table = document.querySelector( "#file-list table" )

	for ( const [ fileName, file ] of files.entries() ) {

		// Create a row

		const tr = document.createElement( "tr" )

		tr.dataset.name = getFilename( file.name )

		table.children[ 1 ].appendChild( tr )

		// Type

		{
			const td = document.createElement( "td" )
			td.textContent = "." + file.name.split( "." ).pop().toUpperCase()

			tr.appendChild( td )
		}

		// Filename

		{
			const td = document.createElement( "td" )
			td.textContent = fileName

			tr.appendChild( td )
		}

		// Size (input)

		{
			const td = document.createElement( "td" )
			td.textContent = formatFileSize( file.size )

			tr.appendChild( td )
		}

		// Size (output)

		{
			const td = document.createElement( "td" )
			// td.textContent = "Calculating..."

			const loader = document.createElement( "span" )
			loader.className = "loader"

			td.appendChild( loader )

			tr.appendChild( td )
		}

		// Download button

		{
			const td = document.createElement( "td" )
			const button = document.createElement( "button" )
			button.disabled = true

			button.textContent = "File"

			td.appendChild( button )
			tr.appendChild( td )
		}
	}
}
