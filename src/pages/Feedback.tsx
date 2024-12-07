import React, { useState } from "react";
import { Tabs, Form, Input, Button, Card, Typography, Row, Col, DatePicker, TimePicker, Switch, Select } from "antd";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [form] = Form.useForm();

  const handleSubmitFeedback = (values) => {
    const newFeedback = {
      ...values,
      status: "Not Viewed",
    };
    setFeedbackData([...feedbackData, newFeedback]);
    form.resetFields();
  };

  const handleViewForm = (index) => {
    const updatedFeedbackData = feedbackData.map((feedback, i) =>
      i === index ? { ...feedback, status: "Viewed" } : feedback
    );
    setFeedbackData(updatedFeedbackData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Feedback
      </Title>
      <Tabs defaultActiveKey="1" centered>
        {/* Tab 1: Submit Feedback */}
        <TabPane tab="Submit Feedback" key="1">
          <Title level={4} style={{ textAlign: "center" }}>
            We appreciate your feedback!
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitFeedback}
            style={{ maxWidth: "800px", margin: "20px auto" }}
          >
            <Form.Item
              name="name"
              label={<Text strong>Name</Text>}
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              name="email"
              label={<Text strong>Email</Text>}
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<Text strong>Phone Number</Text>}
              rules={[{ required: true, message: "Please enter your phone number" }]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>

            <Form.Item label={<Text strong>Dine in/Take Out</Text>}>
              <Switch checkedChildren="Dine In" unCheckedChildren="Take Out" />
            </Form.Item>

            <Form.Item label={<Text strong>Day Visited</Text>}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="date"
                    rules={[{ required: true, message: "Please select a date" }]}
                  >
                    <DatePicker placeholder="Select date" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="time"
                    rules={[{ required: true, message: "Please select a time" }]}
                  >
                    <TimePicker placeholder="Select time" format="HH:mm" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="ampm"
                    rules={[{ required: true, message: "Please select AM/PM" }]}
                  >
                    <Select placeholder="AM/PM">
                      <Option value="AM">AM</Option>
                      <Option value="PM">PM</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            {["Food Quality", "Overall Service Quality", "Order Accuracy", "Speed of Service", "Overall Experience"].map(
              (title) => (
                <Form.Item label={<Text strong>{title}</Text>} key={title}>
                  <Switch style={{ marginRight: "10px" }} />
                  <Text>Excellent</Text>
                  <Switch style={{ margin: "0 10px" }} />
                  <Text>Good</Text>
                  <Switch style={{ margin: "0 10px" }} />
                  <Text>Average</Text>
                  <Switch style={{ margin: "0 10px" }} />
                  <Text>Dissatisfied</Text>
                </Form.Item>
              )
            )}

            <Form.Item
              name="comments"
              label={<Text strong>Any comments, questions or suggestions?</Text>}
            >
              <TextArea placeholder="Type here..." autoSize={{ minRows: 4, maxRows: 8 }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ display: "block", margin: "0 auto" }}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* Tab 2: View Feedback */}
        <TabPane tab="Feedback from Customers" key="2">
          <Title level={4} style={{ textAlign: "center" }}>
            Feedback from Customers
          </Title>
          {["Not Viewed", "Viewed"].map((status) => (
            <div key={status}>
              <Title level={5}>{status}</Title>
              <Row gutter={[16, 16]}>
                {feedbackData
                  .filter((feedback) => feedback.status === status)
                  .map((feedback, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                      <Card>
                        <Text strong>Name:</Text> {feedback.name} <br />
                        <Text strong>Day Visited:</Text> {feedback.date?.format("YYYY-MM-DD")} <br />
                        <Text strong>Comments:</Text> {feedback.comments || "No comments"} <br />
                        <Button
                          type="primary"
                          onClick={() => handleViewForm(index)}
                          style={{ marginTop: "10px" }}
                        >
                          View Form
                        </Button>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </div>
          ))}
        </TabPane>
      </Tabs>
    </div>
  );
};
