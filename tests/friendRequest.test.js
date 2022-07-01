const request = require("supertest");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
const mongoSetup = require("../configs/mongoTestingConfig");

const usersRouter = require("../routes/users");
app.use("/users", usersRouter);

describe.skip("test", () => {
  beforeAll(async () => {
    await mongoSetup();
  });

  it("adds friend request", () => {});
});
