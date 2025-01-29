import React from "react";
import { Form, Input, Button } from "antd";
import { StepProps } from "./index.types";

const Step6Form: React.FC<StepProps> = ({ dispatch, data }) => {
  const [form] = Form.useForm();

  const handleSave = (values: any) => {
    dispatch({ type: "SAVE_DATA", payload: { step6: values } });
  };

  return (
    <Form
      form={form}
      initialValues={data.step6 || {}}
      onFinish={handleSave}
      layout="vertical"
    >
      <div>66666666666666666666666666666666666666666</div>
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

export default Step6Form;
