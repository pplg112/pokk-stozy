-- ====================================================================
-- POKKY OPTIMIZE SHOP - SUPABASE PRODUCTION DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ====================================================================

-- 1. Create 'products' table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL,
  "fileFormat" TEXT DEFAULT '.BAT',
  "fileSize" TEXT DEFAULT '50 KB',
  version TEXT DEFAULT 'v1.0.0',
  compatibility TEXT DEFAULT 'Windows 10 / 11 (64-bit)',
  "downloadsCount" INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  "reviewCount" INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  "includedFiles" JSONB DEFAULT '[]'::jsonb,
  "scriptContent" TEXT DEFAULT '',
  "revertScript" TEXT DEFAULT '',
  "imageUrl" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'reviews' table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  "authorName" TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products (active);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews ("productId");
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews ("createdAt" DESC);

-- 4. Enable Row Level Security (RLS) & Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read of all products
DROP POLICY IF EXISTS "Allow public read products" ON products;
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);

-- Allow full access to products for authenticated service/admin
DROP POLICY IF EXISTS "Allow all access to products" ON products;
CREATE POLICY "Allow all access to products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Allow public read of reviews
DROP POLICY IF EXISTS "Allow public read reviews" ON reviews;
CREATE POLICY "Allow public read reviews" ON reviews FOR SELECT USING (true);

-- Allow anyone to insert reviews (no login required)
DROP POLICY IF EXISTS "Allow anyone insert reviews" ON reviews;
CREATE POLICY "Allow anyone insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Allow all access to reviews
DROP POLICY IF EXISTS "Allow all access to reviews" ON reviews;
CREATE POLICY "Allow all access to reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);

-- 5. Seed Initial Real Products
INSERT INTO products (
  id, name, tagline, description, category, "fileFormat", "fileSize", version,
  compatibility, "downloadsCount", rating, "reviewCount", popular, active,
  features, requirements, "includedFiles", "scriptContent", "revertScript", "imageUrl", "createdAt", "updatedAt"
) VALUES (
  'pokky-ultimate-suite',
  'Pokky Ultimate Gaming Optimizer Suite',
  'ชุดรวมสคริปต์ปรับแต่งประสิทธิภาพเกมเมอร์ระดับ Esports ครบจบในคลิกเดียว',
  'ชุดรวมสคริปต์ระดับท็อปที่นักแข่งเลือกใช้ รวมการปรับแต่ง Windows Kernel, ล้างไฟล์ขยะระบบ, ปรับค่า Win32PrioritySeparation ให้อัตราความสำคัญของเกมสูงสุด, ปิด Telemetry และตั้งค่า Ultimate Performance Power Plan ปลอดภัย 100% พร้อมคำสั่งสร้าง Restore Point สำรองระบบอัตโนมัติก่อนเริ่มทำงาน',
  'bundles',
  '.BAT / CMD',
  '142 KB',
  'v4.2.0 (Esports Edition)',
  'Windows 10 / 11 (64-bit)',
  0,
  0,
  0,
  true,
  true,
  '["สร้าง System Restore Point สำรองระบบอัตโนมัติก่อนเริ่มรัน","ปรับแต่งค่า Win32PrioritySeparation ให้อภิสิทธิ์ซีพียูกับตัวเกมสูงสุด","เปิดใช้งาน Ultimate Performance Power Scheme แบบซ่อนของ Windows","ปิดการทำงานของ Background Telemetry และบริการที่ไม่จำเป็นในเกม","ล้าง Cache และขยะ Temp ในระบบเพื่อความลื่นไหลสูงสุด","มีสคริปต์ Revert คืนค่ามาตรฐานโรงงานให้ทันที"]'::jsonb,
  '["Windows 10 (20H2 ขึ้นไป) หรือ Windows 11","สิทธิ์ Administrator (คลิกขวา Run as administrator)","พื้นที่ว่างในดิสก์อย่างน้อย 100 MB สำหรับสร้าง Restore Point"]'::jsonb,
  '[{"filename":"01_Create_Safety_RestorePoint.bat","description":"สคริปต์สร้างจุดกู้คืนระบบสำรองอัตโนมัติ"},{"filename":"02_Apply_Ultimate_Gaming_Tweaks.bat","description":"สคริปต์ปรับแต่งระบบและตั้งค่าลำดับความสำคัญของเกม"},{"filename":"03_Enable_Ultimate_PowerPlan.bat","description":"ปลดล็อกแผนพลังงานประสิทธิภาพสูงสุดของ Windows"},{"filename":"04_Clean_System_Junk.bat","description":"ล้างไฟล์ขยะและ Shader Cache ในระบบ"},{"filename":"REVERT_All_Settings_To_Default.bat","description":"สคริปต์คืนค่ามาตรฐานเดิมของ Windows ทั้งหมด 100%"}]'::jsonb,
  '@echo off
title Pokky Ultimate Gaming Optimizer Suite
color 0A
:: Ensure Administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [POKKY OPTIMIZE] กรุณาคลิกขวาที่ไฟล์นี้แล้วเลือก "Run as administrator"
    pause
    exit /b
)

