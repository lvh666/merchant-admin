import React, { useState } from 'react';
import { Layout, Menu, message } from 'antd';
import {
  UserOutlined,
  RestOutlined,
  LogoutOutlined,
  MessageOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GitlabOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useLocation, history } from 'umi';
import './index.css';

const { Header, Content, Sider } = Layout;

const BasicLayout = (props) => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleJump = (path) => {
    history.push(path);
  };

  const handleLogout = () => {
    message.success('退出成功');
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    history.push('/login');
  };

  const getUser = () => {
    const user = localStorage.getItem('login');

    if (!user) {
      history.push('/login');
      return <></>;
    }

    return (
      <span style={{ float: 'right' }}>
        <UserOutlined /> admin
        <LogoutOutlined
          style={{ marginRight: '30px', marginLeft: '20px', cursor: 'pointer' }}
          onClick={handleLogout}
        />
      </span>
    );
  };

  return pathname === '/login' ? (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: '#f8f8f8',
        overflow: 'hidden',
      }}
    >
      {props.children}
    </div>
  ) : (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ height: '100vh' }}
      >
        <div className="logo">
          <GitlabOutlined />
          {!collapsed && '商家审核系统'}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item
            key="1"
            onClick={() => {
              handleJump('/');
            }}
            icon={<ShopOutlined />}
            title="餐馆审核"
          >
            餐馆审核
          </Menu.Item>
          <Menu.Item
            key="2"
            onClick={() => {
              handleJump('/comment');
            }}
            icon={<MessageOutlined />}
          >
            评论管理
          </Menu.Item>
          {/* <Menu.Item
            key="3"
            onClick={() => {
              handleJump('/product');
            }}
            icon={<RestOutlined />}
          >
            商品管理
          </Menu.Item> */}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => {
                setCollapsed(() => !collapsed);
              },
            },
          )}
          {getUser()}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
