import React, { useState } from 'react';
import axios from 'axios';

function UploadResume() {
    const [resumeDetails, setResumeDetails] = useState({
        first_name: '',
        last_name: '',
        job_title: '',
        job_description: '',
        company: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResumeDetails({ ...resumeDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/api/resumes', {
                name: `${resumeDetails.first_name} ${resumeDetails.last_name}`,
                job_title: resumeDetails.job_title,
                job_description: resumeDetails.job_description,
                company: resumeDetails.company
            });
            alert(`Resume uploaded! Resume ID: ${response.data.resumeId}`);
            setResumeDetails({
                first_name: '',
                last_name: '',
                job_title: '',
                job_description: '',
                company: ''
            });
        } catch (error) {
            console.error('Error uploading resume:', error);
            setErrorMessage('Error uploading resume. Please try again.');
        }
        setTimeout(()=>setLoading(false),500);
    };

    return (
        <div>
            <h1>Resume Upload</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="first_name" placeholder="First Name" value={resumeDetails.first_name} onChange={handleChange} required />
                <input type="text" name="last_name" placeholder="Last Name" value={resumeDetails.last_name} onChange={handleChange} required />
                <input type="text" name="job_title" placeholder="Job Title" value={resumeDetails.job_title} onChange={handleChange} required />
                <textarea name="job_description" placeholder="Job Description" value={resumeDetails.job_description} onChange={handleChange} required />
                <input type="text" name="company" placeholder="Company" value={resumeDetails.company} onChange={handleChange} required />
                <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload Resume'}</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default UploadResume;
