import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Enrollment from '../models/Enrollment';

class CheckinController {
  async index(req, res) {
    const studentEnrollment = await Enrollment.findOne({
      where: {
        student_id: req.params.id,
      },
    });

    if (!studentEnrollment) {
      return res.status(400).json({ error: 'Student not found or enrolled.' });
    }

    const { page } = req.query;

    let limitView = {};

    if (page) {
      limitView = {
        offset: (page - 1) * 15,
        limit: 15,
      };
    }

    const checkins = await Checkin.findAndCountAll({
      where: { student_id: req.params.id },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'created_at'],
      ...limitView,
    });

    return res.json(checkins);
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

    const currentDate = new Date();

    const verifyCheckins = await Checkin.findAll({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.between]: [subDays(currentDate, 7), currentDate],
        },
      },
    });

    if (verifyCheckins.length >= 5) {
      return res.status(400).json({ error: 'Limite de check-ins excedidos' });
    }

    const checkin = await Checkin.create({
      student_id: req.params.id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
