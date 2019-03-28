var express = require("express");
var bodyParser = require("body-parser");
const pagarme = require("pagarme");

var app = express();

app.set("views", __dirname + "/");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.render("credit_card_installments.ejs");
});

/* Rota da view: credit_card_installments.ejs */
app.post("/checkout", function(req, res) {
  const data = req.body.data;
  console.log(data);
  pagarme.client
    .connect({ api_key: "ak_test_Qr7nr45sEh3K3P2MiFhsmgvuiWDWyV" })
    .then(client => client.transactions.capture({ id: data, amount: 8000 }));
});

app.post("/pay", function(req, res) {
  /*pagarme.client
    .connect({ api_key: "ak_test_Qr7nr45sEh3K3P2MiFhsmgvuiWDWyV" })
    .then(client =>
      client.subscriptions.create({
        plan_id: 417026,
        card_number: "4111111111111111",
        card_holder_name: "Victor Pedro",
        card_expiration_date: "0320",
        card_cvv: "469",
        customer: {
          email: "me.victorhermess@somewhere.com"
        }
      })
    );*/
  const hash = req.body.card_hash;
  console.log(hash);

  pagarme.client
    .connect({ api_key: "ak_test_Qr7nr45sEh3K3P2MiFhsmgvuiWDWyV" })
    .then(client =>
      client.transactions.create({
        card_hash: hash,
        amount: 21000,
        card_number: "4111111111111111",
        card_cvv: "123",
        card_expiration_date: "0922",
        card_holder_name: "Morpheus Fishburne"
      })
    )
    .then(transaction => console.log(transaction));

  return res.redirect("/");
});

app.post("/cancelar", function(req, res) {
  const id = req.body.id;
  pagarme.client
    .connect({ api_key: "ak_test_Qr7nr45sEh3K3P2MiFhsmgvuiWDWyV" })
    .then(client => client.subscriptions.cancel({ id: id }))
    .then(subscription => console.log(subscription));

  return res.redirect("/");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
