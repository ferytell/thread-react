import { FormInstance } from "antd";

export interface FormData {
  step1?: any;
  step2?: any;
  step3?: any;
  step4?: any;
  step5?: any;
  step6?: any;
}

export interface State {
  currentStep: number;
  formData: FormData;
}

export interface StepProps {
  dispatch: React.Dispatch<Action>;
  data: Partial<FormData>;
  //setSubmitHandler: (submitFn: () => void) => void;
  form: FormInstance<any>;
}

export type Action =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SAVE_DATA"; payload: any };
