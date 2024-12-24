import assert from "node:assert";
import {
  checkFreeAttempts,
  // createAttemptsForUser,
  getDaysSinceLastAttempt,
} from "../subscription/index.js";
import "./setup.js";

import { describe, it } from "node:test";

describe("subscription", () => {
  // it("should check free attempts in database", async () => {
  //   await checkFreeAttempts(1234);
  //   assert.equal(1, 1);
  // });
  // it("should create attempts for user", async () => {
  //   // const result = await createAttemptsForUser(123);
  //   // console.log("subscriptions.test.attempts", result);
  // });
  // it("should calculate days since last attempt", async () => {
  //   const result = await getDaysSinceLastAttempt(123);
  //   console.log("subscription.test", result);
  // });
});