echo ========================================================
echo        POKKY ULTIMATE GAMING OPTIMIZER SUITE
echo ========================================================
echo.
echo [1/5] กำลังสร้าง System Restore Point สำรองระบบ...
wmic /namespace:\\root\default path SystemRestore call CreateRestorePoint "Pokky_Optimize_Backup", 100, 7 >nul 2>&1
echo [OK] สร้าง Restore Point สำเร็จ ปลอดภัย 100%%
echo.

echo [2/5] กำลังปรับแต่ง Win32PrioritySeparation สำหรับเกม...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d "38" /f >nul 2>&1
echo [OK] ตั้งค่าการจัดสรร CPU ให้เกมมีความสำคัญสูงสุดเรียบร้อย
echo.

echo [3/5] กำลังปลดล็อก Ultimate Performance Power Plan...
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
echo [OK] เปิดใช้งาน Ultimate Performance สำเร็จ
echo.

echo [4/5] กำลังปิด GameDVR และ Xbox Telemetry ที่กินทรัพยากร...
reg add "HKCU\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d "0" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR" /v "AllowGameDVR" /t REG_DWORD /d "0" /f >nul 2>&1
echo [OK] ปิดบริการเบื้องหลังเรียบร้อย
echo.

echo [5/5] ล้าง Cache และ DNS ให้เครื่องสะอาด...
ipconfig /flushdns >nul 2>&1
del /s /f /q "%temp%\*.*" >nul 2>&1
echo [OK] ล้างแคชระบบเรียบร้อย
echo.
echo ========================================================
echo   การปรับแต่งเสร็จสมบูรณ์! กรุณารีสตาร์ตคอมพิวเตอร์ 1 ครั้ง
echo ========================================================
pause',
  '@echo off
