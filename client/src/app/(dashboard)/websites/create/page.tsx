"use client";

import { useState } from "react";
import type { WebsiteInfo, WebsiteSettings, DroppedForm } from "@/types";
import StepIndicator from "@/components/website-builder/StepIndicator";
import Step1WebsiteInfo from "@/components/website-builder/Step1WebsiteInfo";
import Step2WebsiteSettings from "@/components/website-builder/Step2WebsiteSettings";
import Step3DragAndDrop from "@/components/website-builder/Step3DragAndDrop";
import Step4PreviewExport from "@/components/website-builder/Step4PreviewExport";

const defaultInfo: WebsiteInfo = {
  title: "",
  meta_content: "",
  meta_description: "",
  logo: null,
  logoPreview: null,
};

const defaultSettings: WebsiteSettings = {
  username_github: "",
  db_host: "",
  db_username: "",
  db_name: "",
  db_password: "",
};

export default function CreateWebsitePage() {
  const [step, setStep]               = useState<1 | 2 | 3 | 4>(1);
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfo>(defaultInfo);
  const [websiteSettings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [droppedForms, setDroppedForms] = useState<DroppedForm[]>([]);

  const isBuilderStep = step === 3;

  return (
    <div className={`page-container ${isBuilderStep ? "page-container--wide" : ""}`}>
      {/* Page header */}
      <div className="page-header">
        <div className="breadcrumb">
          <div className="breadcrumb-item">
            <a href="/websites">Websites</a>
            <span>›</span>
          </div>
          <div className="breadcrumb-item current">Create Website</div>
        </div>
        <h1 className="page-title">Create New Website</h1>
        <p className="page-subtitle">
          Build your healthcare intake website in 4 simple steps.
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} />

      {/* Step content */}
      <div className="wizard-content">
        {step === 1 && (
          <Step1WebsiteInfo
            data={websiteInfo}
            onChange={setWebsiteInfo}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2WebsiteSettings
            data={websiteSettings}
            onChange={setSettings}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3DragAndDrop
            droppedForms={droppedForms}
            onChange={setDroppedForms}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <Step4PreviewExport
            websiteInfo={websiteInfo}
            websiteSettings={websiteSettings}
            droppedForms={droppedForms}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}
