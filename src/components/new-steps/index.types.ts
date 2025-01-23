export interface FormData {
  step1: { name: string; email: string };
  step2: { address: string; phoneNumber: string };
  step3: { phoneNumber: string };
  step4: { company: string };
  step5: { jobTitle: string };
  step6: { notes: string };
}

export interface StepProps {
  dispatch: React.Dispatch<Action>;
  data: Partial<FormData>;
}

export type Action =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SAVE_DATA"; payload: Partial<FormData> };
