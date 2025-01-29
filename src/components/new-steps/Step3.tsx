import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { StepProps } from "./index.types";

const Step3Form: React.FC<StepProps> = ({
  dispatch,
  data,
  setSubmitHandler,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    setSubmitHandler(() => form.submit);
  }, [setSubmitHandler, form]);

  const handleSave = (values: any) => {
    dispatch({ type: "SAVE_DATA", payload: { step3: values } });
  };

  return (
    <Form
      form={form}
      initialValues={data.step3 || {}}
      onFinish={handleSave}
      layout="vertical"
    >
      <div>STEPPPPPPPP3</div>
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

export default Step3Form;
