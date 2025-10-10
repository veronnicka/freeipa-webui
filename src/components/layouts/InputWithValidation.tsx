import React from "react";
// PatternFly
import {
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
} from "@patternfly/react-core";
import type { HelperTextItemProps } from "@patternfly/react-core";

export type InputValidationFunction = (value: string) => boolean;
export type HelperTextVariant = NonNullable<HelperTextItemProps["variant"]>;
export type RuleState = { id: string; state: HelperTextVariant };

export interface InputWithValidationProps {
  dataCy: string;
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  rules: Array<{
    id: string;
    message: string;
    validate: InputValidationFunction;
  }>;
}

const InputWithValidation = (props: InputWithValidationProps) => {
  const hasRules = props.rules.length > 0;

  const ruleStates = React.useMemo<RuleState[]>(() => {
    if (!hasRules) return [];
    if (props.value === "") {
      return props.rules.map((r) => ({ id: r.id, state: "indeterminate" }));
    }
    return props.rules.map((r) => ({
      id: r.id,
      state: r.validate(props.value) ? "success" : "error",
    }));
  }, [props.value, hasRules, props.rules]);

  const nonSuccessRuleIds = React.useMemo<string[]>(
    () =>
      hasRules
        ? ruleStates
            .filter((s) => s.state !== "success")
            .map((s) => `${props.id}-${s.id}`)
        : [],
    [hasRules, ruleStates, props.id]
  );

  const ariaInvalid = hasRules
    ? ruleStates.some((s) => s.state === "error")
    : false;

  return (
    <>
      <TextInput
        data-cy={props.dataCy}
        id={props.id}
        name={props.name}
        value={props.value}
        type="text"
        isRequired={props.isRequired}
        aria-label={props.name}
        aria-describedby={nonSuccessRuleIds.join(" ")}
        aria-invalid={ariaInvalid}
        onChange={(_event, value) => props.onChange(value)}
      />
      {props.value && (
        <FormHelperText>
          <HelperText component="ul">
            {props.rules.map((r) => (
              <HelperTextItem
                key={r.id}
                component="li"
                id={`${props.id}-${r.id}`}
                variant={ruleStates.find((s) => s.id === r.id)?.state}
              >
                {r.message}
              </HelperTextItem>
            ))}
          </HelperText>
        </FormHelperText>
      )}
    </>
  );
};

export default InputWithValidation;
