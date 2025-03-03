import React, { useEffect, useState } from "react";
import { Form, Input, Button, FormInstance, Space, Typography } from "antd";
import { StepProps } from "./index.types";

const Step5Form: React.FC<StepProps> = ({ form, data }) => {
  const [bScoreData, setBScoreData] = useState<{ [key: string]: string }>({});

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://db837a5d-4a4d-4140-a4f5-4c783ff4e758.mock.pstmn.io/testingBG"
        );
        const result = await response.json();
        console.log("here is BScore result", result);
        setBScoreData(result.BScore); // Store the BScore data in state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(bScoreData).length > 0) {
      const initialValues = bScores.map((item) => ({
        label: item.label,
        value: bScoreData[item.num] || "", // Use fetched data or fallback to empty string
      }));
      console.log('here is called"======');
      form.setFieldsValue({ bScoress: initialValues }); // Set form values
    }
  }, [bScoreData, form]);

  const handleSave = (values: any) => {
    console.log("Saved values:", values);
    // You can send the updated values to your API here
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
      <Form.Item label="B-Score">{FormBscore(bScores, form)}</Form.Item>

      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </Form>
  );
};

interface MapsGeneric {
  label: string;
  value: string;
  num?: number;
}

const bScores = [
  { label: "M-5", value: "", num: 5 },
  { label: "M-4", value: "", num: 4 },
  { label: "M-3", value: "", num: 3 },
  { label: "M-2", value: "", num: 2 },
  { label: "M-1", value: "", num: 1 },
  { label: "Now", value: "", num: 0 },
];

// get API from https://db837a5d-4a4d-4140-a4f5-4c783ff4e758.mock.pstmn.io/testingBG

function FormBscore(props: MapsGeneric[], form: FormInstance<any>) {
  const states = false;
  const [val, setVal] = useState();
  console.log("value from form", form.getFieldValue("bScoress"));
  return (
    <Form.List
      name="bScoress"
      initialValue={props.map((item) => ({ label: item.label, value: "" }))}
    >
      {(fields) => (
        <Space>
          {fields.map(({ key, name, ...restField }, index) => (
            <div key={key}>
              <Typography>{props[index].label}</Typography>
              <Form.Item
                {...restField}
                name={[name, "value"]}
                rules={[{ required: true }]}
              >
                <Input
                  placeholder={props[index].label}
                  value={val}
                  disabled={states}
                />
              </Form.Item>
            </div>
          ))}
        </Space>
      )}
    </Form.List>
  );
}

export default Step5Form;
