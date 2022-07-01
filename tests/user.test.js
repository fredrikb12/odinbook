const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const router = require("../routes/users");
app.use("/users", router);

describe("user", () => {
  beforeAll(async () => {
    await require("../configs/mongoTestingConfig")();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get user route", () => {
    describe("given the user does not exist", () => {
      it("should return a 404", async () => {
        const userId = "user123";
        const { statusCode } = await supertest(app).get(`/users/${userId}`);
        expect(statusCode).toBe(404);
      });
    });

    describe("given the user does exist", () => {
      it("should return a 200 and the user", async () => {
        const userId = "user123";
        const stuff = await supertest(app).get(`/users/${userId}`).expect(200);
        //console.log(stuff);
      });
    });
  });
});
