import React from "react";
import { Form, Input, Button } from "antd";
import { StepProps } from "./index.types";
import { exportToExcel } from "./test";

const Step5Form: React.FC<StepProps> = ({ form, data }) => {
  const datas = [
    { Name: "John Doe", Age: 28, City: "New York" },
    { Name: "Jane Smith", Age: 34, City: "Los Angeles" },
    { Name: "Mike Johnson", Age: 45, City: "Chicago" },
  ];

  const handleExport = () => {
    exportToExcel({
      datas,
      fileName: "UserData",
      sheetName: "Users",
    });
  };

  return (
    <Form
      form={form}
      initialValues={data.step5 || {}}
      //onFinish={handleSave}
      layout="vertical"
    >
      <div>55555555FIVE</div>
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
      <button onClick={handleExport}>Export to Excel</button>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

export default Step5Form;
