import './App.css';
import Home from './components/home/Home.js';
import NavigationBar from './components/NavigationBar.js';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import About from './components/about/About.js';

function App() {
  return (
    <div className="App">
      <style>{'body { background-color: #1e1e1e; }'}</style>
      <NavigationBar>
      </NavigationBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
