import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, Modal, Form, Input, InputNumber, Switch } from 'antd';

const { Meta } = Card;
const { Title } = Typography;

export const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // New state for Add Modal
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const response = await fetch('http://localhost:3000/api/menu');
    const data = await response.json();
    setMenuItems(data);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    const response = await fetch(`http://localhost:3000/api/menu/${editingItem._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      fetchMenuItems();
      setIsEditModalOpen(false);
    }
  };

  const handleAddSubmit = async (values) => {
    const response = await fetch('http://localhost:3000/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      fetchMenuItems();
      setIsAddModalOpen(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Food Menu</Title>

      {/* Add New Item Button */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          Add New Item
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {menuItems.map((item) => (
          <Col xs={24} sm={12} md={8} lg={8} key={item._id}>
            <Card
              hoverable
              cover={<img alt={item.foodname} src={item.image} />}
              style={{ borderRadius: '8px', overflow: 'hidden' }}
            >
              <Meta title={item.foodname} description={`Price: $${item.price}`} />
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <Button type="primary" style={{ marginRight: '10px' }}>Add to Cart</Button>
                <Button type="default" onClick={() => handleEdit(item)}>Edit</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit Modal */}
      <Modal
        title="Edit Menu Item"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        {editingItem && (
          <Form
            initialValues={editingItem}
            onFinish={handleEditSubmit}
            layout="vertical"
          >
            <Form.Item name="foodname" label="Food Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="foodstatus" label="Available" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="image" label="Image URL">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        title="Add New Menu Item"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form
          onFinish={handleAddSubmit}
          layout="vertical"
        >
          <Form.Item name="foodname" label="Food Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="foodstatus" label="Available" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
