import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { student, helpOrders } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Resposta de Academia GymPoint',
      template: 'answer',
      context: {
        student: student.name,
        question: helpOrders.question,
        answer: helpOrders.answer,
        answer_at: formatRelative(parseISO(helpOrders.answer_at), new Date(), {
          locale: pt,
        }),
      },
    });
  }
}

export default new EnrollmentMail();
