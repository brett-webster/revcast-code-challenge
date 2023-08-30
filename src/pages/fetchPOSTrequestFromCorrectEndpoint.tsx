import { Dispatch, SetStateAction } from "react";
import axios, { AxiosResponse } from "axios";

import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
  sortedStateType,
} from "../server";

// ----------

async function fetchPOSTrequestFromCorrectEndpoint(
  selectedTeam: string | null,
  selectedCustomer: string | null,
  setRowResultsOfDB: Dispatch<SetStateAction<augmentedRepObjectType[]>>,
  fullRowResultsOfDBinCache: augmentedRepObjectType[],
  teamOrCustomerChangedFlag: string | null,
  threeFilteredObjectsCache: nestedFilteredObjectsForClientType | null,
  sortedState: sortedStateType
) {
  let response: AxiosResponse | null = null;

  const {
    columnHeadToSort,
    order,
  }: { columnHeadToSort: string; order: string } = sortedState; // destructuring in-line
  console.log("FE: ", columnHeadToSort, order); // REMOVE

  // Dropdowns reset to initial state (both blank/'') & sorted by id, ascending
  if (
    selectedTeam === "" &&
    selectedCustomer === "" &&
    columnHeadToSort === "id" &&
    order === "Ascending"
  ) {
    console.log("FE:  INSIDE STATIC..."); // REMOVE
    response = null;
    // setting = to cached state here, no endpoint accessed
    setRowResultsOfDB(fullRowResultsOfDBinCache);
  }

  // ADDED
  // Dropdowns reset to initial state (both blank/'') BUT still need to ping back end if NOT sorted by id, ascending
  if (
    selectedTeam === "" &&
    selectedCustomer === "" &&
    (columnHeadToSort !== "id" || order !== "Ascending")
  ) {
    console.log("FE:  INSIDE non-id / Ascending...", sortedState); // REMOVE
    console.log("3cache pre-process: ", threeFilteredObjectsCache); // REMOVE
    response = await axios.post("/api/allSelectedButNeedsReSorted", {
      sortedState,
    });
  }

  // Only TEAM selected
  if (selectedTeam && selectedCustomer === "") {
    response = await axios.post("/api/onlyTeamSelected", {
      selectedTeam,
      sortedState,
    });
  }

  // Only CUSTOMER selected
  if (selectedTeam === "" && selectedCustomer) {
    response = await axios.post("/api/onlyCustomerSelected", {
      selectedCustomer,
      sortedState,
    });
  }

  // Both selected, TEAM is new
  if (
    selectedTeam &&
    selectedCustomer &&
    teamOrCustomerChangedFlag === "TEAM changed"
  ) {
    const customerCurrentSelectionResults: augmentedRepObjectType[] =
      threeFilteredObjectsCache!.customerCurrentSelectionResults;

    response = await axios.post("/api/bothSelectedTeamJustChanged", {
      selectedTeam,
      customerCurrentSelectionResults,
      sortedState,
    });
  }

  // Both selected, CUSTOMER is new
  if (
    selectedTeam &&
    selectedCustomer &&
    teamOrCustomerChangedFlag === "CUSTOMER changed"
  ) {
    const teamCurrentSelectionResults: augmentedRepObjectType[] =
      threeFilteredObjectsCache!.teamCurrentSelectionResults;

    response = await axios.post("/api/bothSelectedCustomerJustChanged", {
      selectedCustomer,
      teamCurrentSelectionResults,
      sortedState,
    });
  } // --- end conditionals

  return response;
}

// ---------

export default fetchPOSTrequestFromCorrectEndpoint;
