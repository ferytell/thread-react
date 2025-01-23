import React, { useReducer } from "react";
import { Action, FormData } from "./index.types";

export const initialState = {
  currentStep: 0,
  formData: {} as Partial<FormData>,
};

export const reducer = (state: typeof initialState, action: Action) => {
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
