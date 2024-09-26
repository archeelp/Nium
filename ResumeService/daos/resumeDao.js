exports.insertResume = async (first_name, last_name, job_title, job_description, company, pool) => {
    const result = await pool.query(
        'INSERT INTO resumes (first_name, last_name, job_title, job_description, company) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [first_name, last_name, job_title, job_description, company]
    );
    return result.rows[0].id;
};

exports.fetchResumeById = async (id, pool) => {
    return await pool.query(
        'SELECT first_name, last_name, job_title, job_description, company FROM resumes WHERE id = $1',
        [id]
    );
};

exports.fetchResumesByName = async (firstName, lastName, pool) => {
    const exactMatches = await pool.query(
        'SELECT * FROM resumes WHERE first_name = $1 AND last_name = $2',
        [firstName, lastName]
    );

    if (exactMatches.rows.length > 0) {
        return exactMatches.rows;
    }

    const independentMatches = await pool.query(
        'SELECT * FROM resumes WHERE first_name = $1 OR last_name = $2',
        [firstName, lastName]
    );

    return independentMatches.rows;
};
