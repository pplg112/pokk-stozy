# Pokky Digital Opt-Store - Esports Optimization Files & Scripts Shop

เว็บไซต์ร้านค้าออนไลน์จำหน่ายไฟล์ดิจิทัล (Digital Download Store) สำหรับขายสคริปต์, ไฟล์ Registry, โปรไฟล์การ์ดจอ, และชุดบันเดิลออพติไมซ์ Windows & Gaming PC สำหรับนำไปรันใช้งานได้เองทันที พัฒนาด้วย Next.js 15 (App Router), TypeScript, และ Tailwind CSS รองรับการ Deploy บน Vercel 100%

## จุดเด่นของระบบ
- **Zero Emojis**: ใช้เฉพาะไอคอน SVG คมชัดจาก `lucide-react` เท่านั้น
- **Zero AI Slop**: สคริปต์และไฟล์ระบุฟังก์ชันทางเทคนิคจริง (bcdedit, MSI utility, DDU configs, TCP NoDelay, Subtimings)
- **E-Commerce Shopping Cart Drawer**: ระบบตะกร้าสินค้าแบบสไลด์ข้าง พร้อมระบบโค้ดส่วนลด (เช่น `POKKY10`) และปุ่มซื้อทันที (Buy Now)
- **Product Quick View Modal**: ดูรายชื่อไฟล์ข้างในแพ็กเกจ (Included Files Tree) และสเปกความต้องการของระบบ
- **PromptPay QR Checkout & Instant Download**: ชำระเงินผ่านแบบจำลอง PromptPay QR แล้วหน้าเว็บจะเปิดให้กดดาวน์โหลดไฟล์ทันที พร้อม License Key ประจำตัว
- **100% Vercel Ready**: Static Page Prerendered ขนาด First Load JS รวมเพียง ~124 kB โหลดไวระดับพริบตา

## สินค้าดิจิทัลที่วางจำหน่าย
1. **Pokky Ultimate Optimization Suite v3.4 (.ZIP Archive)** — ฿490 (ชุดรวมยอดนิยม)
2. **Kernel Latency & Timer 0.5ms Script Pack (.BAT / .CMD)** — ฿250
3. **Windows 10/11 Esports Debloat Script (.PS1 PowerShell)** — ฿290
4. **NVIDIA & AMD Low-Latency Profile Pack (.NIP / .REG)** — ฿190
5. **Esports Network & Bufferbloat Fixer (.REG / .BAT)** — ฿150
6. **RAM Subtimings Sheet & TM5 Test Pack (.PDF / .CFG)** — ฿290

## การรันและทดสอบในเครื่อง (Local Dev)
```bash
npm install
npm run dev
```
เปิดชมผ่านบราวเซอร์ที่: `http://localhost:3000`

## การ Deploy สู่ Vercel
```bash
npx vercel
```
หรือเชื่อมต่อโฟลเดอร์นี้กับ GitHub Repository แล้วกด Import บน Vercel Dashboard
