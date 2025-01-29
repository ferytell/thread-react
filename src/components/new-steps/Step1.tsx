import React, { useCallback, useEffect } from "react";
import { Form, Input } from "antd";
import { StepProps } from "./index.types";

const Step1Form: React.FC<StepProps> = ({
  dispatch,
  data,
  setSubmitHandler,
}) => {
  const [form] = Form.useForm();
  // const isMounted = useRef(false);

  const handleSubmit = useCallback(() => {
    form.submit();
  }, [form]);

  useEffect(() => {
    setSubmitHandler(handleSubmit); // ✅ Uses latest function reference
  }, [setSubmitHandler, handleSubmit]);

  const handleSave = (values: any) => {
    console.log("this one called");
    dispatch({ type: "SAVE_DATA", payload: { step1: values } });
  };

  return (
    <Form
      form={form}
      initialValues={data.step1 || {}}
      onFinish={handleSave}
      layout="vertical"
    >
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
    </Form>
  );
};

export default Step1Form;
