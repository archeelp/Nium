import React, { useState } from 'react';
import axios from 'axios';

function SearchResume() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setSearchResults('');
        if (!firstName.length || !lastName.length) {
            setErrorMessage('Please enter both first name and last name.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/resumes`, {
                params: { name: `${firstName}+${lastName}` } // Sending both firstName and lastName as query params
            });
            if(!response.data.length) {
                setErrorMessage('No matching resumes found.');
                setTimeout(()=>setLoading(false),500);
                return;
            }
            setSearchResults(response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Error fetching search results:', error);
            setErrorMessage('Error fetching results. Please try again.');
        }
        setTimeout(()=>setLoading(false),500);
    };

    return (
        <div className="search-resume">
            <h1>Search Resumes</h1>
            <div className="search-inputs">
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter First Name"
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter Last Name"
                />
                <button onClick={handleSearch} disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {searchResults.length > 0 && (
                <div className="results">
                    <h3>Search Results</h3>
                    <ul>
                        {searchResults.map((resume) => (
                            <li key={resume.resumeId} className="resume-item">
                                <p><strong>First Name:</strong> {resume.first_name}</p>
                                <p><strong>Last Name:</strong> {resume.last_name}</p>
                                <p><strong>Job Title:</strong> {resume.job_title}</p>
                                <p><strong>Job Description:</strong> {resume.job_description}</p>
                                <p><strong>Company:</strong> {resume.company}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchResume;
