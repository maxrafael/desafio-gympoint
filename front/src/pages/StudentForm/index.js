import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';

import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Input } from '@rocketseat/unform';
import { items } from '~/components/Header/menu';

import history from '~/services/history';

import { Container, Header, Data } from './styles';
import api from '~/services/api';

const schema = Yup.object().shape({
  name: Yup.string().required('* campo obrigatório'),
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('* campo obrigatório'),
  age: Yup.number()
    .typeError('* deve informar um número')
    .required('* campo obrigatório'),
  weight: Yup.number()
    .typeError('* deve informar um número')
    .required('* campo obrigatório'),
  height: Yup.number()
    .typeError('* deve informar um número')
    .required('* campo obrigatório'),
});

export default function StudentForm() {
  const [student, setStudent] = useState({});

  const { id } = useParams();

  useEffect(() => {
    async function loadStudent() {
      try {
        const { data } = await api.get('students', {
          params: { id },
        });

        setStudent(data);
      } catch (err) {
        toast.error(err.response.data.error);
      }
    }

    // eslint-disable-next-line no-use-before-define
    if (!newStudent()) {
      loadStudent();
    }
  }, []); //eslint-disable-line

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function newStudent() {
    return !id;
  }

  async function handleSubmit(data) {
    try {
      if (!id) {
        await api.post('students', data);
        toast.success('Aluno cadastrado.');
      } else {
        await api.put(`students/${student.id}`, data);
        toast.success('Cadastro atualizado.');
      }
      history.push(items.students.route);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  return (
    <Container>
      <Header>
        <strong>
          {newStudent() ? 'Cadastro de aluno' : 'Edição de aluno'}
        </strong>
        <div>
          <button
            type="button"
            onClick={() => history.push(items.students.route)}
          >
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
        onSubmit={handleSubmit}
        initialData={student}
      >
        <strong>NOME COMPLETO</strong>
        <Input name="name" />

        <strong>ENDEREÇO DE E-MAIL</strong>
        <Input name="email" type="email" placeholder="exemplo@email.com" />

        <div>
          <div>
            <strong>IDADE</strong>
            <Input name="age" placeholder="00" />
          </div>
          <div>
            <strong>PESO (em kg) </strong>
            <Input name="weight" mask="999" placeholder="000" />
          </div>
          <div>
            <strong>ALTURA</strong>
            <Input name="height" mask="9.99" placeholder="0.00" />
          </div>
        </div>
      </Data>
    </Container>
  );
}
