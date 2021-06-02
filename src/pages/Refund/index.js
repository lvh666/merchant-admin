import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Table, Card, Radio } from 'antd';

const statusInfo = {
  0: '未支付',
  1: '支付',
  2: '退款申请中',
  3: '取消订单',
};

const statusColor = {
  0: 'red',
  1: 'green',
  2: 'orange',
  3: 'green',
};

const options = [
  { label: '未支付', value: '0' },
  { label: '支付', value: '1' },
  { label: '退款申请中', value: '2' },
  { label: '取消订单', value: '3' },
];

export default function IndexPage() {
  const [shopList, setShopList] = useState([]);
  const [toReview, setToReview] = useState([]);
  const [filter, setFilter] = useState('2');

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'ids',
    },
    {
      title: '商品名称',
      dataIndex: 'product',
      key: 'product.name',
      render: (text, record) => record.product.product,
    },
    { title: '数量', dataIndex: 'num', key: 'num' },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'prices',
      render: (text) => `￥${(+text).toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'states',
      render: (text) => (
        <div style={{ color: statusColor[text] }}>{statusInfo[text]}</div>
      ),
    },
    {
      title: '审核',
      dataIndex: '',
      key: 'xs',
      render: (text, record) =>
        record.state === 2 && (
          <div>
            <a
              onClick={() => {
                handleToReview(record.id, 3);
              }}
            >
              通过
            </a>
            <a
              style={{ marginLeft: '5px' }}
              onClick={() => {
                handleToReview(record.id, 1);
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

  const handleToReview = (id, status) => {
    axios('/api/order/Item', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        id: +id,
        status: +status,
        flag: true,
      },
    })
      .then((res) => {
        message.info(res.data.msg);
        getItem();
      })
      .catch((err) => {
        console.error(err);
        message.error('审核失败，请重新审核');
      });
  };

  const getItem = () => {
    axios('/api/order/getAllOrderList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        curPage: 0,
        pageNum: 100,
      },
    })
      .then((res) => res.data)
      .then((res) => {
        const toReview = res.data.filter((item) => item.state === 2);
        setShopList(res.data);
        setToReview(toReview);
      })
      .catch((err) => {
        message.error('获取审核列表失败，请刷新重试');
      });
  };

  const onChange = (e) => {
    let data = shopList.filter((item) => item.state == e.target.value);
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
      <Table
        columns={columns}
        dataSource={toReview}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
