# 🚀 FaucetPay Reward Bot — Deployment Guide

## Project Structure
```
faucetpay-project/
├── index.html                          ← Main Telegram Web App
├── netlify.toml                        ← Netlify config
├── netlify/
│   └── functions/
│       └── faucetpay-withdraw.js       ← FaucetPay API function
└── README.md
```

---

## ✅ Step 1: GitHub pe Upload karo

1. GitHub.com pe naya **repository** banao (e.g. `faucetpay-reward`)
2. Ye saari files upload karo (drag & drop ya git push)

---

## ✅ Step 2: Netlify se Deploy karo

1. [netlify.com](https://netlify.com) pe login karo
2. **"Add new site" → "Import from Git"** click karo
3. GitHub repo select karo
4. Build settings:
   - **Build command**: (khali chhodo)
   - **Publish directory**: `.` (dot)
5. **Deploy** click karo

---

## ✅ Step 3: FaucetPay API Key Set karo (IMPORTANT!)

1. [FaucetPay.io](https://faucetpay.io) pe login karo
2. **Settings → API** pe jao
3. Apni **API Key** copy karo
4. Netlify Dashboard pe jao:
   - **Site settings → Environment variables**
   - **Add variable**:
     - **Key**: `FAUCETPAY_API_KEY`
     - **Value**: `apni-api-key-yahan-paste-karo`
5. **Save** karo
6. Site **Redeploy** karo (Deploys → Trigger deploy)

---

## ✅ Step 4: Test karo

Netlify URL pe jakar app open karo aur withdrawal test karo:
- **Minimum**: `$0.0001 USDT`
- **Daily Bonus**: `$0.001 USDT` (24h mein ek baar)
- **Payment**: Instant FaucetPay API se

---

## ⚠️ Important Notes

- FaucetPay account mein **USDT balance** hona chahiye
- User ko FaucetPay pe **registered email** use karna hoga
- Agar API payment fail ho toh admin ko notification milega
- Currency: **USDT TRC20**

---

## 🔑 Environment Variables List

| Variable | Value |
|----------|-------|
| `FAUCETPAY_API_KEY` | FaucetPay API key |

---

## 📱 Telegram Bot Setup

Bot token already code mein hai. Admin notifications automatically jaate hain withdrawal request pe.

---

## 🐸 PEPE Coin Support

PEPE coin withdrawal ab available hai:
- **Minimum**: 1000 PEPE
- **Payment**: Instant via FaucetPay API
- **Same API Key** use hogi (FAUCETPAY_API_KEY)

### PEPE Balance kaise milega?
Ab aap apne bot ke mining/earning system mein PEPE rewards add kar sakte ho. 
Balance `S.pepe` variable mein store hota hai.

> **Note**: FaucetPay account mein PEPE balance hona chahiye payments ke liye.
