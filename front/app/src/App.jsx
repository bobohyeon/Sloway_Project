import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import DefaultLayouts from "./app/layouts/default/DefaultLayouts";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<DefaultLayouts />
		</>
	);
}

export default App;
