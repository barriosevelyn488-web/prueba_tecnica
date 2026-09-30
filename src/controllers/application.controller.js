const applicationService = require('../services/applicationService');

class ApplicationController {
    async create(req, res) {
        try {
            const result = await applicationService.createApplication(req.body);
            return res.status(201).json({ success: true, data: result });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const data = await applicationService.getApplications(req.query);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await applicationService.updateStatus(id, status);
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ApplicationController();