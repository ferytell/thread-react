import React, { useReducer } from "react";
import { Steps } from "antd";
import Header from "./Header";
import Footer from "./Footer";
import Step1Form from "./Step1";
import Step2Form from "./Step2";
import Step3Form from "./Step3";
import Step4Form from "./Step4";
import Step5Form from "./Step5";
import Step6Form from "./Step6";
import { initialState, reducer } from "./index.hook";

const steps = [
  { title: "Step 1", component: Step1Form },
  { title: "Step 2", component: Step2Form },
  { title: "Step 3", component: Step3Form },
  { title: "Step 4", component: Step4Form },
  { title: "Step 5", component: Step5Form },
  { title: "Step 6", component: Step6Form },
];

const NewSteps: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const CurrentForm = steps[state.currentStep].component;

  const handleSave = () => {
    console.log("Current Form Data:", state.formData); // Log the form data to console
  };

  return (
    <div>
      <Header currentStep={state.currentStep} steps={steps} />
      <div style={{ marginTop: "20px" }}>
        <CurrentForm dispatch={dispatch} data={state.formData} />
      </div>
      <Footer
        currentStep={state.currentStep}
        totalSteps={steps.length}
        onNext={() => dispatch({ type: "NEXT_STEP" })}
        onPrev={() => dispatch({ type: "PREV_STEP" })}
        onSave={handleSave} // Pass the save handler to the Footer
      />
    </div>
  );
};

export default NewSteps;
