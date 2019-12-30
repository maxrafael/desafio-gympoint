import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';

import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';

import { Container, Header, Data, DataEmpty, Pagination } from './styles';

export default function Student() {
  const [studentName, setStudentName] = useState([]);
  const [students, setStudents] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadStudents(1);
  }, []); //eslint-disable-line

  async function loadStudents(currentPage) {
    try {
      const { data } = await api.get('students', {
        params: { student: studentName, page: currentPage },
      });

      setPage(currentPage);
      setLastPage(data.lastPage);
      setStudents(data.content);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  function handleSearchStudent(e) {
    setStudentName(e.target.value);
  }

  async function handleDeleteStudent({ id }) {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Tem certeza que deseja excluir o aluno?`))
      try {
        await api.delete(`/students/${id}`);

        const newStudents = students.filter(student => student.id !== id);

        let newPage = newStudents.length ? page : page - 1;
        if (newPage === 0) {
          newPage = 1;
        }

        loadStudents(newPage);

        toast.success('Aluno excluido.');
      } catch (err) {
        const { error } = err.response.data;
        toast.error(error);
      }
  }

  function handlePrevPage() {
    const currentPage = page - 1;
    loadStudents(currentPage);
  }

  function handleNextPage() {
    const currentPage = page + 1;
    loadStudents(currentPage);
  }

  return (
    <Container>
      <Header>
        <strong>Gerenciando alunos</strong>
        <button type="button" onClick={() => history.push('/students/add')}>
          <MdAdd color="#fff" size={16} />
          <span>CADASTRAR</span>
        </button>
        <span>
          <MdSearch color="#999999" size={16} />
          <input
            name="studentName"
            placeholder="Buscar aluno"
            onKeyDown={event => event.key === 'Enter' && loadStudents(1)}
            onChange={handleSearchStudent}
          />
        </span>
      </Header>
      {students.length ? (
        <>
          <Data>
            <thead>
              <tr>
                <th>NOME</th>
                <th>E-MAIL</th>
                <th>IDADE</th>
                <th aria-label="Vazia" />
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => history.push(`/students/${student.id}`)}
                    >
                      editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStudent(student)}
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
