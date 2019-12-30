import * as Yup from 'yup';

import { parseISO, addMonths } from 'date-fns';

import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const { page, id } = req.query;

    const include = [
      {
        model: Student,
        as: 'student',
        attributes: ['id', 'name'],
      },
      {
        model: Plan,
        as: 'plan',
        attributes: ['id', 'title', 'duration'],
      },
    ];

    if (id) {
      const enrollment = await Enrollment.findByPk(id, { include });
      return res.json(enrollment);
    }

    if (page) {
      const limitView = 5;

      const Count = await Enrollment.count();
      const lastPage = page * limitView >= Count;

      const enrollments = await Enrollment.findAll({
        order: [['end_date', 'DESC']],
        attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
        limit: limitView,
        offset: (page - 1) * limitView,
        include,
      });
      return res.json({ lastPage, content: enrollments });
    }

    const enrollments = await Enrollment.findAll();

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { student_id, plan_id, date } = req.body;

    const planExists = await Plan.findByPk(plan_id);

    const { duration, price } = planExists;

    const totalPrice = duration * price;
    const init_date = parseISO(date);
    const finish_date = addMonths(init_date, duration);

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: init_date,
      end_date: finish_date,
      price: totalPrice,
    });

    const student = await Student.findOne({
      where: { id: student_id },
    });

    await Queue.add(EnrollmentMail.key, {
      student,
      planExists,
      init_date,
      finish_date,
      totalPrice,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { student_id, plan_id, date } = req.body;

    const planExists = await Plan.findByPk(plan_id);

    const { duration, price } = planExists;

    const totalPrice = duration * price;
    const init_date = parseISO(date);
    const finish_date = addMonths(init_date, duration);

    const enrollment = await Enrollment.findByPk(req.params.id);

    const { id, start_date, end_date } = await enrollment.update({
      student_id,
      plan_id,
      start_date: init_date,
      end_date: finish_date,
      price: totalPrice,
    });

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    await enrollment.destroy(enrollment.id);

    return res.json({ success: 'Enrollment deleted.' });
  }
}

export default new EnrollmentController();
