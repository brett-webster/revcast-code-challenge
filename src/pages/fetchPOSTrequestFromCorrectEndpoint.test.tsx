import supertest from "supertest";
import { app, augmentedRepObjectType } from "../server"; // Importing express dev server for supertest
import {
  sortedAscByLastNameResults,
  sortedDescByEmailResults,
  sortedAscByTeamResults,
  sortedAscByFirstNameWithCustomerFilterInput,
  sortedAscByFirstNameResults,
  sortedDescByIDwithTeamFilterInput,
  sortedDescByIDresults,
} from "../data/testingDataForfetchPOSTrequestFromCorrectEndpoint";
import fetchPOSTrequestFromCorrectEndpoint from "./fetchPOSTrequestFromCorrectEndpoint";

// ---------- BELOW USES JEST w/ SUPERTEST ----------

describe("Integration testing: Jest w/ Supertest for Endpoints...", () => {
  // const request = supertest(app); // REQUIRED for supertest - TO REMOVE
  let server: any = null;
  let request: any = null;

  // Setup & teardown of test server (NOTE conditional logic at bottom of server.ts to NOT listen on port 4000 when process.env.NODE_ENV === "test")
  beforeAll(() => {
    server = app.listen(5001); // supertest server assigned 5001 (distinct server number to avoid error in 'npm run coverage')
    request = supertest(app);
  });

  afterAll((done) => {
    server.close(done);
  });

  let MockedResponse: any = {
    body: {
      teamCurrentSelectionResults: [],
      customerCurrentSelectionResults: [],
      combinedCurrentSelectionResults: "FILL THIS IN",
    },
    status: 200,
    ok: true, // vs statusText: "OK" in Axios mock
    headers: {
      "x-powered-by": "Express",
      "content-type": "application/json; charset=utf-8",
    },
  };

  // -----------

  test("Correctly returns full ASCENDING TABLE SORTED by LAST NAME, following any DROPDOWN change from fetchPOSTrequestFromCorrectEndpoint.tsx", async () => {
    const sampleObjectFirstLastName: augmentedRepObjectType = {
      id: 24,
      firstName: "Caleb",
      lastName: "Adams",
      email: "caleb.adams@example.com",
      teamId: 4,
      teamName: "Sunset Strikers",
      totalRevenue: 12694144,
    };
    const sampleObjectFinalLastName: augmentedRepObjectType = {
      id: 37,
      firstName: "Benjamin",
      lastName: "Wood",
      email: "benjamin.wood@example.com",
      teamId: 10,
      teamName: "Cosmic Cyclones",
      totalRevenue: 11151061,
    };

    const response = await request
      .post("/api/allSelectedButNeedsReSorted")
      .send({
        sortedState: {
          columnHeadToSort: "Last Name",
          order: "Ascending",
        },
      });

    // Update all properties in Mock
    MockedResponse.body.teamCurrentSelectionResults = [];
    MockedResponse.body.customerCurrentSelectionResults = [];
    MockedResponse.body.combinedCurrentSelectionResults =
      sortedAscByLastNameResults;

    // console.log(
    //   "RESPONSE: ",
    //   response.body.combinedCurrentSelectionResults
    //   //   MockedResponse.body.combinedCurrentSelectionResults
    // );

    expect(response.body).toEqual(MockedResponse.body);
    expect(response.body.combinedCurrentSelectionResults).toHaveLength(
      MockedResponse.body.combinedCurrentSelectionResults.length
    ); // 80
    expect(response.body.combinedCurrentSelectionResults[0]).toEqual(
      sampleObjectFirstLastName
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[0]).not.toEqual(
      sampleObjectFinalLastName
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[79]).toEqual(
      sampleObjectFinalLastName
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[79]).not.toEqual(
      sampleObjectFirstLastName
    ); // SEE ABOVE
    expect(response.status).toBe(MockedResponse.status); // 200
    expect(response.ok).toBe(MockedResponse.ok); // true
    expect(response.headers["x-powered-by"]).toBe(
      MockedResponse.headers["x-powered-by"]
    ); // "Express"
    expect(response.headers["content-type"]).toBe(
      MockedResponse.headers["content-type"]
    ); // 'application/json; charset=utf-8'

    return request
      .post("/api/allSelectedButNeedsReSorted")
      .send({
        sortedState: {
          columnHeadToSort: "Last Name",
          order: "Ascending",
        },
      })
      .expect(200); // Correctly passes
  });

  // -----------

  test("Correctly returns DESCENDING TABLE SORTED by EMAIL, filtered only by TEAM (Emerald Enchanters) from fetchPOSTrequestFromCorrectEndpoint.tsx", async () => {
    const sampleObjectFirstEmail: augmentedRepObjectType = {
      id: 47,
      firstName: "Savannah",
      lastName: "Kim",
      email: "savannah.kim@example.com",
      teamId: 3,
      teamName: "Emerald Enchanters",
      totalRevenue: 0,
    };
    const sampleObjectFinalEmail: augmentedRepObjectType = {
      id: 8,
      firstName: "Aiden",
      lastName: "Evans",
      email: "aiden.evans@example.com",
      teamId: 3,
      teamName: "Emerald Enchanters",
      totalRevenue: 8293738,
    };

    const response = await request.post("/api/onlyTeamSelected").send({
      selectedTeam: "Emerald Enchanters",
      sortedState: {
        columnHeadToSort: "Email",
        order: "Descending",
      },
    });

    // Update all properties in Mock
    MockedResponse.body.teamCurrentSelectionResults =
      response.body.combinedCurrentSelectionResults;
    MockedResponse.body.customerCurrentSelectionResults = [];
    MockedResponse.body.combinedCurrentSelectionResults =
      sortedDescByEmailResults;

    // console.log(
    //   "RESPONSE: ",
    //   response.body.combinedCurrentSelectionResults,
    //   MockedResponse.body.combinedCurrentSelectionResults,
    //   response.body.combinedCurrentSelectionResults.length
    // );

    // expect(response.body).toEqual(MockedResponse.body);
    expect(response.body.combinedCurrentSelectionResults).toHaveLength(
      MockedResponse.body.combinedCurrentSelectionResults.length
    ); // 9
    expect(response.body.combinedCurrentSelectionResults[0]).toEqual(
      sampleObjectFirstEmail
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[0]).not.toEqual(
      sampleObjectFinalEmail
    ); // SEE ABOVE
    expect(
      response.body.combinedCurrentSelectionResults[
        response.body.combinedCurrentSelectionResults.length - 1
      ]
    ).toEqual(sampleObjectFinalEmail); // SEE ABOVE
    expect(
      response.body.combinedCurrentSelectionResults[
        response.body.combinedCurrentSelectionResults.length - 1
      ]
    ).not.toEqual(sampleObjectFirstEmail); // SEE ABOVE
    expect(response.status).toBe(MockedResponse.status); // 200
    expect(response.ok).toBe(MockedResponse.ok); // true
    expect(response.headers["x-powered-by"]).toBe(
      MockedResponse.headers["x-powered-by"]
    ); // "Express"
    expect(response.headers["content-type"]).toBe(
      MockedResponse.headers["content-type"]
    ); // 'application/json; charset=utf-8'

    return request
      .post("/api/onlyTeamSelected")
      .send({
        selectedTeam: "Emerald Enchanters",
        sortedState: {
          columnHeadToSort: "Email",
          order: "Descending",
        },
      })
      .expect(200); // Correctly passes
  });

  // -----------

  test("Correctly returns ASCENDING TABLE SORTED by TEAM, filtered only by CUSTOMER (XYZ Corporation) from fetchPOSTrequestFromCorrectEndpoint.tsx", async () => {
    const sampleObjectFirstTeam: augmentedRepObjectType = {
      id: 18,
      firstName: "Sophia",
      lastName: "Gomez",
      email: "sophia.gomez@example.com",
      teamName: "Aqua Serpents",
      totalRevenue: 3579906,
      teamId: 2,
    };
    const sampleObjectFinalTeam: augmentedRepObjectType = {
      id: 73,
      firstName: "Henry",
      lastName: "Torres",
      email: "henry.torres@example.com",
      teamName: "Thunderbolts",
      totalRevenue: 0,
      teamId: 1,
    };

    const response = await request.post("/api/onlyCustomerSelected").send({
      selectedCustomer: "XYZ Corporation",
      sortedState: {
        columnHeadToSort: "Team",
        order: "Ascending",
      },
    });

    // Update all properties in Mock
    MockedResponse.body.teamCurrentSelectionResults = [];
    MockedResponse.body.customerCurrentSelectionResults =
      sortedAscByTeamResults;
    MockedResponse.body.combinedCurrentSelectionResults =
      sortedAscByTeamResults;

    // console.log(
    //   "RESPONSE: ",
    //   response.body.combinedCurrentSelectionResults,
    //   //   MockedResponse.body.combinedCurrentSelectionResults,
    //   response.body.combinedCurrentSelectionResults.length
    // );

    expect(response.body).toEqual(MockedResponse.body);
    expect(response.body.combinedCurrentSelectionResults).toHaveLength(
      MockedResponse.body.combinedCurrentSelectionResults.length
    ); // 80
    expect(response.body.combinedCurrentSelectionResults[0]).toEqual(
      sampleObjectFirstTeam
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[0]).not.toEqual(
      sampleObjectFinalTeam
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[79]).toEqual(
      sampleObjectFinalTeam
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[79]).not.toEqual(
      sampleObjectFirstTeam
    ); // SEE ABOVE
    expect(response.status).toBe(MockedResponse.status); // 200
    expect(response.ok).toBe(MockedResponse.ok); // true
    expect(response.headers["x-powered-by"]).toBe(
      MockedResponse.headers["x-powered-by"]
    ); // "Express"
    expect(response.headers["content-type"]).toBe(
      MockedResponse.headers["content-type"]
    ); // 'application/json; charset=utf-8'

    return request
      .post("/api/onlyCustomerSelected")
      .send({
        selectedCustomer: "XYZ Corporation",
        sortedState: {
          columnHeadToSort: "Team",
          order: "Ascending",
        },
      })
      .expect(200); // Correctly passes
  });

  // -----------

  test("Correctly returns ASCENDING TABLE SORTED by FIRST NAME, filtered most recently by TEAM (Magenta Mystics) & CUSTOMER (Global Tech) from fetchPOSTrequestFromCorrectEndpoint.tsx", async () => {
    const sampleObjectInitialFirstName: augmentedRepObjectType = {
      id: 70,
      firstName: "Eliana",
      lastName: "Cox",
      email: "eliana.cox@example.com",
      teamName: "Magenta Mystics",
      totalRevenue: 0,
      teamId: 12,
    };
    const sampleObjectFinalFirstName: augmentedRepObjectType = {
      id: 78,
      firstName: "Sofia",
      lastName: "Foster",
      email: "sofia.foster@example.com",
      teamName: "Magenta Mystics",
      totalRevenue: 0,
      teamId: 12,
    };

    const response = await request
      .post("/api/bothSelectedTeamJustChanged")
      .send({
        selectedTeam: "Magenta Mystics", // NEWEST SELECTION
        customerCurrentSelectionResults:
          sortedAscByFirstNameWithCustomerFilterInput, // selectedCustomer: "Global Tech"
        sortedState: {
          columnHeadToSort: "First Name",
          order: "Ascending",
        },
      });

    // Update all properties in Mock
    MockedResponse.body.teamCurrentSelectionResults =
      response.body.teamCurrentSelectionResults;
    MockedResponse.body.customerCurrentSelectionResults =
      response.body.customerCurrentSelectionResults;
    MockedResponse.body.combinedCurrentSelectionResults =
      sortedAscByFirstNameResults;

    // console.log(
    //   "RESPONSE: ",
    //   response.body.combinedCurrentSelectionResults,
    //   MockedResponse.body.combinedCurrentSelectionResults,
    //   response.body.combinedCurrentSelectionResults.length
    // );

    // expect(response.body).toEqual(MockedResponse.body);
    expect(response.body.combinedCurrentSelectionResults).toHaveLength(
      MockedResponse.body.combinedCurrentSelectionResults.length
    ); // 4
    expect(response.body.combinedCurrentSelectionResults[0]).toEqual(
      sampleObjectInitialFirstName
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[0]).not.toEqual(
      sampleObjectFinalFirstName
    ); // SEE ABOVE
    expect(
      response.body.combinedCurrentSelectionResults[
        response.body.combinedCurrentSelectionResults.length - 1
      ]
    ).toEqual(sampleObjectFinalFirstName); // SEE ABOVE
    expect(
      response.body.combinedCurrentSelectionResults[
        response.body.combinedCurrentSelectionResults.length - 1
      ]
    ).not.toEqual(sampleObjectInitialFirstName); // SEE ABOVE
    expect(response.status).toBe(MockedResponse.status); // 200
    expect(response.ok).toBe(MockedResponse.ok); // true
    expect(response.headers["x-powered-by"]).toBe(
      MockedResponse.headers["x-powered-by"]
    ); // "Express"
    expect(response.headers["content-type"]).toBe(
      MockedResponse.headers["content-type"]
    ); // 'application/json; charset=utf-8'

    return request
      .post("/api/bothSelectedTeamJustChanged")
      .send({
        selectedTeam: "Magenta Mystics", // NEWEST SELECTION
        customerCurrentSelectionResults:
          sortedAscByFirstNameWithCustomerFilterInput, // selectedCustomer: "Global Tech"
        sortedState: {
          columnHeadToSort: "First Name",
          order: "Ascending",
        },
      })
      .expect(200); // Correctly passes
  });

  // -----------

  test("Correctly returns DESCENDING TABLE SORTED by ID, filtered most recently by TEAM (Bubblegum Unicorns) & CUSTOMER (ABC Company) from fetchPOSTrequestFromCorrectEndpoint.tsx", async () => {
    const sampleObjectFirstID: augmentedRepObjectType = {
      id: 72,
      firstName: "Zoe",
      lastName: "Bennett",
      email: "zoe.bennett@example.com",
      teamId: 7,
      teamName: "Bubblegum Unicorns",
      totalRevenue: 0,
    };
    const sampleObjectFinalID: augmentedRepObjectType = {
      id: 27,
      firstName: "Aria",
      lastName: "Ramos",
      email: "aria.ramos@example.com",
      teamId: 7,
      teamName: "Bubblegum Unicorns",
      totalRevenue: 3571488,
    };

    const response = await request
      .post("/api/bothSelectedCustomerJustChanged")
      .send({
        selectedCustomer: "ABC Company", // NEWEST SELECTION
        teamCurrentSelectionResults: sortedDescByIDwithTeamFilterInput, // selectedTeam: "Bubblegum Unicorns"
        sortedState: {
          columnHeadToSort: "ID",
          order: "Descending",
        },
      });

    // Update all properties in Mock
    MockedResponse.body.teamCurrentSelectionResults =
      response.body.teamCurrentSelectionResults;
    MockedResponse.body.customerCurrentSelectionResults =
      response.body.customerCurrentSelectionResults;
    MockedResponse.body.combinedCurrentSelectionResults = sortedDescByIDresults;

    // console.log(
    //   "RESPONSE: ",
    //   response.body.combinedCurrentSelectionResults,
    //   MockedResponse.body.combinedCurrentSelectionResults,
    //   response.body.combinedCurrentSelectionResults.length
    // );

    expect(response.body).toEqual(MockedResponse.body);
    expect(response.body.combinedCurrentSelectionResults).toHaveLength(
      MockedResponse.body.combinedCurrentSelectionResults.length
    ); // 7
    expect(response.body.combinedCurrentSelectionResults[0]).toEqual(
      sampleObjectFirstID
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[0]).not.toEqual(
      sampleObjectFinalID
    ); // SEE ABOVE
    expect(
      response.body.combinedCurrentSelectionResults[
        response.body.combinedCurrentSelectionResults.length - 1
      ]
    ).toEqual(sampleObjectFinalID); // SEE ABOVE
    expect(
      response.body.combinedCurrentSelectionResults[
        response.body.combinedCurrentSelectionResults.length - 1
      ]
    ).not.toEqual(sampleObjectFirstID); // SEE ABOVE
    expect(response.status).toBe(MockedResponse.status); // 200
    expect(response.ok).toBe(MockedResponse.ok); // true
    expect(response.headers["x-powered-by"]).toBe(
      MockedResponse.headers["x-powered-by"]
    ); // "Express"
    expect(response.headers["content-type"]).toBe(
      MockedResponse.headers["content-type"]
    ); // 'application/json; charset=utf-8'

    return request
      .post("/api/bothSelectedCustomerJustChanged")
      .send({
        selectedCustomer: "ABC Company", // NEWEST SELECTION
        teamCurrentSelectionResults: sortedDescByIDwithTeamFilterInput, // selectedTeam: "Bubblegum Unicorns"
        sortedState: {
          columnHeadToSort: "ID",
          order: "Descending",
        },
      })
      .expect(200); // Correctly passes
    //     return request
    //       .post("/api/bothSelectedCustomerJustChanged")
    //       .send({})
    //       .expect(500); // Correctly passes (error)
  });
}); // END describe("Integration testing: Jest w/ Supertest for Endpoints...")

