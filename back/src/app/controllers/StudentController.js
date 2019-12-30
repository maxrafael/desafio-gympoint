import * as Yup from 'yup';
import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { page, student, id } = req.query;

    if (id) {
      const readStudent = await Student.findByPk(id);

      if (!readStudent) {
        return res.status(400).json({ error: 'Student not found' });
      }

      return res.json(readStudent);
    }

    if (page) {
      const limitView = 5;
      const where = student ? { name: { [Op.iLike]: `%${student}%` } } : {};

      const students = await Student.findAll({
        where,
        order: ['name'],
        attributes: ['id', 'name', 'email', 'age'],
        limit: limitView,
        offset: (page - 1) * limitView,
      });

      const Count = await Student.count({ where });
      const lastPage = page * limitView >= Count;

      return res.json({ lastPage, content: students });
    }
    const students = await Student.findAll();

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const studentExists = await Student.findOne({
      where: {
        [Op.or]: [{ name: req.body.name }, { email: req.body.email }],
      },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { name, email } = req.body;

    const student = await Student.findByPk(req.params.id);

    if (name !== student.name || email !== student.email) {
      const studentExists = await Student.findOne({
        where: {
          [Op.or]: [{ name: req.body.name }, { email: req.body.email }],
        },
      });

      if (studentExists) {
        return res.status(400).json({ error: 'Name or email already used.' });
      }
    }

    const { id, age, weight, height } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);

    await student.destroy(student.id);

    return res.json({ success: 'Student deleted.' });
  }
}

export default new StudentController();
