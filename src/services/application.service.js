const db = require('../config/db');

class ApplicationService {
    async createApplication(data) {
        const { candidate_id, vacancy_id, cover_letter = '', source = 'JOB_BOARD' } = data;
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            const [candidates] = await connection.query('SELECT * FROM candidates WHERE id = ?', [candidate_id]);
            if (candidates.length === 0) throw new Error('Candidato no encontrado');
            const candidate = candidates[0];

            const [vacancies] = await connection.query('SELECT * FROM vacancies WHERE id = ?', [vacancy_id]);
            if (vacancies.length === 0) throw new Error('Vacante no encontrada');
            if (vacancies[0].status !== 'OPEN') throw new Error('La vacante está cerrada');

            const [existing] = await connection.query(
                `SELECT * FROM applications 
                 WHERE candidate_id = ? AND (
                     status IN ('RECEIVED', 'IN_REVIEW') 
                     OR (status = 'REJECTED' AND updated_at >= NOW() - INTERVAL 30 DAY)
                 )`,
                [candidate_id]
            );
            if (existing.length > 0) {
                throw new Error('El candidato tiene un proceso activo o fue rechazado hace menos de 30 días');
            }

            const [activeApps] = await connection.query(
                `SELECT COUNT(*) as count FROM applications WHERE candidate_id = ? AND status IN ('RECEIVED', 'IN_REVIEW')`,
                [candidate_id]
            );
            const activeCount = activeApps[0].count;

            let score = candidate.years_of_experience * 5;
            const sourceBonuses = { REFERRAL: 15, INTERNAL: 20, JOB_BOARD: 5, OTHER: 0 };
            score += sourceBonuses[source] || 0;

            const lowerLetter = cover_letter.toLowerCase();
            if (lowerLetter.includes('node')) score += 5;
            if (lowerLetter.includes('sql')) score += 5;
            if (lowerLetter.includes('api')) score += 5;
            if (cover_letter.length > 100) score += 10;

            score -= (activeCount * 5);
            if (score < 0) score = 0;
            if (score > 100) score = 100;

            let priority = 'LOW';
            if (score >= 85) priority = 'TOP';
            else if (score >= 70) priority = 'HIGH';
            else if (score >= 50) priority = 'MEDIUM';

            const [result] = await connection.query(
                `INSERT INTO applications (candidate_id, vacancy_id, cover_letter, source, score, priority, status) 
                 VALUES (?, ?, ?, ?, ?, ?, 'RECEIVED')`,
                [candidate_id, vacancy_id, cover_letter, source, score, priority]
            );

            await connection.commit();
            return { id: result.insertId, score, priority, status: 'RECEIVED' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getApplications(filters) {
        let query = 'SELECT * FROM applications WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }
        if (filters.vacancy_id) {
            query += ' AND vacancy_id = ?';
            params.push(filters.vacancy_id);
        }

        query += ' ORDER BY score DESC, created_at DESC';
        const [rows] = await db.query(query, params);
        return rows;
    }

    async updateStatus(id, newStatus) {
        const validStatuses = ['RECEIVED', 'IN_REVIEW', 'REJECTED', 'HIRED'];
        if (!validStatuses.includes(newStatus)) throw new Error('Estado inválido');

        const [rows] = await db.query('SELECT * FROM applications WHERE id = ?', [id]);
        if (rows.length === 0) throw new Error('Postulación no encontrada');

        if (['HIRED', 'REJECTED'].includes(rows[0].status)) {
            throw new Error('No se puede modificar una postulación en estado final');
        }

        await db.query('UPDATE applications SET status = ? WHERE id = ?', [newStatus, id]);
        return { id, status: newStatus };
    }
}

module.exports = new ApplicationService();