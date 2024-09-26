const resumeHandler = require('../../handlers/resumeHandler');
const resumeManager = require('../../managers/resumeManager');
const EXCEPTION_MESSAGES = require('../../constants/exceptionMessages');

jest.mock('../../managers/resumeManager'); // Mock the activity module

describe('resumeHandler', () => {
    let req, res, pool;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        pool = {};
    });

    describe('uploadResume', () => {
        it('should respond with error if uploadResume fails', async () => {
            req.body = {
                name: 'John Doe',
                job_title: 'Software Engineer',
                job_description: 'Developing web applications.',
                company: 'Tech Corp',
            };
            resumeManager.uploadResume.mockRejectedValue({ status: 400, message: 'Error' });

            await resumeHandler.uploadResume(req, res, pool);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error' });
        });

        it('should respond with resumeId if upload is successful', async () => {
            req.body = {
                name: 'John Doe',
                job_title: 'Software Engineer',
                job_description: 'Developing web applications.',
                company: 'Tech Corp',
            };
            resumeManager.uploadResume.mockResolvedValue(1); // Mock return value

            await resumeHandler.uploadResume(req, res, pool);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ resumeId: 1 });
        });
    });

    describe('getResumeById', () => {
        it('should respond with error if resume not found', async () => {
            req.params.id = 1;
            resumeManager.getResumeById.mockRejectedValue({ status: 404, message: 'Not Found' });

            await resumeHandler.getResumeById(req, res, pool);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Not Found' });
        });

        it('should respond with resume details if found', async () => {
            req.params.id = 1;
            const mockResume = { first_name: 'John', last_name: 'Doe' };
            resumeManager.getResumeById.mockResolvedValue(mockResume); // Mock return value

            await resumeHandler.getResumeById(req, res, pool);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResume);
        });
    });

    describe('getResumeByName', () => {
        it('should respond with error if name format is incorrect', async () => {
            req.query.name = 'John'; // Invalid format
            resumeManager.getResumeByName.mockRejectedValue({ status: 400, message: EXCEPTION_MESSAGES.INVALID_NAME_FORMAT_EXCEPTION });

            await resumeHandler.getResumeByName(req, res, pool);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: EXCEPTION_MESSAGES.INVALID_NAME_FORMAT_EXCEPTION });
        });
    });
});
