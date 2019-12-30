/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';

import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { parseISO, addMonths } from 'date-fns';

import MyDatePicker from '~/components/MyDatePicker';
import CurrencyInput from '~/components/MyCurrencyInput';

import api from '~/services/api';

import 'react-datepicker/dist/react-datepicker.css';

import history from '~/services/history';

import {
  Container,
  Header,
  Data,
  Row,
  StudentPicker,
  PlanPicker,
} from './styles';

const schema = Yup.object().shape({
  student: Yup.mixed().required('* campo obrigatório'),
  plan: Yup.mixed().required('* campo obrigatório'),
  start_date: Yup.date()
    .typeError('* deve informar uma data')
    .required('* campo obrigatório'),
});

export default function EnrollmentForm() {
  const [enrollment, setEnrollment] = useState({});
  const [plans, setPlans] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    async function pageLoad() {
      if (!isNewEnrollment()) {
        const fetchPlansPromise = fetchPlans();
        const fetchEnrollmentPromise = fetchEnrollment();

        const plansData = (await fetchPlansPromise).data;
        const enrollmentData = (await fetchEnrollmentPromise).data;

        setPlans(plansData);

        setEnrollment({
          ...enrollmentData,
          start_date: parseISO(enrollmentData.start_date),
          end_date: parseISO(enrollmentData.end_date),
        });
      } else {
        const { data } = await fetchPlans();
        setPlans(data);
      }
    }

    pageLoad();
  }, []); //eslint-disable-line

  function fetchStudents() {
    return api.get('students');
  }

  function fetchPlans() {
    return api.get('plans');
  }

  function fetchEnrollment() {
    return api.get('enrollments', {
      params: { id },
    });
  }

  function isNewEnrollment() {
    return !id;
  }

  async function handleFormSubmit(data) {
    try {
      if (isNewEnrollment()) {
        await insertEnrollment(data);
      } else {
        await updateEnrollment(data);
      }
      history.push('/enrollments');
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  function fixHttpData(data) {
    data = {
      ...data,
      student_id: data.student.id,
      plan_id: data.plan.id,
      date: data.start_date,
    };

    delete data.student;
    delete data.plan;
    delete data.start_date;
    delete data.price;
    delete data.end_date;

    return data;
  }

  async function insertEnrollment(data) {
    data = fixHttpData(data);

    await api.post('enrollments', data);
    toast.success('Matrícula realizada');
  }

  async function updateEnrollment(data) {
    data = fixHttpData(data);

    await api.put(`enrollments/${enrollment.id}`, data);
    toast.success('Matrícula alterada');
  }

  const filterColors = (data, inputValue) => {
    return data.filter(i =>
      i.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const loadStudentOptions = async inputValue => {
    async function loadStudents() {
      const { data } = await fetchStudents();
      return data;
    }
    const data = await loadStudents();

    return new Promise(resolve => {
      resolve(filterColors(data, inputValue));
    });
  };

  function handleStartDateChange(newDate) {
    setEnrollment({
      ...enrollment,
      start_date: newDate,
      end_date: addMonths(newDate, enrollment.plan.duration),
    });
  }

  function handlePlanChange(newPlan) {
    setEnrollment({
      ...enrollment,
      plan: newPlan,
      end_date: enrollment.start_date
        ? addMonths(enrollment.start_date, newPlan.duration)
        : null,
      price: newPlan.price * newPlan.duration,
    });
  }

  return (
    <Container>
      <Header>
        <strong>
          {isNewEnrollment() ? 'Cadastro de matrícula' : 'Edição de matrícula'}
        </strong>
        <div>
          <button type="button" onClick={() => history.push('/enrollments')}>
            <MdKeyboardArrowLeft color="#fff" size={16} />
            <span>VOLTAR</span>
          </button>

          <button type="submit" form="Form">
            <MdCheck color="#fff" size={16} />
            <span>SALVAR</span>
          </button>
        </div>
      </Header>
      <Data
        id="Form"
        schema={schema}
        initialData={enrollment}
        onSubmit={handleFormSubmit}
      >
        <div>
          <strong>ALUNO</strong>
          <StudentPicker
            className="InputValidation"
            name="student"
            loadOptions={loadStudentOptions}
          />
        </div>

        <Row>
          <div>
            <strong>PLANO</strong>
            <PlanPicker
              className="InputValidation"
              name="plan"
              options={plans}
              onChange={handlePlanChange}
            />
          </div>
          <div>
            <strong>DATA DE INÍCIO</strong>
            <MyDatePicker
              className="InputValidation"
              name="start_date"
              dateFormat="dd/MM/yyyy"
              locale="pt"
              onChange={handleStartDateChange}
            />
          </div>
          <div>
            <strong>DATA DE TÉRMINO</strong>
            <MyDatePicker
              name="end_date"
              dateFormat="dd/MM/yyyy"
              locale="pt"
              disabled
            />
          </div>
          <div>
            <strong>VALOR FINAL</strong>
            <CurrencyInput name="price" prefix="R$ " disabled />
          </div>
        </Row>
      </Data>
    </Container>
  );
}
