import { Dispatch, SetStateAction } from "react";
import { useState, useRef } from "react";

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

// --------- Components - Initially 2 basic dropdown filters -----------
// THESE HAVE BEEN REPLACED W/ CUSTOM DROPDOWN FILTERS BELOW

// const TeamDropdownFilter = (props: teamPropsType): JSX.Element => {
//   const handleOptionChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ): void => {
//     props.setSelectedTeam(event.target.value);
//     props.setTeamOrCustomerChangedFlag("TEAM changed");
//   };

//   return (
//     <div>
//       <select
//         id="teamDropdown"
//         value={props.selectedTeam || ""}
//         onChange={handleOptionChange}
//       >
//         <option value="">-- ALL TEAMS --</option>
//         {props.teamList.map((option: string) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// // ---------

// const CustomerDropdownFilter = (props: customerPropsType): JSX.Element => {
//   const handleOptionChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ): void => {
//     props.setSelectedCustomer(event.target.value);
//     props.setTeamOrCustomerChangedFlag("CUSTOMER changed");
//   };

//   return (
//     <div>
//       <select
//         id="customerDropdown"
//         value={props.selectedCustomer || ""}
//         onChange={handleOptionChange}
//       >
//         <option value="">-- ALL CUSTOMERS --</option>
//         {props.customerList.map((option: string) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// ---------

// CUSTOM TEAM DROPDOWN FILTER
const TeamDropdownFilter = (props: teamPropsType): JSX.Element => {
  const [dropdownIsOpenBoolean, setDropdownIsOpenBoolean] =
    useState<boolean>(false);
  const dropDownFilterRef = useRef<HTMLDivElement>(null);

  const handleDropdownFilterClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setDropdownIsOpenBoolean(!dropdownIsOpenBoolean); // toggle this
  };

  const handleMouseMoveOutsideDropdown = (
    event: any // React.MouseEvent<Window> ??
  ): void => {
    if (
      dropdownIsOpenBoolean &&
      !dropDownFilterRef?.current?.contains(event.target as Node) // latter checks for given node w/in DOM
    ) {
      //
      setDropdownIsOpenBoolean(false);
    }
  };
  window.addEventListener("mousemove", handleMouseMoveOutsideDropdown); // changed from 'click'

  const handleClickOnDropdownSelection = (listItem: string): void => {
    // console.log(dropDownFilterRef?.current, listItem); // REMOVE
    listItem === "-- ALL TEAMS --"
      ? props.setSelectedTeam("")
      : props.setSelectedTeam(listItem); // set TEAM state to selection (reset to "" in case ALL is selected)
    props.setTeamOrCustomerChangedFlag("TEAM changed"); // re-set flag
    setDropdownIsOpenBoolean(false); // Once selected, disappear dropdown
    setDropDownListItemBackgroundColor("#f8f8f8"); // reset styling color as well
  };

  //   -------

  // Styling section - :hover in CSS NOT working for some reason so using in-line here...
  type dropDownFilterStyleType = {
    backgroundColor: string;
    cursor: string;
    height: number;
    width: number;
    borderRadius: string;
    borderColor: string;
    fontWeight: string;
    fontFamily: string;
  };

  type dropDownListItemStyleType = {
    backgroundColor: string;
    cursor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    color: string;
    display: string;
    justifyContent: string;
    padding: number;
    zIndex: number;
  };

  const [filterBackgroundColor, setFilterBackgroundColorOnHover] =
    useState<string>("#34d399");
  const [mouseCursorOnHoverStyle, setMouseCursorOnHover] =
    useState<string>("cursor");

  const dropDownFilterStyle: dropDownFilterStyleType = {
    backgroundColor: filterBackgroundColor,
    cursor: mouseCursorOnHoverStyle,
    height: 40,
    width: 180,
    borderRadius: "10px",
    borderColor: "lightgrey",
    fontWeight: "bold",
    fontFamily: "verdana",
  };

  const [dropDownListItemBackgroundColor, setDropDownListItemBackgroundColor] =
    useState<string>("#f8f8f8");
  const [mouseCursorOnHoverTypeListItem, setMouseCursorOnHoverTypeListItem] =
    useState<string>("cursor");

  const dropDownListItemStyle: dropDownListItemStyleType = {
    backgroundColor: dropDownListItemBackgroundColor,
    cursor: mouseCursorOnHoverTypeListItem,
    fontFamily: "verdana",
    fontSize: "14px",
    fontWeight: "bold",
    color: "grey",
    display: "flex",
    justifyContent: "center",
    padding: 5,
    zIndex: 100,
  };

  //   -------

  // Inserting '-- ALL TEAMS --' to beginning of dropdown list for display
  const expandedTeamList: string[] = props.teamList.slice();
  expandedTeamList.unshift("-- ALL TEAMS --");
  //   console.log(expandedTeamList); // REMOVE

  // Bundle up list of teams as array of <li> items for displaying dropdown list upon click
  const teamListBundle: JSX.Element[] = expandedTeamList.map((listItem) => {
    return (
      <li
        onMouseEnter={() => {
          //   setDropDownListItemBackgroundColor("#34d399"); // RE-INSTATE, MAKES ALL li's GREEN
          setMouseCursorOnHoverTypeListItem("pointer");
        }}
        onMouseLeave={() => {
          setDropDownListItemBackgroundColor("#f8f8f8");
          setMouseCursorOnHoverTypeListItem("cursor");
        }}
        onClick={() => handleClickOnDropdownSelection(listItem)}
        style={dropDownListItemStyle}
        key={`${listItem}DROPDOWN`}
      >
        {listItem}
      </li>
    );
  });

  return (
    <>
      <div
        id="teamDropdown"
        style={{
          position: "absolute",
          marginLeft: "5%",
          zIndex: 100,
        }}
        ref={dropDownFilterRef}
      >
        <button
          value={props.selectedTeam || ""}
          onClick={(event) => handleDropdownFilterClick(event)}
          style={dropDownFilterStyle} // Dropdown filter button styling above
          onMouseOver={() => {
            setFilterBackgroundColorOnHover("#2dbe89");
            setMouseCursorOnHover("pointer");
          }}
          onMouseLeave={() => {
            setFilterBackgroundColorOnHover("#bee1d4");
            setMouseCursorOnHover("cursor");
          }}
        >
          {props.selectedTeam === "" ? "-- ALL TEAMS --" : props.selectedTeam}
        </button>
        {dropdownIsOpenBoolean ? (
          <ul
            style={{
              borderRadius: "4px",
              border: "1px solid grey",
              borderTopWidth: 0, // top border thickness
              listStyle: "none", // for ol & ul, no bullets or numbering
              marginTop: 0, // gap btwn 1st option and button
              maxHeight: "300px", // height of dropdown options
              overflowY: "auto", // add a scroll bar
              paddingLeft: 0,
            }}
          >
            {teamListBundle}
          </ul>
        ) : null}
      </div>
    </>
  );
};

