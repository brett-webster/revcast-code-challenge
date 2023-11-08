import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import setStateOfMultipleItemsOnInitialPageLoad from "./setStateOfMultipleItemsOnInitialPageLoad";

import TableComponentAGgrid from "./TableComponentAGgrid";
import {
  TeamDropdownFilterMantine,
  CustomerDropdownFilterMantine,
} from "./dropdownComponentsMantine";

import type { augmentedRepObjectType } from "../server";

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

  // Below are used to (re)set team and customer choices using dropdown filters & track which most recent changed
  const [selectedTeam, setSelectedTeam] = useState<string | null>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>("");

  // --------- useEffect hooks triggered under various scenarios --------

  // #1:  On INITIAL PAGELOAD only grab 2 alphabetized dropdown lists + full DB contents of rep details for initial display
  useEffect(() => {
    setStateOfMultipleItemsOnInitialPageLoad(
      setTeamList,
      setCustomerList,
      setRowResultsOfDB,
      setFullRowResultsOfDBtoCache
    ); // Helper fxn -- sets initial states on page load
  }, []); // end useEffect hook #1 (on initial load)

  // ---------

  // #2:  Below hook is triggered upon ANY state change in either dropdown selection
  // Selection is routed to the below endpoint (if needed), with updated filter results being returned for display
  useEffect(() => {
    // Conditional here routing to endpoint w/ async wrapper
    (async (): Promise<void> => {
      // Ping appropriate server endpoint based on dropdown filter selections, returning processed data for display as needed (some pre-caching obviates this need in some cases)
      let response: AxiosResponse | null = null;

      if (selectedTeam === "" && selectedCustomer === "")
        setRowResultsOfDB(fullRowResultsOfDBinCache);
      // setting = to cached state here, no endpoint accessed
      else
        response = await axios.post(
          "/api/getTeamAndCustomerSelectionsFiltered",
          {
            selectedTeam,
            selectedCustomer,
            fullRowResultsOfDBinCache,
          }
        );

      // response = null fails to trigger conditional (i.e. when both dropdowns are blank / '' selected)
      if (response) {
        const rowResults: augmentedRepObjectType[] = response.data;
        setRowResultsOfDB(rowResults);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam, selectedCustomer]); // end useEffect hook #2 (onChange of team or customer)

  // --------- Returning LandingPage component ----------

  return (
    <>
      <div style={{ display: "flex", justifyContent: "none" }}>
        <TeamDropdownFilterMantine
          teamList={teamList}
          setSelectedTeam={setSelectedTeam}
          selectedTeam={selectedTeam}
        />
        <CustomerDropdownFilterMantine
          customerList={customerList}
          setSelectedCustomer={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
        />
      </div>
      <br></br>
      <br></br>
      <TableComponentAGgrid dataRows={rowResultsOfDB} />
    </>
  );
};

export default LandingPage;
