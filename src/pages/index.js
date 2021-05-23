import React, { useState, useEffect } from 'react';
import './index.less';
import axios from 'axios';
import { List, message, Avatar, Card, Radio } from 'antd';

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
  { label: '全部餐馆', value: '1' },
  { label: '待审核餐馆', value: '0' },
  { label: '审核未通过', value: '2' },
];

export default function IndexPage() {
  const [shopList, setShopList] = useState([]);
  const [toReview, setToReview] = useState([]);
  const [filter, setFilter] = useState('0');

  const handleToReview = (id, type) => {
    axios('/api/shop/reviewShop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        id: +id,
        type: +type,
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

  useEffect(() => {
    const user = localStorage.getItem('login');
    if (!user) {
      history.push('/login');
      return;
    }

    getItem();
  }, []);

  const getItem = () => {
    axios('/api/shop/getShops', {
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
        const toReview = res.data.filter((item) => item.isReview === 0);
        setShopList(res.data);
        setToReview(toReview);
      })
      .catch((err) => {
        message.error('获取餐馆列表失败，请刷新重试');
      });
  };

  const onChange = (e) => {
    let data = [];
    switch (e.target.value) {
      case '0':
        data = shopList.filter((item) => item.isReview == e.target.value);
        break;
      case '1':
        data = shopList;
        break;
      case '2':
        data = shopList.filter((item) => item.isReview == e.target.value);
        break;
    }
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
      <Card style={{ height: '63vh', overflowY: 'scroll' }}>
        <List
          itemLayout="horizontal"
          dataSource={toReview}
          renderItem={(item) => (
            <List.Item
              actions={[
                !item.isReview && (
                  <a
                    key="list-loadmore-edit"
                    onClick={() => {
                      handleToReview(item.id, 1);
                    }}
                  >
                    通过
                  </a>
                ),
                !item.isReview && (
                  <a
                    key="list-loadmore-edit"
                    onClick={() => {
                      handleToReview(item.id, 2);
                    }}
                  >
                    不通过
                  </a>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    size={64}
                    style={{ width: '50px', height: '50px' }}
                    src={item.pic || ''}
                  />
                }
                title={<a>{item.shop}</a>}
                description={item.address}
              />
              <div style={{ color: statusColor[item.isReview] }}>
                {statusInfo[item.isReview]}
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
