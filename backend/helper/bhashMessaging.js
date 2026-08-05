const axios = require("axios");

const SMS_API_URL = process.env.BHASH_SMS_API_URL || "https://bhashsms.com/api/sendmsg.php";

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
};

const bhashSmsPhoneNumber = (mobile) => {
  const digits = String(mobile || "").replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  throw new Error("A valid Indian mobile number is required");
};

const ensureBhashAccepted = (response, channel) => {
  const providerMessage = String(response.data || "").trim();
  if (/api\s+not\s+activated|error|invalid|failed|not\s+authorized|insufficient|blocked/i.test(providerMessage)) {
    throw new Error(`BhashSMS rejected the ${channel}: ${providerMessage}`);
  }
};

const sendSms = async ({ mobile, message }) => {
  const response = await axios.get(
    SMS_API_URL,
    { params: {
      user: required("BHASH_SMS_USER"),
      pass: required("BHASH_SMS_PASSWORD"),
      sender: required("BHASH_SMS_SENDER_ID"),
      phone: bhashSmsPhoneNumber(mobile),
      text: message,
      priority: process.env.BHASH_SMS_PRIORITY || "ndnd",
      stype: process.env.BHASH_SMS_TYPE || "normal",
    }, timeout: 10000 }
  );

  ensureBhashAccepted(response, "SMS");

  return { channel: "sms", providerResponse: response.data };
};

const sendWhatsApp = async ({ mobile, otp }) => {
  const response = await axios.get(process.env.BHASH_WHATSAPP_API_URL || SMS_API_URL, {
    params: {
      user: required("BHASH_SMS_USER"),
      pass: required("BHASH_SMS_PASSWORD"),
      sender: required("BHASH_WHATSAPP_SENDER_ID"),
      phone: bhashSmsPhoneNumber(mobile),
      text: required("BHASH_WHATSAPP_OTP_TEMPLATE"),
      priority: "wa",
      stype: "auth",
      Params: String(otp),
    },
    timeout: 10000,
  });
  ensureBhashAccepted(response, "WhatsApp OTP");
  return { channel: "whatsapp", providerResponse: response.data };
};

/** Sends the same OTP through every configured BhashSMS channel. */
const sendOtp = async ({ mobile, otp }) => {
  const channels = (process.env.BHASH_OTP_CHANNELS || "sms")
    .split(",")
    .map((channel) => channel.trim().toLowerCase())
    .filter(Boolean);
  const message = `Your KheloIndore OTP is ${otp}. It is valid for 5 minutes. Do not share this code.`;
  const senders = { sms: sendSms, whatsapp: sendWhatsApp };

  if (!channels.length || channels.some((channel) => !senders[channel])) {
    throw new Error("BHASH_OTP_CHANNELS must contain sms and/or whatsapp");
  }

  const results = await Promise.allSettled(
    channels.map((channel) => senders[channel]({ mobile, otp, message }))
  );
  const delivered = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value.channel);

  if (!delivered.length) {
    const errors = results.map((result) => result.reason?.message).filter(Boolean).join("; ");
    throw new Error(`BhashSMS could not send the OTP: ${errors}`);
  }

  return { delivered, failed: channels.filter((channel) => !delivered.includes(channel)) };
};

module.exports = { sendOtp };
