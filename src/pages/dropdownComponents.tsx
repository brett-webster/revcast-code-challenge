import { Dispatch, SetStateAction } from "react";

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

// --------- Components - Currently 2 basic dropdown filters -----------

const TeamDropdownFilter = (props: teamPropsType): JSX.Element => {
  const handleOptionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    props.setSelectedTeam(event.target.value);
    props.setTeamOrCustomerChangedFlag("TEAM changed");
  };

  return (
    <div>
      <select
        id="teamDropdown"
        value={props.selectedTeam || ""}
        onChange={handleOptionChange}
      >
        <option value="">-- ALL TEAMS --</option>
        {props.teamList.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

// ---------

const CustomerDropdownFilter = (props: customerPropsType): JSX.Element => {
  const handleOptionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    props.setSelectedCustomer(event.target.value);
    props.setTeamOrCustomerChangedFlag("CUSTOMER changed");
  };

  return (
    <div>
      <select
        id="customerDropdown"
        value={props.selectedCustomer || ""}
        onChange={handleOptionChange}
      >
        <option value="">-- ALL CUSTOMERS --</option>
        {props.customerList.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export { TeamDropdownFilter, CustomerDropdownFilter };
