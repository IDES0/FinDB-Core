import './App.css';
import Home from './components/home/Home.js';
import NavigationBar from './components/NavigationBar.js';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import About from './components/about/About.js';
import Model from './components/model/Model.js';

function App() {
  return (
    <div className="App">
      <style>{'body { background-color: #1e1e1e; }'}</style>
      <NavigationBar>
      </NavigationBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/stocks" element={<Model name={"Stock"}/>} />
        <Route path="/sectors" element={<Model name={"Sector"} />} />
        <Route path="/indexes" element={<Model name={"Index"} />} />
      </Routes>
    </div>
  );
}

export default App;
