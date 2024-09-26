const resumeManager = require('../../managers/resumeManager');
const resumeDao = require('../../daos/resumeDao');
const EXCEPTION_MESSAGES = require('../../constants/exceptionMessages');

jest.mock('../../daos/resumeDao'); // Mock the DAO module

describe('resumeManager', () => {
    describe('uploadResume', () => {
        it('should throw an error if required fields are missing', async () => {
            await expect(resumeManager.uploadResume({}, {})).rejects.toEqual({
                status: 400,
                message: EXCEPTION_MESSAGES.MISSING_REQUIRED_FIELDS,
            });
        });

        it('should insert resume and return resume ID', async () => {
            const mockResume = {
                name: 'John Doe',
                job_title: 'Software Engineer',
                job_description: 'Developing web applications.',
                company: 'Tech Corp',
            };
            resumeDao.insertResume.mockResolvedValue(1); // Mock insertResume return value

            const result = await resumeManager.uploadResume(mockResume, {});
            expect(result).toBe(1);
            expect(resumeDao.insertResume).toHaveBeenCalledWith(
                'John',
                'Doe',
                'Software Engineer',
                'Developing web applications.',
                'Tech Corp',
                {}
            );
        });
    });

    describe('getResumeById', () => {
        it('should throw an error if resume is not found', async () => {
            resumeDao.fetchResumeById.mockResolvedValue({ rows: [] }); // No results

            await expect(resumeManager.getResumeById(1, {})).rejects.toEqual({
                status: 404,
                message: EXCEPTION_MESSAGES.RESUME_NOT_FOUND_EXCEPTION,
            });
        });

        it('should return resume details', async () => {
            const mockResume = { first_name: 'John', last_name: 'Doe', job_title: 'Software Engineer', job_description: 'Developing web applications.', company: 'Tech Corp' };
            resumeDao.fetchResumeById.mockResolvedValue({ rows: [mockResume] }); // Mock resume

            const result = await resumeManager.getResumeById(1, {});
            expect(result).toEqual(mockResume);
        });
    });

    describe('getResumeByName', () => {
        it('should throw an error if both names are not provided', async () => {
            await expect(resumeManager.getResumeByName('John', {})).rejects.toEqual({
                status: 400,
                message: EXCEPTION_MESSAGES.INVALID_NAME_FORMAT_EXCEPTION,
            });
        });
    });
});
