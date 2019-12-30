import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { Form, Textarea } from '@rocketseat/unform';
import * as Yup from 'yup';

import api from '~/services/api';

import {
  Container,
  Header,
  DataEmpty,
  Data,
  Pagination,
  AnswerModal,
} from './styles';

const schema = Yup.object().shape({
  answer: Yup.string().required('* campo obrigatório'),
});

export default function HelpOrder() {
  const [helpOrders, setHelpOrders] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);
  const [viewModal, setViewModal] = useState();
  const [selectedHelpOrder, setSelectedHelpOrder] = useState();

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadHelpOrders(1);
  }, []);

  async function loadHelpOrders(currentPage) {
    const { data } = await api.get('help-orders/answer', {
      params: { page: currentPage },
    });

    const newData = data.content.map(helporder => ({
      ...helporder,
    }));

    setPage(currentPage);
    setLastPage(data.lastPage);
    setHelpOrders(newData);
  }

  async function handleSubmit(data) {
    try {
      await api.put(`help-orders/${selectedHelpOrder.id}/answer`, data);

      toast.success('Resposta salva');

      const newHelpOrders = helpOrders.filter(
        helpOrder => helpOrder.id !== selectedHelpOrder.id
      );

      let newPage = newHelpOrders.length ? page : page - 1;
      if (newPage === 0) {
        newPage = 1;
      }

      loadHelpOrders(newPage);

      setViewModal(false);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  function openModal() {
    setViewModal(true);
  }

  function handleAnswer(helpOrder) {
    console.tron.log(helpOrder);
    setSelectedHelpOrder(helpOrder);
    openModal();
  }

  function handlePrevPage() {
    const currentPage = page - 1;
    loadHelpOrders(currentPage);
  }

  function handleNextPage() {
    const currentPage = page + 1;
    loadHelpOrders(currentPage);
  }

  return (
    <Container>
      <Header>
        <strong>Pedidos de auxílio</strong>
      </Header>
      {helpOrders.length ? (
        <>
          <Data>
            <thead>
              <tr>
                <th>ALUNO</th>
                <th aria-label="Vazia" />
              </tr>
            </thead>
            <tbody>
              {helpOrders.map(helporder => (
                <tr key={helporder.id}>
                  <td>{helporder.student.name}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleAnswer(helporder)}
                    >
                      responder
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

      <AnswerModal
        isOpen={viewModal}
        onRequestClose={() => setViewModal(false)}
      >
        <span>
          <strong>PERGUNTA DO ALUNO</strong>
        </span>
        <span>{selectedHelpOrder && selectedHelpOrder.question}</span>
        <span>
          <strong>SUA RESPOSTA</strong>
        </span>
        <Form schema={schema} onSubmit={handleSubmit}>
          <Textarea
            name="answer"
            type="text"
            placeholder="Sua resposta aqui..."
            onChange={e =>
              setSelectedHelpOrder({
                ...selectedHelpOrder,
                answer: e.target.value,
              })
            }
          />
          <button type="submit">Responder aluno</button>
        </Form>
      </AnswerModal>
    </Container>
  );
}
