/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useEffect, useRef, useState } from "react";
// PatternFly
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  MenuToggle,
  MenuToggleCheckbox,
  Popper,
} from "@patternfly/react-core";

interface EntryData<Type> {
  selected: Type[];
  selectableTable: Type[];
  updateSelected: (entry: any[], isSelected: boolean) => void;
  nameAttr: string;
}

interface ButtonsData {
  updateIsDeleteButtonDisabled: (value: boolean) => void;
}

interface SelectedPerPageData {
  selectedPerPage: number;
  updateSelectedPerPage: (selected: number) => void;
}

interface PropsToBulkSelectorPrep<Type> {
  list: Type[];
  shownElementsList: Type[];
  elementData: EntryData<Type>;
  buttonsData: ButtonsData;
  selectedPerPageData: SelectedPerPageData;
}

const BulkSelectorPrep = <Type,>(props: PropsToBulkSelectorPrep<Type>) => {
  // Table functionality (from parent component) to manage the bulk selector functionality
  // - Menu
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const toggleRefMenu = useRef<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRefMenu = useRef<HTMLDivElement>(null);

  const handleMenuKeys = (event: KeyboardEvent) => {
    if (!isOpenMenu) {
      return;
    }
    if (
      menuRef.current?.contains(event.target as Node) ||
      toggleRefMenu.current?.contains(event.target as Node)
    ) {
      if (event.key === "Escape" || event.key === "Tab") {
        setIsOpenMenu(!isOpenMenu);
        toggleRefMenu.current?.focus();
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (isOpenMenu && !menuRef.current?.contains(event.target as Node)) {
      setIsOpenMenu(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleMenuKeys);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleMenuKeys);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpenMenu, menuRef]);

  // - When a bulk selector element is selected, it remains highlighted
  const onToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation(); // Stop handleClickOutside from handling
    setIsOpenMenu(!isOpenMenu);
  };

  const getSelectableElements = () => {
    const selectableElements = [] as Type[];
    const key = props.elementData.nameAttr;
    props.shownElementsList.forEach(function (obj) {
      if (obj[key] !== "") {
        selectableElements.push(obj);
      }
    });
    return selectableElements;
  };

  // - Selectable checkboxes on table (elements per page)
  const selectableElementsPage = getSelectableElements();

  // - Methods to manage the Bulk selector options
  // -- Unselect all items on the table
  const unselectPageItems = () => {
    props.elementData.updateSelected(props.shownElementsList, false);
  };

  const unselectAllItems = () => {
    props.elementData.updateSelected(props.elementData.selected, false);
    props.buttonsData.updateIsDeleteButtonDisabled(true);
  };

  // Select all elements (Page)
  const selectAllElementsPage = (
    isSelecting = true,
    selectableList: Type[]
  ) => {
    // Enable/disable 'Delete' button
    if (isSelecting) {
      props.elementData.updateSelected(selectableList, true);

      // Enable delete button
      props.buttonsData.updateIsDeleteButtonDisabled(false);
      // Update the 'selectedPerPage' counter
      props.selectedPerPageData.updateSelectedPerPage(selectableList.length);
    } else {
      props.elementData.updateSelected(props.shownElementsList, false);
      props.buttonsData.updateIsDeleteButtonDisabled(true);
      // Restore the 'selectedPerPage' counter
      props.selectedPerPageData.updateSelectedPerPage(0);
    }
  };

  // Helper method to manage the checkbox icon symbol
  // - All rows selected: true (full check)
  // - Some rows selected: null (-)
  // - None selected: false (empty)
  const areAllElementsSelected: boolean | null =
    props.elementData.selected.length > 0 &&
    props.elementData.selected.length ===
      props.elementData.selectableTable.length
      ? true
      : props.elementData.selected.length > 0
        ? null
        : false;

  // Menu toggle element with checkbox
  const toggle = (
    <MenuToggle
      data-cy="bulk-selector-prep"
      ref={toggleRefMenu}
      onClick={onToggleClick}
      isExpanded={isOpenMenu}
      splitButtonOptions={{
        items: [
          <MenuToggleCheckbox
            id="split-button-checkbox-with-text-disabled-example"
            key="split-checkbox-with-text-disabled"
            aria-label="Select all"
            onChange={(
              isSelecting: boolean | undefined,
              event: FormEvent<HTMLInputElement>
            ) =>
              selectAllElementsPage(
                isSelecting,
                props.elementData.selectableTable
              )
            }
            isChecked={areAllElementsSelected}
          >
            {props.elementData.selected.length > 0 && (
              <p>{props.elementData.selected.length + " selected"}</p>
            )}
          </MenuToggleCheckbox>,
        ],
      }}
      aria-label="Menu toggle with checkbox split button and text"
    />
  );

  // Checks wether all the elements on the currect page have been selected or not
  const [currentPageAlreadySelected, setCurrentPageAlreadySelected] =
    useState(false);

  // The 'currentPageAlreadySelected' should be set when elements are selected
  const allSelected = () => {
    const key = props.elementData.nameAttr;
    props.shownElementsList.forEach(function (shown) {
      let found = false;
      props.elementData.selected.forEach(function (selected) {
        if (shown[key] === selected[key]) {
          found = true;
        }
      });
      if (!found) {
        return false;
      }
    });
    return true;
  };

  // The 'currentPageAlreadySelected' should be set when elements are selected
  const someSelected = () => {
    const key = props.elementData.nameAttr;
    props.shownElementsList.forEach(function (shown) {
      props.elementData.selected.forEach(function (selected) {
        if (shown[key] === selected[key]) {
          return true;
        }
      });
    });
    return false;
  };

  useEffect(() => {
    if (allSelected()) {
      // All the elements on that page are been selected
      setCurrentPageAlreadySelected(true);
    } else {
      // The elements on that page are not been selected (yet)
      setCurrentPageAlreadySelected(false);
      // If there are no elements selected on the page yet, reset 'selectedPerPage'
      if (!someSelected()) {
        props.selectedPerPageData.updateSelectedPerPage(0);
      }
    }
  }, [props.elementData.selected.length, props.shownElementsList]);

  // Set the messages displayed in the 'Select page' option (bulk selector)
  const getSelectedElements = () => {
    let msg = "Select page (" + props.elementData.selected.length + " items)";
    const remainingElements = Math.min(
      props.elementData.selected.length +
        props.shownElementsList.length -
        props.selectedPerPageData.selectedPerPage,
      props.list.length
    );

    if (
      props.list.length > props.elementData.selected.length &&
      !currentPageAlreadySelected
    ) {
      msg = "Select page (" + remainingElements + " items)";
    }

    return msg;
  };

  const group_id_list = props.elementData.selected.map((group) => {
    return group[props.elementData.nameAttr];
  });

  // Menu options
  const menuToolbar = (
    <Menu
      ref={menuRef}
      style={{ minWidth: "fit-content" }}
      onSelect={(_ev) => {
        setIsOpenMenu(!isOpenMenu);
        toggleRefMenu.current?.querySelector("button").focus();
      }}
    >
      <MenuContent>
        <MenuList>
          <MenuItem itemId={0} onClick={unselectPageItems}>
            Unselect page (0 items)
          </MenuItem>
          <MenuItem itemId={1} onClick={unselectAllItems}>
            Unselect all (0 items)
          </MenuItem>
          <MenuItem
            itemId={2}
            onClick={() => selectAllElementsPage(true, selectableElementsPage)}
            // NOTE: The line below disables this BS option when all the page rows have been selected.
            // This can benefit the user experience as it provides extra context of the already selected elements.
            // isDisabled={currentPageAlreadySelected}
          >
            {getSelectedElements()}
          </MenuItem>
        </MenuList>
      </MenuContent>
    </Menu>
  );

  // Renders component with the elements' data
  return (
    <div
      id={"menu-all-groups-table"}
      ref={containerRefMenu}
      title={group_id_list.join(", ")}
    >
      <Popper
        trigger={toggle}
        popper={menuToolbar}
        appendTo={containerRefMenu.current || undefined}
        isVisible={isOpenMenu}
        aria-label={"Menu toggle with checkbox split button"}
      />
    </div>
  );
};

export default BulkSelectorPrep;
