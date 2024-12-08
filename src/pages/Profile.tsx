import React, { useEffect, useState } from "react";
import { Card, Typography, Input, Button, Upload, Form, message, DatePicker, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useGetIdentity } from "@refinedev/core";

const { Title, Text } = Typography;

export const Profile = () => {
  const { data:user } = useGetIdentity<{
    email: string;
    
  }>();

  const [profile, setProfile] = useState({
    username: "",
    phone: "",
    email: user?.email || "",
    dob: null,
    profileImage: null,
  });

  // Update profile when user data is loaded
  useEffect(() => {
    if (user?.email) {
      setProfile(prev => ({
        ...prev,
        email: user.email
      }));
      
      // Update form with email
      form.setFieldsValue({
        email: user.email
      });
    }
  }, [user]);

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      setProfile((prevProfile) => ({
        ...prevProfile,
        profileImage: URL.createObjectURL(info.file.originFileObj),
      }));
      message.success("Profile image uploaded successfully!");
    }
  };

  const handleUpdateProfile = (values) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      username: values.username,
      phone: values.phone,
      email: values.email,
      dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
    }));
    setIsModalVisible(true); // Show success modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        User Profile
      </Title>
      <Card
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        {/* Profile Image */}
        <div
          style={{
            width: "150px",
            height: "150px",
            margin: "0 auto",
            marginBottom: "20px",
            background: "#f0f0f0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover",  }}
            />
          ) : (
            <>
              <Text>No Image</Text>
              <Upload
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => onSuccess("ok"), 0);
                }}
                onChange={handleImageUpload}
              >
                <Button
                  icon={<UploadOutlined />}
                  type="primary"
                  size="small"
                  style={{ marginTop: "8px" }}
                >
                  Upload
                </Button>
              </Upload>
            </>
          )}
        </div>

        {/* Profile Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          initialValues={{
            username: profile.username,
            phone: profile.phone,
            email: profile.email,
            dob: profile.dob ? moment(profile.dob, "YYYY-MM-DD") : null,
          }}
        >
          <Form.Item
            name="username"
            label={<Text strong>Username</Text>}
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<Text strong>Phone Number</Text>}
            rules={[{ required: true, message: "Please enter your phone number!" }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Text strong>Email Address</Text>}
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input 
              placeholder="Enter your email address" 
              disabled 
              defaultValue={user?.email || ''}
            />
          </Form.Item>

          <Form.Item
            name="dob"
            label={<Text strong>Date-of-Birth</Text>}
            rules={[{ required: true, message: "Please select your date of birth!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Success Modal */}
      <Modal
        title="Success"
        open={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalClose}>
            OK
          </Button>,
        ]}
      >
        <p>Profile updated successfully!</p>
      </Modal>
    </div>
  );
};