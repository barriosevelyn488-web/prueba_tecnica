const applicationService = require('../src/services/application.service');
const db = require('../src/config/db');

jest.mock('../src/config/db', () => ({
    getConnection: jest.fn(),
    query: jest.fn()
}));

describe('ApplicationService - Motor de Cálculo de Puntaje y Prioridades', () => {
    let mockConnection;

    beforeEach(() => {
        jest.clearAllMocks();
        mockConnection = {
            query: jest.fn(),
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            release: jest.fn()
        };
        db.getConnection.mockResolvedValue(mockConnection);
    });

    test('1. Valida la acumulación correcta de puntos por experiencia y palabras clave', async () => {
        mockConnection.query
            .mockResolvedValueOnce([[{ id: 1, years_of_experience: 4 }]])
            .mockResolvedValueOnce([[{ id: 1, status: 'OPEN' }]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[{ count: 0 }]])
            .mockResolvedValueOnce([{ insertId: 10 }]);

        const result = await applicationService.createApplication({
            candidate_id: 1,
            vacancy_id: 1,
            cover_letter: 'Tengo amplia experiencia trabajando con node, sql y api rest para desarrollar microservicios avanzados y escalables en producción.', // > 100 caracteres
            source: 'JOB_BOARD'
        });

        expect(result.score).toBe(50);
        expect(result.priority).toBe('MEDIUM');
    });

    test('2. Prueba la penalización asegurando que el puntaje jamás baje de cero', async () => {
        mockConnection.query
            .mockResolvedValueOnce([[{ id: 2, years_of_experience: 0 }]])
            .mockResolvedValueOnce([[{ id: 1, status: 'OPEN' }]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[{ count: 5 }]])
            .mockResolvedValueOnce([{ insertId: 11 }]);

        const result = await applicationService.createApplication({
            candidate_id: 2,
            vacancy_id: 1,
            cover_letter: 'Carta corta.',
            source: 'OTHER'
        });

        expect(result.score).toBe(0);
        expect(result.priority).toBe('LOW');
    });

    test('3. Comprueba que al alcanzar el puntaje máximo se asigne prioridad TOP', async () => {
        mockConnection.query
            .mockResolvedValueOnce([[{ id: 3, years_of_experience: 10 }]])
            .mockResolvedValueOnce([[{ id: 1, status: 'OPEN' }]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[{ count: 0 }]])
            .mockResolvedValueOnce([{ insertId: 12 }]);

        const result = await applicationService.createApplication({
            candidate_id: 3,
            vacancy_id: 1,
            cover_letter: 'Soy un experto senior especializado en node, sql y api con arquitecturas robustas, altamente escalables y con disponibilidad total.', // > 100 caracteres
            source: 'INTERNAL'
        });

        expect(result.score).toBe(95);
        expect(result.priority).toBe('TOP');
    });
});