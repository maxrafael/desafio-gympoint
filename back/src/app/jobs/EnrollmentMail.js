import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { student, planExists, init_date, finish_date, totalPrice } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Nova matrícula',
      template: 'enrollment',
      context: {
        student: student.name,
        student_id: student.id,
        plan: planExists.title,
        start_date: format(parseISO(init_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        end_date: format(parseISO(finish_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(totalPrice),
      },
    });
  }
}

export default new EnrollmentMail();
