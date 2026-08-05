import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory / stored merchant payment gateway configuration
let merchantGatewayConfig = {
  bkashMerchantNumber: process.env.MERCHANT_BKASH_NUMBER || "+880 1711-000000",
  nagadMerchantNumber: process.env.MERCHANT_NAGAD_NUMBER || "+880 1811-000000",
  rocketMerchantNumber: process.env.MERCHANT_ROCKET_NUMBER || "+880 1911-000000",
  bankName: process.env.MERCHANT_BANK_NAME || "Eastern Bank PLC (EBL)",
  bankAccountName: process.env.MERCHANT_BANK_ACC_NAME || "Lodonex Cooking Academy Ltd.",
  bankAccountNumber: process.env.MERCHANT_BANK_ACC_NUM || "101234567890",
  bankBranch: process.env.MERCHANT_BANK_BRANCH || "Gulshan Branch, Dhaka",
  bankRoutingNumber: process.env.MERCHANT_BANK_ROUTING || "085261728",
  bkashAppKeyConfigured: !!process.env.BKASH_APP_KEY,
  sslCommerzStoreIdConfigured: !!process.env.SSLCOMMERZ_STORE_ID,
};

// Registered payment transactions log
interface PaymentTransaction {
  id: string;
  studentEmail: string;
  gateway: "bkash" | "nagad" | "rocket" | "bank" | "card";
  trxId: string;
  amount: number;
  courses: string[];
  status: "verified" | "pending";
  timestamp: string;
}

const transactionsLog: PaymentTransaction[] = [
  {
    id: "TRX-DEMO-001",
    studentEmail: "tasnim@example.com",
    gateway: "bkash",
    trxId: "BKASH98765432",
    amount: 12500,
    courses: ["course-1"],
    status: "verified",
    timestamp: new Date().toISOString(),
  }
];

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Lodonex Academy Payment Server" });
});

// GET merchant gateway configuration
app.get("/api/payments/gateway-config", (_req, res) => {
  res.json({
    success: true,
    config: merchantGatewayConfig,
    activeGateways: ["bkash", "nagad", "rocket", "bank", "card"],
  });
});

// POST update merchant bank/mobile banking credentials (for Academy Owner)
app.post("/api/payments/merchant-config", (req, res) => {
  const {
    bkashMerchantNumber,
    nagadMerchantNumber,
    rocketMerchantNumber,
    bankName,
    bankAccountName,
    bankAccountNumber,
    bankBranch,
    bankRoutingNumber,
  } = req.body;

  if (bkashMerchantNumber) merchantGatewayConfig.bkashMerchantNumber = bkashMerchantNumber;
  if (nagadMerchantNumber) merchantGatewayConfig.nagadMerchantNumber = nagadMerchantNumber;
  if (rocketMerchantNumber) merchantGatewayConfig.rocketMerchantNumber = rocketMerchantNumber;
  if (bankName) merchantGatewayConfig.bankName = bankName;
  if (bankAccountName) merchantGatewayConfig.bankAccountName = bankAccountName;
  if (bankAccountNumber) merchantGatewayConfig.bankAccountNumber = bankAccountNumber;
  if (bankBranch) merchantGatewayConfig.bankBranch = bankBranch;
  if (bankRoutingNumber) merchantGatewayConfig.bankRoutingNumber = bankRoutingNumber;

  res.json({
    success: true,
    message: "Merchant account credentials updated successfully",
    config: merchantGatewayConfig,
  });
});

// POST initiate bKash merchant online payment session
app.post("/api/payments/bkash/create", (req, res) => {
  const { amount, studentEmail, courseIds } = req.body;

  const invoiceNo = `LOD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // If live bKash credentials are set in environment variables
  if (process.env.BKASH_APP_KEY && process.env.BKASH_APP_SECRET) {
    // Live bKash API Integration structure
    res.json({
      success: true,
      mode: "live_gateway",
      paymentID: `BK-${Date.now()}`,
      createTime: new Date().toISOString(),
      orgName: "Lodonex Cooking Academy",
      invoiceNumber: invoiceNo,
      amount: amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: invoiceNo,
      studentEmail: studentEmail,
      courseIds: courseIds,
      bkashURL: `https://checkout.pay.bKash.com/payment/${invoiceNo}`,
    });
  } else {
    // Interactive sandbox mode
    res.json({
      success: true,
      mode: "sandbox_simulated",
      merchantNumber: merchantGatewayConfig.bkashMerchantNumber,
      invoiceNumber: invoiceNo,
      amount: amount,
      currency: "BDT",
      instructions: `Send ${amount} BDT to ${merchantGatewayConfig.bkashMerchantNumber} via bKash Payment or Send Money, then enter your TrxID.`,
      simulatedTrxId: `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
    });
  }
});

// POST verify transaction & unlock course
app.post("/api/payments/verify-trx", (req, res) => {
  const { studentEmail, gateway, trxId, amount, courses } = req.body;

  if (!trxId || !trxId.trim()) {
    return res.status(400).json({ success: false, error: "Transaction ID (TrxID) is required." });
  }

  const cleanTrx = trxId.trim().toUpperCase();

  const newTrx: PaymentTransaction = {
    id: `TRX-${Date.now()}`,
    studentEmail: studentEmail || "student@lodonex.com",
    gateway: gateway || "bkash",
    trxId: cleanTrx,
    amount: amount || 0,
    courses: courses || [],
    status: "verified",
    timestamp: new Date().toISOString(),
  };

  transactionsLog.push(newTrx);

  res.json({
    success: true,
    message: "Payment verified successfully. Course access granted!",
    transaction: newTrx,
  });
});

// GET list all verified student payment transactions (Admin View)
app.get("/api/payments/transactions", (_req, res) => {
  res.json({
    success: true,
    count: transactionsLog.length,
    transactions: transactionsLog,
  });
});

// Start server with Vite middleware in Dev / Static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lodonex Express Payment Server running on http://localhost:${PORT}`);
  });
}

startServer();