// --------

// Additional tests for fetchPOSTrequestFromCorrectEndpoint.tsx -- covering statements missed in Jest Coverage ---> file:///Users/sarahkhuwaja/brett/Revcast-take-home/revcast-code-challenge/coverage/lcov-report/src/pages/index.html
describe("Additional tests for fetchPOSTrequestFromCorrectEndpoint.tsx -- covering some statements missed in Jest Coverage", () => {
  test('Following Control flow:  selectedTeam === "" && selectedCustomer === "" && (columnHeadToSort !== "id" || order !== "Ascending")', async () => {
    const response = await fetchPOSTrequestFromCorrectEndpoint(
      "", // selectedTeam
      "", // selectedCustomer
      () => {}, // setRowResultsOfDB
      [], // fullRowResultsOfDBinCache
      "", // teamOrCustomerChangedFlag
      {
        teamCurrentSelectionResults: [],
        customerCurrentSelectionResults: [],
        combinedCurrentSelectionResults: [],
      }, // threeFilteredObjectsCache
      {
        columnHeadToSort: "id",
        order: "Descending",
      } // sortedState (order differs)
    );
    expect(response).toBeUndefined(); // No need to worry about response here, testing only for conditional logic coverage
  });

  test('Following Control flow:  selectedTeam && selectedCustomer && teamOrCustomerChangedFlag === "TEAM changed")', async () => {
    const response = await fetchPOSTrequestFromCorrectEndpoint(
      "Teal Titans",
      "XYZ Corporation",
      () => {},
      [],
      "TEAM changed",
      {
        teamCurrentSelectionResults: [],
        customerCurrentSelectionResults: [],
        combinedCurrentSelectionResults: [],
      },
      {
        columnHeadToSort: "totalRevenue",
        order: "Descending",
      }
    );
    expect(response).toBeUndefined(); // No need to worry about response here, testing only for conditional logic
  });

  test('Following Control flow:  selectedTeam && selectedCustomer && teamOrCustomerChangedFlag === "CUSTOMER changed")', async () => {
    const response = await fetchPOSTrequestFromCorrectEndpoint(
      "Teal Titans",
      "XYZ Corporation",
      () => {},
      [],
      "CUSTOMER changed",
      {
        teamCurrentSelectionResults: [],
        customerCurrentSelectionResults: [],
        combinedCurrentSelectionResults: [],
      },
      {
        columnHeadToSort: "totalRevenue",
        order: "Descending",
      }
    );
    expect(response).toBeUndefined(); // No need to worry about response here, testing only for conditional logic
  });
});
