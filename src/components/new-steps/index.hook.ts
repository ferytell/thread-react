import { Action, FormData, State } from "./index.types";

// export const initialState = {
//   currentStep: 0,
//   formData: {} as Partial<FormData>,
// };

export const initialState: State = {
  currentStep: 0,
  formData: {},
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1 };
    case "PREV_STEP":
      return { ...state, currentStep: state.currentStep - 1 };
    case "SAVE_DATA":
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    default:
      return state;
  }
};
