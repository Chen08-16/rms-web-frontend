import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { useForgotPassword } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import R_Wallpaper_2 from "../../images/R_Wallpaper_2.jpg";

const { Title, Text } = Typography;

export const ForgotPassword = () => {
  const { mutate: forgotPassword, isLoading } = useForgotPassword();
  const navigate = useNavigate();

  const handleSignInNavigation = () => {
    navigate("/login");
  };

  const onFinish = (values) => {
    forgotPassword({ email: values.email });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${R_Wallpaper_2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      {/* Panel for Title */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          padding: "10px 20px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <Title level={1} style={{ color: "white", margin: 0 }}>
          Password Recovery
        </Title>
      </div>

      {/* Forgot Password Form Panel */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          Reset Your Password
        </Title>
        <Text
          style={{
            display: "block",
            marginBottom: "20px",
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Please enter your email address to receive a password reset link.
        </Text>

        {/* Forgot Password Form */}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label={<Text style={{ color: "#fff" }}>Email Address</Text>}
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
            style={{ marginTop: "20px" }}
          >
            Send Reset Link
          </Button>
        </Form>

        {/* Sign In Navigation Link */}
        <Text
          style={{
            display: "block",
            marginTop: "30px",
            textAlign: "center",
            color: "#fff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={handleSignInNavigation}
        >
          Have an account? Sign in
        </Text>
      </div>
    </div>
  );
};
