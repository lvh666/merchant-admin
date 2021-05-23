import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, message, Avatar, Card, Radio } from 'antd';

export default function IndexPage() {
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: 'shop',
      dataIndex: 'shop',
      key: 'shop',
      render: (text, record) => record.shop.shop,
    },
    { title: 'content', dataIndex: 'content', key: 'content' },
    {
      title: 'create_date',
      dataIndex: 'create_date',
      key: 'create_date',
      render: (text, record) => text.slice(0, 10),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => <a onClick={() => delItem(record)}>Delete</a>,
    },
  ];

  const delItem = (record) => {
    axios('/api/comment/Item', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      params: {
        id: +record.id,
      },
    })
      .then((res) => {
        if (res.data.msg === '取消成功') {
          message.success('删除成功');
          getItem();
        } else {
          message.error('删除失败');
        }
      })
      .catch((err) => {
        console.error(err);
        message.error('删除失败');
      });
  };

  useEffect(() => {
    const user = localStorage.getItem('login');
    if (!user) {
      history.push('/login');
      return;
    }
    getItem();
  }, []);

  const getItem = () => {
    axios('/api/comment/getAllComment', {
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
        setComments(() => res.data.comments);
        setPagination(() => ({
          current: pagination.current + 1,
          pageSize: pagination.pageSize,
          total: res.data.total,
        }));
      })
      .catch((err) => {
        message.error('获取评论列表失败，请刷新重试');
      });
  };

  return (
    <div>
      <Table columns={columns} dataSource={comments} pagination={pagination} />
    </div>
  );
}
