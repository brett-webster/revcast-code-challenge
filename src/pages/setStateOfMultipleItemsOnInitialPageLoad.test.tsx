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
  //   const request = supertest(app); // REQUIRED for supertest - TO REMOVE
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
    // console.log("RESPONSE: ", response, response.body);

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
    //   console.log("RESPONSE: ", response.body);

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
    // console.log("RESPONSE: ", response.body);

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
    //   console.log(
    //     "response.data / MockedResponse.data: ",
    //     response.data,
    //     MockedResponse.data
    //   );

    expect(response).toEqual(MockedResponse); // entire payload
    expect(response.data).toEqual(MockedResponse.data); // teamListArrResult
    expect(response.data).toHaveLength(MockedResponse.data.length); // 12
    expect(response.data).toEqual(expect.arrayContaining(["Aqua Serpents"])); // 'Aqua Serpents'
    expect(response.data).not.toEqual(expect.arrayContaining(["Thunderbolt"])); // 'Thunderbolt'
    expect(response.status).toBe(MockedResponse.status); // 200
    expect(response.statusText).toBe(MockedResponse.statusText); // "OK"
    expect(response.headers).toBe(MockedResponse.headers); // headers
    expect(response.config).toEqual(MockedResponse.config); // { headers: headers } <-- strict equality, so toEqual
    // return res.status(200).json(teamListArray);
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
    //   console.log(
    //     "response.data / MockedResponse.data: ",
    //     response.data,
    //     MockedResponse.data
    //   );

    expect(response).toEqual(MockedResponse);
    // Note:  See other assertions above to test specific properties of MockedResponse...
    // return res.status(200).json(customerListArray);
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
    //   console.log(
    //     "response.data / MockedResponse.data: ",
    //     response.data,
    //     MockedResponse.data
    //   );

    expect(response).toEqual(MockedResponse);
    // Note:  See other assertions above to test specific properties of MockedResponse...
    // return res.status(200).json(fullResultsOfDB);
  });
}); // END describe("Endpoint tests: Jest mocking w/ Axios..."

// --------------

// SEE following links for example of using AXIOS for integration testing (as alternative to Supertest):
// VIDEO:  https://frontendmasters.com/courses/testing-practices-principles/basic-integration-test-for-a-node-server/

// CODE
// ACTUAL TEST MODULE: https://github.com/FrontendMasters/testing-workshop/blob/3ea5baaf662d03d3be1f659537229c9f52d16ac2/server/src/routes/__tests__/users.js
// SUPPORTING MODULES --->
// SETUP ROUTES:  https://github.com/FrontendMasters/testing-workshop/blob/3ea5baaf662d03d3be1f659537229c9f52d16ac2/server/src/routes/index.js
// STARTSERVER:  https://github.com/FrontendMasters/testing-workshop/blob/3ea5baaf662d03d3be1f659537229c9f52d16ac2/server/src/start.js
// ENTRY POINT:  https://github.com/FrontendMasters/testing-workshop/blob/3ea5baaf662d03d3be1f659537229c9f52d16ac2/server/src/index.js

// --------- BASIC SYNCHRONOUS MOCK FXN (example for reference) -----------

// // https://jestjs.io/docs/mock-functions
// describe("Basic Sync Mock Test...", () => {
//   test("Basic Sync Mock Test", () => {
//     let assembleBundledRows = [1, 2, 3];
//     //   assembleBundledRows = assembleBundledRows.map((elem: number) => {
//     //     return elem * 2;
//     //   });
//     //   console.log(assembleBundledRows);

//     // Need to place mock w/in test because react-scripts default config clears mocks BEFORE EACH test
//     const mockCallback = jest.fn((assembleBundledRows) =>
//       assembleBundledRows.map((elem: number) => elem * 2)
//     );

//     expect(mockCallback).not.toHaveBeenCalled();
//     mockCallback(assembleBundledRows);
//     //   console.log(mockCallback(assembleBundledRows));
//     //   console.log(mockCallback, mockCallback.mock, mockCallback.mock.results);
//     //   console.log(mockCallback.mock.calls[0]);
//     expect(mockCallback).toHaveBeenCalledTimes(1);
//     expect(mockCallback).not.toHaveBeenCalledTimes(2);
//     expect(mockCallback.mock.calls.length).toBe(1);
//     expect(mockCallback.mock.results.length).toBe(1);
//     expect(mockCallback.mock.results[0].value).toEqual([2, 4, 6]);
//   });
// });

