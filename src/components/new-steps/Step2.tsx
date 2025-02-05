import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { StepProps } from "./index.types";

const Step2Form: React.FC<StepProps> = ({
  // dispatch,
  data,
  //setSubmitHandler,
  form,
}) => {
  // useEffect(() => {
  //   setSubmitHandler(() => form.submit);
  // }, [setSubmitHandler, form]);

  // React.useEffect(() => {
  //   setSubmitHandler(() => {
  //     form.submit();
  //   });
  // }, [setSubmitHandler]);

  // const handleSave = (values: any) => {
  //   dispatch({ type: "SAVE_DATA", payload: { step2: values } });
  // };

  return (
    <Form
      form={form}
      initialValues={data.step2 || {}}
      // onFinish={handleSave}
      layout="vertical"
    >
      <div>DUAAAAAA</div>
      <Form.Item
        label="Adress"
        name="address"
        rules={[{ required: true, message: "Address is required" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="phoneNumber"
        name="phoneNumber"
        rules={[
          { required: true, message: "phoneNumber is required" },
          //   { type: "number", message: "Enter a Number bitch" },
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

export default Step2Form;
