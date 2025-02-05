import React from "react";
import { Form, Input, Button } from "antd";
import { StepProps } from "./index.types";

const Step4Form: React.FC<StepProps> = ({ form, data }) => {
  return (
    <Form
      form={form}
      initialValues={data.step4 || {}}
      //onFinish={handleSave}
      layout="vertical"
    >
      <div>EMPATTTT</div>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Name is required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Email is required" },
          { type: "email", message: "Enter a valid email" },
        ]}
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

export default Step4Form;
