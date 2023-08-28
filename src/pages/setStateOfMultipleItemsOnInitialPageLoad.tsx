import { Dispatch, SetStateAction } from "react";
import axios, { AxiosResponse } from "axios";

import assembleBundledRowsForDisplayHelperFxn from "./assembleBundledRowsForDisplayHelperFxn";

import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
} from "../server";

// ---------

function setStateOfMultipleItemsOnInitialPageLoad(
  setTeamList: Dispatch<SetStateAction<string[]>>,
  setCustomerList: Dispatch<SetStateAction<string[]>>,
  setRowResultsOfDB: any, // Dispatch<SetStateAction<augmentedRepObjectType[]>>  <---  TO FIX ERROR (could be 'undefined'), use type assertion or similar solution:  https://bobbyhadz.com/blog/typescript-argument-type-undefined-not-assignable-parameter-type-string
  assembleBundledRowsForDisplayHelperFxn: any, // Dispatch<SetStateAction<JSX.Element[]>>
  setRowResultsToDisplay: Dispatch<SetStateAction<JSX.Element[]>>,
  setFullRowResultsToDisplay: Dispatch<SetStateAction<JSX.Element[]>>
): void {
  // Grab & session-persist sorted TeamList for dropdown
  try {
    (async function getTeamListArray(): Promise<void> {
      const response: AxiosResponse = await axios.get(
        "/api/getUniqueSortedTeamList"
      );
      const teamListArray: string[] = response.data;
      // console.log(teamListArray); // NOTE: Prints 2x in console due to 2 renders in dev mode due to <React.StrictMode> (prints only once as intended in prod mode)
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
      // console.log(customerListArray); // NOTE: Prints 2x in console due to 2 renders in dev mode due to <React.StrictMode> (prints only once as intended in prod mode)
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
      // console.log(rowResultsOfDB); // NOTE: Prints 2x in console due to 2 renders in dev mode due to <React.StrictMode> (prints only once as intended in prod mode)
      // console.log(Object.values(rowResultsOfDB[0])); // REMOVE
      setRowResultsOfDB(Object.values(rowResultsOfDB));

      // Bundle up each 'rep row' containing 4 columns:  Name, Eamil, Team, Total Revenue
      const bundledInitialRowsToDisplay: JSX.Element[] =
        assembleBundledRowsForDisplayHelperFxn(rowResultsOfDB);

      // console.log(bundledInitialRowsToDisplay); // REMOVE
      setRowResultsToDisplay(bundledInitialRowsToDisplay);
      setFullRowResultsToDisplay(bundledInitialRowsToDisplay); // Set this ONLY once so cached for future
    })();
  } catch {
    console.error(Error);
  }
}

// ---------

export default setStateOfMultipleItemsOnInitialPageLoad;
