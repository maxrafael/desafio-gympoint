import React, { useState, useEffect } from 'react';
import { MdAdd, MdCheckCircle } from 'react-icons/md';

import { toast } from 'react-toastify';

import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';
import history from '~/services/history';

import { Container, Header, Data, Pagination, DataEmpty } from './styles';

export default function Enrollment() {
  const [enrollments, setEnrollments] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadEnrollments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dateFormatted(date) {
    return format(parseISO(date), "d 'de' MMMM 'de' yyyy", {
      locale: pt,
    });
  }

  async function loadEnrollments(currentPage) {
    const { data } = await api.get('enrollments', {
      params: { page: currentPage },
    });

    const newData = data.content.map(enrollment => ({
      ...enrollment,
      start_date: dateFormatted(enrollment.start_date),
      end_date: dateFormatted(enrollment.end_date),
    }));

    setPage(currentPage);
    setLastPage(data.lastPage);
    setEnrollments(newData);
  }

  async function handleDeleteEnrollment({ id }) {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Tem certeza que deseja excluir a matrícula?`))
      try {
        await api.delete(`/enrollments/${id}`);

        const newEnrollments = enrollments.filter(
          enrollment => enrollment.id !== id
        );

        let newPage = newEnrollments.length ? page : page - 1;
        if (newPage === 0) {
          newPage = 1;
        }

        loadEnrollments(newPage);

        toast.success('Matrícula excluida.');
      } catch (err) {
        const { error } = err.response.data;
        toast.error(error);
      }
  }

  function handlePrevPage() {
    const currentPage = page - 1;
    loadEnrollments(currentPage);
  }

  function handleNextPage() {
    const currentPage = page + 1;
    loadEnrollments(currentPage);
  }
  return (
    <Container>
      <Header>
        <strong>Gerenciando matrículas</strong>
        <button type="button" onClick={() => history.push('/enrollments/add')}>
          <MdAdd color="#fff" size={16} />
          <span>CADASTRAR</span>
        </button>
      </Header>
      {enrollments.length ? (
        <>
          <Data>
            <thead>
              <tr>
                <th>ALUNO</th>
                <th>PLANO</th>
                <th>INÍCIO</th>
                <th>TÉRMINO</th>
                <th>ATIVA</th>
                <th aria-label="Vazia" />
              </tr>
            </thead>
            <tbody>
              {enrollments.map(enrollment => (
                <tr key={enrollment.id}>
                  <td>{enrollment.student.name}</td>
                  <td>{enrollment.plan.title}</td>
                  <td>{enrollment.start_date}</td>
                  <td>{enrollment.end_date}</td>
                  <td>
                    {enrollment.active ? (
                      <MdCheckCircle color="#33D043" size={18} />
                    ) : (
                      <MdCheckCircle color="#cccccc" size={18} />
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        history.push(`/enrollments/${enrollment.id}`)
                      }
                    >
                      editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEnrollment(enrollment)}
                    >
                      apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Data>

          <Pagination>
            <button
              type="button"
              disabled={page === 1}
              onClick={handlePrevPage}
            >
              Anterior
            </button>
            <button type="button" disabled={lastPage} onClick={handleNextPage}>
              Próxima
            </button>
          </Pagination>
        </>
      ) : (
        <DataEmpty>
          <span>Nenhum registro encontrado</span>
        </DataEmpty>
      )}
    </Container>
  );
}
