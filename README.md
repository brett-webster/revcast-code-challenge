# Revcast App


<p align="center">
  <img width="500" src="/public/revcast-logo.svg">
</p>


## Setup Instructions
### Cloning Repo:
Pull down shared ‘revcast-code-challenge’ repo into your local directory.  Use Github’s fork function, then clone the repo by entering the below command into your CLI.  Navigate to that directory
```bash
git clone [https-url] [new-folder-name]
cd [new-folder-name]
```

NOTE:
```bash
https-url = https://github.com/brett-webster/revcast-code-challenge.git
```

### Installing Node Packages:
Batch install required libraries/dependencies (see package.json)
```bash
npm install
```

### Dev mode:  
Enter the below command in the CLI to run the app in development mode (http://localhost:3000/)
```bash
npm start
```

### Production mode:  
Enter the below command in the CLI to build and bundle the app using Webpack (results sent to ./build folder)
```bash
npm run build
```

Once built, enter the below command in the CLI to run the app in production mode (http://localhost:4000/)
```bash
npm run deploy
```

### Testing mode:  
Enter the below command in the CLI to run a comprehensive suite of unit and integration tests (Jest, RTL, Supertest/Axios)
```bash
npm test
```
Enter the below commands in the CLI to run testing coverage analysis of unit and integration tests  
```bash
npm run coverage
```
Enter the below command in the CLI to run end-to-end tests in the CLI (Cypress)
```bash
npm run e2e
```
Enter the below command in the CLI to run end-to-end tests in the Cypress Test Runner UI
```bash
npm run cypress:open
```
Enter the below command in the CLI to run linter
```bash
npm run lint
```


<br> </br>
## The App

<p align="center">
  <img width="1200" src="/public/Revcast-table-screenshot.png">
</p>


### Summary
The ‘Revcast App’ uses the sales rep JSON data found in the `src/api` directory to create an interactive, dynamic table to quickly view sales rep performance results.  App allows users to filter table results by 'Team Name' and/or 'Customer Name', as well as sort any of the table's 6 columns in ascending or descending order.  Table columns include:  Rep ID, First Name, Last Name, Email, Team, Total Revenue.  Give it a spin!


### Data Overview
- 80 sales reps
- 12 teams
- 7 customers
- 1000 sales opportunities


### Potential Future Improvements
- Reduce the number of API endpoints (in hindsight performance enhancement from caching / additional endpoints likely outweighed by added complexity)
- Utilize an UI components library like Mantine for front-end components (e.g. dropdown filters, sortable column headers)
- Add ability to filter for multiple Teams and/or Customers (instead of a single list item at a time)
- Add composite sort functionality (e.g. enable user to sort descending by Revenue in ascending alphabetical order by First Name -- some sales reps share the same First or Last Name)
- Add text search functionality by a sale rep's Last Name
- Work with a professional designer :)


### Tech Stack
- Create React App
- React.js
- TypeScript
- Node.js
- Express.js
- Webpack
- Postman
- Jest
- React Testing Library
- Supertest
- Axios
- Cypress
- Mantine
- AG Grid