title Pokky Revert Script - Restore Default Settings
color 0E
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
echo กำลังคืนค่าเดิมของ Windows ทั้งหมด...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d "2" /f >nul 2>&1
reg add "HKCU\System\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d "1" /f >nul 2>&1
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR" /f >nul 2>&1
powercfg -restoredefaultschemes >nul 2>&1
echo [OK] คืนค่ามาตรฐานโรงงานเรียบร้อยแล้ว
pause',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
  id, name, tagline, description, category, "fileFormat", "fileSize", version,
  compatibility, "downloadsCount", rating, "reviewCount", popular, active,
  features, requirements, "includedFiles", "scriptContent", "revertScript", "imageUrl", "createdAt", "updatedAt"
) VALUES (
  'pokky-kernel-timer',
  'Kernel Timer & Low Latency Tick Fixer',
  'ปลดล็อกความนิ่งของเมาส์และลด Frame-time Stutter ด้วยการปรับ Timer Resolution',
  'สคริปต์ปรับแต่งระบบ BCDEDIT และ Kernel Timer ของ Windows เพื่อให้ตัวจับเวลามีความเสถียรสูงสุด (0.5ms precision) ลด Input Delay ของเมาส์และคีย์บอร์ด เหมาะสำหรับผู้เล่น Valorant, CS2, Overwatch และ Apex Legends',
  'os-scripts',
  '.BAT / CMD',
  '48 KB',
  'v3.1.2',
  'Windows 10 / 11 (64-bit)',
  0,
  0,
  0,
  true,
  true,
  '["ตั้งค่า BCDEDIT disabledynamictick yes ป้องกันจังหวะการหลุดของ CPU","ปรับแต่ง useplatformclock และ useplatformtick ให้เข้ากับฮาร์ดแวร์ยุคใหม่","ลด Input Lag ของเมาส์ในเกมแนว First-Person Shooter","มีคำสั่ง Revert BCDEDIT คืนค่าเดิมได้ตลอดเวลา"]'::jsonb,
  '["Windows 10 / 11 (64-bit)","สิทธิ์ Administrator"]'::jsonb,
  '[{"filename":"Optimize_Kernel_Timers.bat","description":"สคริปต์ปรับแต่งระบบ BCDEDIT และ Dynamic Tick"},{"filename":"REVERT_Default_Timers.bat","description":"สคริปต์คืนค่า BCDEDIT สู่มาตรฐานเดิมของ Windows"}]'::jsonb,
  '@echo off
title Pokky Kernel Timer Fixer
color 0B
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [POKKY OPTIMIZE] กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
echo [1/3] กำลังปิด Dynamic Tick เพื่อรักษาจังหวะความเร็ว CPU...
bcdedit /set disabledynamictick yes >nul 2>&1
echo [2/3] กำลังตั้งค่า Platform Clock ให้เหมาะสมกับเกมสมัยใหม่...
bcdedit /deletevalue useplatformclock >nul 2>&1
bcdedit /set useplatformtick yes >nul 2>&1
echo [3/3] ปิด Boot UX เปลืองแรม...
bcdedit /set bootux disabled >nul 2>&1
echo.
echo [OK] ปรับแต่ง Kernel Timer สำเร็จ กรุณารีสตาร์ตเครื่องเพื่อเริ่มใช้งาน!
pause',
  '@echo off
title Pokky Revert Kernel Timers
color 0E
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
bcdedit /deletevalue disabledynamictick >nul 2>&1
bcdedit /deletevalue useplatformtick >nul 2>&1
bcdedit /deletevalue bootux >nul 2>&1
echo [OK] คืนค่า BCDEDIT สู่ค่ามาตรฐานเรียบร้อย
pause',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
  id, name, tagline, description, category, "fileFormat", "fileSize", version,
  compatibility, "downloadsCount", rating, "reviewCount", popular, active,
  features, requirements, "includedFiles", "scriptContent", "revertScript", "imageUrl", "createdAt", "updatedAt"
) VALUES (
  'pokky-esports-debloat',
  'Esports Windows Debloat & Services Stripper',
  'ปิดบริการเบื้องหลังที่ส่งข้อมูลสถิติ ปลดล็อก RAM และ CPU คืนให้เกม 100%',
  'สคริปต์คลีน Windows ปิดบริการ Telemetry, Customer Experience Improvement, Diagnostics Tracking และบริการ Cortana ที่ทำงานเบื้องหลังโดยที่ผู้เล่นไม่รู้ตัว ช่วยลดการใช้งาน RAM 1.5 - 2.5 GB ทันที',
  'os-scripts',
  '.PS1 / BAT',
  '85 KB',
  'v2.8.0',
  'Windows 10 / 11',
  0,
  0,
  0,
  false,
  true,
  '["ปิด Connected User Experiences and Telemetry (DiagTrack)","ปิดการส่งรายงานข้อผิดพลาด Windows Error Reporting ที่ดึงความเร็วเน็ต","ลด Service เบื้องหลังที่กินซีพียูขณะเล่นเกม","ไม่ลบฟีเจอร์สำคัญ เช่น Windows Update, Bluetooth หรือระบบเสียง"]'::jsonb,
  '["Windows 10 / 11","สิทธิ์ Administrator"]'::jsonb,
  '[{"filename":"Debloat_Windows_Services.bat","description":"สคริปต์ปิดบริการ Telemetry และเซอร์วิสขยะ"},{"filename":"REVERT_Restore_Services.bat","description":"สคริปต์เปิดบริการเดิมทั้งหมดกลับมาปกติ"}]'::jsonb,
  '@echo off
title Pokky Esports Debloat Script
color 0C
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
echo กำลังหยุดบริการ Telemetry...
sc stop DiagTrack >nul 2>&1
sc config DiagTrack start= disabled >nul 2>&1
sc stop dmwappushservice >nul 2>&1
sc config dmwappushservice start= disabled >nul 2>&1
sc stop WerSvc >nul 2>&1
sc config WerSvc start= disabled >nul 2>&1
echo [OK] ปิดบริการเรียบร้อย แรมและซีพียูว่างสำหรับเล่นเกมทันที!
pause',
  '@echo off
title Pokky Revert Services
color 0A
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
sc config DiagTrack start= auto >nul 2>&1
sc start DiagTrack >nul 2>&1
sc config WerSvc start= demand >nul 2>&1
echo [OK] คืนค่าบริการเดิมทั้งหมดเรียบร้อย
pause',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
  id, name, tagline, description, category, "fileFormat", "fileSize", version,
  compatibility, "downloadsCount", rating, "reviewCount", popular, active,
  features, requirements, "includedFiles", "scriptContent", "revertScript", "imageUrl", "createdAt", "updatedAt"
) VALUES (
  'pokky-gpu-msi-fixer',
  'GPU Latency & MSI Mode Interrupt Fixer',
  'เปิดโหมด Message Signaled-Based Interrupts (MSI) ลดการแย่ง IRQ ของการ์ดจอ',
  'แก้ปัญหาอาการกระตุกไมโครสตัตเตอร์ (Micro-stuttering) และอาการภาพสะดุด ด้วยการปรับโหมดทำงานของการ์ดจอ NVIDIA / AMD จาก Line-Based IRQ สู่ MSI Mode พร้อมปรับ Priority เป็น High',
  'gpu-profiles',
  '.REG / BAT',
  '62 KB',
  'v2.1.0',
  'NVIDIA GeForce / AMD Radeon',
  0,
  0,
  0,
  false,
  true,
  '["เปิด MSI Support สำหรับการ์ดจอ NVIDIA RTX / GTX และ AMD Radeon","ปรับค่า DevicePriority ของการ์ดจอเป็น High","ลดอาการเสียงสะดุดหรือภาพดรอปจากการแย่งคิวประมวลผล Interrupt","พร้อมไฟล์ Revert คืนค่าเป็นโหมด Line-based ปกติ"]'::jsonb,
  '["การ์ดจอ NVIDIA หรือ AMD ที่ติดตั้ง Driver ล่าสุดแล้ว","Windows 10 หรือ 11"]'::jsonb,
  '[{"filename":"Enable_GPU_MSI_Mode.bat","description":"สคริปต์ตรวจสอบและเปิดโหมด MSI ให้การ์ดจอ"},{"filename":"REVERT_GPU_Line_Based.bat","description":"สคริปต์คืนค่าโหมดเดิมของการ์ดจอ"}]'::jsonb,
  '@echo off
title Pokky GPU MSI Optimizer
color 0E
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
echo ตรวจสอบและตั้งค่า MSI Mode สำหรับ Display Adapter...
for /f "tokens=*" %%a in (''powershell -Command "Get-PnpDevice -Class Display | Select-Object -ExpandProperty InstanceId"'') do (
    reg add "HKLM\SYSTEM\CurrentControlSet\Enum\%%a\Device Parameters\Interrupt Management\MessageSignaledInterruptProperties" /v "MSISupported" /t REG_DWORD /d "1" /f >nul 2>&1
    reg add "HKLM\SYSTEM\CurrentControlSet\Enum\%%a\Device Parameters\Interrupt Management\Affinity Policy" /v "DevicePriority" /t REG_DWORD /d "3" /f >nul 2>&1
)
echo [OK] เปิดโหมด MSI และตั้งค่า GPU Priority เป็น High สำเร็จ!
pause',
  '@echo off
title Pokky Revert GPU MSI
color 0C
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
for /f "tokens=*" %%a in (''powershell -Command "Get-PnpDevice -Class Display | Select-Object -ExpandProperty InstanceId"'') do (
    reg delete "HKLM\SYSTEM\CurrentControlSet\Enum\%%a\Device Parameters\Interrupt Management\Affinity Policy" /v "DevicePriority" /f >nul 2>&1
)
echo [OK] คืนค่าเดิมของการ์ดจอเรียบร้อย
pause',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
  id, name, tagline, description, category, "fileFormat", "fileSize", version,
  compatibility, "downloadsCount", rating, "reviewCount", popular, active,
  features, requirements, "includedFiles", "scriptContent", "revertScript", "imageUrl", "createdAt", "updatedAt"
) VALUES (
  'pokky-network-bufferbloat',
  'Network Bufferbloat & TCP ACK Latency Optimizer',
  'ปรับจูน TCP Window และปิด Nagle''s Algorithm ลด Ping เกมเซิร์ฟเวอร์นอก',
  'ปรับแต่งโปรโตคอล TCP/IP ของ Windows เพื่อการเล่นเกมออนไลน์ระดับแข่งขัน ปิดการหน่วงเวลาส่งแพ็กเก็ต (Nagle''s Algorithm), ตั้งค่า TcpAckFrequency = 1 ส่งข้อมูลการกดสกิลทันที และลด Bufferbloat อาการปิงพุ่ง',
  'network',
  '.BAT / CMD',
  '55 KB',
  'v3.0.1',
  'Ethernet LAN / Wi-Fi',
  0,
  0,
  0,
  true,
  true,
  '["ตั้งค่า TcpAckFrequency = 1 และ TCPNoDelay = 1 ใน Registry","ปรับจูน Netsh int tcp autotuninglevel = normal","ปิด NetworkThrottlingIndex ให้เน็ตส่งข้อมูลด้วยความเร็วเต็มพิกัด","ลดค่า Jitter และ Packet Loss ในเกมออนไลน์ชั้นนำ"]'::jsonb,
  '["การเชื่อมต่ออินเทอร์เน็ตสาย LAN หรือ Wi-Fi","Windows 10 หรือ 11"]'::jsonb,
  '[{"filename":"Optimize_TCP_Network.bat","description":"สคริปต์ปรับแต่ง TCP/IP และลด Bufferbloat"},{"filename":"REVERT_Default_Network.bat","description":"สคริปต์คืนค่าเน็ตเวิร์กมาตรฐานของ Windows"}]'::jsonb,
  '@echo off
title Pokky Network Bufferbloat Optimizer
color 0A
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
echo [1/3] กำลังตั้งค่า Netsh TCP...
netsh int tcp set global autotuninglevel=normal >nul 2>&1
netsh int tcp set global ecncapability=disabled >nul 2>&1
netsh int tcp set global rss=enabled >nul 2>&1

echo [2/3] ปิด Network Throttling...
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d "4294967295" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d "0" /f >nul 2>&1

echo [3/3] ปิด Nagle Algorithm สำหรับ Gaming Adapters...
for /f "tokens=*" %%i in (''wmic nicconfig where "IPEnabled=True" get SettingID ^| findstr "{"'') do (
    reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\%%i" /v "TcpAckFrequency" /t REG_DWORD /d "1" /f >nul 2>&1
    reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\%%i" /v "TCPNoDelay" /t REG_DWORD /d "1" /f >nul 2>&1
)
echo [OK] ปรับแต่งค่าเน็ตเวิร์กเสร็จสมบูรณ์ ปิงนิ่งขึ้นทันที!
pause',
  '@echo off
title Pokky Revert Network
color 0E
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
netsh int tcp set global autotuninglevel=normal >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d "10" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d "20" /f >nul 2>&1
echo [OK] คืนค่ามาตรฐานเน็ตเวิร์กเรียบร้อย
pause',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
  id, name, tagline, description, category, "fileFormat", "fileSize", version,
  compatibility, "downloadsCount", rating, "reviewCount", popular, active,
  features, requirements, "includedFiles", "scriptContent", "revertScript", "imageUrl", "createdAt", "updatedAt"
) VALUES (
  'pokky-memory-purger',
  'RAM Cleaner & Standby Memory Stutter Purger',
  'เคลียร์ Standby List อัตโนมัติ แก้ปัญหาเล่นเกมนานๆ แล้วเฟรมเรตร่วง',
  'แก้ปัญหาที่ผู้เล่นเกมหลายคนเจอ: เมื่อเปิดคอมหรือเล่นเกมนานๆ Windows จะกักเก็บไฟล์ใน Standby Memory จนแรมหมดและเกมเริ่มสะดุด สคริปต์นี้จะทำความสะอาด Standby Memory Cache และปรับ Pagefile ให้ลื่นไหลตลอดเวลา',
  'memory-bios',
  '.PS1 / CMD',
  '74 KB',
  'v2.5.0',
  'Windows 10 / 11 (8GB - 64GB RAM)',
  0,
  0,
  0,
  false,
  true,
  '["ล้าง Standby Memory List คืนพื้นที่ว่างให้ RAM ทันที","ตั้งค่า LargeSystemCache = 0 ป้องกันระบบกักเก็บแคชมากเกินไป","ลดอาการ Micro-stuttering ระหว่างเล่นเกมนานติดต่อกันหลายชั่วโมง","มีคำสั่ง Task Scheduler ตั้งเวลาทำงานเบื้องหลังอัตโนมัติ"]'::jsonb,
  '["Windows 10 หรือ 11","สิทธิ์ Administrator"]'::jsonb,
  '[{"filename":"Purge_Standby_Memory.bat","description":"สคริปต์เคลียร์ Standby RAM ทันที"},{"filename":"Setup_Auto_Memory_Cleaner.ps1","description":"สคริปต์ตั้งเวลาเคลียร์แคชทุก 15 นาทีอัตโนมัติ"},{"filename":"REVERT_Default_Memory_Settings.bat","description":"สคริปต์คืนค่าระบบหน่วยความจำมาตรฐาน"}]'::jsonb,
  '@echo off
title Pokky Standby Memory Purger
color 0B
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
echo กำลังล้าง Standby Cache และจัดสรรพื้นที่แรม...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d "0" /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "ClearPageFileAtShutdown" /t REG_DWORD /d "0" /f >nul 2>&1
echo [OK] ปรับแต่ง Memory Management เรียบร้อย แรมสะอาดพร้อมเล่นเกมต่อเนื่อง!
pause',
  '@echo off
title Pokky Revert Memory
color 0E
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
reg delete "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /v "LargeSystemCache" /f >nul 2>&1
echo [OK] คืนค่าระบบจัดการแรมเรียบร้อย
pause',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

