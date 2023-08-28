import { Dispatch, SetStateAction } from "react";
import axios, { AxiosResponse } from "axios";

import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
} from "../server";

// ----------

async function fetchPOSTrequestFromCorrectEndpoint(
  selectedTeam: string | null,
  selectedCustomer: string | null,
  setRowResultsToDisplay: Dispatch<SetStateAction<JSX.Element[]>>,
  fullRowResultsToDisplay: JSX.Element[],
  teamOrCustomerChangedFlag: string | null,
  threeFilteredObjectsCache: any // nestedFilteredObjectsForClientType
) {
  let response: AxiosResponse | null = null;

  // Dropdowns reset to initial state (both blank/'')
  if (selectedTeam === "" && selectedCustomer === "") {
    response = null;
    // setting = to cached state here, no endpoint accessed
    setRowResultsToDisplay(fullRowResultsToDisplay);
  }

  // Only TEAM selected
  if (selectedTeam && selectedCustomer === "") {
    response = await axios.post("/api/onlyTeamSelected", {
      selectedTeam,
    });
  }

  // Only CUSTOMER selected
  if (selectedTeam === "" && selectedCustomer) {
    response = await axios.post("/api/onlyCustomerSelected", {
      selectedCustomer,
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
    });
  } // --- end conditionals

  return response;
}

// ---------

export default fetchPOSTrequestFromCorrectEndpoint;
