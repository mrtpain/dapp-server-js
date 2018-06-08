const fromExpress = require('webtask-tools').fromExpress;
const express = require('express');
const pug = require('pug');

const StellarSdk = require("stellar-sdk");
const Mobius = require("@mobius-network/mobius-client-js");

const dev = pug.compile(require('./dev.pug'));

const mobius = new Mobius.Client();
mobius.network = StellarSdk.Networks.TESTNET;

const app = express();
app.enable('strict routing');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", require("./api"));
app.use("/auth", require("./auth"));

app.get("/dev", (req, res) => {
  const { APP_KEY } = req.webtaskContext.secrets;
  res.send(dev({ mobius, publicKey: StellarSdk.Keypair.fromSecret(APP_KEY).publicKey() }));
});

module.exports = fromExpress(app);
