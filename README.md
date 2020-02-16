# 2ulaundry-functions - Firebase cloud functions

Node 8 is required [https://github.com/tj/n.git](https://github.com/tj/n.git)

## Scripts

- **Install dependencies** `. ./dependencies.sh`

- **Update firebase libs** `. ./update_firebase.sh`

# API local

- PATH `http://localhost:5001/fire2ulaundry/us-central1/invoices`

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
  
  Status: 422 Unprocessable Entity

  ```javascript
  interface InvoiceResponse {
    message?: string;
    errors: ValidationError[] | FirebaseError[];
  }
  ```
  ref:
  
  - [ValidationError](https://github.com/SinghDigamber/express-node-server-side-form-validation/blob/master/node_modules/express-validator/src/base.d.ts#L20)
  - [FirebaseError](https://github.com/firebase/firebase-admin-node/blob/master/src/index.d.ts#L31)



  
