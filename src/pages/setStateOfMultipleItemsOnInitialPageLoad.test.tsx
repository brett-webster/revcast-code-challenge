import supertest from "supertest";
import { app, augmentedRepObjectType } from "../server"; // Importing express dev server for supertest
import axios, { AxiosResponse, AxiosRequestHeaders } from "axios";

import {
  teamListArrResult,
  customerListArrResult,
  entireUniqueSortedArrayOfObjsResult,
} from "../data/testingDataForfilteringLogicHelperFxns";

// ---------- BELOW USES JEST w/ SUPERTEST (integration testing) ----------

describe("Integration testing: Jest w/ Supertest for Endpoints...", () => {
  let server: any = null;
  let request: any = null;

  // Setup & teardown of test server (NOTE conditional logic at bottom of server.ts to NOT listen on port 4000 when process.env.NODE_ENV === "test")
  beforeAll(() => {
    server = app.listen(5000); // supertest server assigned 5000 (distinct server number to avoid error in 'npm run coverage')
    request = supertest(app);
  });
  afterAll((done) => {
    server.close(done);
  });

  let MockedResponse: any = {
    body: "VARIOUS", // vs "data" in Axios mock
    status: 200,
    ok: true, // vs statusText: "OK" in Axios mock
    headers: {
      "x-powered-by": "Express",
      "content-type": "application/json; charset=utf-8",
    },
  };

  // -----------

  test("Correctly returns SORTED TEAM LIST on initial load from setStateOfMultipleItemsOnInitialPageLoad.tsx", async () => {
    MockedResponse = { ...MockedResponse, body: teamListArrResult };
    const response = await request.get("/api/getUniqueSortedTeamList");

    expect(response.body).toEqual(MockedResponse.body); // teamListArrResult
    expect(response.body).toHaveLength(MockedResponse.body.length); // 12
    expect(response.body).toEqual(expect.arrayContaining(["Aqua Serpents"])); // 'Aqua Serpents'
    expect(response.body).not.toEqual(expect.arrayContaining(["Thunderbolt"])); // 'Thunderbolt'
    expect(response.status).toBe(MockedResponse.status); // 200
    expect(response.ok).toBe(MockedResponse.ok); // true
    expect(response.headers["x-powered-by"]).toBe(
      MockedResponse.headers["x-powered-by"]
    ); // "Express"
    expect(response.headers["content-type"]).toBe(
      MockedResponse.headers["content-type"]
    ); // 'application/json; charset=utf-8'

    // request.get("/api/getUniqueSortedTeamList").expect(201); // NOTE:  This incorrectly passes (should be 200) BECAUSE missing 'return'
    // return request.get("/api/getUniqueSortedTeamList").expect(201); // This correctly fails (should be 200)
    return request.get("/api/getUniqueSortedTeamList").expect(200); // Correctly passes
  });

  //   -----------

  test("Correctly returns SORTED CUSTOMER LIST on initial load from setStateOfMultipleItemsOnInitialPageLoad.tsx", async () => {
    MockedResponse = { ...MockedResponse, body: customerListArrResult };
    const response = await request.get("/api/getUniqueSortedCustomerList");

    expect(response.body).toEqual(MockedResponse.body); // customerListArrResult
    expect(response.body).toHaveLength(MockedResponse.body.length); // 7
    expect(response.body).toEqual(expect.arrayContaining(["Acme Corp"])); // 'Acme Corp'
    expect(response.body).not.toEqual(expect.arrayContaining(["EFG Ltd."])); // 'EFG Ltd'
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

  // -----------

  test("Correctly returns FULL DATABASE TABLE on initial load from setStateOfMultipleItemsOnInitialPageLoad.tsx", async () => {
    MockedResponse = {
      ...MockedResponse,
      body: entireUniqueSortedArrayOfObjsResult,
    };
    const sampleObject1: augmentedRepObjectType = {
      id: 1,
      firstName: "Michael",
      lastName: "Chavez",
      email: "michael.chavez@example.com",
      teamId: 5,
      teamName: "Royal Ravens",
      totalRevenue: 10233398,
    };
    const sampleObject80wrong: augmentedRepObjectType = {
      id: 80,
      firstName: "AudreyS", // should be 'Audrey'
      lastName: "Allen",
      email: "audrey.allen@example.com",
      teamId: 11,
      teamName: "Lime Lightning",
      totalRevenue: 0,
    };

    const response = await request.get("/api/getEntireUniqueSortedArrayOfObjs");

    expect(response.body).toEqual(MockedResponse.body); // customerListArrResult
    expect(response.body).toHaveLength(MockedResponse.body.length); // 80
    expect(response.body[0]).toEqual(sampleObject1); // SEE ABOVE
    expect(response.body[79]).not.toEqual(sampleObject80wrong); // SEE ABOVE
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

describe("Endpoint tests: Jest mocking w/ Axios...", () => {
  jest.mock("axios");
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  let headers = {
    "Content-Type": "application/json",
  } as AxiosRequestHeaders;

  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // -----------

  test("Correctly returns SORTED TEAM LIST on initial load from setStateOfMultipleItemsOnInitialPageLoad.tsx", async () => {
    const MockedResponse: AxiosResponse = {
      data: teamListArrResult,
      status: 200,
      statusText: "OK",
      headers: headers,
      config: { headers: headers },
    };

    mockedAxios.get = jest.fn().mockReturnValue(teamListArrResult); // Define fxn here
    mockedAxios.get.mockResolvedValue(MockedResponse);
    //   jest.spyOn(axios, "get").mockResolvedValueOnce(mockedAxios);

    expect(axios.get).not.toHaveBeenCalled();
    const response = await axios.get("/api/getUniqueSortedTeamList");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).not.toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledWith("/api/getUniqueSortedTeamList");

    expect(response).toEqual(MockedResponse); // entire payload
    expect(response.data).toEqual(MockedResponse.data); // teamListArrResult
    expect(response.data).toHaveLength(MockedResponse.data.length); // 12
    expect(response.data).toEqual(expect.arrayContaining(["Aqua Serpents"])); // 'Aqua Serpents'
    expect(response.data).not.toEqual(expect.arrayContaining(["Thunderbolt"])); // 'Thunderbolt'
    expect(response.status).toBe(MockedResponse.status); // 200
    expect(response.statusText).toBe(MockedResponse.statusText); // "OK"
    expect(response.headers).toBe(MockedResponse.headers); // headers
    expect(response.config).toEqual(MockedResponse.config); // { headers: headers } <-- strict equality, so toEqual
  });

  // -----------

  test("Correctly returns SORTED CUSTOMER LIST on initial load from setStateOfMultipleItemsOnInitialPageLoad.tsx", async () => {
    const MockedResponse = {
      data: customerListArrResult,
      status: 200,
      statusText: "OK",
      headers: headers,
      config: { headers: headers },
    };

    mockedAxios.get = jest.fn().mockReturnValue(customerListArrResult); // Define fxn here
    mockedAxios.get.mockResolvedValue(MockedResponse);

    expect(axios.get).not.toHaveBeenCalled();
    const response = await axios.get("/api/getUniqueSortedCustomerList");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("/api/getUniqueSortedCustomerList");

    expect(response).toEqual(MockedResponse);
  });

  // -----------

  test("Correctly returns FULL DATABASE TABLE on initial load from setStateOfMultipleItemsOnInitialPageLoad.tsx", async () => {
    const MockedResponse = {
      data: entireUniqueSortedArrayOfObjsResult,
      status: 200,
      statusText: "OK",
      headers: headers,
      config: { headers: headers },
    };

    mockedAxios.get = jest.fn().mockReturnValue(customerListArrResult); // Define fxn here
    mockedAxios.get.mockResolvedValue(MockedResponse);

    expect(axios.get).not.toHaveBeenCalled();
    const response = await axios.get("/api/getEntireUniqueSortedArrayOfObjs");
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      "/api/getEntireUniqueSortedArrayOfObjs"
    );

    expect(response).toEqual(MockedResponse);
  });
}); // END describe("Endpoint tests: Jest mocking w/ Axios..."
