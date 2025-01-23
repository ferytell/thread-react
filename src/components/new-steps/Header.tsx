import React from "react";
import { Steps } from "antd";

interface HeaderProps {
  currentStep: number;
  steps: { title: string }[];
}

const Header: React.FC<HeaderProps> = ({ currentStep, steps }) => {
  return (
    <Steps current={currentStep}>
      {steps.map((step, index) => (
        <Steps.Step key={index} title={step.title} />
      ))}
    </Steps>
  );
};

export default Header;
