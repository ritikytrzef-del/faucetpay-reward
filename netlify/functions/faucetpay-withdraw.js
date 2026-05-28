// netlify/functions/faucetpay-withdraw.js
// FaucetPay Instant Withdrawal — USDT & PEPE support

const FAUCETPAY_API_URL = "https://faucetpay.io/api/v1/send";

// Supported currencies aur unke decimal units
// FaucetPay amount = actual_amount * decimal_multiplier
const CURRENCY_CONFIG = {
  USDT: {
    multiplier: 1000000,  // $1 = 1000000 units (6 decimals)
    min: 0.0001,
    label: "USDT TRC20"
  },
  PEPE: {
    multiplier: 1,        // PEPE = whole units (no decimals on FaucetPay)
    min: 1000,
    label: "PEPE"
  }
};

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: "Method not allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: "Invalid JSON body" }),
    };
  }

  const { to_address, amount, currency = "USDT" } = body;
  const currencyUpper = currency.toUpperCase();

  if (!to_address || !amount) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: "to_address aur amount required hai" }),
    };
  }

  const cfg = CURRENCY_CONFIG[currencyUpper];
  if (!cfg) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: "Unsupported currency: " + currencyUpper }),
    };
  }

  const amountFloat = parseFloat(amount);
  if (isNaN(amountFloat) || amountFloat < cfg.min) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Minimum ${cfg.label} withdrawal: ${cfg.min}`,
      }),
    };
  }

  const apiKey = process.env.FAUCETPAY_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "API key configure nahi hai — Netlify me FAUCETPAY_API_KEY set karo",
      }),
    };
  }

  const faucetpayAmount = Math.round(amountFloat * cfg.multiplier);

  try {
    const formData = new URLSearchParams();
    formData.append("api_key", apiKey);
    formData.append("to", to_address);
    formData.append("amount", faucetpayAmount);
    formData.append("currency", currencyUpper);

    const response = await fetch(FAUCETPAY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.status === 200) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `${cfg.label} payment successful!`,
          txid: data.payout_id || null,
          amount: amountFloat,
          currency: currencyUpper,
          to: to_address,
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          message: data.message || `${cfg.label} payment failed`,
          faucetpay_status: data.status,
        }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Server error: " + err.message,
      }),
    };
  }
};
