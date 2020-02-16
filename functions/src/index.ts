import { https } from "firebase-functions";
import { database, FirebaseError, initializeApp } from "firebase-admin";

// TODO: BUG: Functions shell/emulator unable to load default credentials #1940
initializeApp();
// https://github.com/firebase/firebase-tools/issues/1940

const invoicesRef = database().ref("invoices");
import * as express from "express";
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");

interface Invoice {
  currency: string;
  due_date: string;
  invoice_date: string;
  invoice_number: string;
  remittance_address: string;
  status: string;
  total: string;
  vendor_name: string;
  objID?: string;
}

interface DataError {
  msg: string;
  param: string;
  location: string;
}

interface InvoiceListResponse {
  invoices: Invoice[];
  code?: string;
  message?: string;
  errors?: DataError[];
}

interface InvoiceResponse {
  message?: string;
  errors: DataError[] | FirebaseError[];
}

app.use(cors({ origin: true }));

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Invoices list
 */
const invoiceList = (_: express.Request, resp: express.Response): void => {
  resp.set({
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=UTF-8"
  });

  invoicesRef
    .orderByChild("invoice_number")
    .once("value")
    .then(snapshot => {
      const res: InvoiceListResponse = {
        invoices: []
      };

      const objects = snapshot.val();

      for (const objID in objects) {
        if (
          objects.hasOwnProperty(objID) &&
          objects[objID].status === "pending"
        ) {
          res.invoices.push({
            ...objects[objID],
            objID: objID
          });
        }
      }

      if (res.invoices.length > 1) {
        res.invoices = res.invoices
          .filter(invoice => invoice.status === "pending")
          .reverse();
      }

      resp.status(200);

      resp.send(res);
    })
    .catch((error: FirebaseError) => {
      const res: InvoiceListResponse = {
        invoices: [],
        ...error
      };

      resp.status(418);

      resp.send(res);
    });
};

/**
 * Invoice Create
 */
const invoiceCreate = (req: express.Request, resp: express.Response): void => {
  resp.set({
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=UTF-8"
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resp.status(422);

    resp.send(<InvoiceResponse>{
      message:
        "Please check that the properites are in the body of the http request, and also empty is not allowed",
      errors: errors.array()
    });
  } else {
    invoicesRef
      .push({
        invoice_number: req.body.invoice_number,
        total: req.body.total,
        currency: req.body.currency,
        invoice_date: req.body.invoice_date,
        due_date: req.body.due_date,
        vendor_name: req.body.vendor_name,
        remittance_address: req.body.remittance_address,
        status: "pending"
      })
      .then(() => {
        resp.status(200);

        resp.send({
          message: "invoice submitted successfully"
        });
      })
      .catch((error: FirebaseError) => {
        resp.status(422);

        resp.send(<InvoiceResponse>{
          message: "Firebase error, check the errors array for more details.",
          errors: [error]
        });
      });
  }
};

const sanitize = (s: string) =>
  body(s)
    .not()
    .isEmpty()
    .trim()
    .escape();

const invoceParameters = [
  sanitize("invoice_number"),
  sanitize("total"),
  sanitize("currency"),
  sanitize("invoice_date"),
  sanitize("due_date"),
  sanitize("vendor_name"),
  sanitize("remittance_address")
];

const addInvoce = (req: express.Request, resp: express.Response) =>
  invoiceCreate(req, resp);

app.post("/", invoceParameters, addInvoce);
// alias
app.post("/Invoice", invoceParameters, addInvoce);

// app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));

// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));

app.get("/", (req: express.Request, resp: express.Response) =>
  invoiceList(req, resp)
);

exports.invoices = https.onRequest(app);
