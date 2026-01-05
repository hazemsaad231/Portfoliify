import NavBar from "./Components/Navbar/navbar";
import About from "./Components/About/about";
import Contact from "./Components/Contact/contact";
import Experience from "./Components/Experience/experience";
import Hero from "./Components/Hero/hero";
import Projects from "./Components/Projects/projects";

export default function HomePage() {
  return (
    <div className="app">
      <NavBar userId={null} />
      <Hero userId={null} />
      <About userId={null} />
      <Experience userId={null} />
      <Projects userId={null} />
      <Contact userId={null} />
    </div>
  );
}
