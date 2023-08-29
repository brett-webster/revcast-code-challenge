import { Dispatch, SetStateAction } from "react";
import axios, { AxiosResponse } from "axios";

// import assembleBundledRowsForDisplayHelperFxn from "./assembleBundledRowsForDisplayHelperFxn"; -- REMOVE, NO LONGER NEEDED

import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
} from "../server";

// ---------

function setStateOfMultipleItemsOnInitialPageLoad(
  setTeamList: Dispatch<SetStateAction<string[]>>,
  setCustomerList: Dispatch<SetStateAction<string[]>>,
  setRowResultsOfDB: Dispatch<SetStateAction<augmentedRepObjectType[]>>,
  setFullRowResultsOfDBtoCache: Dispatch<
    SetStateAction<augmentedRepObjectType[]>
  >
  // assembleBundledRowsForDisplayHelperFxn: any, // Dispatch<SetStateAction<JSX.Element[]>> -- REMOVE, NO LONGER NEEDED
  // setRowResultsToDisplay: Dispatch<SetStateAction<JSX.Element[]>>,
  // setFullRowResultsToDisplay: Dispatch<SetStateAction<JSX.Element[]>>
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

      const rowResultsOfDB: augmentedRepObjectType[] = response.data; // as augmentedRepObjectType[] ???
      setRowResultsOfDB(rowResultsOfDB); // NOTE:  Changed from 'Object.values(rowResultsOfDB)'
      setFullRowResultsOfDBtoCache(rowResultsOfDB); // Set this ONLY once so cached for future, need to replace setFullRowResultsToDisplay (deleted below)

      // BELOW NO LONGER NEEDED SINCE v2 USES React Component INSTEAD -- REMOVE, NO LONGER NEEDED
      // // Bundle up each 'rep row' containing 4 columns:  Name, Email, Team, Total Revenue
      // const bundledInitialRowsToDisplay: JSX.Element[] =
      //   assembleBundledRowsForDisplayHelperFxn(rowResultsOfDB);

      // setRowResultsToDisplay(bundledInitialRowsToDisplay);
      // setFullRowResultsToDisplay(bundledInitialRowsToDisplay); // Set this ONLY once so cached for future
    })();
  } catch {
    console.error(Error);
  }
}

// ---------

export default setStateOfMultipleItemsOnInitialPageLoad;
