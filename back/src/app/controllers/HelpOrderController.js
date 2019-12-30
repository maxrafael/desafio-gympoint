import Enrollment from '../models/Enrollment';

import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const { page } = req.query;

    const studentEnrollment = await Enrollment.findOne({
      where: {
        student_id: req.params.id,
      },
    });

    if (!studentEnrollment) {
      return res.status(400).json({ error: 'Student not found or enrolled.' });
    }

    let limitView = {};

    if (page) {
      limitView = {
        offset: (page - 1) * 10,
        limit: 10,
      };
    }

    const helpOrders = await HelpOrder.findAndCountAll({
      where: {
        student_id: req.params.id,
      },
      order: [['created_at', 'DESC']],
      ...limitView,
      attributes: ['created_at', 'question', 'answer', 'answer_at'],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const studentEnrollment = await Enrollment.findOne({
      where: {
        student_id: req.params.id,
      },
    });

    if (!studentEnrollment) {
      return res.status(400).json({ error: 'Student not found or enrolled.' });
    }

    const { question } = req.body;

    const helpOrder = await HelpOrder.create({
      student_id: req.params.id,
      question,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
