# 2ulaundry-functions - Firebase cloud functions

Node 8 is required [https://github.com/tj/n.git](https://github.com/tj/n.git)

## Scripts

- **Install dependencies** `. ./dependencies.sh`

- **Update firebase libs** `. ./update_firebase.sh`

## API local

- (localhost test path): `http://localhost:5001/fire2ulaundry/us-central1/<PATH>`

### ERROR  

  Status: 400 | 422 | 418

  ```javascript
  interface InvoiceResponse {
    message?: string;
    errors: ValidationError[] | FirebaseError[];
  }
  ```
  ref:
  
  - [ValidationError](https://github.com/SinghDigamber/express-node-server-side-form-validation/blob/master/node_modules/express-validator/src/base.d.ts#L20)
  - [FirebaseError](https://github.com/firebase/firebase-admin-node/blob/master/src/index.d.ts#L31)



### POST `/invoices`
  
  - (alias) `/invoices/Invoice` 

  **headers**
  
  - `Content-Type: application/json; charset=UTF-8`

  **body** 
  
  ```JSON
  {
    "invoice_number": "12345",
    "total": "199.99",
    "currency": "USD",
    "invoice_date": "2019-08-17",
    "due_date": "2019-09-17",
    "vendor_name": "Acme Cleaners Inc.",
    "remittance_address": "123 ABC St. Charlotte, NC 28209"
  }
  ```
  
  **responses** 

  Status: 200 OK

  ```JSON
  {
    message: "invoice submitted successfully"
  }
  ```
  

### PATH `/invoices`

  **headers**
  
  - `Content-Type: application/json; charset=UTF-8`

  **body** 
  
  ```JSON
  {"id":"-M05qky4Rq5qH8yi23hl", "status": "pending"}
  ```
  
  **responses** 

  Status: 200 OK

  ```JSON
  {
    "message": "invoice uppdate successfully"
  }
  ```

### GET `/invoices`

  **responses** 

  Status: 200 OK

  ```JSON
  {
      "invoices": [
          {
              "currency": "PEN",
              "due_date": "2020-02-14",
              "invoice_date": "2020-02-13",
              "invoice_number": "66",
              "remittance_address": "756 Opal Court, Babb, Wyoming, 9509",
              "status": "pending",
              "total": "1,536.37",
              "vendor_name": "EARTHPURE",
              "objID": "-M05qky4Rq5qH8yi23hl"
          },
          ....
  ```
  
  NOTE: Constrained to only return the pending invoices


  ## MicroService Source Code 
  
  [functions/src/index.ts](functions/src/index.ts)
  
  
