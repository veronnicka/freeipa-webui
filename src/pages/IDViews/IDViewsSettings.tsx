import React, { useState } from "react";
// PatternFly
import { Flex, Form, FormGroup, Icon, Tooltip } from "@patternfly/react-core";
// Forms
import IpaTextArea from "../../components/Form/IpaTextArea";
import IpaTextInput from "src/components/Form/IpaTextInput";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import TabLayout from "src/components/layouts/TabLayout";
// Utils
import { asRecord } from "../../utils/hostUtils";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useUpdateRoute from "src/hooks/useUpdateRoute";
// Icons
import { HelpIcon } from "@patternfly/react-icons";
// Data types
import { IDView, Metadata } from "../../utils/datatypes/globalDataTypes";
// RPC
import { ErrorResult } from "src/services/rpc";
import { useSaveIDViewMutation } from "src/services/rpcIDViews";

interface PropsToIDViewSettings {
  idView: Partial<IDView>;
  originalIDView: Partial<IDView>;
  metadata: Metadata;
  onIDViewChange: (hostGroup: Partial<IDView>) => void;
  onRefresh: () => void;
  isModified: boolean;
  isDataLoading?: boolean;
  modifiedValues: () => Partial<IDView>;
  onResetValues: () => void;
}

// WIP - placeholder until settings page is actually fully implemented

const IDViewSettings = (props: PropsToIDViewSettings) => {
  const alerts = useAlerts();

  // API
  const [saveView] = useSaveIDViewMutation();

  // Update current route data to Redux and highlight the current page in the Nav bar
  useUpdateRoute({ pathname: "id-view", noBreadcrumb: true });

  const [isSaving, setSaving] = useState(false);

  // Get 'ipaObject' and 'recordOnChange' to use in 'IpaTextInput'
  const { ipaObject, recordOnChange } = asRecord(
    props.idView,
    props.onIDViewChange
  );

  // 'Save' handler method
  const onSave = () => {
    const modifiedValues = props.modifiedValues();
    modifiedValues.cn = props.idView.cn;
    setSaving(true);

    saveView(modifiedValues).then((response) => {
      if ("data" in response) {
        if (response.data?.result) {
          // Show toast notification: success
          alerts.addAlert("save-success", "ID view modified", "success");
        } else if (response.data?.error) {
          // Show toast notification: error
          const errorMessage = response.data.error as ErrorResult;
          alerts.addAlert("save-error", errorMessage.message, "danger");
        }
        // Reset values. Disable 'revert' and 'save' buttons
        props.onResetValues();
        setSaving(false);
      }
    });
  };

  // 'Revert' handler method
  const onRevert = () => {
    props.onIDViewChange(props.originalIDView);
    alerts.addAlert("revert-success", "ID view data reverted", "success");
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton
          dataCy="id-views-tab-settings-button-refresh"
          onClickHandler={props.onRefresh}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: (
        <SecondaryButton
          dataCy="id-views-tab-settings-button-revert"
          isDisabled={!props.isModified}
          onClickHandler={onRevert}
        >
          Revert
        </SecondaryButton>
      ),
    },
    {
      key: 2,
      element: (
        <SecondaryButton
          dataCy="id-views-tab-settings-button-save"
          isDisabled={!props.isModified || isSaving}
          onClickHandler={onSave}
          isLoading={isSaving}
          spinnerAriaValueText="Saving"
          spinnerAriaLabelledBy="Saving"
          spinnerAriaLabel="Saving"
        >
          {isSaving ? "Saving" : "Save"}
        </SecondaryButton>
      ),
    },
  ];

  // Render component
  return (
    <TabLayout id="settings-page" toolbarItems={toolbarFields}>
      <alerts.ManagedAlerts />
      <Flex direction={{ default: "column" }} flex={{ default: "flex_1" }}>
        <TitleLayout
          key={0}
          headingLevel="h2"
          id="id-view-settings"
          text="ID view settings"
        />
        <Form
          className="pf-v5-u-mt-sm pf-v5-u-mb-lg pf-v5-u-mr-md"
          isHorizontal
        >
          <FormGroup
            label="Domain resolution order"
            fieldId="ipadomainresolutionorder"
            labelIcon={
              <Tooltip
                content={
                  <div>
                    Colon-separated list of domains used for short name
                    qualification
                  </div>
                }
              >
                <Icon iconSize="sm">
                  <HelpIcon />
                </Icon>
              </Tooltip>
            }
          >
            <IpaTextInput
              dataCy="id-views-tab-settings-textbox-ipadomainresolutionorder"
              name="ipadomainresolutionorder"
              ariaLabel={"Domain resolution order"}
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="idview"
              metadata={props.metadata}
            />
          </FormGroup>
          <FormGroup label="Description" fieldId="description">
            <IpaTextArea
              dataCy="id-views-tab-settings-textbox-description"
              name="description"
              ipaObject={ipaObject}
              onChange={recordOnChange}
              objectName="idview"
              metadata={props.metadata}
            />
          </FormGroup>
        </Form>
      </Flex>
    </TabLayout>
  );
};

export default IDViewSettings;
