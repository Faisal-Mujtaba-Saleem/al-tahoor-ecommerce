# Testing Sanity Webhooks Locally

Since `localhost` is not public, Sanity servers cannot directly "talk" to your local application. This means while **creating orders** (App → Sheet) works fine locally, receiving **updates** (Sanity → App → Sheet) requires a workaround.

To test status updates locally, use **ngrok** to create a secure tunnel to your localhost.

## 1. Start Ngrok
Open a new terminal and run:
```bash
npx ngrok http 3000
```
This will give you a public URL like: `https://abcd-123-456.ngrok-free.app`

## 2. Configure Sanity Webhook
1. Go to [Sanity Manage](https://sanity.io/manage).
2. Select your project -> **API** -> **Webhooks**.
3. Edit your "Google Sheets Sync" webhook.
4. **Update the URL** to your ngrok URL:
   `https://abcd-123-456.ngrok-free.app/api/webhooks/sanity`
5. **(Recommended) Add a Secret**:
   - Scroll down to "Secret".
   - Generate or type a strong secret (e.g., `my_super_secret_key`).
   - Save.
   - **Important**: Copy this secret and add it to your `.env` file:
     `SANITY_WEBHOOK_SECRET=my_super_secret_key`
6. Save.

## 3. Test It
1. Change an order status in your local Sanity Studio (or the hosted one).
2. Watch your terminal; you should see the `console.log` from the webhook!
3. Check the Google Sheet; the status should update.

> **Note:** When you deploy your app (e.g., to Vercel), you must update the Webhook URL to your real domain (`https://al-tahoor.com/api/webhooks/sanity`).
