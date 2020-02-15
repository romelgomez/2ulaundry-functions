import * as functions from "firebase-functions";

export const invoices = functions.https.onRequest((_, response) => {
  const success = { message: "invoice submitted successfully" };

  response.set({
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=UTF-8"
  });

  response.status(201);

  response.send(success);
});
