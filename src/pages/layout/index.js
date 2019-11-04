import React from 'react';
import { connect } from 'react-redux';
import { Header } from './components';
import { Layout } from 'antd';
import { RouteList } from '@/router';
import { UserContext } from '@/utils/contexts';

const { Content } = Layout;

const StoreLayout = ({ match, user }) => {
  return (
    <UserContext.Provider value={user}>
      <Layout className="app-container">
        <Header />
        <Content className="main-container">
          <RouteList match={match} />
        </Content>
      </Layout>
    </UserContext.Provider>
  );
};

const mapStateToProps = ({ userState }) => {
  return {
    user: userState.user
  };
};

export default connect(mapStateToProps, null)(StoreLayout);
