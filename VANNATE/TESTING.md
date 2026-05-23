# VANNATE Testing Guide

## Prerequisites

- Node.js 18.x or newer
- NPM or Yarn
- Modern web browser (Chrome, Firefox, Edge recommended)

---

## Getting Started

### Step 1: Clone the Repository
```bash
git clone https://github.com/soumoditt-source/VANNATE_V1_HACKARENA.git
cd VANNATE_V1_HACKARENA
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```
OR
```bash
npm run launch
```

The app will be available at **http://localhost:3000** (or next available port if 3000 is in use).

---

## End-to-End Testing Flow

### 1. Home Page Test
- Open http://localhost:3000
- Verify hero section loads
- Check navigation menu works
- Verify falling icons physics animation

### 2. Verification Flow Test (Most Important!)

#### Step 2.1: Open Verify Page
Go to **http://localhost:3000/verify**

#### Step 2.2: Test Camera Capture
1. Click **"Start Camera"**
2. Grant camera permission if prompted
3. Verify live camera feed appears
4. Click **"Capture Photo"**
5. Verify processing starts
6. Verify step is marked complete with:
   - Photo preview
   - Timestamp
   - Location (if GPS enabled)
   - Currency detected
   - OCR extracted text
7. Click **"🔄 Retake Photo"** to test retake functionality
8. Click **"Next Step →"**

#### Step 2.3: Test Upload Capture (No Camera Needed)
1. Click **"Upload Photo"**
2. Select any image file from your computer
3. Verify processing starts
4. Verify all verification details appear

#### Step 2.4: Complete All 4 Steps
1. Step 1: Donor Initiates
2. Step 2: Volunteer Receives
3. Step 3: NGO Hub Verification
4. Step 4: Beneficiary Confirms

After all 4 steps:
- Verify "🎉 Verification Complete!" banner appears
- Verify total verified amount counter
- Click "Start New Verification" to reset

### 3. AI Copilot Test
- Go to **http://localhost:3000/copilot**
- Type a question in the chat
- Verify AI responds
- Test voice input (if available)
- Test voice output (TTS)

### 4. Blood Bank Test
- Go to **http://localhost:3000/blood**
- Verify blood bank dashboard loads
- Check donor alerts panel

### 5. Crisis Response Test
- Go to **http://localhost:3000/crisis**
- Verify crisis map loads
- Check incident feed

### 6. NGO CRM Test
- Go to **http://localhost:3000/crm**
- Verify CRM dashboard loads
- Test navigation between tabs (Overview, Donors, Campaigns)

### 7. News Feed Test
- Go to **http://localhost:3000/news**
- Verify live news feed loads

### 8. Community Test
- Go to **http://localhost:3000/community**
- Verify community feed loads

---

## API Testing

### Test Upload API
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/your/image.jpg"
```

### Test Analyze API
```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "file=@/path/to/your/image.jpg"
```

### Test AI API
```bash
curl -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -d '{"query":"Hello Vannate!"}'
```

---

## Troubleshooting

### Issue: Camera Permission Denied
**Fix:**
1. Click the 🔒 Lock icon in browser address bar
2. Find "Camera" permissions
3. Select "Allow"
4. Refresh the page

### Issue: GPS Location Not Working
**Fix:**
1. Click the 🔒 Lock icon in browser address bar
2. Find "Location" permissions
3. Select "Allow"
4. Refresh the page

### Issue: Port 3000 Already In Use
**Fix:** The `npm run launch` script will automatically use the next available port (usually 3001).

### Issue: Stale Cache
**Fix:** Do a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)

---

## Team Information

- **Soumoditya Das** - Lead Developer & Visionary
- **Sounak Kumar Mondal** - Full-Stack Developer (Shinobi)

---

## Build for Production

```bash
npm run build
```

Production-ready files will be in the `.next` folder.

---

*Built for Humanity. Powered by AI.*
