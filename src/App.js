import './App.css';
import Home from './Components/Home';
import Admin from './Components/admin'; // Corrected the import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter

function App() {
  return (
    <div className="App">
      <Router> {/* Wrap Routes with BrowserRouter */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
