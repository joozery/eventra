# EVENTRA --- Event Platform

> Discover. Create. Experience.

EVENTRA คือแพลตฟอร์ม Event Technology สำหรับค้นหา สร้าง จัดการ
และเข้าร่วมงานอีเวนต์ในระบบเดียว โดยแนวคิดหลักคล้าย Event Marketplace +
Ticketing + Organizer SaaS

------------------------------------------------------------------------

## 1. Product Vision

EVENTRA ไม่ใช่แค่ระบบขายบัตร แต่เป็นแพลตฟอร์มที่เชื่อม 3 กลุ่มหลัก:

-   **Attendee** --- ค้นหา Event, ลงทะเบียน, ซื้อบัตร, รับ QR Ticket และ
    Check-in
-   **Organizer** --- สร้าง Event, จัดการ Ticket, Orders, Attendees,
    Check-in, Marketing และ Analytics
-   **Admin** --- ดูแล Users, Organizers, Events, Payments, Commission,
    Payouts และระบบโดยรวม

### Core Flow

``` text
ATTENDEE
ค้นหา Event
    ↓
ดูรายละเอียด
    ↓
เลือก Ticket
    ↓
Checkout
    ↓
Payment
    ↓
ได้รับ Digital Ticket + QR
    ↓
Check-in เข้างาน


ORGANIZER
สร้าง Event
    ↓
ตั้งค่า Ticket
    ↓
Publish Event
    ↓
รับ Orders
    ↓
จัดการ Attendees
    ↓
QR Check-in
    ↓
ดูยอดขาย / Analytics
    ↓
Payout


ADMIN
ตรวจสอบ Organizer
    ↓
อนุมัติ Event
    ↓
ดูแล Orders / Payments
    ↓
จัดการ Commission
    ↓
Payout
    ↓
Reports
```

------------------------------------------------------------------------

# 2. Goals

## MVP Goals

-   [ ] สมัคร / Login
-   [ ] ค้นหา Event
-   [ ] ดูรายละเอียด Event
-   [ ] สร้าง Event
-   [ ] สร้างประเภท Ticket
-   [ ] Checkout
-   [ ] Payment Mock
-   [ ] สร้าง Digital Ticket
-   [ ] สร้าง QR Code
-   [ ] Organizer Dashboard
-   [ ] Attendee Management
-   [ ] QR Check-in
-   [ ] Admin Dashboard

## Future Goals

-   [ ] Payment Gateway จริง
-   [ ] Refund
-   [ ] Promotion / Coupon
-   [ ] Email Notification
-   [ ] SMS Notification
-   [ ] Organizer Payout
-   [ ] Commission
-   [ ] Analytics ขั้นสูง
-   [ ] Multiple Check-in Stations
-   [ ] Staff Account
-   [ ] Recommendation
-   [ ] Mobile App

------------------------------------------------------------------------

# 3. User Roles

## Attendee

ผู้เข้าร่วมงาน

สิทธิ์:

-   Browse Event
-   Search Event
-   Favorite Event
-   Purchase Ticket
-   View Orders
-   View Tickets
-   View QR Code
-   Check-in Status

## Organizer

ผู้จัดงาน

สิทธิ์:

-   Create Event
-   Edit Event
-   Publish Event
-   Manage Ticket
-   View Orders
-   Manage Attendees
-   Check-in
-   View Analytics
-   Manage Promotion
-   View Finance

## Event Staff

เจ้าหน้าที่หน้างาน

สิทธิ์:

-   View Assigned Events
-   Scan QR
-   Check-in Attendee
-   View Check-in History

ไม่สามารถจัดการ Finance หรือ Event Settings

## Admin

ผู้ดูแลระบบ

สิทธิ์:

-   Manage Users
-   Manage Organizers
-   Approve Events
-   Manage Categories
-   Manage Orders
-   Manage Payments
-   Manage Commission
-   Manage Payout
-   Reports
-   System Settings

------------------------------------------------------------------------

# 4. UI / Design System

## Brand

**EVENTRA**

Tagline:

> Discover. Create. Experience.

## Visual Direction

