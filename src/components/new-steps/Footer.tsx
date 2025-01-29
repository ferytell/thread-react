import React from "react";
import { Button } from "antd";

interface FooterProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSave: () => void; // Callback for saving form data
}

const Footer: React.FC<FooterProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSave,
}) => {
  return (
    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
      <Button onClick={onPrev} disabled={currentStep === 0}>
        Back
      </Button>
      <Button
        type="primary"
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
      >
        Next
      </Button>
      <Button type="default" onClick={onSave} htmlType="submit">
        Save
      </Button>
    </div>
  );
};

export default Footer;

// import React from "react";
// import { Button } from "antd";

// interface FooterProps {
//   currentStep: number;
//   totalSteps: number;
//   onNext: () => void;
//   onPrev: () => void;
// }

// const Footer: React.FC<FooterProps> = ({
//   currentStep,
//   totalSteps,
//   onNext,
//   onPrev,
// }) => {
//   return (
//     <div style={{ marginTop: "20px" }}>
//       <Button onClick={onPrev} disabled={currentStep === 0}>
//         Back
//       </Button>
//       <Button
//         type="primary"
//         onClick={onNext}
//         disabled={currentStep === totalSteps - 1}
//         style={{ marginLeft: "10px" }}
//       >
//         Next
//       </Button>
//     </div>
//   );
// };

// export default Footer;
