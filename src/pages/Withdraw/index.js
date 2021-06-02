import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Table, Card, Radio } from 'antd';

const statusInfo = {
  0: '待审核',
  1: '通过审核',
  2: '审核未通过',
};

const statusColor = {
  0: 'orange',
  1: 'green',
  2: 'red',
};

const options = [
  { label: '待审核', value: '0' },
  { label: '通过', value: '1' },
  { label: '未通过', value: '2' },
];

export default function IndexPage() {
  const [shopList, setShopList] = useState([]);
  const [toReview, setToReview] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
  });
  const [filter, setFilter] = useState('0');

  const columns = [
    {
      title: '提现账户',
      dataIndex: 'paypal',
      key: 'paypal',
    },
    { title: '账户名', dataIndex: 'name', key: 'name' },
    {
      title: '提现用户',
      dataIndex: 'user',
      key: 'user',
      render: (text, record) => record.user.name,
    },
    {
      title: '用户余额',
      dataIndex: 'user',
      key: 'user.money',
      render: (text, record) => `￥${record.user.money}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <div style={{ color: statusColor[text] }}>{statusInfo[text]}</div>
      ),
    },
    {
      title: '审核',
      dataIndex: '',
      key: 'x',
      render: (text, record) =>
        !record.status && (
          <div>
            <a
              onClick={() => {
                handleToReview(record.id, 1, record.user_id);
              }}
            >
              通过
            </a>
            <a
              style={{ marginLeft: '5px' }}
              onClick={() => {
                handleToReview(record.id, 2, record.user_id);
              }}
            >
              不通过
            </a>
          </div>
        ),
    },
  ];

  useEffect(() => {
    const user = localStorage.getItem('login');
    if (!user) {
      history.push('/login');
      return;
    }
    getItem();
  }, []);

  const handleToReview = (id, status, userId) => {
    axios('/api/withdraw/isWithdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        id: +id,
        status: +status,
        userId: +userId,
      },
    })
      .then((res) => {
        if (res.data.msg === '审核成功') {
          message.success(res.data.msg);
          getItem();
        } else {
          message.error(res.data.msg);
        }
      })
      .catch((err) => {
        console.error(err);
        message.error('审核失败，请重新审核');
      });
  };

  const getItem = () => {
    axios('/api/withdraw/getWithdrawList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        curPage: pagination.current - 1,
        pageNum: pagination.pageSize,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        const toReview = res.data.filter((item) => item.status === 0);
        setShopList(res.data);
        setToReview(toReview);
      })
      .catch((err) => {
        message.error('获取审核列表失败，请刷新重试');
      });
  };

  const onChange = (e) => {
    let data = shopList.filter((item) => item.status == e.target.value);
    setToReview(() => data);
    setFilter(() => e.target.value);
  };

  return (
    <div>
      <Card>
        <Radio.Group
          options={options}
          onChange={onChange}
          value={filter}
          optionType="button"
          buttonStyle="solid"
        />
      </Card>
      <Table columns={columns} dataSource={toReview} pagination={pagination} />
    </div>
  );
}
