import { https } from "firebase-functions";
import { database, FirebaseError, initializeApp } from "firebase-admin";

// TODO: BUG: Functions shell/emulator unable to load default credentials #1940
initializeApp();
// https://github.com/firebase/firebase-tools/issues/1940

const invoicesRef = database().ref("invoices");
import * as express from "express";
const cors = require("cors");
const app = express();

interface Invoice {
  currency: string;
  due_date: string;
  invoice_date: string;
  invoice_number: number;
  remittance_address: string;
  status: string;
  total: string;
  vendor_name: string;
  objID: string;
}

interface InvoiceListResponse {
  invoices: Invoice[];
  code?: string;
  message?: string;
}

app.use(cors({ origin: true }));

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

// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));

// app.post('/', (req, res) => res.send(Widgets.create()));

// app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));

// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));

app.get("/", (req: express.Request, resp: express.Response) =>
  invoiceList(req, resp)
);

exports.invoices = https.onRequest(app);
