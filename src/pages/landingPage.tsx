import React, { useState, useEffect } from "react";
import { Paper, Container, Text, Title, Anchor } from "@mantine/core";
import axios, { AxiosResponse } from "axios";

import setStateOfMultipleItemsOnInitialPageLoad from "./setStateOfMultipleItemsOnInitialPageLoad";
import fetchPOSTrequestFromCorrectEndpoint from "./fetchPOSTrequestFromCorrectEndpoint";
// import assembleBundledRowsForDisplayHelperFxn from "./assembleBundledRowsForDisplayHelperFxn"; -- TO REMOVE
import TableComponent from "./TableComponent";
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
  const [rowResultsOfDB, setRowResultsOfDB] = useState<
    augmentedRepObjectType[]
  >([]);
  const [fullRowResultsOfDBinCache, setFullRowResultsOfDBtoCache] = useState<
    augmentedRepObjectType[]
  >([]); // Replacing setFullRowResultsToDisplay (below to remove)

  // const [fullRowResultsToDisplay, setFullRowResultsToDisplay] = useState<
  //   JSX.Element[]
  // >([]); // This array of JSX.Elements is computed on initial pageload and persisted across entire session as cache -- REMOVE, NO LONGER NEEDED
  // const [rowResultsToDisplay, setRowResultsToDisplay] = useState<JSX.Element[]>(
  //   []
  // ); // Array of JSX.Elements for displaying in latest results in table on each re-filter OR column sort -- REMOVE, NO LONGER NEEDED
  const [threeFilteredObjectsCache, setThreeFilteredObjectsCache] =
    useState<nestedFilteredObjectsForClientType | null>(null); // Caching returned filters to re-use & spare repeat computations on backend

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
      setFullRowResultsOfDBtoCache
      // assembleBundledRowsForDisplayHelperFxn, -- REMOVE, NO LONGER NEEDED
      // setRowResultsToDisplay,
      // setFullRowResultsToDisplay
    ); // Helper fxn -- sets initial states on page load
  }, []); // end useEffect hook #1 (on initial load)

  // ---------

  // #2:  Below hook is triggered upon ANY state change in either dropdown selection
  // Selection is routed using conditional logic to the proper endpoint, with updated filter results being returned for display
  useEffect(() => {
    // Conditionals here for all endpoints w/ async wrapper
    (async (): Promise<void> => {
      const response: AxiosResponse | null =
        await fetchPOSTrequestFromCorrectEndpoint(
          selectedTeam,
          selectedCustomer,
          // setRowResultsToDisplay, -- REMOVE, NO LONGER NEEDED
          // fullRowResultsToDisplay,
          setRowResultsOfDB,
          fullRowResultsOfDBinCache,
          teamOrCustomerChangedFlag,
          threeFilteredObjectsCache
        ); // Helper fxn -- selects and pings appropriate server endpoint based on dropdown filter selections, returning processed data for display as needed (some pre-caching obviates this need in some cases)

      // null response fails to trigger conditional (i.e. when both dropdowns are blank / '' selected)
      if (response) {
        const threeFilteredObjects: nestedFilteredObjectsForClientType =
          response.data;

        // const combinedCurrentSelectionResults: augmentedRepObjectType[] =
        //   threeFilteredObjects.combinedCurrentSelectionResults as augmentedRepObjectType[]; // -- REMOVE, NO LONGER NEEDED
        setRowResultsOfDB(threeFilteredObjects.combinedCurrentSelectionResults); // A change here in rowResultsOfDB triggers the below useEffect to run
        setThreeFilteredObjectsCache(threeFilteredObjects);
      }
    })();
  }, [selectedTeam, selectedCustomer]); // end useEffect hook #2 (onChange of team or customer)

  // ---------

  // REMOVE, NO LONGER NEEDED
  // // #3:  Onchange of rowResultsOfDB, assemble array of JSX.Elements for painting
  // useEffect(() => {
  //   if (rowResultsOfDB) {
  //     // Bundle up latest result and reset state -- each 'rep row' contains 4 columns:  Name, Eamil, Team, Total Revenue
  //     const bundledRowsToDisplay: JSX.Element[] =
  //       assembleBundledRowsForDisplayHelperFxn(rowResultsOfDB);

  //     setRowResultsToDisplay(bundledRowsToDisplay);
  //   }
  // }, [rowResultsOfDB]); // end useEffect hook #3 (onChange of rowResultsOfDB)

  // --------- Returning LandingPage component ----------

  return (
    <>
      {/* <Paper shadow="md" p="xl">
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
        <br></br> */}
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
      {/* <ol>{rowResultsToDisplay}</ol> */}
      <TableComponent dataRows={rowResultsOfDB} />
      {/* </Container>
    </Paper> */}
    </>
  );
};

export default LandingPage;
