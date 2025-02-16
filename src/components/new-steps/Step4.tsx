import React, { useState } from "react";
import { Form, Button, Upload, Table, UploadProps } from "antd";
import { StepProps } from "./index.types";
import * as XLSX from "xlsx";
import { UploadOutlined } from "@ant-design/icons/lib/icons";

interface FileData {
  [key: string]: any;
}

const Step4Form: React.FC<StepProps> = ({ form, data }) => {
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (typeof data === "string" || data instanceof ArrayBuffer) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData: FileData[] = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

        // Generate columns for Ant Design Table
        if (jsonData.length > 0) {
          const firstRow = jsonData[0];
          const cols = Object.keys(firstRow).map((key) => ({
            title: key,
            dataIndex: key,
            key: key,
          }));
          setColumns(cols);
        }

        setFileData(jsonData); // Set the data for the table
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Ant Design Upload props
  const uploadProps: UploadProps = {
    beforeUpload: (file: File) => {
      handleFileUpload(file);
      return false; // Prevent default upload behavior
    },
    accept: ".xlsx",
    showUploadList: false,
  };

  const testjee = () => {
    console.log(fileData);
  };

  return (
    <Form
      form={form}
      initialValues={data.step4 || {}}
      //onFinish={handleSave}
      layout="vertical"
    >
      <div>EMPATTTT</div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Upload XLSX File</Button>
      </Upload>

      <Button onClick={testjee}>sdfdsfs</Button>

      {fileData.length > 0 && (
        <Table
          dataSource={fileData}
          columns={columns}
          bordered
          pagination={{ pageSize: 10 }}
          style={{ marginTop: "20px" }}
        />
      )}
    </Form>
  );
};

export default Step4Form;
