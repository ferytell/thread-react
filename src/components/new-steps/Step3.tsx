import React, { useEffect, useState } from "react";
import { Form, Input, Button, Radio, RadioChangeEvent } from "antd";
import { StepProps } from "./index.types";

const style: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const Step3Form: React.FC<StepProps> = ({
  //dispatch,
  data,
  //setSubmitHandler,
  form,
}) => {
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <Form
      form={form}
      initialValues={data.step3 || {}}
      //onFinish={handleSave}
      layout="vertical"
    >
      <div>STEPPPPPPPP3</div>

      <Form.Item
        label="Optionn"
        name="option"
        rules={[{ required: true, message: "Email is required" }]}
      >
        <Radio.Group
          style={style}
          onChange={onChange}
          value={value}
          options={[
            { value: 1, label: "Option A" },
            { value: 2, label: "Option B" },
            { value: 3, label: "Option C" },
            {
              value: 4,
              label: (
                <>
                  More...
                  {value === 4 && (
                    <Input
                      variant="filled"
                      placeholder="please input"
                      style={{ width: 120, marginInlineStart: 12 }}
                    />
                  )}
                </>
              ),
            },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default Step3Form;
