import { main } from "./main"
import { test } from "./test/main"

if ( window.location.pathname === "/test" ) {

	test()
}
else {

	main()
}
