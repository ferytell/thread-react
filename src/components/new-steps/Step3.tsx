import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  RadioChangeEvent,
  Card,
  Row,
  Col,
} from "antd";
import { StepProps } from "./index.types";

const style: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};
const { TextArea } = Input;

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

  const debiturPlant = [
    {
      value: 1,
      label:
        "Tidak ada rencana penyelesaian (khusus untuk apabila debitur tidak memiliki permasalahan usaha)",
      disabled: true,
    },
    { value: 2, label: "Penagihan AR yang tertunggak" },
    { value: 3, label: "Jual asset / rencana pelunasan" },
    { value: 4, label: "Pengajuan restrukturisasi" },
    { value: 5, label: "Pengajuan / relaksasi Covid-19 (program khusus)" },
    { value: 6, label: "Ganti usaha" },
    {
      value: 7,
      label: (
        <>
          Others
          {value === 7 && (
            <TextArea
              showCount
              placeholder="disable resize"
              style={{ height: 120, width: "100%", resize: "none" }}
            />
          )}
        </>
      ),
    },
  ];
  return (
    <Card>
      <Card type="inner" title="Rencana Debitur Terkait Pinjaman di OCBC">
        <Form
          form={form}
          initialValues={data.step3 || {}}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 24 }}
          layout="vertical"
        >
          <Form.Item
            //label="Optionn"
            name="planningDebtur"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Radio.Group
              style={style}
              onChange={onChange}
              value={value}
              //options={debiturPlant}
            >
              <Row gutter={24}>
                <Col className="gutter-row" span={12}>
                  <Radio value="red"> Red </Radio>
                  <Radio value="green"> Green </Radio>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Radio value="yellow"> Yellow </Radio>
                  <Radio value="blue"> Blue </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Form.Item>

          <Col className="gutter-row" span={12}>
            <div style={style}>col-6</div>
          </Col>
        </Form>
      </Card>
    </Card>
  );
};

export default Step3Form;
