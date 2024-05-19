import "./main.css"
import * as FileUtils from "./utils/FileUtils"
import * as DOMUtils from "./utils/DOMUtils"

const inputButton = document.querySelector( "#input button" )

inputButton.onclick = async () => {

	const files = await FileUtils.importFiles()

	if ( files ) {

		document.getElementById( "input" ).remove()

		DOMUtils.DOMRenderFileList( files )
	}
}
