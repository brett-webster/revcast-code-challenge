import React, { useState, useEffect } from "react";
import { Paper, Container, Text, Title, Anchor } from "@mantine/core";
import axios, { AxiosResponse } from "axios";

import setStateOfMultipleItemsOnInitialPageLoad from "./setStateOfMultipleItemsOnInitialPageLoad";
import fetchPOSTrequestFromCorrectEndpoint from "./fetchPOSTrequestFromCorrectEndpoint";
import assembleBundledRowsForDisplayHelperFxn from "./assembleBundledRowsForDisplayHelperFxn";
import {
  TeamDropdownFilter,
  CustomerDropdownFilter,
} from "./dropdownComponents";

import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
} from "../server";

// ---------

const LandingPage = (): JSX.Element => {
  // --------- useState hooks --------

  // On initial pageload only, the below 3 items are fetched from server and stored as cache.  1st two are persisted across entire session
  const [teamList, setTeamList] = useState<string[]>([]);
  const [customerList, setCustomerList] = useState<string[]>([]);
  const [rowResultsOfDB, setRowResultsOfDB] =
    useState<augmentedRepObjectType[]>();

  const [fullRowResultsToDisplay, setFullRowResultsToDisplay] = useState<
    JSX.Element[]
  >([]); // This array of JSX.Elements is computed on initial pageload and persisted across entire session as cache
  const [rowResultsToDisplay, setRowResultsToDisplay] = useState<JSX.Element[]>(
    []
  ); // Array of JSX.Elements for displaying in latest results in table on each re-filter OR column sort
  const [threeFilteredObjectsCache, setThreeFilteredObjectsCache] =
    useState<nestedFilteredObjectsForClientType>(); // Caching returned filters to re-use & spare repeat computations on backend

  // Below are used to (re)set team and customer choices using dropdown filters & track which most recent changed
  const [selectedTeam, setSelectedTeam] = useState<string | null>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>("");
  const [teamOrCustomerChangedFlag, setTeamOrCustomerChangedFlag] = useState<
    string | null
  >("");

  // --------- useEffect hooks triggered under various scenarios --------

  // #1:  On INITIAL PAGELOAD only grab 2 alphabetized dropdown lists + full DB contents of rep details for initial display
  useEffect(() => {
    setStateOfMultipleItemsOnInitialPageLoad(
      setTeamList,
      setCustomerList,
      setRowResultsOfDB,
      assembleBundledRowsForDisplayHelperFxn,
      setRowResultsToDisplay,
      setFullRowResultsToDisplay
    ); // Helper fxn -- sets initial states on page load

    // BELOW TO REMOVE
    // // Grab & session-persist sorted TeamList for dropdown
    // try {
    //   (async function getTeamListArray(): Promise<void> {
    //     const response: AxiosResponse = await axios.get(
    //       "/api/getUniqueSortedTeamList"
    //     );
    //     const teamListArray: string[] = response.data;
    //     // console.log(teamListArray); // NOTE: Prints 2x in console due to 2 renders in dev mode due to <React.StrictMode> (prints only once as intended in prod mode)
    //     setTeamList(teamListArray);
    //   })();
    // } catch {
    //   console.error(Error);
    // }
    // // Grab & session-persist sorted CustomerList for dropdown
    // try {
    //   (async function getCustomerListArray(): Promise<void> {
    //     const response: AxiosResponse = await axios.get(
    //       "/api/getUniqueSortedCustomerList"
    //     );
    //     const customerListArray: string[] = response.data;
    //     // console.log(customerListArray); // NOTE: Prints 2x in console due to 2 renders in dev mode due to <React.StrictMode> (prints only once as intended in prod mode)
    //     setCustomerList(customerListArray);
    //   })();
    // } catch {
    //   console.error(Error);
    // }
    // // Grab & session-persist full, augmented rep list for initial display
    // try {
    //   (async function getEntireArrayOfObjects(): Promise<void> {
    //     const response: AxiosResponse = await axios.get(
    //       "/api/getEntireUniqueSortedArrayOfObjs"
    //     );
    //     const rowResultsOfDB: augmentedRepObjectType[] = response.data;
    //     // console.log(rowResultsOfDB); // NOTE: Prints 2x in console due to 2 renders in dev mode due to <React.StrictMode> (prints only once as intended in prod mode)
    //     // console.log(Object.values(rowResultsOfDB[0])); // REMOVE
    //     setRowResultsOfDB(Object.values(rowResultsOfDB));
    //     // Bundle up each 'rep row' containing 4 columns:  Name, Eamil, Team, Total Revenue
    //     const bundledInitialRowsToDisplay: JSX.Element[] =
    //       assembleBundledRowsForDisplayHelperFxn(rowResultsOfDB);
    //     // console.log(bundledInitialRowsToDisplay); // REMOVE
    //     setRowResultsToDisplay(bundledInitialRowsToDisplay);
    //     setFullRowResultsToDisplay(bundledInitialRowsToDisplay); // Set this ONLY once so cached for future
    //   })();
    // } catch {
    //   console.error(Error);
    // }
  }, []); // end useEffect hook #1 (on initial load)

  // ---------

  // #2:  Below hook is triggered upon ANY state change in either dropdown selection
  // Selection is routed using conditional logic to the proper endpoint, with updated filter results being returned for display
  useEffect(() => {
    // Conditionals here for all endpoints w/ async wrapper
    (async (): Promise<void> => {
      // let response: AxiosResponse | null = null; // REMOVE

      const response: AxiosResponse | null =
        await fetchPOSTrequestFromCorrectEndpoint(
          selectedTeam,
          selectedCustomer,
          setRowResultsToDisplay,
          fullRowResultsToDisplay,
          teamOrCustomerChangedFlag,
          threeFilteredObjectsCache
        ); // Helper fxn -- selects and pings appropriate server endpoint based on dropdown filter selections, returning processed data for display as needed (some pre-caching obviates this need in some cases)

      // // Dropdowns reset to initial state (both blank/'')
      // if (selectedTeam === "" && selectedCustomer === "") {
      //   response = null;
      //   // setting = to cached state here, no endpoint accessed
      //   setRowResultsToDisplay(fullRowResultsToDisplay);
      // }

      // // Only TEAM selected
      // if (selectedTeam && selectedCustomer === "") {
      //   response = await axios.post("/api/onlyTeamSelected", {
      //     selectedTeam,
      //   });
      // }

      // // Only CUSTOMER selected
      // if (selectedTeam === "" && selectedCustomer) {
      //   response = await axios.post("/api/onlyCustomerSelected", {
      //     selectedCustomer,
      //   });
      // }

      // // Both selected, TEAM is new
      // if (
      //   selectedTeam &&
      //   selectedCustomer &&
      //   teamOrCustomerChangedFlag === "TEAM changed"
      // ) {
      //   const customerCurrentSelectionResults: augmentedRepObjectType[] =
      //     threeFilteredObjectsCache!.customerCurrentSelectionResults;

      //   response = await axios.post("/api/bothSelectedTeamJustChanged", {
      //     selectedTeam,
      //     customerCurrentSelectionResults,
      //   });
      // }

      // // Both selected, CUSTOMER is new
      // if (
      //   selectedTeam &&
      //   selectedCustomer &&
      //   teamOrCustomerChangedFlag === "CUSTOMER changed"
      // ) {
      //   const teamCurrentSelectionResults: augmentedRepObjectType[] =
      //     threeFilteredObjectsCache!.teamCurrentSelectionResults;

      //   response = await axios.post("/api/bothSelectedCustomerJustChanged", {
      //     selectedCustomer,
      //     teamCurrentSelectionResults,
      //   });
      // }

      // // --- end conditionals

      // null response fails to trigger conditional (i.e. when both dropdowns are blank / '' selected)
      if (response) {
        const threeFilteredObjects: nestedFilteredObjectsForClientType =
          response.data;

        setRowResultsOfDB(threeFilteredObjects.combinedCurrentSelectionResults); // A change here in rowResultsOfDB triggers the below useEffect to run
        setThreeFilteredObjectsCache(threeFilteredObjects);
      }
    })();
  }, [selectedTeam, selectedCustomer]); // end useEffect hook #2 (onChange of team or customer)

  // ---------

  // #3:  Onchange of rowResultsOfDB assemble array of JSX.Elements for painting
  useEffect(() => {
    if (rowResultsOfDB) {
      // Bundle up latest result and reset state -- each 'rep row' contains 4 columns:  Name, Eamil, Team, Total Revenue
      const bundledRowsToDisplay: JSX.Element[] =
        assembleBundledRowsForDisplayHelperFxn(rowResultsOfDB);

      setRowResultsToDisplay(bundledRowsToDisplay);
    }
  }, [rowResultsOfDB]); // end useEffect hook #3 (onChange of rowResultsOfDB)

  // --------- Returning LandingPage component ----------

  return (
    <Paper shadow="md" p="xl">
      <Container size="md">
        <Title order={1}>Good luck!</Title>
        &nbsp;
        <Text>Please refer to README.md or reach out with any questions</Text>
        &nbsp;
        <Text>
          It is optional to use Mantine Components&nbsp;&nbsp;
          <Anchor href="https://mantine.dev/" target="_blank">
            Mantine docs
          </Anchor>
        </Text>
        &nbsp;
        <Text>
          Create a table of reps that includes the following columns: First
          Name, Last Name, Email, Team, Total Revenue
        </Text>
        &nbsp;
        <Text>Add the following filters: Team Name, Opp Customer</Text>
        <br></br>
        <br></br>
        <div style={{ display: "flex", justifyContent: "none" }}>
          <TeamDropdownFilter
            teamList={teamList}
            setSelectedTeam={setSelectedTeam}
            setTeamOrCustomerChangedFlag={setTeamOrCustomerChangedFlag}
            selectedTeam={selectedTeam}
          />
          <CustomerDropdownFilter
            customerList={customerList}
            setSelectedCustomer={setSelectedCustomer}
            setTeamOrCustomerChangedFlag={setTeamOrCustomerChangedFlag}
            selectedCustomer={selectedCustomer}
          />
        </div>
        <br></br>
        <br></br>
        <ol>{rowResultsToDisplay}</ol>
      </Container>
    </Paper>
  );
};

export default LandingPage;
