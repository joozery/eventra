import type { OrderData, ReceiptInfo } from "./checkout-shell";
import type { MockEvent } from "@/lib/mock-data";

function fmt(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function thDate() {
  return new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
}

function docNumber(prefix: string) {
  return prefix + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function openPrintDocument(
  type: "quotation" | "invoice",
  event: MockEvent,
  order: OrderData,
  receipt: ReceiptInfo | null,
  bookingRef?: string,
) {
  const isInvoice = type === "invoice";
  const docNo     = bookingRef ? `INV-${bookingRef}` : docNumber(isInvoice ? "INV" : "QT");
  const docTitle  = isInvoice ? "ใบแจ้งหนี้ / ใบเสร็จรับเงิน" : "ใบเสนอราคา";
  const date      = thDate();

  const rowsHtml = order.items.map((item, i) => `
    <tr>
      <td class="td-num">${i + 1}</td>
      <td class="td-desc">
        <div class="item-name">${item.name} &mdash; ${event.title}</div>
        <div class="item-sub">${event.endDate ? `${event.date} &ndash; ${event.endDate}` : `${event.date} &middot; ${event.time}`} &middot; ${event.location}</div>
      </td>
      <td class="td-qty">${item.qty}</td>
      <td class="td-price">&#3647;${fmt(item.price)}</td>
      <td class="td-total">&#3647;${fmt(item.price * item.qty)}</td>
    </tr>
  `).join("");

  const discountRow = order.discount > 0 ? `
    <tr class="discount-row">
      <td class="td-num">&mdash;</td>
      <td colspan="3" style="color:#92400e;font-size:13px;">
        ส่วนลดโปรโมชั่น (${order.promo?.code}) &mdash; ${order.promo?.label}
      </td>
      <td class="td-total" style="color:#b45309;">&minus;&#3647;${fmt(order.discount)}</td>
    </tr>` : "";

  const buyerBlock = receipt
    ? `<div class="info-name">${receipt.name}</div>
       <span class="info-tax">${receipt.taxId}</span>
       ${receipt.branch ? `<div class="info-row" style="margin-top:6px"><strong>สาขา:</strong> ${receipt.branch}</div>` : ""}
       <div class="info-row" style="margin-top:6px">${receipt.address}</div>
       ${receipt.email ? `<div class="info-row">${receipt.email}</div>` : ""}`
    : `<div class="info-name">${order.buyerName}</div>
       <div class="info-row">${order.buyerEmail}</div>
       <div class="info-row">${order.buyerPhone}</div>`;

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${docTitle} &mdash; ${docNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Sarabun', sans-serif;
      font-size: 14px;
      color: #111827;
      background: #f1f5f9;
      min-height: 100vh;
    }

    /* ── Print action bar ── */
    .print-bar {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 28px;
      background: #0f172a;
      color: #fff;
    }
    .pb-brand { font-size: 15px; font-weight: 700; letter-spacing: -0.5px; }
    .pb-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 1px; }
    .pb-actions { display: flex; gap: 8px; }
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border: none; border-radius: 8px;
      font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .btn-print { background: #4f46e5; color: #fff; }
    .btn-print:hover { background: #4338ca; }
    .btn-close {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12) !important;
      color: rgba(255,255,255,0.65);
    }
    .btn-close:hover { background: rgba(255,255,255,0.14); }

    /* ── Page wrapper ── */
    .page-wrap { padding: 28px 20px 56px; max-width: 860px; margin: 0 auto; }

    .doc {
      background: #fff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 20px 60px -12px rgba(0,0,0,0.14);
    }

    /* ── Header band ── */
    .doc-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4338ca 100%);
      padding: 32px 40px;
      display: flex; justify-content: space-between; align-items: flex-start;
      position: relative; overflow: hidden;
    }
    .doc-header::before {
      content: ''; position: absolute; top: -50px; right: -50px;
      width: 220px; height: 220px; border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .doc-header::after {
      content: ''; position: absolute; bottom: -60px; right: 100px;
      width: 150px; height: 150px; border-radius: 50%;
      background: rgba(255,255,255,0.03);
    }

    .brand-logo { font-size: 30px; font-weight: 700; color: #fff; letter-spacing: -1px; line-height: 1; }
    .brand-name { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; }
    .brand-addr { font-size: 11px; color: rgba(255,255,255,0.38); margin-top: 8px; line-height: 1.7; }

    .doc-type { text-align: right; position: relative; z-index: 1; }
    .doc-badge {
      display: inline-block;
      padding: 3px 10px;
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 100px;
      font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .doc-title { font-size: 20px; font-weight: 700; color: #fff; line-height: 1.25; }
    .doc-meta { margin-top: 10px; }
    .meta-row {
      display: flex; justify-content: flex-end; align-items: center; gap: 8px;
      margin-top: 4px; font-size: 12px; color: rgba(255,255,255,0.55);
    }
    .meta-val { color: #fff; font-weight: 600; }

    ${isInvoice ? `
    .stamp {
      position: absolute; top: 50%; right: 180px;
      transform: translateY(-50%) rotate(-14deg);
      border: 3px solid rgba(134,239,172,0.45);
      border-radius: 8px; padding: 6px 14px;
      color: rgba(134,239,172,0.65);
      font-size: 15px; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; z-index: 1; pointer-events: none;
    }` : ""}

    /* ── Body ── */
    .doc-body { padding: 36px 40px 40px; }

    /* ── Info grid ── */
    .info-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
      margin-bottom: 32px;
    }
    .info-label {
      font-size: 10px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: #9ca3af;
      padding-bottom: 8px; margin-bottom: 10px;
      border-bottom: 1px solid #f3f4f6;
    }
    .info-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 3px; }
    .info-row { font-size: 12px; color: #6b7280; line-height: 1.75; }
    .info-row strong { color: #374151; }
    .info-tax {
      display: inline-block; margin-top: 6px; margin-bottom: 2px;
      padding: 2px 8px; background: #f3f4f6; border-radius: 5px;
      font-size: 11px; font-family: monospace; letter-spacing: 0.1em; color: #374151;
    }
    .event-chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px;
      background: #eef2ff; border-radius: 6px;
      font-size: 11px; color: #4338ca; font-weight: 600;
      margin-bottom: 8px;
    }

    /* ── Table ── */
    .table-wrap {
      border-radius: 12px; overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f8fafc; }
    th {
      padding: 11px 16px;
      font-size: 10px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.07em;
      color: #6b7280; text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    tbody tr { border-bottom: 1px solid #f3f4f6; }
    tbody tr:last-child { border-bottom: none; }
    td { padding: 13px 16px; vertical-align: middle; }
    .td-num { text-align: center; color: #9ca3af; font-size: 12px; width: 40px; }
    .item-name { font-weight: 600; font-size: 14px; color: #111827; }
    .item-sub { font-size: 11px; color: #9ca3af; margin-top: 3px; line-height: 1.5; }
    .td-qty { text-align: center; font-size: 14px; width: 60px; }
    .td-price { text-align: right; font-size: 13px; color: #6b7280; width: 110px; }
    .td-total { text-align: right; font-size: 14px; font-weight: 600; color: #111827; width: 120px; }
    .discount-row td { padding: 10px 16px; background: #fffbeb; }

    /* ── Totals ── */
    .totals-wrap { display: flex; justify-content: flex-end; margin-top: 24px; }
    .totals-box {
      width: 300px;
      border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;
    }
    .tot-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 16px; border-bottom: 1px solid #e5e7eb;
      font-size: 13px;
    }
    .tot-label { color: #6b7280; }
    .tot-val { font-weight: 600; color: #374151; }
    .tot-grand {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 20px;
      background: linear-gradient(135deg, #1e1b4b, #312e81);
    }
    .tot-grand-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); }
    .tot-grand-val { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }

    /* ── Signatures ── */
    .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-top: 56px; }
    .sig-box { text-align: center; }
    .sig-space { height: 48px; }
    .sig-line { height: 1px; background: #d1d5db; margin-bottom: 8px; }
    .sig-label { font-size: 12px; color: #6b7280; }
    .sig-date { font-size: 11px; color: #9ca3af; margin-top: 4px; }

    /* ── Validity note ── */
    .validity {
      margin-top: 32px; padding: 14px 18px;
      background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;
      font-size: 12px; color: #92400e; line-height: 1.7;
    }

    /* ── Footer ── */
    .doc-footer {
      margin-top: 44px; padding-top: 18px;
      border-top: 1px solid #f3f4f6;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; color: #9ca3af;
    }
    .footer-brand { font-weight: 700; color: #6b7280; letter-spacing: -0.3px; }

    /* ── Print overrides ── */
    @media print {
      body { background: #fff; }
      .print-bar { display: none !important; }
      .page-wrap { padding: 0; max-width: 100%; }
      .doc { box-shadow: none; border-radius: 0; }
      .doc-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .tot-grand { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- Action bar (hidden when printing) -->
  <div class="print-bar">
    <div>
      <div class="pb-brand">EVENTRA</div>
      <div class="pb-sub">${docTitle}</div>
    </div>
    <div class="pb-actions">
      <button class="btn btn-close" onclick="window.close()">✕&nbsp; ปิด</button>
      <button class="btn btn-print" onclick="window.print()">🖨&nbsp; พิมพ์เอกสาร</button>
    </div>
  </div>

  <div class="page-wrap">
    <div class="doc">

      <!-- Header band -->
      <div class="doc-header">
        <div>
          <div class="brand-logo">EVENTRA</div>
          <div class="brand-name">บริษัท อีเวนทรา จำกัด</div>
          <div class="brand-addr">
            เลขผู้เสียภาษี: 0105565XXXXXX<br>
            123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย<br>
            กรุงเทพมหานคร 10110
          </div>
        </div>

        ${isInvoice ? `<div class="stamp">ชำระแล้ว</div>` : ""}

        <div class="doc-type">
          <div class="doc-badge">${isInvoice ? "TAX INVOICE" : "QUOTATION"}</div>
          <div class="doc-title">${docTitle}</div>
          <div class="doc-meta">
            <div class="meta-row">
              <span>เลขที่</span>
              <span class="meta-val">${docNo}</span>
            </div>
            <div class="meta-row">
              <span>วันที่</span>
              <span class="meta-val">${date}</span>
            </div>
            ${isInvoice && bookingRef ? `<div class="meta-row"><span>รหัสการจอง</span><span class="meta-val">${bookingRef}</span></div>` : ""}
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="doc-body">

        <!-- Info grid -->
        <div class="info-grid">
          <div>
            <div class="info-label">ออกให้แก่ / Bill To</div>
            ${buyerBlock}
          </div>
          <div>
            <div class="info-label">รายละเอียดงาน / Event</div>
            <div class="event-chip">🎟 ${event.category}</div>
            <div class="info-name">${event.title}</div>
            <div class="info-row">${event.endDate ? `${event.date} &ndash; ${event.endDate}` : `${event.date} &middot; ${event.time}`}</div>
            <div class="info-row">${event.location}</div>
          </div>
        </div>

        <!-- Items table -->
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th style="text-align:center">#</th>
                <th>รายการ / Description</th>
                <th style="text-align:center">จำนวน</th>
                <th style="text-align:right">ราคา/หน่วย</th>
                <th style="text-align:right">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              ${discountRow}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="totals-wrap">
          <div class="totals-box">
            <div class="tot-row">
              <span class="tot-label">ราคาไม่รวมภาษีมูลค่าเพิ่ม</span>
              <span class="tot-val">&#3647;${fmt(order.total)}</span>
            </div>
            <div class="tot-row">
              <span class="tot-label">ภาษีมูลค่าเพิ่ม (7%)</span>
              <span class="tot-val">&#3647;${fmt(order.vat)}</span>
            </div>
            <div class="tot-grand">
              <span class="tot-grand-label">รวมทั้งสิ้น</span>
              <span class="tot-grand-val">&#3647;${fmt(order.grandTotal)}</span>
            </div>
          </div>
        </div>

        ${isInvoice ? `
        <!-- Signatures -->
        <div class="sig-grid">
          <div class="sig-box">
            <div class="sig-space"></div>
            <div class="sig-line"></div>
            <div class="sig-label">ผู้รับเงิน / Received by</div>
            <div class="sig-date">วันที่ &nbsp; ……………………………………</div>
          </div>
          <div class="sig-box">
            <div class="sig-space"></div>
            <div class="sig-line"></div>
            <div class="sig-label">ผู้จ่ายเงิน / Paid by</div>
            <div class="sig-date">วันที่ &nbsp; ……………………………………</div>
          </div>
        </div>` : `
        <!-- Validity -->
        <div class="validity">
          <strong>หมายเหตุ:</strong> ใบเสนอราคานี้มีอายุ <strong>7 วัน</strong> นับจากวันที่ออกเอกสาร &middot;
          ราคาข้างต้นยังไม่รวมภาษีมูลค่าเพิ่ม 7% ซึ่งแสดงไว้แยกต่างหากในตารางด้านบน &middot;
          กรุณายืนยันการสั่งซื้อก่อนวันหมดอายุ
        </div>`}

        <!-- Footer -->
        <div class="doc-footer">
          <span class="footer-brand">EVENTRA</span>
          <span>support@eventra.co.th &nbsp;&middot;&nbsp; www.eventra.co.th &nbsp;&middot;&nbsp; โทร 02-XXX-XXXX</span>
          <span>หน้า 1 / 1</span>
        </div>

      </div>
    </div>
  </div>

</body>
</html>`;

  const win = window.open("", "_blank", "width=960,height=760");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
