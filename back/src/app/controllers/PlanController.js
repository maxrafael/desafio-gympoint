import * as Yup from 'yup';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';

class PlanController {
  async index(req, res) {
    const { page, id } = req.query;
    const limitView = 5;

    if (id) {
      const readPlan = await Plan.findByPk(id);
      return res.json(readPlan);
    }

    if (page) {
      const plans = await Plan.findAll({
        order: ['price'],
        limit: limitView,
        offset: (page - 1) * limitView,
      });
      const Count = await Plan.count();
      const lastPage = page * limitView >= Count;

      return res.json({ lastPage, content: plans });
    }

    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { title } = req.body;

    const plan = await Plan.findByPk(req.params.id);

    if (title !== plan.title) {
      const planExists = await Plan.findOne({
        where: { title: req.body.title },
      });

      if (planExists) {
        return res.status(400).json({ error: 'Name already used.' });
      }
    }

    const { id, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    const enrollmentExists = await Enrollment.findOne({
      where: { plan_id: req.params.id },
    });

    if (enrollmentExists) {
      return res.status(400).json({ error: 'Plano com alunos matriculados.' });
    }

    await plan.destroy(plan.id);

    return res.json({ success: 'Plan deleted.' });
  }
}

export default new PlanController();
