// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The customers of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endPoint: 'http://ec2-3-22-222-162.us-east-2.compute.amazonaws.com:8080/',
  apiKeyGoogleMap: 'AIzaSyBSzDKtlv-N8pdutqj5DS2cbNLykqLCOE0',
  firebaseConfig: {
    apiBaseUrl: 'https://identitytoolkit.googleapis.com/v1/accounts',
    apiKey: "AIzaSyC0Lj0OEQhxSWeoEbisGBtwMUQVeoLUVBs",
    authDomain: "ng-store-recipe-book.firebaseapp.com",
    databaseURL: "https://ng-store-recipe-book.firebaseio.com",
    projectId: "ng-store-recipe-book",
    storageBucket: "ng-store-recipe-book.appspot.com",
    messagingSenderId: "294850348748",
    appId: "1:294850348748:web:f1c3695404801a1c4ae469",
    measurementId: "G-EK4B45SME4"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
