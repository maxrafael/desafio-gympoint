import React, { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';

import { toast } from 'react-toastify';

import api from '~/services/api';
import history from '~/services/history';

import { formatPrice } from '~/util/format';

import { Container, Header, Data, Pagination } from './styles';

export default function Plan() {
  const [plans, setPlans] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadPlans(1);
  }, []);

  async function loadPlans(currentPage) {
    const { data } = await api.get('plans', {
      params: { page: currentPage },
    });

    const newData = data.content.map(plan => ({
      ...plan,
      duration: `${plan.duration} ${plan.duration > 1 ? 'Meses' : 'Mês'}`,
      price: formatPrice(plan.price),
    }));

    setPage(currentPage);
    setLastPage(data.lastPage);
    setPlans(newData);
  }

  function handlePrevPage() {
    const currentPage = page - 1;
    loadPlans(currentPage);
  }

  function handleNextPage() {
    const currentPage = page + 1;
    loadPlans(currentPage);
  }

  async function handleDeletePlan({ id }) {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Tem certeza que deseja excluir o plano?`))
      try {
        await api.delete(`/plans/${id}`);

        const newPlans = plans.filter(plan => plan.id !== id);

        let newPage = newPlans.length ? page : page - 1;
        if (newPage === 0) {
          newPage = 1;
        }

        loadPlans(newPage);

        toast.success('Plano excluido.');
      } catch (err) {
        const { error } = err.response.data;
        toast.error(error);
      }
  }

  return (
    <Container>
      <Header>
        <strong>Gerenciando planos</strong>
        <button type="button" onClick={() => history.push('/plans/add')}>
          <MdAdd color="#fff" size={16} />
          <span>CADASTRAR</span>
        </button>
      </Header>

      <>
        <Data>
          <thead>
            <tr>
              <th>TÍTULO</th>
              <th>DURAÇÃO</th>
              <th>VALOR p/ MÊS</th>
              <th aria-label="Vazia" />
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id}>
                <td>{plan.title}</td>
                <td>{plan.duration}</td>
                <td>{plan.price}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => history.push(`/plans/${plan.id}`)}
                  >
                    editar
                  </button>
                  <button type="button" onClick={() => handleDeletePlan(plan)}>
                    apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Data>

        <Pagination>
          <button type="button" disabled={page === 1} onClick={handlePrevPage}>
            Anterior
          </button>
          <button type="button" disabled={lastPage} onClick={handleNextPage}>
            Próxima
          </button>
        </Pagination>
      </>
    </Container>
  );
}
