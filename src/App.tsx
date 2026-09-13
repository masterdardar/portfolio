import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import useLenis from "./hooks/useLenis";
import { projects } from "./data/projects";
import Navigation from "./components/Navigation/Navigation";
import Hero from "./components/Hero/Hero";
import PracticeStatement from "./components/PracticeStatement/PracticeStatement";
import SelectedWork from "./components/SelectedWork/SelectedWork";
import Practice from "./components/Practice/Practice";
import Experience from "./components/Experience/Experience";
import Recognition from "./components/Recognition/Recognition";
import Skills from "./components/Skills/Skills";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Cursor from "./components/Cursor/Cursor";

import "./styles/variables.css";
import "./styles/global.css";
import "./components/Ticks/Ticks.css";
import "./components/Navigation/Navigation.css";
import "./components/Hero/Hero.css";
import "./components/PracticeStatement/PracticeStatement.css";
import "./components/SelectedWork/SelectedWork.css";
import "./components/HorizontalGallery/HorizontalGallery.css";
import "./components/Masonry/Masonry.css";
import "./components/ImageWithDetail/ImageWithDetail.css";
import "./components/Model3D/Model3D.css";
import "./components/Practice/Practice.css";
import "./components/Experience/Experience.css";
import "./components/Skills/Skills.css";
import "./components/Contact/Contact.css";
import "./components/Footer/Footer.css";
import "./components/Cursor/Cursor.css";

function App() {
	useLenis();

	useEffect(() => {
		useGLTF.preload(projects[0].model.src);
	}, []);

	return (
		<>
			<a className="skip-link" href="#work">
				Skip to work
			</a>
			<div className="rails" aria-hidden="true">
				<span className="rails__left" />
				<span className="rails__right" />
			</div>
			<Cursor />
			<Navigation />
			<main>
				<Hero />
				<PracticeStatement />
				<SelectedWork />
				<Practice />
				<Experience />
				<Recognition />
				<Skills />
				<Contact />
			</main>
			<Footer />
		</>
	);
}

export default App;
