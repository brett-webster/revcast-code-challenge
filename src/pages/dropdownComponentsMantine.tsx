import { Dispatch, SetStateAction } from "react";
import { Select } from "@mantine/core"; // https://mantine.dev/core/select/

// ---------

// Using typing here for props bc in-line destructuring unwieldy
type teamPropsType = {
  teamList: string[];
  setSelectedTeam: Dispatch<SetStateAction<string | null>>;
  setTeamOrCustomerChangedFlag: Dispatch<SetStateAction<string | null>>;
  selectedTeam: string | null;
};

type customerPropsType = {
  customerList: string[];
  setSelectedCustomer: Dispatch<SetStateAction<string | null>>;
  setTeamOrCustomerChangedFlag: Dispatch<SetStateAction<string | null>>;
  selectedCustomer: string | null;
};

// ---------

// MANTINE UI TEAM DROPDOWN FILTER
const TeamDropdownFilterMantine = (props: teamPropsType): JSX.Element => {
  // Inserting '-- ALL TEAMS --' to beginning of dropdown list for display
  const expandedTeamList: string[] = props.teamList.slice();
  expandedTeamList.unshift("-- ALL TEAMS --");

  // Handler for click on dropdown list item
  const handleClickOnDropdownSelection = (listItem: string): void => {
    listItem === "-- ALL TEAMS --"
      ? props.setSelectedTeam("")
      : props.setSelectedTeam(listItem); // set TEAM state to selection (reset to "" in case ALL is selected)
    props.setTeamOrCustomerChangedFlag("TEAM changed"); // re-set flag
  };

  return (
    <>
      <Select
        placeholder="-- ALL TEAMS --"
        data={expandedTeamList}
        value={props.selectedTeam}
        onChange={handleClickOnDropdownSelection}
      />
    </>
  );
};

// ---------

// MANTINE UI CUSTOMER DROPDOWN FILTER
const CustomerDropdownFilterMantine = (
  props: customerPropsType
): JSX.Element => {
  // Inserting '-- ALL CUSTOMERS --' to beginning of dropdown list for display
  const expandedCustomerList: string[] = props.customerList.slice();
  expandedCustomerList.unshift("-- ALL CUSTOMERS --");

  // Handler for click on dropdown list item
  const handleClickOnDropdownSelection = (listItem: string): void => {
    listItem === "-- ALL CUSTOMERS --"
      ? props.setSelectedCustomer("")
      : props.setSelectedCustomer(listItem); // set CUSTOMER state to selection (reset to "" in case ALL is selected)
    props.setTeamOrCustomerChangedFlag("CUSTOMER changed"); // re-set flag
  };

  return (
    <>
      <Select
        placeholder="-- ALL CUSTOMERS --"
        data={expandedCustomerList}
        value={props.selectedCustomer}
        onChange={handleClickOnDropdownSelection}
      />
    </>
  );
};

// ---------

export { TeamDropdownFilterMantine, CustomerDropdownFilterMantine };
