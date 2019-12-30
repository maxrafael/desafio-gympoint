import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

import {
  Container,
  Content,
  SubmitButton,
  List,
  Checkin,
  CheckNumber,
  CheckDate,
} from './styles';

import AppHeader from '~/components/Header';

import api from '~/services/api';

function Dashboard({ isFocused }) {
  const student = useSelector(state => state.student.student);
  const [checkins, setCheckins] = useState([]);

  const [page, setPage] = useState(1);
  const [scroll, setScroll] = useState(false);
  const [showLoadingMoreIndicator, setShowLoadingMoreIndicator] = useState(
    false
  );
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [loading, setLoading] = useState(false);

  function formatDateRelative(date) {
    return formatRelative(parseISO(date), new Date(), {
      locale: pt,
      addSuffix: true,
    });
  }

  async function loadCheckins(newPage) {
    const { data } = await api.get(
      `students/${student.id}/checkins?page=${newPage}`
    );

    setDataCount(data.count);

    if (!data.rows.length) {
      if (newPage === 1) {
        setCheckins([]);
      }

      setNoMoreData(true);
    } else {
      setNoMoreData(false);

      const newData = data.rows.map(checkin => ({
        ...checkin,
        formattedDate: formatDateRelative(checkin.created_at),
      }));
      if (newPage === 1) {
        setCheckins(newData);
      } else {
        const newCheckins = [...checkins, ...newData];
        setCheckins(newCheckins);
      }
    }

    setLoadingMore(false);
    setRefreshing(false);
    setShowLoadingMoreIndicator(false);

    setPage(newPage);
  }

  useEffect(() => {
    if (isFocused) {
      loadCheckins(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  async function handleLoadMore() {
    if (scroll) {
      setScroll(false);
      setLoadingMore(true);
      const newPage = page + 1;
      await loadCheckins(newPage);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    loadCheckins(1);
  }

  function renderFooter() {
    return (
      showLoadingMoreIndicator && (
        <View style={{ marginTop: 10 }}>
          <ActivityIndicator size={22} />
        </View>
      )
    );
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      const { data } = await api.post(`students/${student.id}/checkins`);

      const newCheckins = [
        { ...data, formattedDate: formatDateRelative(data.createdAt) },
        ...checkins,
      ];

      setCheckins(newCheckins);
      setDataCount(dataCount + 1);
      setLoading(false);
    } catch (err) {
      Alert.alert('Erro', err.response.data.error);
      setLoading(false);
    }
  }

  return (
    <>
      <Container>
        <AppHeader />
        <Content>
          <SubmitButton loading={loading} onPress={handleSubmit}>
            Novo check-in
          </SubmitButton>
          <List
            data={checkins}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (!loadingMore && !refreshing) {
                handleLoadMore();
              }
            }}
            onMomentumScrollBegin={() => {
              setScroll(true);
              if (!noMoreData) {
                setShowLoadingMoreIndicator(true);
              }
            }}
            keyExtractor={(item, index) => String(index)}
            ListFooterComponent={renderFooter}
            renderItem={({ item, index }) => (
              <Checkin>
                <CheckNumber>{`Checkin #${dataCount - index}`}</CheckNumber>
                <CheckDate>{item.formattedDate}</CheckDate>
              </Checkin>
            )}
          />
        </Content>
      </Container>
    </>
  );
}

const tabBarIcon = ({ tintColor }) => (
  <Icon name="edit-location" size={20} color={tintColor} />
);

Dashboard.navigationOptions = {
  tabBarLabel: 'Check-ins',
  tabBarIcon,
};

tabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Dashboard);
