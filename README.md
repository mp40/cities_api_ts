## cities api

Was created to interact with calls made from the GAN Integrity repo found [here](https://github.com/gandevops/backend-code-challenge).

### How to start
```
npm install
npm run build
npm run start
```
If started without issue the following should be visible in the terminal
```
create table
Server running on: 8080
seed table
database setup complete
```

### Notes
#### Database
* Given the data is of a standard shape I thought it best to store in a relational database than to query against a json file.
* Used `SQLite3` as a database as this is a small project and can store in memory for convenience.
* Used `Knex.js` ORM so I didn't have to hand roll asynchronous database interactions.
#### Testing
* Used `supertest` to confirm endpoint behavior, mocking calls to model/utils - endpoints should not care about business rules.
* Used `vitest` for unit tests.
* Ran the above mentioned GAN Integrity repo for integration testing.
#### Utils/Services
* Used `turf.js` to help with distance calculations
* Considered using a package like `bee-queue` to implement the job queue, but instead opted for a hand rolled alternative to minimize packages used.
#### Types
* Used TypeScript over JavaScript to leverage type safety.
* Opted for the use of the `zod` package to parse incoming data.

### Area For Improvement
* Error handling could be improved. At the moment it relies on returning null values and strings (eg: `queue.getJobResult(jobId: string): Address[] | "not found" | null`). My preference would be using the `ts-results` package to type errors in model and services methods.


