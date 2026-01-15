# Accounting Software – Project Workflow

This document explains **END-TO-END SYSTEM FLOW** of the accounting software.
It describes **where data starts, how it moves, which module consumes it, and where accounting impact happens**.

This is written for:

* Backend implementation (Node + Prisma)
* Frontend flow clarity (React / Antigravity UI)
* Accounting correctness (Ledger-first system)

---

## 1. GLOBAL WORKFLOW PRINCIPLE

```text
SuperAdmin → Company → User → Transaction → Ledger → Reports
```

### Golden Rules

1. NOTHING exists without a company
2. NOTHING posts without a ledger
3. UI flow can be flexible
4. Accounting rules are NOT flexible

---

## 2. SUPER ADMIN → COMPANY CREATION FLOW

### Step 1: Super Admin Login

* SuperAdmin logs in
* Access only SuperAdmin panel

### Step 2: Create Company

SuperAdmin creates a company with minimal data:

* Company Name
* Email
* Phone

📌 System Actions (Auto):

* Generate `companyId`
* Create default:

  * Chart of Accounts (Base)
  * Cash Ledger
  * Bank Ledger
  * Sales Income Ledger
  * Purchase Ledger

➡️ Company is now ACTIVE

---

## 3. COMPANY ADMIN FIRST LOGIN FLOW

### Step 1: Company Admin Login

* Login using company credentials

### Step 2: Company Setup (Mandatory)

Company Admin completes:

* Company Address
* GST / VAT
* Bank Details
* Logo upload

📌 This data is stored in `company_settings`
📌 Used automatically in all documents

---

## 4. USER, ROLE & PERMISSION FLOW

### Role Creation

* Admin creates Roles
* Assign permissions:

  * Menu access
  * Create / Edit / View / Delete

### User Creation

* User is linked to:

  * ONE company
  * ONE role

📌 Login Flow:

```text
Login → JWT → companyId → role → permissions → UI render
```

---

## 5. INVENTORY MASTER FLOW

### Step 1: Warehouse Setup

* Create one or more warehouses

### Step 2: Unit of Measure

* Piece, Kg, Box, Liter etc.

### Step 3: Product Creation

Flow:

```text
Product → Select Warehouse → Select UOM → Opening Stock → Save
```

📌 Inventory Entry Created:

* Stock In (Opening)

---

## 6. INVENTORY MOVEMENT FLOW

### A. Stock Transfer

Flow:

```text
From Warehouse → To Warehouse → Quantity
```

System Actions:

* Reduce stock from source warehouse
* Add stock to destination warehouse
* Create stock movement log

---

### B. Inventory Adjustment

Used for:

* Damage
* Loss
* Physical count mismatch

Flow:

```text
Select Warehouse → Product → +/- Quantity → Reason
```

📌 Accounting Impact (optional):

* Adjustment Expense Ledger

---

## 7. SALES WORKFLOW (DEEP FLOW)

### 7.1 Sales Quotation

Flow:

```text
Customer Select → Products Manual → Save Quotation
```

📌 No accounting impact
📌 Only commitment

---

### 7.2 Sales Order

#### Case A: From Quotation

* Customer auto-filled
* Products auto-filled

#### Case B: Direct

* Manual selection

📌 No accounting impact

---

### 7.3 Delivery Challan

Flow:

```text
Sales Order → Delivery Challan → Partial / Full Delivery
```

📌 Inventory RESERVED or MOVED (based on config)
📌 No ledger entry yet

---

### 7.4 Invoice (CRITICAL POINT)

Flow:

```text
Invoice → Confirm → Post
```

📌 SYSTEM ACTIONS:

1. Inventory OUT
2. Ledger Posting

Accounting Entry:

```text
Customer Ledger   DR
Sales Income      CR
```

📌 Invoice Status:

* Unpaid
* Partial
* Paid

---

### 7.5 Receipt (Customer Payment)

Flow:

```text
Invoice → Receipt → Payment Mode
```

Accounting Entry:

```text
Cash / Bank   DR
Customer      CR
```

📌 Multiple receipts allowed

---

### 7.6 Sales Return

Flow:

```text
Invoice → Sales Return → Quantity
```

System Actions:

* Inventory IN

Accounting Entry:

```text
Sales Return     DR
Customer Ledger  CR
```

---

## 8. PURCHASE WORKFLOW (DEEP FLOW)

### 8.1 Purchase Quotation

Flow:

```text
Vendor → Products Manual → Save
```

📌 No accounting impact

---

### 8.2 Purchase Order

* From Quotation OR Direct

📌 No accounting impact

---

### 8.3 Goods Receipt (GRN)

Flow:

```text
PO → GRN → Received Qty
```

📌 Inventory IN
📌 No ledger posting yet

---

### 8.4 Purchase Bill

CRITICAL POINT

Accounting Entry:

```text
Inventory / Expense DR
Vendor Ledger       CR
```

---

### 8.5 Vendor Payment

Accounting Entry:

```text
Vendor Ledger  DR
Cash / Bank    CR
```

---

### 8.6 Purchase Return

Flow:

```text
Purchase Bill → Return
```

Accounting Entry:

```text
Vendor Ledger   DR
Inventory       CR
```

---

## 9. POS WORKFLOW

Flow:

```text
Customer → Category Filter → Product Select → Qty → Invoice
```

System Actions:

* Invoice auto-created
* Inventory reduced instantly
* Customer ledger updated

---

## 10. CHART OF ACCOUNTS FLOW

### Creation Rules

* Customer → AR Ledger
* Vendor → AP Ledger
* Expense → Expense Ledger
* Income → Income Ledger

📌 NO TRANSACTION WITHOUT LEDGER

---

## 11. JOURNAL & VOUCHER FLOW

### Journal Entry

Used for:

* Opening Balance
* Corrections
* Adjustments

Rule:

```text
Total DR = Total CR
```

---

## 12. REPORT GENERATION FLOW

Reports are generated ONLY from:

* Ledger Entries
* COA Structure

### Key Reports

* Trial Balance
* Profit & Loss
* Balance Sheet
* Customer Aging
* Vendor Outstanding
* Inventory Summary

📌 NO hardcoded logic

---

## 13. END-TO-END DATA FLOW SUMMARY

```text
UI Action
 → API (companyId)
   → Validation
     → Inventory Update
       → Ledger Entry
         → Report Auto Update
```

---

## FINAL SYSTEM STATEMENT

"UI can change.
Workflow can expand.
Accounting rules must NEVER break."