-   Clean
-   Modern
-   Premium
-   Event Marketplace
-   SaaS Dashboard
-   Mobile First
-   White background
-   Dark navy text
-   Blue / Purple accent

## Suggested Colors

``` text
Primary      #4F46E5
Primary Dark #3730A3
Accent       #7C3AED
Text         #111827
Secondary    #6B7280
Background   #F8FAFC
Surface      #FFFFFF
Border       #E5E7EB
Success      #16A34A
Warning      #F59E0B
Error        #DC2626
```

## Typography

แนะนำ:

-   Inter --- English
-   Noto Sans Thai --- Thai

## UI Principles

1.  ใช้ White Space เยอะ
2.  Card ไม่ควรมี Shadow หนัก
3.  Border Radius ประมาณ 12--16px
4.  ปุ่มหลักใช้ Primary Color
5.  Event Image ต้องเด่น
6.  Checkout ต้องเรียบและลดสิ่งรบกวน
7.  Organizer Dashboard ใช้ Sidebar
8.  Mobile ใช้ Bottom Navigation สำหรับ Attendee

------------------------------------------------------------------------

# 5. Main Pages

## Public

``` text
/
├── Home
├── Events
├── Events/[slug]
├── Categories
├── Organizers
├── About
└── Search
```

## Authentication

``` text
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password
```

## Attendee

``` text
/account
/account/profile
/account/orders
/account/tickets
/account/favorites
```

## Checkout

``` text
/checkout/[event]
/checkout/[event]/information
/checkout/[event]/payment
/checkout/success
```

## Organizer

``` text
/organizer
/organizer/events
/organizer/events/create
/organizer/events/[id]
/organizer/events/[id]/tickets
/organizer/events/[id]/orders
/organizer/events/[id]/attendees
/organizer/events/[id]/check-in
/organizer/events/[id]/analytics
/organizer/events/[id]/finance
/organizer/settings
```

## Admin

``` text
/admin
/admin/users
/admin/organizers
/admin/events
/admin/categories
/admin/orders
/admin/payments
/admin/commissions
/admin/payouts
/admin/reports
/admin/settings
```

------------------------------------------------------------------------

# 6. Homepage Structure

``` text
Navbar
    ↓
Hero
    ↓
Search Event
    ↓
Popular Events
    ↓
Categories
    ↓
Upcoming Events
    ↓
Featured Organizers
    ↓
Why EVENTRA
    ↓
Create Your Event CTA
    ↓
Footer
```

### Hero

Headline:

> Discover events you'll love.

Subheadline:

> Find and book amazing events happening around you.

Search:

``` text
[ Search events, artists or locations ] [ Date ] [ Search ]
```

------------------------------------------------------------------------

# 7. Event Detail

``` text
Event Cover
    ↓
Event Title
    ↓
Date / Time / Location
    ↓
Description
    ↓
Organizer
    ↓
Artists / Speakers
    ↓
Venue / Map
    ↓
Ticket Selection
    ↓
Related Events
```

Desktop:

``` text
┌───────────────────────────────┬─────────────────┐
│ Event Information             │ Ticket Card     │
│                               │                 │
│ Cover                         │ Early Bird      │
│ Title                         │ Regular         │
│ Date                          │ VIP             │
│ Location                      │                 │
│ Description                   │ [Buy Ticket]   │
└───────────────────────────────┴─────────────────┘
```

Ticket Card ควร Sticky เมื่อ Scroll

------------------------------------------------------------------------

# 8. Ticket System

Ticket Type:

``` text
id
event_id
name
description
price
quantity
sold_quantity
sale_start
sale_end
status
created_at
updated_at
```

ตัวอย่าง:

``` text
Early Bird
฿500
Quantity: 200

Regular
฿800
Quantity: 500

VIP
฿1,500
Quantity: 100
```

Ticket Status:

``` text
DRAFT
ACTIVE
SOLD_OUT
EXPIRED
DISABLED
```

------------------------------------------------------------------------

# 9. Order System

Order Flow:

``` text
Cart / Ticket Selection
        ↓
Create Order
        ↓
Reserve Ticket
        ↓
Payment
        ↓
Payment Verification
        ↓
Order Paid
        ↓
Generate Ticket
        ↓
Generate QR
        ↓
Send Notification
```

