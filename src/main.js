import "./main.css"
import { OBJLoader } from "three/addons/loaders/OBJLoader"
import * as FileUtils from "./utils/FileUtils"
import * as DOMUtils from "./utils/DOMUtils"
import Compressor from "./tasks/Compressor?worker"

const objLoader = new OBJLoader()

const inputButton = document.querySelector( "#input button" )

inputButton.onclick = async () => {

	const files = await FileUtils.importFiles()

	if ( files ) {

		document.getElementById( "input" ).remove()

		DOMUtils.DOMRenderFileList( files )

		//

		const completed = await distributeTasks( [ ...files.values() ], navigator.hardwareConcurrency || 4 )
	
		if ( completed ) {

			console.info( "All tasks completed successfully!" )
		}
	}
}

function distributeTasks( tasks, numWorkers ) {

	const results = []
	let completed = 0
	const workers = []
	const tasksQueue = tasks.slice()

	return new Promise( ( resolve, reject ) => {

		function onWorkerMessage( { data } ) {

			const filename = FileUtils.getFilename( data.filename )

			const tr = document.querySelector( `tr[data-name="${ filename }"]` )

			const downloadButton = tr.querySelector( `button` )

			const fileSize = FileUtils.formatFileSize( data.blob.size )

			tr.children[ 3 ].innerHTML = ""
			tr.children[ 3 ].textContent = fileSize

			downloadButton.onclick = () => {

				FileUtils.downloadBlob( data.blob, filename )
			}

			downloadButton.removeAttribute( "disabled" )

			completed++

			if ( tasksQueue.length > 0 ) {

				this.postMessage( tasksQueue.shift() )
			}
			else {

				this.terminate()

				workers.splice( workers.indexOf( this ), 1 )

				if ( completed === tasks.length ) {

					resolve( true )
				}
			}
		}

		for ( let i = 0; i < numWorkers; i++ ) {

			if ( tasksQueue.length > 0 ) {

				const worker = new Compressor()
				workers.push( worker )
				worker.onmessage = onWorkerMessage
				worker.postMessage( tasksQueue.shift() )
			}
		}
	} )
}
