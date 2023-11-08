import { Dispatch, SetStateAction } from "react";
import axios, { AxiosResponse } from "axios";

import type { augmentedRepObjectType } from "../server";

// ---------

function setStateOfMultipleItemsOnInitialPageLoad(
  setTeamList: Dispatch<SetStateAction<string[]>>,
  setCustomerList: Dispatch<SetStateAction<string[]>>,
  setRowResultsOfDB: Dispatch<SetStateAction<augmentedRepObjectType[]>>,
  setFullRowResultsOfDBtoCache: Dispatch<
    SetStateAction<augmentedRepObjectType[]>
  >
): void {
  // Grab & session-persist sorted TeamList for dropdown
  try {
    (async function getTeamListArray(): Promise<void> {
      const response: AxiosResponse = await axios.get(
        "/api/getUniqueSortedTeamList"
      );
      const teamListArray: string[] = response.data;
      setTeamList(teamListArray);
    })();
  } catch {
    console.error(Error);
  }

  // Grab & session-persist sorted CustomerList for dropdown
  try {
    (async function getCustomerListArray(): Promise<void> {
      const response: AxiosResponse = await axios.get(
        "/api/getUniqueSortedCustomerList"
      );
      const customerListArray: string[] = response.data;
      setCustomerList(customerListArray);
    })();
  } catch {
    console.error(Error);
  }

  // Grab & session-persist full, augmented rep list for initial display
  try {
    (async function getEntireArrayOfObjects(): Promise<void> {
      const response: AxiosResponse = await axios.get(
        "/api/getEntireUniqueSortedArrayOfObjs"
      );

      const rowResultsOfDB: augmentedRepObjectType[] = response.data;
      setRowResultsOfDB(rowResultsOfDB);
      setFullRowResultsOfDBtoCache(rowResultsOfDB); // Set this ONLY once so cached for future
    })();
  } catch {
    console.error(Error);
  }
}

// ---------

export default setStateOfMultipleItemsOnInitialPageLoad;