Order Status:

``` text
PENDING
PAYMENT_PROCESSING
PAID
CANCELLED
EXPIRED
REFUNDED
```

### Important

ห้ามให้ Frontend เป็นผู้กำหนดว่า Payment สำเร็จ

ต้องใช้:

``` text
Payment Gateway
      ↓
Webhook
      ↓
Backend Verify
      ↓
Update Order
      ↓
Generate Ticket
```

------------------------------------------------------------------------

# 10. Digital Ticket

Ticket ต้องมี:

``` text
Ticket ID
Order ID
Event ID
Attendee Name
Ticket Type
QR Code
Status
```

ตัวอย่าง:

``` text
EVENTRA
Bangkok Music Festival

John Doe

VIP

Ticket ID:
EVT-829192

[ QR CODE ]

VALID
```

------------------------------------------------------------------------

# 11. QR Check-in

Check-in Flow:

``` text
Scan QR
   ↓
Decode Ticket ID
   ↓
Find Ticket
   ↓
Validate Event
   ↓
Validate Ticket Status
   ↓
Check Already Used?
   ↓
Mark CHECKED_IN
   ↓
Show Result
```

Success:

``` text
✓ Check-in Successful

John Doe
VIP

Ticket: EVT-829192
```

Already Used:

``` text
✕ Already Checked In

Checked in at:
18:32
```

ต้องป้องกัน Race Condition กรณีสแกน QR เดียวกันพร้อมกันหลายเครื่อง

------------------------------------------------------------------------

# 12. Organizer Dashboard

Dashboard Cards:

``` text
Total Revenue
Tickets Sold
Orders
Attendees
Conversion Rate
```

Charts:

-   Sales Overview
-   Tickets by Type
-   Daily Orders
-   Check-in Statistics
-   Revenue

Menu:

``` text
Dashboard
Events
Orders
Tickets
Attendees
Check-in
Marketing
Analytics
Finance
Settings
```

------------------------------------------------------------------------

# 13. Create Event Wizard

แนะนำให้ทำเป็น Stepper:

``` text
1. Basic Info
2. Date & Location
3. Tickets
4. Payment
5. Preview
6. Publish
```

## Step 1

``` text
Event Name
Category
Description
Cover Image
Gallery
```

## Step 2

``` text
Start Date
End Date
Start Time
End Time
Venue
Address
Latitude
Longitude
```

## Step 3

``` text
Ticket Name
Price
Quantity
Sale Start
Sale End
```

## Step 4

``` text
Platform Fee
Payment Fee
Organizer Revenue
```

## Step 5

Preview หน้า Event ก่อน Publish

------------------------------------------------------------------------

# 14. Promotion

รองรับ:

``` text
Promo Code
Coupon
Discount %
Discount Amount
Usage Limit
Per User Limit
Minimum Order
Start Date
Expire Date
```

ตัวอย่าง:

``` text
EVENTRA10

10% OFF

Minimum: ฿500
Maximum Usage: 1,000
```

------------------------------------------------------------------------

# 15. Finance

ตัวอย่างการคำนวณ:

``` text
Gross Sales       ฿100,000
Platform Fee       -฿5,000
Payment Fee        -฿2,000
--------------------------------
Net Organizer       ฿93,000
```

Finance Modules:

``` text
Transactions
Payments
Commission
Refunds
Payouts
Invoices
Receipts
```

------------------------------------------------------------------------

# 16. Commission

Platform สามารถกำหนด Commission ต่อ Event หรือ Organizer

``` text
Commission Type

Percentage
Fixed Amount
```

ตัวอย่าง:

``` text
Ticket Sales      ฿100,000

Platform Fee 5%   ฿5,000

Organizer         ฿95,000
```

------------------------------------------------------------------------

# 17. Payout

``` text
PENDING
    ↓
PROCESSING
    ↓
PAID
```

ข้อมูล:

``` text
payout_id
organizer_id
event_id
gross_amount
commission
payment_fee
net_amount
status
paid_at
```

------------------------------------------------------------------------

