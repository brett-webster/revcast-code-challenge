import axios, { AxiosResponse, AxiosRequestHeaders } from "axios";
import supertest from "supertest";
import { app, augmentedRepObjectType } from "../server"; // Importing express dev server for supertest
import { entireUniqueSortedArrayOfObjsResult } from "../data/testingDataForfilteringLogicHelperFxns";
import { sortedDescByIDinput } from "../data/testingDataForsortingLogicHelperFxnDESC";

// ---------- BELOW USES JEST w/ SUPERTEST (integration testing) ----------

describe("Integration testing: Jest w/ Supertest for Endpoints...", () => {
  let server: any = null;
  let request: any = null;

  // Setup & teardown of test server (NOTE conditional logic at bottom of server.ts to NOT listen on port 4000 when process.env.NODE_ENV === "test")
  beforeAll(() => {
    server = app.listen(5002); // supertest server assigned 5002 (distinct server number to avoid error in 'npm run coverage')
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

  test("Correctly returns SORTED TABLE on inital load from landingPage.tsx", async () => {
    MockedResponse.body.combinedCurrentSelectionResults = sortedDescByIDinput;
    const sampleObjectHighestRevenue: augmentedRepObjectType = {
      id: 34,
      firstName: "Eli",
      lastName: "Alvarez",
      email: "eli.alvarez@example.com",
      teamId: 7,
      teamName: "Bubblegum Unicorns",
      totalRevenue: 16739625,
    };
    const sampleObjectLowestRevenue: augmentedRepObjectType = {
      id: 80,
      firstName: "Audrey",
      lastName: "Allen",
      email: "audrey.allen@example.com",
      teamId: 11,
      teamName: "Lime Lightning",
      totalRevenue: 0,
    };

    const response = await request.post("/api/reSortTable").send({
      sortedState: {
        columnHeadToSort: "Total Revenue",
        order: "Descending",
      },
      threeFilteredObjectsCache: {
        teamCurrentSelectionResults: [],
        customerCurrentSelectionResults: [],
        combinedCurrentSelectionResults: entireUniqueSortedArrayOfObjsResult,
      },
    });

    expect(response.body).toEqual(MockedResponse.body);
    expect(response.body.combinedCurrentSelectionResults).toHaveLength(
      MockedResponse.body.combinedCurrentSelectionResults.length
    ); // 80
    expect(response.body.combinedCurrentSelectionResults[0]).toEqual(
      sampleObjectHighestRevenue
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[0]).not.toEqual(
      sampleObjectLowestRevenue
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[79]).toEqual(
      sampleObjectLowestRevenue
    ); // SEE ABOVE
    expect(response.body.combinedCurrentSelectionResults[79]).not.toEqual(
      sampleObjectHighestRevenue
    ); // SEE ABOVE
    expect(response.status).toBe(MockedResponse.status); // 200
    expect(response.ok).toBe(MockedResponse.ok); // true
    expect(response.headers["x-powered-by"]).toBe(
      MockedResponse.headers["x-powered-by"]
    ); // "Express"
    expect(response.headers["content-type"]).toBe(
      MockedResponse.headers["content-type"]
    ); // 'application/json; charset=utf-8'
    return request.get("/api/getUniqueSortedCustomerList").expect(200); // Correctly passes
  });
}); // END describe("Integration testing: Jest w/ Supertest for Endpoints...)

// ---------- BELOW USES JEST MOCKING w/ AXIOS (matches above Supertest tests) ----------

describe("Endpoint test: Jest mocking w/ Axios...", () => {
  jest.mock("axios");
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  let headers = {
    "Content-Type": "application/json",
  } as AxiosRequestHeaders;

  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const MockedResponse: AxiosResponse = {
    data: {
      teamCurrentSelectionResults: [],
      customerCurrentSelectionResults: [],
      combinedCurrentSelectionResults: entireUniqueSortedArrayOfObjsResult,
    },
    status: 200,
    statusText: "OK",
    headers: headers,
    config: { headers: headers },
  };

  // ---------

  test("Correctly returns SORTED TABLE on inital load from landingPage.tsx", async () => {
    mockedAxios.post = jest.fn().mockReturnValue({
      teamCurrentSelectionResults: [],
      customerCurrentSelectionResults: [],
      combinedCurrentSelectionResults: entireUniqueSortedArrayOfObjsResult,
    }); // Define fxn here
    mockedAxios.post.mockResolvedValue(MockedResponse);

    expect(axios.post).not.toHaveBeenCalled();
    const response = await axios.post("/api/reSortTable", {
      sortedState: {
        columnHeadToSort: "id",
        order: "Ascending",
      },
      threeFilteredObjectsCache: mockedAxios.post, // Note:  null also works here
    });
    expect(axios.post).toHaveBeenCalledTimes(1);

    expect(response.data).toEqual(MockedResponse.data);
    // return res.status(200).json(threeFilteredObjectsCache);
  });
}); // END describe("Endpoint test: Jest mocking w/ Axios...")

// --------
