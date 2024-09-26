const resumeDao = require('../daos/resumeDao');
const EXCEPTION_MESSAGES = require('../constants/exceptionMessages');

exports.uploadResume = async (data, pool) => {
    const { name, job_title, job_description, company } = data;

    if (!name || !job_title || !job_description || !company) {
        throw { status: 400, message: EXCEPTION_MESSAGES.MISSING_REQUIRED_FIELDS };
    }

    const [first_name, last_name] = name.split(' ');
    if (!first_name || !last_name) {
        throw { status: 400, message: EXCEPTION_MESSAGES.INVALID_NAME_FORMAT_EXCEPTION };
    }

    return await resumeDao.insertResume(first_name, last_name, job_title, job_description, company, pool);
};

exports.getResumeById = async (id, pool) => {
    const result = await resumeDao.fetchResumeById(id, pool);
    if (result.rows.length === 0) {
        throw { status: 404, message: EXCEPTION_MESSAGES.RESUME_NOT_FOUND_EXCEPTION };
    }
    return result.rows[0];
};

exports.getResumeByName = async (name, pool) => {
    const decodedName = decodeURIComponent(name);
    const nameParts = decodedName.split('+');
    if (nameParts.length !== 2) {
        throw { status: 400, message: EXCEPTION_MESSAGES.INVALID_NAME_FORMAT_EXCEPTION };
    }

    return await resumeDao.fetchResumesByName(nameParts[0], nameParts[1], pool);
};