# 18. Database

แนะนำ PostgreSQL

Core tables:

``` text
users
roles
user_roles

organizers
organizer_staff

events
event_categories
categories
event_images
venues

ticket_types
tickets
attendees

orders
order_items
payments

check_ins

promotions
promotion_usages

commissions
payouts

notifications

favorites

audit_logs
```

### Relationship

``` text
User
 │
 ├── Orders
 │      │
 │      └── Order Items
 │              │
 │              └── Tickets
 │
 └── Organizer
          │
          └── Events
                │
                ├── Ticket Types
                ├── Attendees
                ├── Orders
                └── Check-ins
```

------------------------------------------------------------------------

# 19. Recommended Tech Stack

## Frontend

``` text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
React Hook Form
Zod
TanStack Query
```

## Backend

แนะนำ NestJS:

``` text
NestJS
TypeScript
Prisma
PostgreSQL
Redis
BullMQ
```

## Storage

``` text
AWS S3
หรือ
Cloudflare R2
```

## Authentication

``` text
JWT
Refresh Token
HttpOnly Cookie
RBAC
```

## Infrastructure

MVP:

``` text
Vercel
    +
Railway / Render / AWS
    +
PostgreSQL
    +
Redis
    +
S3 / R2
```

Production:

``` text
AWS
├── CloudFront
├── ECS / EC2
├── RDS PostgreSQL
├── ElastiCache Redis
├── S3
└── SES
```

------------------------------------------------------------------------

# 20. Backend Modules

NestJS structure:

``` text
src/
├── auth/
├── users/
├── organizers/
├── events/
├── categories/
├── venues/
├── tickets/
├── orders/
├── payments/
├── attendees/
├── checkins/
├── promotions/
├── commissions/
├── payouts/
├── notifications/
├── analytics/
├── uploads/
├── admin/
├── common/
└── prisma/
```

------------------------------------------------------------------------

# 21. Frontend Structure

``` text
app/
├── (public)/
│   ├── page.tsx
│   ├── events/
│   ├── categories/
│   └── organizers/
│
├── (auth)/
│   ├── login/
│   ├── register/
│   └── forgot-password/
│
├── account/
│   ├── profile/
│   ├── orders/
│   ├── tickets/
│   └── favorites/
│
├── checkout/
│
├── organizer/
│   ├── dashboard/
│   ├── events/
│   ├── orders/
│   ├── attendees/
│   ├── check-in/
│   ├── analytics/
│   └── finance/
│
└── admin/
    ├── dashboard/
    ├── users/
    ├── organizers/
    ├── events/
    ├── payments/
    ├── commissions/
    └── payouts/

components/
├── ui/
├── event/
├── ticket/
├── checkout/
├── dashboard/
├── organizer/
└── checkin/

lib/
├── api.ts
├── auth.ts
├── utils.ts
└── validations/

types/
```

------------------------------------------------------------------------

# 22. API Design

Base URL:

``` text
/api/v1
```

## Auth

``` http
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

## Events

``` http
GET    /events
GET    /events/:slug
POST   /events
PATCH  /events/:id
DELETE /events/:id
POST   /events/:id/publish
POST   /events/:id/unpublish
```

## Tickets

``` http
GET    /events/:id/tickets
POST   /events/:id/tickets
PATCH  /tickets/:id
DELETE /tickets/:id
```

## Orders

``` http
POST /orders
GET  /orders
GET  /orders/:id
POST /orders/:id/cancel
```

## Payments

``` http
POST /payments/create
POST /payments/webhook
GET  /payments/:id
```

## Check-in

``` http
POST /checkins/scan
GET  /events/:id/checkins
GET  /events/:id/checkins/stats
```

------------------------------------------------------------------------

# 23. Security

ต้องให้ความสำคัญกับ:

-   Password Hashing
-   JWT Security
-   Refresh Token Rotation
-   RBAC
-   Rate Limiting
-   API Validation
-   Input Sanitization
-   SQL Injection Protection
-   CSRF Protection
-   XSS Protection
-   Secure File Upload
-   Payment Webhook Verification
-   Audit Log

## QR Security

ไม่ควรใส่ข้อมูลส่วนตัวทั้งหมดไว้ใน QR

แนะนำ:

``` text
QR
 ↓
