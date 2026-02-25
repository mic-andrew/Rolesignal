import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { useSetupInterview } from "../hooks/useSetupInterview";
import { StepRail } from "../components/shared/StepRail";
import { Button } from "../components/ui/Button";
import { RoleDetailsStep } from "../components/shared/setup/RoleDetailsStep";
import { JobDescriptionStep } from "../components/shared/setup/JobDescriptionStep";
import { CriteriaStep } from "../components/shared/setup/CriteriaStep";
import { ConfigureStep } from "../components/shared/setup/ConfigureStep";
import { InviteLaunchStep } from "../components/shared/setup/InviteLaunchStep";

const STEPS = [
  "Role Details",
  "Job Description",
  "Criteria",
  "Configure",
  "Invite & Launch",
];

export default function SetupInterview() {
  const {
    step,
    nextStep,
    prevStep,
    goToStep,
    roleData,
    setRoleTitle,
    setDepartment,
    setSeniority,
    jobDescription,
    setJobDescription,
    handleJdUpload,
    isUploading,
    fileInputRef,
    criteria,
    updateWeight,
    totalWeight,
    updateCriterionName,
    updateCriterionDescription,
    addCriterion,
    removeCriterion,
    addSubCriterion,
    updateSubCriterion,
    removeSubCriterion,
    importFromTemplate,
    templates,
    isLoadingTemplates,
    isParsing,
    extractCriteria,
    config,
    setConfig,
    candidates,
    addCandidate,
    removeCandidate,
    launch,
    launchPending,
  } = useSetupInterview();

  return (
    <div className="px-6 pb-8">
      <StepRail steps={STEPS} current={step} onStepClick={goToStep} />

      <div className="max-w-[700px] mx-auto animate-fade-in-scale" key={step}>
        {step === 0 && (
          <RoleDetailsStep
            roleTitle={roleData.roleTitle}
            department={roleData.department}
            seniority={roleData.seniority}
            onRoleTitleChange={setRoleTitle}
            onDepartmentChange={setDepartment}
            onSeniorityChange={setSeniority}
          />
        )}

        {step === 1 && (
          <JobDescriptionStep
            jobDescription={jobDescription}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
            onJobDescriptionChange={setJobDescription}
            onFileUpload={handleJdUpload}
          />
        )}

        {step === 2 && (
          <CriteriaStep
            criteria={criteria}
            totalWeight={totalWeight}
            jobDescription={jobDescription}
            isParsing={isParsing}
            templates={templates}
            isLoadingTemplates={isLoadingTemplates}
            onExtractCriteria={extractCriteria}
            onAddCriterion={addCriterion}
            onSelectTemplate={importFromTemplate}
            onWeightChange={updateWeight}
            onNameChange={updateCriterionName}
            onDescriptionChange={updateCriterionDescription}
            onRemove={removeCriterion}
            onAddSub={addSubCriterion}
            onUpdateSub={updateSubCriterion}
            onRemoveSub={removeSubCriterion}
          />
        )}

        {step === 3 && (
          <ConfigureStep config={config} onConfigChange={setConfig} />
        )}

        {step === 4 && (
          <InviteLaunchStep
            candidates={candidates}
            roleTitle={roleData.roleTitle}
            config={config}
            criteriaCount={criteria.length}
            launchPending={launchPending}
            onAddCandidate={addCandidate}
            onRemoveCandidate={removeCandidate}
            onLaunch={() => launch()}
          />
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between max-w-[700px] mx-auto mt-6">
        <Button
          variant="ghost"
          onClick={prevStep}
          className={step === 0 ? "opacity-30 pointer-events-none" : ""}
        >
          <RiArrowLeftLine size={14} />
          Back
        </Button>
        {step < 4 && (
          <Button onClick={nextStep}>
            Continue
            <RiArrowRightLine size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
