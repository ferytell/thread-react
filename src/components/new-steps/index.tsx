import React, { useReducer } from "react";
import { Form, Steps } from "antd";
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

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

const NewSteps: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [form] = Form.useForm();
  const CurrentForm = steps[state.currentStep].component;
  //const submitHandlerRef = React.useRef<(() => void) | null>(null);

  // const handleSave = () => {
  //   // if (submitHandlerRef.current) {
  //   //   submitHandlerRef.current();
  //   // }
  //   form.submit();
  //   console.log("Current Form Data:", state.formData);
  // };

  const handleSave = async () => {
    try {
      // Validate and get form values
      const values = await form.validateFields();
      console.log(
        `Form data submitted for step ${state.currentStep + 1}:`,
        values
      );

      // Dispatch the form data to update the state
      dispatch({
        type: "SAVE_DATA",
        payload: { [`step${state.currentStep + 1}`]: values }, // Dynamically save data for the current step
      });

      // Log the updated state
      console.log("Current Form Data:", state.formData);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  return (
    <div>
      <Header currentStep={state.currentStep} steps={steps} />
      <div style={{ marginTop: "20px" }}>
        <CurrentForm
          dispatch={dispatch}
          data={state.formData}
          //setSubmitHandler={(fn) => (submitHandlerRef.current = fn)}
          form={form}
        />
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