Signed Token / Random Ticket Token
 ↓
Backend
 ↓
Validate
```

------------------------------------------------------------------------

# 24. MVP Development Roadmap

## Phase 1 --- Foundation

-   [ ] Setup Monorepo
-   [ ] Setup Next.js
-   [ ] Setup NestJS
-   [ ] Setup PostgreSQL
-   [ ] Setup Prisma
-   [ ] Setup Redis
-   [ ] Setup Authentication
-   [ ] Setup RBAC
-   [ ] Setup CI/CD

## Phase 2 --- Event

-   [ ] Event CRUD
-   [ ] Category
-   [ ] Venue
-   [ ] Image Upload
-   [ ] Event Search
-   [ ] Event Detail
-   [ ] Publish / Unpublish

## Phase 3 --- Ticket

-   [ ] Ticket Type
-   [ ] Ticket Inventory
-   [ ] Ticket Reservation
-   [ ] Order
-   [ ] Order Items
-   [ ] Attendee

## Phase 4 --- Payment

เริ่มจาก Mock Payment:

``` text
Create Order
    ↓
Mock Payment
    ↓
Webhook Simulation
    ↓
Paid
```

จากนั้นค่อยเชื่อม Payment Gateway จริง

## Phase 5 --- Ticket & QR

-   [ ] Generate Ticket
-   [ ] Generate QR
-   [ ] My Tickets
-   [ ] QR Scanner
-   [ ] Check-in
-   [ ] Check-in History

## Phase 6 --- Organizer

-   [ ] Dashboard
-   [ ] Sales Analytics
-   [ ] Orders
-   [ ] Attendees
-   [ ] Check-in Dashboard
-   [ ] Finance

## Phase 7 --- Admin

-   [ ] Admin Dashboard
-   [ ] User Management
-   [ ] Organizer Management
-   [ ] Event Approval
-   [ ] Payment Management
-   [ ] Commission
-   [ ] Payout
-   [ ] Reports

------------------------------------------------------------------------

# 25. MVP Definition

MVP จะถือว่าสำเร็จเมื่อสามารถทำ Flow นี้ได้ครบ:

``` text
User
 ↓
Register
 ↓
Browse Events
 ↓
Open Event
 ↓
Select Ticket
 ↓
Checkout
 ↓
Mock Payment
 ↓
Order Paid
 ↓
Generate Ticket
 ↓
Generate QR
 ↓
Organizer เปิด Check-in
 ↓
Scan QR
 ↓
Ticket Valid
 ↓
Check-in Success
 ↓
Organizer เห็นยอด Check-in
```

------------------------------------------------------------------------

# 26. Development Priority

อย่าทำ Feature ทุกอย่างพร้อมกัน

ลำดับที่แนะนำ:

``` text
1. Authentication
        ↓
2. Event
        ↓
3. Ticket
        ↓
4. Order
        ↓
5. Mock Payment
        ↓
6. Digital Ticket
        ↓
7. QR Check-in
        ↓
8. Organizer Dashboard
        ↓
9. Admin
        ↓
10. Real Payment
        ↓
11. Finance / Payout
        ↓
12. Marketing / Analytics
```

------------------------------------------------------------------------

# 27. Repository Structure

แนะนำ Monorepo:

``` text
eventra/
├── apps/
│   ├── web/
│   ├── api/
│   └── checkin/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   └── eslint-config/
│
├── docs/
├── prisma/
├── docker-compose.yml
├── package.json
└── README.md
```

ถ้าต้องการลดความซับซ้อนใน MVP สามารถเริ่มจาก:

``` text
eventra/
├── frontend/
└── backend/
```

แล้วค่อยแยกเป็น Monorepo ภายหลัง

------------------------------------------------------------------------

# 28. Initial Setup

แนะนำเริ่มจาก:

``` bash
mkdir eventra
cd eventra
```

Frontend:

``` bash
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app
```

Backend:

``` bash
npm i -g @nestjs/cli

