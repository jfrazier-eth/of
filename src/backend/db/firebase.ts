import { cert } from "firebase-admin/app";
import { App, initializeApp } from "firebase-admin/app";
import { config } from "../config.js";

let app: App;

export function getApp() {
  if (!app) {
    app = initializeApp({
      credential: cert(config.firebase.serviceAccount),
    });
  }
  return app;
}
