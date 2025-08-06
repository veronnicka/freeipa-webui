import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Select,
  SelectOption,
  MenuToggle,
  MenuToggleElement,
} from "@patternfly/react-core";

export const ModalFormExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [groupSelected, setGroupSelected] = useState<string | null>(null);
  const [addSpinning, setAddSpinning] = useState(false);
  const submitButtonRef = React.useRef<HTMLButtonElement>(null);

  const dummyGroups = ["Group A", "Group B", "Group C"];

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      data-cy="modal-select-automember-toggle"
      ref={toggleRef}
      onClick={() => setIsSelectOpen(!isSelectOpen)}
      className="pf-v5-u-w-100"
    >
      {groupSelected}
    </MenuToggle>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelectGroup = (selection: any) => {
    setGroupSelected(selection.target.textContent);
    setIsSelectOpen(false);
    setTimeout(() => {
      console.log("Submit button ref:", submitButtonRef.current);
      if (submitButtonRef.current && !submitButtonRef.current.disabled) {
        submitButtonRef.current.focus();
      }
    }, 100);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted with group:", groupSelected);
    setAddSpinning(true);

    // Simulate API call
    setTimeout(() => {
      alert(`Added group: ${groupSelected}`);
      setAddSpinning(false);
      setIsModalOpen(false);
    }, 1000);
  };

  return (
    <Modal
      title="Test Modal"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      variant="small"
    >
      <Form id="add-rule-modal" onSubmit={onSubmit}>
        <Select
          data-cy="modal-select-automember"
          id="automember"
          toggle={toggle}
          onSelect={onSelectGroup}
          selected={groupSelected}
          isOpen={isSelectOpen}
          aria-labelledby="automember-group-add"
        >
          {dummyGroups.map((option, index) => (
            <SelectOption
              data-cy={"modal-select-automember-" + option}
              key={index}
              value={option}
            >
              {option}
            </SelectOption>
          ))}
        </Select>

        <Button
          ref={submitButtonRef}
          data-cy="modal-button-add"
          type="submit"
          isLoading={addSpinning}
          isDisabled={!groupSelected}
        >
          Add
        </Button>
      </Form>
    </Modal>
  );
};

export default ModalFormExample;
