const express = require('express');
const resumeHandler = require('../handlers/resumeHandler');

const router = express.Router();

// POST /api/resumes
/**
 * @swagger
 * /api/resumes:
 *   post:
 *     summary: Upload resume details
 *     description: Uploads a candidate's resume details to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               job_title:
 *                 type: string
 *                 example: Software Engineer
 *               job_description:
 *                 type: string
 *                 example: Developing web applications.
 *               company:
 *                 type: string
 *                 example: Tech Corp
 *     responses:
 *       200:
 *         description: Resume uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumeId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Bad request.
 */
router.post('/resumes', (req, res) => resumeHandler.uploadResume(req, res));

// GET /api/resumes/:id
/**
 * @swagger
 * /api/resumes/{id}:
 *   get:
 *     summary: Get resume by ID
 *     description: Retrieves a candidate's resume details by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Resume details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                   example: John
 *                 last_name:
 *                   type: string
 *                   example: Doe
 *                 job_title:
 *                   type: string
 *                   example: Software Engineer
 *                 job_description:
 *                   type: string
 *                   example: Developing web applications.
 *                 company:
 *                   type: string
 *                   example: Tech Corp
 *       404:
 *         description: Resume not found.
 */
router.get('/resumes/:id', (req, res) => resumeHandler.getResumeById(req, res));

// GET /api/resumes?name=JohnDoe
/**
 * @swagger
 * /api/resumes:
 *   get:
 *     summary: Get resumes by name
 *     description: Retrieves resumes that match the given name (first name, last name, or both).
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *           example: John+Doe
 *         description: The name to filter resumes by. Supports partial matching.
 *     responses:
 *       200:
 *         description: Resumes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     example: Doe
 *                   job_title:
 *                     type: string
 *                     example: Software Engineer
 *                   job_description:
 *                     type: string
 *                     example: Developing web applications.
 *                   company:
 *                     type: string
 *                     example: Tech Corp
 *       400:
 *         description: Bad request. Invalid query parameter.
 *       404:
 *         description: No matching resumes found.
 */
// Get resumes by name
router.get('/resumes', (req, res) => resumeHandler.getResumeByName(req, res));

module.exports = router;
