# HarnKao — หารข้าว

> Split trip expenses with friends, no sign-up required.
> แบ่งค่าใช้จ่ายระหว่างเดินทางกับเพื่อน ไม่ต้องสมัครสมาชิก

---

## English

### What is HarnKao?

HarnKao is a lightweight, single-page web app for splitting expenses on group trips. Add people, log what each person paid and who shared the cost, and the app calculates the simplest set of transfers to settle up. Everything runs in your browser — no server, no account, no data sent anywhere unless you choose to share a link.

### Features

- **Multiple trips** — create and switch between trips, all stored locally in the browser
- **Multi-currency** — log expenses in any currency; live exchange rates fetched automatically with offline fallback
- **Equal or custom split** — split a bill evenly or enter exact amounts per person
- **Categories** — tag expenses (Food, Hotel, Transport, Activity, Shopping, Other) for a category breakdown in the summary
- **Settlement summary** — greedy algorithm finds the minimum number of transfers to clear all debts; mark transfers as paid
- **Export** — save the summary as a PDF or PNG image
- **Share** — generate a URL that encodes the full trip; optionally shorten it via is.gd
- **PWA** — installable on mobile and desktop, works offline after first load
- **Light / dark theme**

### How to run locally

```bash
# Quick preview (PWA features won't work on file://)
open public/HarnKao.html

# Full PWA testing (service worker requires HTTP)
npx serve public
# or
python3 -m http.server 8080 --directory public
```

Then open `http://localhost:3000` (serve) or `http://localhost:8080` (Python) in your browser.

### How to deploy

The app is a single HTML file. Any static host works.

**Netlify (recommended):** `netlify.toml` is already configured — it publishes the `public/` directory. Connect the repo to Netlify and push; `HarnKao.html` will be served at both `/` and `/HarnKao.html`.

**Other hosts:** upload the contents of `public/` to your web root (`HarnKao.html`, `manifest.json`, `sw.js`, `Harnkao.png`). Point the document root at that directory.

### Tech stack

| Layer | Choice |
|-------|--------|
| Language | Vanilla HTML / CSS / JS — no framework, no build step |
| Storage | `localStorage` |
| PWA | Web App Manifest + Service Worker (`sw.js`) |
| Exchange rates | [exchangerate-api.com](https://www.exchangerate-api.com) (free tier, 1-hour cache) |
| URL shortening | [is.gd](https://is.gd) (optional, no account needed) |
| PNG export | [html2canvas 1.4.1](https://html2canvas.hertzen.com) via cdnjs (lazy-loaded) |
| Fonts | DM Sans via Google Fonts |

---

## ภาษาไทย

### HarnKao คืออะไร?

HarnKao คือเว็บแอปแบบหน้าเดียว (single-page) สำหรับหารค่าใช้จ่ายระหว่างเดินทางกับเพื่อนกลุ่ม เพิ่มรายชื่อคน บันทึกว่าใครจ่ายค่าอะไร และใครร่วมจ่ายบ้าง แอปจะคำนวณหาชุดการโอนเงินที่น้อยที่สุดเพื่อจบบัญชีให้เรียบร้อย ทุกอย่างทำงานบนเบราว์เซอร์ของคุณ ไม่มีเซิร์ฟเวอร์ ไม่ต้องสมัครสมาชิก ไม่มีข้อมูลถูกส่งออกไปไหน เว้นแต่คุณจะแชร์ลิงก์

### ฟีเจอร์หลัก

- **หลายทริป** — สร้างและสลับระหว่างทริปได้หลายทริป ข้อมูลเก็บไว้ในเบราว์เซอร์
- **หลายสกุลเงิน** — บันทึกค่าใช้จ่ายเป็นสกุลเงินอะไรก็ได้ อัตราแลกเปลี่ยนดึงอัตโนมัติ มีค่า fallback สำหรับใช้งานออฟไลน์
- **หารเท่ากัน หรือกำหนดเอง** — หารบิลเท่ากันทุกคน หรือระบุจำนวนเงินของแต่ละคนเอง
- **หมวดหมู่** — แท็กค่าใช้จ่าย (อาหาร, โรงแรม, เดินทาง, กิจกรรม, ช้อปปิ้ง, อื่นๆ) เพื่อดูสรุปแยกตามหมวด
- **สรุปการชำระ** — อัลกอริทึมหาจำนวนการโอนเงินน้อยที่สุดในการเคลียร์หนี้ทั้งหมด กดติ๊กเพื่อมาร์กว่าจ่ายแล้ว
- **ส่งออก** — บันทึกสรุปเป็น PDF หรือรูปภาพ PNG
- **แชร์** — สร้าง URL ที่บรรจุข้อมูลทริปทั้งหมด ย่อลิงก์ได้ผ่าน is.gd
- **PWA** — ติดตั้งได้บนมือถือและเดสก์ท็อป ใช้งานออฟไลน์ได้หลังโหลดครั้งแรก
- **ธีมสว่าง / มืด**

### วิธีรันบนเครื่อง

```bash
# เปิดดูได้เลย (ฟีเจอร์ PWA จะไม่ทำงานบน file://)
open HarnKao.html

# ทดสอบ PWA เต็มรูปแบบ (Service Worker ต้องการ HTTP)
npx serve .
# หรือ
python3 -m http.server 8080
```

จากนั้นเปิด `http://localhost:3000` (serve) หรือ `http://localhost:8080` (Python) ในเบราว์เซอร์

### วิธี deploy

แอปเป็นไฟล์ HTML ไฟล์เดียว รองรับทุก static host

**Netlify (แนะนำ):** มี `netlify.toml` ตั้งค่าไว้แล้ว โดย publish จาก directory `public/` เชื่อมต่อ repo กับ Netlify แล้ว push — `HarnKao.html` จะถูกเสิร์ฟที่ทั้ง `/` และ `/HarnKao.html` อัตโนมัติ

**Host อื่นๆ:** อัปโหลดไฟล์ทั้งหมดใน `public/` ขึ้นไปที่ web root (`HarnKao.html`, `manifest.json`, `sw.js`, `Harnkao.png`) แล้วชี้ document root ไปที่ directory นั้น

### เทคโนโลยีที่ใช้

| ส่วน | เทคโนโลยี |
|------|-----------|
| ภาษา | HTML / CSS / JS แบบ Vanilla — ไม่มี framework ไม่มี build step |
| จัดเก็บข้อมูล | `localStorage` |
| PWA | Web App Manifest + Service Worker (`sw.js`) |
| อัตราแลกเปลี่ยน | [exchangerate-api.com](https://www.exchangerate-api.com) (แคชทุก 1 ชั่วโมง) |
| ย่อ URL | [is.gd](https://is.gd) (ไม่บังคับ ไม่ต้องสมัคร) |
| ส่งออก PNG | [html2canvas 1.4.1](https://html2canvas.hertzen.com) ผ่าน cdnjs (โหลดเมื่อต้องใช้) |
| ฟอนต์ | DM Sans ผ่าน Google Fonts |