// ---------

// CUSTOM CUSTOMER DROPDOWN FILTER
const CustomerDropdownFilter = (props: customerPropsType): JSX.Element => {
  const [dropdownIsOpenBoolean, setDropdownIsOpenBoolean] =
    useState<boolean>(false);
  const dropDownFilterRef = useRef<HTMLDivElement>(null);

  const handleDropdownFilterClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setDropdownIsOpenBoolean(!dropdownIsOpenBoolean); // toggle this
  };

  const handleMouseMoveOutsideDropdown = (
    event: any // React.MouseEvent<Window> ??
  ): void => {
    if (
      dropdownIsOpenBoolean &&
      !dropDownFilterRef?.current?.contains(event.target as Node) // latter checks for given node w/in DOM
    ) {
      //
      setDropdownIsOpenBoolean(false);
    }
  };
  window.addEventListener("mousemove", handleMouseMoveOutsideDropdown); // changed from 'click'

  const handleClickOnDropdownSelection = (listItem: string): void => {
    // console.log(dropDownFilterRef?.current, listItem); // REMOVE
    listItem === "-- ALL CUSTOMERS --"
      ? props.setSelectedCustomer("")
      : props.setSelectedCustomer(listItem); // set CUSTOMER state to selection (reset to "" in case ALL is selected)
    props.setTeamOrCustomerChangedFlag("CUSTOMER changed"); // re-set flag
    setDropdownIsOpenBoolean(false); // Once selected, disappear dropdown
    setDropDownListItemBackgroundColor("#f8f8f8"); // reset styling color as well
  };

  //   -------

  // Styling section - :hover in CSS NOT working for some reason so using in-line here...
  type dropDownFilterStyleType = {
    backgroundColor: string;
    cursor: string;
    height: number;
    width: number;
    borderRadius: string;
    borderColor: string;
    fontWeight: string;
    fontFamily: string;
  };

  type dropDownListItemStyleType = {
    backgroundColor: string;
    cursor: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    color: string;
    display: string;
    justifyContent: string;
    padding: number;
    zIndex: number;
  };

  const [filterBackgroundColor, setFilterBackgroundColorOnHover] =
    useState<string>("#34d399");
  const [mouseCursorOnHoverStyle, setMouseCursorOnHover] =
    useState<string>("cursor");

  const dropDownFilterStyle: dropDownFilterStyleType = {
    backgroundColor: filterBackgroundColor,
    cursor: mouseCursorOnHoverStyle,
    height: 40,
    width: 180,
    borderRadius: "10px",
    borderColor: "lightgrey",
    fontWeight: "bold",
    fontFamily: "verdana",
  };

  const [dropDownListItemBackgroundColor, setDropDownListItemBackgroundColor] =
    useState<string>("#f8f8f8");
  const [mouseCursorOnHoverTypeListItem, setMouseCursorOnHoverTypeListItem] =
    useState<string>("cursor");

  const dropDownListItemStyle: dropDownListItemStyleType = {
    backgroundColor: dropDownListItemBackgroundColor,
    cursor: mouseCursorOnHoverTypeListItem,
    fontFamily: "verdana",
    fontSize: "14px",
    fontWeight: "bold",
    color: "grey",
    display: "flex",
    justifyContent: "center",
    padding: 5,
    zIndex: 100,
  };

  //   -------

  // Inserting '-- ALL CUSTOMERS --' to beginning of dropdown list for display
  const expandedCustomerList: string[] = props.customerList.slice();
  expandedCustomerList.unshift("-- ALL CUSTOMERS --");
  //   console.log(expandedCustomerList); // REMOVE

  // Bundle up list of customers as array of <li> items for displaying dropdown list upon click
  const customerListBundle: JSX.Element[] = expandedCustomerList.map(
    (listItem) => {
      return (
        <li
          onMouseEnter={() => {
            //   setDropDownListItemBackgroundColor("#34d399"); // RE-INSTATE, MAKES ALL li's GREEN
            setMouseCursorOnHoverTypeListItem("pointer");
          }}
          onMouseLeave={() => {
            setDropDownListItemBackgroundColor("#f8f8f8");
            setMouseCursorOnHoverTypeListItem("cursor");
          }}
          onClick={() => handleClickOnDropdownSelection(listItem)}
          style={dropDownListItemStyle}
          key={`${listItem}DROPDOWN`}
        >
          {listItem}
        </li>
      );
    }
  );

  return (
    <>
      <div
        id="customerDropdown"
        style={{
          position: "absolute",
          marginLeft: "20%",
          zIndex: 100,
        }}
        ref={dropDownFilterRef}
      >
        <button
          value={props.selectedCustomer || ""}
          onClick={(event) => handleDropdownFilterClick(event)}
          style={dropDownFilterStyle} // Dropdown filter button styling above
          onMouseOver={() => {
            setFilterBackgroundColorOnHover("#2dbe89");
            setMouseCursorOnHover("pointer");
          }}
          onMouseLeave={() => {
            setFilterBackgroundColorOnHover("#bee1d4");
            setMouseCursorOnHover("cursor");
          }}
        >
          {props.selectedCustomer === ""
            ? "-- ALL CUSTOMERS --"
            : props.selectedCustomer}
        </button>
        {dropdownIsOpenBoolean ? (
          <ul
            style={{
              borderRadius: "4px",
              border: "1px solid grey",
              borderTopWidth: 0, // top border thickness
              listStyle: "none", // for ol & ul, no bullets or numbering
              marginTop: 0, // gap btwn 1st option and button
              maxHeight: "300px", // height of dropdown options
              overflowY: "auto", // add a scroll bar
              paddingLeft: 0,
            }}
          >
            {customerListBundle}
          </ul>
        ) : null}
      </div>
    </>
  );
};

// ---------

export { TeamDropdownFilter, CustomerDropdownFilter };
