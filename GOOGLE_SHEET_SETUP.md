# 📊 Google Sheet Order Logging Setup Guide

This website is pre-configured to automatically push all orders directly into your **Google Sheet** in real-time.

---

## ⚡ 1-Minute Setup via Google Apps Script (Recommended)

Follow these simple steps to connect your Google Sheet:

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new spreadsheet named **"Meivan Art Orders"**.
2. In the first row (Row 1), add these column headers:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Order ID** | **Date & Time** | **Customer Name** | **Email** | **Phone** | **Street Address** | **City** | **State** | **Pincode** | **Products Summary** | **Qty** | **Subtotal** | **Shipping** | **Total (₹)** | **Payment** | **Payment Status** | **Fulfillment Status** | **Courier Partner** | **AWB Tracking No** | **Notes** |

---

### Step 2: Add Google Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**.
2. Delete any code in the editor and paste the following script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;

    if (action === "appendOrder") {
      var d = payload.data;
      sheet.appendRow([
        d.orderId,
        d.dateTime,
        d.customerName,
        d.customerEmail,
        d.customerPhone,
        d.streetAddress,
        d.city,
        d.state,
        d.pincode,
        d.productsSummary,
        d.totalQuantity,
        d.subtotal,
        d.shippingFee,
        d.totalAmount,
        d.paymentMethod,
        d.paymentStatus,
        d.fulfillmentStatus,
        d.courierPartner,
        d.trackingNumber,
        d.orderNotes
      ]);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Order appended" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "updateTracking") {
      var orderId = payload.orderId;
      var update = payload.update;
      var data = sheet.getDataRange().getValues();

      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(orderId)) {
          // Column Q = Fulfillment Status (17), Column R = Courier (18), Column S = AWB (19), Column T = Notes (20)
          if (update.status) sheet.getRange(i + 1, 17).setValue(update.status.toUpperCase());
          if (update.courierName) sheet.getRange(i + 1, 18).setValue(update.courierName);
          if (update.trackingNumber) sheet.getRange(i + 1, 19).setValue(update.trackingNumber);
          if (update.notes) sheet.getRange(i + 1, 20).setValue(update.notes);
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Tracking updated" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "ignored" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### Step 3: Deploy as Web App
1. Click the blue **Deploy** button (top right) → **New deployment**.
2. Select type: **Web app** (click the gear icon ⚙️ if not visible).
3. Set the following settings:
   - **Description**: Meivan Art Order Webhook
   - **Execute as**: **Me** (`your-email@gmail.com`)
   - **Who has access**: **Anyone**
4. Click **Deploy**, click **Authorize Access**, and choose your Google Account (click *Advanced* → *Go to script (unsafe)* if prompted).
5. Copy the **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

### Step 4: Add Webhook URL to `.env`
Open your `.env` file in the project and paste your URL:

```env
GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

🎉 **Done!** Every time a customer places an order via PayU or direct checkout, a new row will be created in your Google Sheet instantly.
When an admin updates courier tracking details in the Admin Dashboard, the row will be updated automatically!
