"use client";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { number: 1, label: "Website Info", icon: "🌐" },
  { number: 2, label: "Settings",     icon: "⚙️" },
  { number: 3, label: "Form Builder", icon: "🧩" },
  { number: 4, label: "Preview",      icon: "✨" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="wizard-step-indicator">
      {STEPS.map((step, idx) => {
        const isDone    = currentStep > step.number;
        const isActive  = currentStep === step.number;

        return (
          <div key={step.number} className="wizard-step-wrapper">
            {/* connector line before each step except the first */}
            {idx > 0 && (
              <div className={`wizard-connector ${isDone ? "done" : isActive ? "active" : ""}`} />
            )}

            <div className={`wizard-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
              <div className="wizard-step-circle">
                {isDone ? "✓" : step.icon}
              </div>
              <div className="wizard-step-meta">
                <span className="wizard-step-num">Step {step.number}</span>
                <span className="wizard-step-label">{step.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
