const resumeManager = require('../managers/resumeManager');
const pool = require('../daos/dbPool');

exports.uploadResume = async (req, res) => {
    try {
        const result = await resumeManager.uploadResume(req.body, pool);
        res.status(200).json({ resumeId: result });
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ error: error.message });
    }
};

exports.getResumeById = async (req, res) => {
    try {
        const result = await resumeManager.getResumeById(req.params.id, pool);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ error: error.message });
    }
};

exports.getResumeByName = async (req, res) => {
    try {
        const { name } = req.query;
        const result = await resumeManager.getResumeByName(name, pool);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ error: error.message });
    }
};
