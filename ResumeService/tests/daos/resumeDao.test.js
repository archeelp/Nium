const resumeDao = require('../../daos/resumeDao');

describe('resumeDao', () => {
    let pool;

    beforeEach(() => {
        pool = {
            query: jest.fn(),
        };
    });

    describe('insertResume', () => {
        it('should insert a resume and return the resume ID', async () => {
            pool.query.mockResolvedValue({ rows: [{ id: 1 }] });

            const result = await resumeDao.insertResume('John', 'Doe', 'Software Engineer', 'Developing web applications.', 'Tech Corp', pool);
            expect(result).toBe(1);
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO resumes (first_name, last_name, job_title, job_description, company) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                ['John', 'Doe', 'Software Engineer', 'Developing web applications.', 'Tech Corp']
            );
        });
    });

    describe('fetchResumeById', () => {
        it('should fetch resume by ID', async () => {
            const mockResult = { rows: [{ first_name: 'John', last_name: 'Doe' }] };
            pool.query.mockResolvedValue(mockResult);

            const result = await resumeDao.fetchResumeById(1, pool);
            expect(result).toEqual(mockResult);
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT first_name, last_name, job_title, job_description, company FROM resumes WHERE id = $1',
                [1]
            );
        });
    });

    describe('fetchResumesByName', () => {
        it('should return resumes based on name search', async () => {
            const mockResult = { rows: [{ first_name: 'John', last_name: 'Doe' }] };
            pool.query.mockResolvedValue(mockResult);

            const result = await resumeDao.fetchResumesByName('John', 'Doe', pool);
            expect(result).toEqual(mockResult.rows);
        });
    });
});
