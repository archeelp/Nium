import React, { useState } from 'react';
import axios from 'axios';

function FetchResume() {
    const [resumeID, setResumeID] = useState('');
    const [fetchedResume, setFetchedResume] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFetchResume = async () => {
        setFetchedResume('');
        if (!resumeID) {
            setErrorMessage('Please enter a Resume ID.');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/resumes/${resumeID}`);
            setFetchedResume(response.data);
            setErrorMessage('');
        } catch (error) {
            console.error('Error fetching resume:', error);
            setErrorMessage('Error fetching resume. Please check the Resume ID.');
        }
        setTimeout(()=>setLoading(false),500);
    };

    return (
        <div className="fetch-resume">
            <h1>Retrieve Resume Details</h1>
            <div className="fetch-inputs">
                <input
                    type="text"
                    value={resumeID}
                    onChange={(e) => setResumeID(e.target.value)}
                    placeholder="Enter Resume ID"
                />
                <button onClick={handleFetchResume} disabled={loading}>{loading ? 'Retrieving Resume Details...' : 'Retrieve Resume Details'}</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {fetchedResume && (            
                <div className="resume-details">
                    <h3>Resume Details</h3>
                    <ul>
                        <li key={fetchedResume.resumeId} className="resume-item">
                            <p><strong>First Name:</strong> {fetchedResume.first_name}</p>
                            <p><strong>Last Name:</strong> {fetchedResume.last_name}</p>
                            <p><strong>Job Title:</strong> {fetchedResume.job_title}</p>
                            <p><strong>Job Description:</strong> {fetchedResume.job_description}</p>
                            <p><strong>Company:</strong> {fetchedResume.company}</p>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default FetchResume;
