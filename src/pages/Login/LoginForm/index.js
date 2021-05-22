import React, { useState } from 'react';
import axios from 'axios';
import { history } from 'umi';
import { message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './style.css';

const index = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    if (!username) {
      message.error('请输入用户名');
      setMsg(() => '请输入用户名');
    } else if (!password) {
      message.error('请输入密码');
    } else {
      axios('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          username,
          password,
        },
      })
        .then((res) => res.data)
        .then((res) => {
          message.success('登录成功');
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('login', true);
          history.push('/');
        })
        .catch((err) => {
          console.error(err);
          message.error('登录失败');
        });
    }
  };

  return (
    <div className="bg">
      <div className="login">
        <div className="container">
          <div id="login">
            <div
              className="login-tabs"
              style={{
                fontSize: '24px',
                marginBottom: '20px',
                marginTop: '10px',
              }}
            >
              <p>密码登录</p>
            </div>
            <div className="login-content">
              <div className="login-form">
                <div className="fm-field">
                  <div>
                    <label className="fm-label-icon">
                      <UserOutlined className="el-icon-user" />
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="fm-text"
                      placeholder="请输入用户名"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="fm-field">
                  <div>
                    <label className="fm-label-icon">
                      <LockOutlined className="el-icon-lock" />
                    </label>
                  </div>
                  <div>
                    <input
                      type="password"
                      className="fm-text"
                      placeholder="请输入登录密码"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <button className="fm-btn" onClick={onSubmit}>
                    登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
