import app from "../src/server.mjs";

export default async function handler(req, res) {
  return app(req, res);
}