nest new backend
```

Backend dependencies:

``` bash
npm install @prisma/client
npm install -D prisma
```

Validation:

``` bash
npm install class-validator class-transformer
```

Authentication:

``` bash
npm install @nestjs/jwt passport passport-jwt bcrypt
```

------------------------------------------------------------------------

# 29. Docker Development

Development services:

``` text
PostgreSQL
Redis
```

ตัวอย่าง:

``` yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: eventra
      POSTGRES_PASSWORD: eventra
      POSTGRES_DB: eventra
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

------------------------------------------------------------------------

# 30. Important Business Rules

## Ticket Inventory

ต้องไม่ขาย Ticket เกินจำนวน:

``` text
available =
quantity - sold_quantity - reserved_quantity
```

## Reservation

เมื่อ User เริ่ม Checkout:

``` text
Reserve Ticket
TTL 10–15 minutes
```

ถ้าไม่ชำระเงิน:

``` text
Reservation Expired
    ↓
คืน Ticket
```

## Payment

Order จะเป็น PAID ได้ต่อเมื่อ Backend ตรวจสอบ Payment สำเร็จ

## Check-in

Ticket ที่ CHECKED_IN แล้วไม่สามารถ Check-in ซ้ำได้

------------------------------------------------------------------------

# 31. Future Architecture

เมื่อระบบใหญ่ขึ้น:

``` text
                   EVENTRA
                      │
              API Gateway
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     Event API    Order API     Payment API
        │             │             │
        └─────────────┼─────────────┘
                      │
                   Redis
                      │
                    Queue
                      │
          ┌───────────┼───────────┐
          │           │           │
       Email       Analytics    Notification
```

ยังไม่จำเป็นต้องเริ่มด้วย Microservices

**MVP ใช้ Modular Monolith ก่อน** แล้วค่อยแยก Service เมื่อมี Load จริง

------------------------------------------------------------------------

# 32. Product Roadmap

### Version 0.1

Event + Ticket + Order

### Version 0.2

QR Check-in + Organizer Dashboard

### Version 0.3

Payment Gateway + Promotion

### Version 0.4

Finance + Commission + Payout

### Version 0.5

Analytics + Marketing

### Version 1.0

Full Event Platform

------------------------------------------------------------------------

# 33. Brand

``` text
EVENTRA

Discover. Create. Experience.
```

Brand Direction:

``` text
Clean
Modern
Premium
Friendly
Technology
Event-focused
```

Primary logo concept:

-   Geometric E symbol
-   Purple → Blue gradient
-   Dark navy wordmark
-   Horizontal logo
-   Icon-only version สำหรับ App / Favicon

------------------------------------------------------------------------

# 34. Final Product Structure

``` text
                       EVENTRA
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    DISCOVERY          TICKETING         ORGANIZER
        │                 │                 │
     Events            Checkout         Create Event
     Search            Payment          Ticket
     Category          QR Ticket        Attendees
     Favorite          Orders           Check-in
                                          Analytics
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                       ADMIN
                          │
             Users / Events / Payments
             Commission / Payout / Reports
```

------------------------------------------------------------------------

# 35. Definition of Done

Feature จะถือว่าเสร็จเมื่อ:

-   UI เสร็จ
-   Responsive
-   API เชื่อมต่อจริง
-   Database Migration เสร็จ
-   Validation ครบ
-   Error Handling ครบ
-   Authentication / Authorization ถูกต้อง
-   Loading State
-   Empty State
-   Error State
-   Success State
-   Audit Log สำหรับ Action สำคัญ
-   Tested
-   Documented

------------------------------------------------------------------------

## Recommended First Sprint

เริ่มจาก 7 งานนี้ก่อน:

``` text
[ ] สร้าง Repository EVENTRA
[ ] Setup Next.js
[ ] Setup NestJS
[ ] Setup PostgreSQL + Prisma
[ ] สร้าง Auth
[ ] สร้าง Event CRUD
[ ] ออกแบบ Homepage + Event Detail
```

จากนั้นค่อยต่อ:

``` text
Event
 → Ticket
 → Order
 → Payment
 → QR
 → Check-in
```

นี่คือเส้นทางหลักของ EVENTRA MVP
