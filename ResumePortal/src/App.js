import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UploadResume from './pages/UploadResume';
import FetchResume from './pages/FetchResume';
import SearchResume from './pages/SearchResume';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <Link to="/uploadResume">Upload Resume</Link>
                    <Link to="/fetchResume">Retrieve Resume</Link>
                    <Link to="/">Search Resume</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<SearchResume />} />
                    <Route path="/fetchResume" element={<FetchResume />} />
                    <Route path="/uploadResume" element={<UploadResume />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
