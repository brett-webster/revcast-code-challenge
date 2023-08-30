import React, { useState, useEffect } from "react";
// import { Paper, Container, Text, Title, Anchor } from "@mantine/core";
import axios, { AxiosResponse } from "axios";

import setStateOfMultipleItemsOnInitialPageLoad from "./setStateOfMultipleItemsOnInitialPageLoad";
import fetchPOSTrequestFromCorrectEndpoint from "./fetchPOSTrequestFromCorrectEndpoint";
import TableComponent from "./TableComponent";
import {
  TeamDropdownFilter,
  CustomerDropdownFilter,
} from "./dropdownComponents";

import type {
  augmentedRepObjectType,
  nestedFilteredObjectsForClientType,
} from "../server";
import type { sortedStateType } from "./TableComponent";

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
  >([]); // entirety of table is cached for future reference

  const [threeFilteredObjectsCache, setThreeFilteredObjectsCache] =
    useState<nestedFilteredObjectsForClientType | null>(null); // Caching returned filters to re-use & spare repeat computations on backend

  // Below are used to (re)set team and customer choices using dropdown filters & track which most recent changed
  const [selectedTeam, setSelectedTeam] = useState<string | null>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>("");
  const [teamOrCustomerChangedFlag, setTeamOrCustomerChangedFlag] = useState<
    string | null
  >("");

  const [sortedState, setSortedState] = useState<sortedStateType>({
    columnHeadToSort: "id",
    order: "Ascending",
  });

  // --------- useEffect hooks triggered under various scenarios --------

  // #1:  On INITIAL PAGELOAD only grab 2 alphabetized dropdown lists + full DB contents of rep details for initial display
  useEffect(() => {
    setStateOfMultipleItemsOnInitialPageLoad(
      setTeamList,
      setCustomerList,
      setRowResultsOfDB,
      setFullRowResultsOfDBtoCache,
      setThreeFilteredObjectsCache
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
          setRowResultsOfDB,
          fullRowResultsOfDBinCache,
          teamOrCustomerChangedFlag,
          threeFilteredObjectsCache,
          sortedState
        ); // Helper fxn -- selects and pings appropriate server endpoint based on dropdown filter selections, returning processed data for display as needed (some pre-caching obviates this need in some cases)

      // null response fails to trigger conditional (i.e. when both dropdowns are blank / '' selected)
      if (response) {
        const threeFilteredObjects: nestedFilteredObjectsForClientType =
          response.data;

        setRowResultsOfDB(threeFilteredObjects.combinedCurrentSelectionResults);
        setThreeFilteredObjectsCache(threeFilteredObjects);
      }
    })();
  }, [selectedTeam, selectedCustomer]); // end useEffect hook #2 (onChange of team or customer)

  // ---------

  // #3:  Below hook is triggered upon ANY state change in sorting by column
  // Selection is routed to the back end for re-sorting and returning the updated bundle for re-setting state & display
  useEffect(() => {
    (async (): Promise<void> => {
      const response: AxiosResponse | null = await axios.post(
        "/api/reSortTable",
        {
          sortedState,
          threeFilteredObjectsCache,
        }
      );

      // null response fails to trigger conditional (similar code to above)
      if (response?.data) {
        const reSortedThreeFilteredObjects: nestedFilteredObjectsForClientType =
          response.data;
        // console.log("FE: ", response.data); // REMOVE

        setRowResultsOfDB(
          reSortedThreeFilteredObjects.combinedCurrentSelectionResults
        );
        setThreeFilteredObjectsCache(reSortedThreeFilteredObjects);
      }
    })();
  }, [sortedState]); // end useEffect hook #3 (onChange of sorting by column header)

  // --------- Returning LandingPage component ----------

  return (
    <>
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
      <TableComponent
        dataRows={rowResultsOfDB}
        sortedState={sortedState}
        setSortedState={setSortedState}
      />
    </>
  );
};

export default LandingPage;