// --------- BASIC ASYNCHRONOUS MOCK FXN (example for reference) -----------

// 9:00  (axios example @ 10mins)
// VIDEO:  frontendmasters.com/courses/testing-practices-principles/using-jest-mock/
// Test code:  https://github.com/FrontendMasters/testing-workshop/blob/3ea5baaf662d03d3be1f659537229c9f52d16ac2/server/src/utils/__tests__/gist.js
// CLIENT __mocks__ folder::  https://github.com/FrontendMasters/testing-workshop/blob/3ea5baaf662d03d3be1f659537229c9f52d16ac2/client/src/__mocks__/axios.js
// SERVER __mocks__ folder:  https://github.com/FrontendMasters/testing-workshop/blob/3ea5baaf662d03d3be1f659537229c9f52d16ac2/server/src/__mocks__/axios.js
// INITIALIZE a RANDOM MOCKED DB:  https://github.com/FrontendMasters/testing-workshop/blob/3ea5baaf662d03d3be1f659537229c9f52d16ac2/server/test/til-server-test-utils.js#L4  /  https://zellwk.com/blog/seed-database
// SAMPLE CODE:  https://medium.com/trendyol-tech/jest-mocking-part-1-functions-1db67c033254

// ---------------------------------------

// // https://jestjs.io/docs/mock-function-api#mockfnmockresolvedvaluevalue
// describe("Basic Async Mock Test -- Mocking Axios...", () => {
//   jest.mock("axios"); // mock axios package
//   const axiosMock = jest.mocked(axios); // wrap jest mock method types to package

//   beforeEach(() => {
//     jest.restoreAllMocks();
//   });

//   test("Basic Async Mock Test -- Mocking Axios", async () => {
//     const mockResponse = { data: [2, 3, 14] };
//     // https://medium.com/trendyol-tech/jest-mocking-part-1-functions-1db67c033254
//     (axiosMock.get as jest.Mock).mockResolvedValue(mockResponse); // Adding "as jest.Mock" typing to remove warning message
//     // axiosMock.get.mockResolvedValue(mockResponse); // Throws typing warning message, so using the above
//     // axiosMock.get = jest.fn(() => mockResponse); // UNDOCUMENT THIS to remove Promise wrapper encasing { data: [2, 3, 14] }

//     // console.log(
//     //   (axiosMock.get as jest.Mock).mock,
//     //   String((axiosMock.get as jest.Mock).mockImplementation)
//     // ); // DELETE

//     expect(axiosMock.get).not.toHaveBeenCalled();
//     const response = await axiosMock.get("/api/getUniqueSortedTeamList");
//     expect(response.data).toEqual(mockResponse.data); // [ 2, 3, 14 ]
//     expect(axiosMock.get).toHaveBeenCalledTimes(1);
//     await axiosMock.get("/api/getUniqueSortedTeamList");
//     expect(axiosMock.get).toHaveBeenCalledTimes(2);
//     expect(axiosMock.get).toHaveBeenCalledWith("/api/getUniqueSortedTeamList");
//     await expect(axiosMock.get("/api/getUniqueSortedTeamList")).resolves.toBe(
//       mockResponse
//     );
//     expect(axiosMock.get).toHaveBeenCalledTimes(3);
//     expect(axiosMock.get).toHaveReturned();
//     expect(axiosMock.get).toHaveReturnedTimes(3);
//     // expect(axiosMock.get).toHaveReturnedWith(response); // NOTE:  This only returns true IF following is undocumented above:  axiosMock.get = jest.fn(() => mockResponse);

//     // console.log(
//     //   "FULL axiosMock",
//     //   axiosMock, // NOTE:  INCLUDES BOTH get & post from __mocks__/axios.js
//     //   "axiosMock.get..: ",
//     //   //   axiosMock.get.mock, // Throws typing warning message, so adding "as jest.Mock" typing as below to remove warning message
//     //   (axiosMock.get as jest.Mock).mock,
//     //   (axiosMock.get as jest.Mock).mock.calls,
//     //   (axiosMock.get as jest.Mock).mock.results, // array
//     //   (axiosMock.get as jest.Mock).mock.results[0].value, // Yields Promise wrapper.  NOTE: Include the following mock re-assignment ABOVE to avoid Promose wrapper:  axiosMock.get = jest.fn(() => mockResponse);
//     //   await Promise.resolve((axiosMock.get as jest.Mock).mock.results[0].value) // await * Promise wrapper needed here to resolve
//     // );
//   });
// });
