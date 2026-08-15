export default function FinancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-sm font-semibold text-foreground">การเงิน</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">สรุปรายได้และประวัติการชำระเงิน</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "รายได้รวม",          value: "฿124,500", sub: "ทั้งหมด",          cls: "bg-emerald-50 text-emerald-700" },
          { label: "รอการโอน",           value: "฿38,200",  sub: "กำลังดำเนินการ",  cls: "bg-amber-50 text-amber-700"   },
          { label: "โอนแล้ว",            value: "฿86,300",  sub: "เสร็จสิ้น",        cls: "bg-indigo-50 text-indigo-700" },
        ].map((c) => (
          <div key={c.label} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{c.value}</p>
            <span className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ${c.cls}`}>{c.sub}</span>
          </div>
        ))}
      </div>

      {/* Transaction history */}
      <div className="rounded-xl border border-border bg-background">
        <div className="border-b border-border px-5 py-3.5">
          <p className="text-sm font-semibold text-foreground">ประวัติ Transaction</p>
        </div>
        <div className="divide-y divide-border/40">
          {[
            { event: "Maroon 5 Asia 2027",      amount: "+฿45,000", date: "12 ส.ค. 2026", status: "โอนแล้ว",  statusCls: "text-emerald-600" },
            { event: "BNK48 Concert",            amount: "+฿28,500", date: "8 ส.ค. 2026",  status: "โอนแล้ว",  statusCls: "text-emerald-600" },
            { event: "Tech Summit Bangkok 2026", amount: "+฿38,200", date: "5 ส.ค. 2026",  status: "รอโอน",    statusCls: "text-amber-600"   },
            { event: "Art Exhibition",           amount: "+฿12,800", date: "1 ส.ค. 2026",  status: "โอนแล้ว",  statusCls: "text-emerald-600" },
          ].map((t) => (
            <div key={t.event} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{t.event}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
              <p className="text-sm font-semibold tabular-nums text-foreground">{t.amount}</p>
              <p className={`text-xs font-medium ${t.statusCls}`}>{t.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
