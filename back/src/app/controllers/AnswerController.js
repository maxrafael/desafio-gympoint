import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async index(req, res) {
    const { page } = req.query;
    const limitView = 5;

    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
      order: ['created_at'],
      attributes: ['id', 'student_id', 'question'],
      limit: limitView,
      offset: (page - 1) * limitView,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    const Count = await HelpOrder.count({
      where: {
        answer_at: null,
      },
    });
    const lastPage = page * limitView >= Count;

    return res.json({ lastPage, content: helpOrders });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations Fails' });
    }

    const helpOrders = await HelpOrder.findByPk(req.params.id);

    if (!helpOrders) {
      return res.status(400).json({ error: 'Question not found' });
    }

    const student = await Student.findByPk(helpOrders.student_id);

    const { answer } = req.body;

    await helpOrders.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerMail.key, {
      student,
      helpOrders,
    });

    return res.json(helpOrders);
  }
}

export default new AnswerController();
