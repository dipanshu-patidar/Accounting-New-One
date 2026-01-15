# Accounting Software – Project Overview

## Tech Stack

* **Backend:** Node.js, Express, Prisma ORM, MySQL
* **Frontend:** React (Antigravity UI Builder)
* **Auth:** JWT-based authentication
* **Architecture:** Multi-tenant (Company-based data isolation)

---

## 1. System Architecture (Multi-Company Core)

### Super Admin

* Creates companies
* Manages plans / limits (future)
* No transactional data mixing

### Company (Tenant)

* Every record is linked with `companyId`
* All APIs are **company-scoped**
* Users only see their own company data

```text
GLOBAL RULE:
Every table must have companyId
Every API must filter by companyId
```

---

## 2. User, Role & Permission System

### Roles

* Admin
* Accountant
* Staff

### Permission Logic

* Role → Permissions (menu + actions)
* User → Role
* UI renders menus based on permission

### User Rules

* User belongs to ONE company
* User can access ONLY assigned company data

---

## 3. Company Settings Module

### Managed by Super Admin

* Company basic creation

  * Name
  * Email
  * Phone

### Managed by Company Admin

* Company Logo
* Address
* GST / VAT
* Bank Details

📌 Used automatically in:

* Sales
* Purchase
* Invoice

---

## 4. Inventory Management (Warehouse-based)

### Core Entities

* Warehouse
* Unit of Measure
* Product
* Inventory Stock

### Product Creation Flow

1. Select Warehouse
2. Select Unit of Measure
3. Add Opening Stock
4. Save Product

### Inventory Operations

* Stock Transfer (Warehouse → Warehouse)
* Inventory Adjustment (+ / -)

📌 Every inventory movement creates a **stock transaction log**

---

## 5. Sales Module (End-to-End Flow)

### Sales Documents

1. Quotation
2. Sales Order
3. Delivery Challan
4. Invoice
5. Receipt (Payment)

### Core Rule

* Linked document → Auto product selection
* Direct document → Manual selection

### Accounting Impact (Invoice)

```text
Customer Ledger   DR
Sales Income      CR
```

### Sales Return

* Linked with Invoice
* Reverses inventory
* Accounting Entry:

```text
Sales Return      DR
Customer Ledger   CR
```

---

## 6. Purchase Module (End-to-End Flow)

### Purchase Documents

1. Purchase Quotation
2. Purchase Order
3. Goods Receipt (GRN)
4. Purchase Bill
5. Vendor Payment

### Accounting Impact (Purchase Bill)

```text
Inventory / Expense DR
Vendor Ledger       CR
```

### Purchase Return

* Linked with Purchase Bill
* Inventory reduced
* Vendor balance adjusted

---

## 7. POS Module

### POS Flow

1. Select Customer
2. Category-wise Product Filter
3. Select Products & Quantity
4. Auto price calculation
5. Generate Invoice

### POS Rules

* Invoice is mandatory
* Inventory deducted instantly
* Customer ledger updated

---

## 8. Chart of Accounts (COA – Core Engine)

### Primary Groups

* Assets
* Liabilities
* Income
* Expenses
* Equity

### Ledger Rules

* Every Customer → AR Ledger
* Every Vendor → AP Ledger
* No transaction without ledger

---

## 9. Accounting Modules

### Customer (Receivable)

* Individual Ledger
* Aging
* Outstanding Balance

### Vendor (Payable)

* Vendor Ledger
* Outstanding Payables

### Expense Management

```text
Expense Ledger DR
Cash / Bank     CR
```

### Income Management

```text
Cash / Bank DR
Income Ledger CR
```

---

## 10. Vouchers

* Receipt Voucher
* Payment Voucher
* Journal Entry

📌 Used for adjustments & opening balances

---

## 11. Reports (Auto-Generated)

* Sales Report
* Purchase Report
* Tax Report
* Inventory Summary
* Trial Balance
* Profit & Loss
* Balance Sheet
* Customer Ledger
* Vendor Ledger
* Day Book
* General Ledger

---

## 12. API Design Rules

* REST based
* JWT secured
* companyId mandatory
* Role-based authorization

---

## 13. Database Rules (MySQL)

* Foreign keys enforced
* No hard delete (soft delete)
* Ledger consistency mandatory

---

## FINAL SYSTEM RULE

"Simple UI is allowed.
Breaking accounting rules is NOT allowed."

---

✅ This document is ready for Claude AI, backend execution, frontend integration, and real-world accounting use.