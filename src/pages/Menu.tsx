import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, Modal, Input, InputNumber, Switch, Upload, message, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Meta } = Card;

export const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [foodname, setFoodname] = useState('');
  const [price, setPrice] = useState('');
  const [foodstatus, setFoodstatus] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      message.error('Error loading menu items');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    const file = values.image?.[0]?.originFileObj;
    if (!file) {
      message.error('Please upload an image.');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const formData = {
        foodname: values.foodname,
        price: values.price,
        foodstatus: values.foodstatus ? 'true' : 'false',
        image: reader.result, // Base64 encoded string
      };
  
      try {
        await axios.post('http://localhost:3000/api/menu', formData);
        message.success('Menu item added successfully!');
        setIsAddModalOpen(false);
        fetchMenuItems();
      } catch (err) {
        message.error('Failed to add menu item.');
      }
    };
  
    reader.readAsDataURL(file);
  };


  const handleAddSubmit = async (values) => {
    const file = values.image?.[0]?.originFileObj;
    if (!file) {
      message.error('Please upload an image.');
      return;
    }

    console.log('Form Data:', values);
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      const formData = {
        foodname: values.foodname,
        price: values.price,
        foodstatus: values.foodstatus ? 'true' : 'false',
        image: reader.result, // Base64 encoded string
      };
  
      try {
        await axios.post('http://localhost:3000/api/menu', formData);
        message.success('Menu item added successfully!');
        setIsAddModalOpen(false);
        fetchMenuItems();
      } catch (err) {
        message.error('Failed to add menu item.');
      }
    };
  
    reader.readAsDataURL(file);
  };

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      setImageFile(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error('Failed to upload image');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Food Menu</Title>

      <div style={{ marginBottom: '20px', textAlign: 'right' }}>
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


      {/* Add New Item Modal */}
      <Modal
        title="Add New Menu Item"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
         <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
          <Form.Item name="foodname" label="Food Name" rules={[{ required: true, message: 'Please enter food name' }]}>            
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter price' }]}>            
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="foodstatus" label="Available" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item 
              name="image" 
              label="Upload Image" 
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList;
              }}
              
              >
            <Upload listType="picture" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
