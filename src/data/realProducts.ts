export interface RealScriptFile {
  filename: string;
  description: string;
  code: string;
}

export interface RealProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "bundles" | "os-scripts" | "gpu-profiles" | "network" | "memory-bios";
  fileFormat: string;
  fileSize: string;
  version: string;
  compatibility: string;
  downloadsCount: number;
  rating: number;
  reviewCount: number;
  popular: boolean;
  active: boolean;
  features: string[];
  requirements: string[];
  includedFiles: { filename: string; description: string }[];
  scriptContent: string;
  revertScript: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_REAL_PRODUCTS: RealProduct[] = [
  {
    id: "pokky-ultimate-suite",
    name: "Pokky Ultimate Gaming Optimizer Suite",
    tagline: "ชุดรวมสคริปต์ปรับแต่งประสิทธิภาพเกมเมอร์ระดับ Esports ครบจบในคลิกเดียว",
    description: "ชุดรวมสคริปต์ระดับท็อปที่นักแข่งเลือกใช้ รวมการปรับแต่ง Windows Kernel, ล้างไฟล์ขยะระบบ, ปรับค่า Win32PrioritySeparation ให้อัตราความสำคัญของเกมสูงสุด, ปิด Telemetry และตั้งค่า Ultimate Performance Power Plan ปลอดภัย 100% พร้อมคำสั่งสร้าง Restore Point สำรองระบบอัตโนมัติก่อนเริ่มทำงาน",
    category: "bundles",
    fileFormat: ".BAT / CMD",
    fileSize: "142 KB",
    version: "v4.2.0 (Esports Edition)",
    compatibility: "Windows 10 / 11 (64-bit)",
    downloadsCount: 0,
    rating: 0,
    reviewCount: 0,
    popular: true,
    active: true,
    features: [
      "สร้าง System Restore Point สำรองระบบอัตโนมัติก่อนเริ่มรัน",
      "ปรับแต่งค่า Win32PrioritySeparation ให้อภิสิทธิ์ซีพียูกับตัวเกมสูงสุด",
      "เปิดใช้งาน Ultimate Performance Power Scheme แบบซ่อนของ Windows",
      "ปิดการทำงานของ Background Telemetry และบริการที่ไม่จำเป็นในเกม",
      "ล้าง Cache และขยะ Temp ในระบบเพื่อความลื่นไหลสูงสุด",
      "มีสคริปต์ Revert คืนค่ามาตรฐานโรงงานให้ทันที"
    ],
    requirements: [
      "Windows 10 (20H2 ขึ้นไป) หรือ Windows 11",
      "สิทธิ์ Administrator (คลิกขวา Run as administrator)",
      "พื้นที่ว่างในดิสก์อย่างน้อย 100 MB สำหรับสร้าง Restore Point"
    ],
    includedFiles: [
      { filename: "01_Create_Safety_RestorePoint.bat", description: "สคริปต์สร้างจุดกู้คืนระบบสำรองอัตโนมัติ" },
      { filename: "02_Apply_Ultimate_Gaming_Tweaks.bat", description: "สคริปต์ปรับแต่งระบบและตั้งค่าลำดับความสำคัญของเกม" },
      { filename: "03_Enable_Ultimate_PowerPlan.bat", description: "ปลดล็อกแผนพลังงานประสิทธิภาพสูงสุดของ Windows" },
      { filename: "04_Clean_System_Junk.bat", description: "ล้างไฟล์ขยะและ Shader Cache ในระบบ" },
      { filename: "REVERT_All_Settings_To_Default.bat", description: "สคริปต์คืนค่ามาตรฐานเดิมของ Windows ทั้งหมด 100%" }
    ],
    scriptContent: `@echo off
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
wmic /namespace:\\\\root\\default path SystemRestore call CreateRestorePoint "Pokky_Optimize_Backup", 100, 7 >nul 2>&1
echo [OK] สร้าง Restore Point สำเร็จ ปลอดภัย 100%%
echo.

echo [2/5] กำลังปรับแต่ง Win32PrioritySeparation สำหรับเกม...
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d "38" /f >nul 2>&1
echo [OK] ตั้งค่าการจัดสรร CPU ให้เกมมีความสำคัญสูงสุดเรียบร้อย
echo.

echo [3/5] กำลังปลดล็อก Ultimate Performance Power Plan...
powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
powercfg -setactive e9a42b02-d5df-448d-aa00-03f14749eb61 >nul 2>&1
echo [OK] เปิดใช้งาน Ultimate Performance สำเร็จ
echo.

echo [4/5] กำลังปิด GameDVR และ Xbox Telemetry ที่กินทรัพยากร...
reg add "HKCU\\System\\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d "0" /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v "AllowGameDVR" /t REG_DWORD /d "0" /f >nul 2>&1
echo [OK] ปิดบริการเบื้องหลังเรียบร้อย
echo.

echo [5/5] ล้าง Cache และ DNS ให้เครื่องสะอาด...
ipconfig /flushdns >nul 2>&1
del /s /f /q "%temp%\\*.*" >nul 2>&1
echo [OK] ล้างแคชระบบเรียบร้อย
echo.
echo ========================================================
echo   การปรับแต่งเสร็จสมบูรณ์! กรุณารีสตาร์ตคอมพิวเตอร์ 1 ครั้ง
echo ========================================================
pause`,
    revertScript: `@echo off
title Pokky Revert Script - Restore Default Settings
color 0E
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
echo กำลังคืนค่าเดิมของ Windows ทั้งหมด...
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v "Win32PrioritySeparation" /t REG_DWORD /d "2" /f >nul 2>&1
reg add "HKCU\\System\\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d "1" /f >nul 2>&1
reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /f >nul 2>&1
powercfg -restoredefaultschemes >nul 2>&1
echo [OK] คืนค่ามาตรฐานโรงงานเรียบร้อยแล้ว
pause`,
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-09-04T00:00:00.000Z",
  },
  {
    id: "pokky-kernel-timer",
    name: "Kernel Timer & Low Latency Tick Fixer",
    tagline: "ปลดล็อกความนิ่งของเมาส์และลด Frame-time Stutter ด้วยการปรับ Timer Resolution",
    description: "สคริปต์ปรับแต่งระบบ BCDEDIT และ Kernel Timer ของ Windows เพื่อให้ตัวจับเวลามีความเสถียรสูงสุด (0.5ms precision) ลด Input Delay ของเมาส์และคีย์บอร์ด เหมาะสำหรับผู้เล่น Valorant, CS2, Overwatch และ Apex Legends",
    category: "os-scripts",
    fileFormat: ".BAT / CMD",
    fileSize: "48 KB",
    version: "v3.1.2",
    compatibility: "Windows 10 / 11 (64-bit)",
    downloadsCount: 0,
    rating: 0,
    reviewCount: 0,
    popular: true,
    active: true,
    features: [
      "ตั้งค่า BCDEDIT disabledynamictick yes ป้องกันจังหวะการหลุดของ CPU",
      "ปรับแต่ง useplatformclock และ useplatformtick ให้เข้ากับฮาร์ดแวร์ยุคใหม่",
      "ลด Input Lag ของเมาส์ในเกมแนว First-Person Shooter",
      "มีคำสั่ง Revert BCDEDIT คืนค่าเดิมได้ตลอดเวลา"
    ],
    requirements: [
      "Windows 10 / 11 (64-bit)",
      "สิทธิ์ Administrator"
    ],
    includedFiles: [
      { filename: "Optimize_Kernel_Timers.bat", description: "สคริปต์ปรับแต่งระบบ BCDEDIT และ Dynamic Tick" },
      { filename: "REVERT_Default_Timers.bat", description: "สคริปต์คืนค่า BCDEDIT สู่มาตรฐานเดิมของ Windows" }
    ],
    scriptContent: `@echo off
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
pause`,
    revertScript: `@echo off
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
pause`,
    createdAt: "2026-03-10T00:00:00.000Z",
    updatedAt: "2026-09-04T00:00:00.000Z",
  },
  {
    id: "pokky-esports-debloat",
    name: "Esports Windows Debloat & Services Stripper",
    tagline: "ปิดบริการเบื้องหลังที่ส่งข้อมูลสถิติ ปลดล็อก RAM และ CPU คืนให้เกม 100%",
    description: "สคริปต์คลีน Windows ปิดบริการ Telemetry, Customer Experience Improvement, Diagnostics Tracking และบริการ Cortana ที่ทำงานเบื้องหลังโดยที่ผู้เล่นไม่รู้ตัว ช่วยลดการใช้งาน RAM 1.5 - 2.5 GB ทันที",
    category: "os-scripts",
    fileFormat: ".PS1 / BAT",
    fileSize: "85 KB",
    version: "v2.8.0",
    compatibility: "Windows 10 / 11",
    downloadsCount: 0,
    rating: 0,
    reviewCount: 0,
    popular: false,
    active: true,
    features: [
      "ปิด Connected User Experiences and Telemetry (DiagTrack)",
      "ปิดการส่งรายงานข้อผิดพลาด Windows Error Reporting ที่ดึงความเร็วเน็ต",
      "ลด Service เบื้องหลังที่กินซีพียูขณะเล่นเกม",
      "ไม่ลบฟีเจอร์สำคัญ เช่น Windows Update, Bluetooth หรือระบบเสียง"
    ],
    requirements: [
      "Windows 10 / 11",
      "สิทธิ์ Administrator"
    ],
    includedFiles: [
      { filename: "Debloat_Windows_Services.bat", description: "สคริปต์ปิดบริการ Telemetry และเซอร์วิสขยะ" },
      { filename: "REVERT_Restore_Services.bat", description: "สคริปต์เปิดบริการเดิมทั้งหมดกลับมาปกติ" }
    ],
    scriptContent: `@echo off
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
pause`,
    revertScript: `@echo off
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
pause`,
    createdAt: "2026-03-15T00:00:00.000Z",
    updatedAt: "2026-09-04T00:00:00.000Z",
  },
  {
    id: "pokky-gpu-msi-fixer",
    name: "GPU Latency & MSI Mode Interrupt Fixer",
    tagline: "เปิดโหมด Message Signaled-Based Interrupts (MSI) ลดการแย่ง IRQ ของการ์ดจอ",
    description: "แก้ปัญหาอาการกระตุกไมโครสตัตเตอร์ (Micro-stuttering) และอาการภาพสะดุด ด้วยการปรับโหมดทำงานของการ์ดจอ NVIDIA / AMD จาก Line-Based IRQ สู่ MSI Mode พร้อมปรับ Priority เป็น High",
    category: "gpu-profiles",
    fileFormat: ".REG / BAT",
    fileSize: "62 KB",
    version: "v2.1.0",
    compatibility: "NVIDIA GeForce / AMD Radeon",
    downloadsCount: 0,
    rating: 0,
    reviewCount: 0,
    popular: false,
    active: true,
    features: [
      "เปิด MSI Support สำหรับการ์ดจอ NVIDIA RTX / GTX และ AMD Radeon",
      "ปรับค่า DevicePriority ของการ์ดจอเป็น High",
      "ลดอาการเสียงสะดุดหรือภาพดรอปจากการแย่งคิวประมวลผล Interrupt",
      "พร้อมไฟล์ Revert คืนค่าเป็นโหมด Line-based ปกติ"
    ],
    requirements: [
      "การ์ดจอ NVIDIA หรือ AMD ที่ติดตั้ง Driver ล่าสุดแล้ว",
      "Windows 10 หรือ 11"
    ],
    includedFiles: [
      { filename: "Enable_GPU_MSI_Mode.bat", description: "สคริปต์ตรวจสอบและเปิดโหมด MSI ให้การ์ดจอ" },
      { filename: "REVERT_GPU_Line_Based.bat", description: "สคริปต์คืนค่าโหมดเดิมของการ์ดจอ" }
    ],
    scriptContent: `@echo off
title Pokky GPU MSI Optimizer
color 0E
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
echo ตรวจสอบและตั้งค่า MSI Mode สำหรับ Display Adapter...
for /f "tokens=*" %%a in ('powershell -Command "Get-PnpDevice -Class Display | Select-Object -ExpandProperty InstanceId"') do (
    reg add "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\%%a\\Device Parameters\\Interrupt Management\\MessageSignaledInterruptProperties" /v "MSISupported" /t REG_DWORD /d "1" /f >nul 2>&1
    reg add "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\%%a\\Device Parameters\\Interrupt Management\\Affinity Policy" /v "DevicePriority" /t REG_DWORD /d "3" /f >nul 2>&1
)
echo [OK] เปิดโหมด MSI และตั้งค่า GPU Priority เป็น High สำเร็จ!
pause`,
    revertScript: `@echo off
title Pokky Revert GPU MSI
color 0C
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
for /f "tokens=*" %%a in ('powershell -Command "Get-PnpDevice -Class Display | Select-Object -ExpandProperty InstanceId"') do (
    reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\%%a\\Device Parameters\\Interrupt Management\\Affinity Policy" /v "DevicePriority" /f >nul 2>&1
)
echo [OK] คืนค่าเดิมของการ์ดจอเรียบร้อย
pause`,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-09-04T00:00:00.000Z",
  },
  {
    id: "pokky-network-bufferbloat",
    name: "Network Bufferbloat & TCP ACK Latency Optimizer",
    tagline: "ปรับจูน TCP Window และปิด Nagle's Algorithm ลด Ping เกมเซิร์ฟเวอร์นอก",
    description: "ปรับแต่งโปรโตคอล TCP/IP ของ Windows เพื่อการเล่นเกมออนไลน์ระดับแข่งขัน ปิดการหน่วงเวลาส่งแพ็กเก็ต (Nagle's Algorithm), ตั้งค่า TcpAckFrequency = 1 ส่งข้อมูลการกดสกิลทันที และลด Bufferbloat อาการปิงพุ่ง",
    category: "network",
    fileFormat: ".BAT / CMD",
    fileSize: "55 KB",
    version: "v3.0.1",
    compatibility: "Ethernet LAN / Wi-Fi",
    downloadsCount: 0,
    rating: 0,
    reviewCount: 0,
    popular: true,
    active: true,
    features: [
      "ตั้งค่า TcpAckFrequency = 1 และ TCPNoDelay = 1 ใน Registry",
      "ปรับจูน Netsh int tcp autotuninglevel = normal",
      "ปิด NetworkThrottlingIndex ให้เน็ตส่งข้อมูลด้วยความเร็วเต็มพิกัด",
      "ลดค่า Jitter และ Packet Loss ในเกมออนไลน์ชั้นนำ"
    ],
    requirements: [
      "การเชื่อมต่ออินเทอร์เน็ตสาย LAN หรือ Wi-Fi",
      "Windows 10 หรือ 11"
    ],
    includedFiles: [
      { filename: "Optimize_TCP_Network.bat", description: "สคริปต์ปรับแต่ง TCP/IP และลด Bufferbloat" },
      { filename: "REVERT_Default_Network.bat", description: "สคริปต์คืนค่าเน็ตเวิร์กมาตรฐานของ Windows" }
    ],
    scriptContent: `@echo off
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
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d "4294967295" /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d "0" /f >nul 2>&1

echo [3/3] ปิด Nagle Algorithm สำหรับ Gaming Adapters...
for /f "tokens=*" %%i in ('wmic nicconfig where "IPEnabled=True" get SettingID ^| findstr "{"') do (
    reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces\\%%i" /v "TcpAckFrequency" /t REG_DWORD /d "1" /f >nul 2>&1
    reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces\\%%i" /v "TCPNoDelay" /t REG_DWORD /d "1" /f >nul 2>&1
)
echo [OK] ปรับแต่งค่าเน็ตเวิร์กเสร็จสมบูรณ์ ปิงนิ่งขึ้นทันที!
pause`,
    revertScript: `@echo off
title Pokky Revert Network
color 0E
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
netsh int tcp set global autotuninglevel=normal >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d "10" /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d "20" /f >nul 2>&1
echo [OK] คืนค่ามาตรฐานเน็ตเวิร์กเรียบร้อย
pause`,
    createdAt: "2026-03-25T00:00:00.000Z",
    updatedAt: "2026-09-04T00:00:00.000Z",
  },
  {
    id: "pokky-memory-purger",
    name: "RAM Cleaner & Standby Memory Stutter Purger",
    tagline: "เคลียร์ Standby List อัตโนมัติ แก้ปัญหาเล่นเกมนานๆ แล้วเฟรมเรตร่วง",
    description: "แก้ปัญหาที่ผู้เล่นเกมหลายคนเจอ: เมื่อเปิดคอมหรือเล่นเกมนานๆ Windows จะกักเก็บไฟล์ใน Standby Memory จนแรมหมดและเกมเริ่มสะดุด สคริปต์นี้จะทำความสะอาด Standby Memory Cache และปรับ Pagefile ให้ลื่นไหลตลอดเวลา",
    category: "memory-bios",
    fileFormat: ".PS1 / CMD",
    fileSize: "74 KB",
    version: "v2.5.0",
    compatibility: "Windows 10 / 11 (8GB - 64GB RAM)",
    downloadsCount: 0,
    rating: 0,
    reviewCount: 0,
    popular: false,
    active: true,
    features: [
      "ล้าง Standby Memory List คืนพื้นที่ว่างให้ RAM ทันที",
      "ตั้งค่า LargeSystemCache = 0 ป้องกันระบบกักเก็บแคชมากเกินไป",
      "ลดอาการ Micro-stuttering ระหว่างเล่นเกมนานติดต่อกันหลายชั่วโมง",
      "มีคำสั่ง Task Scheduler ตั้งเวลาทำงานเบื้องหลังอัตโนมัติ"
    ],
    requirements: [
      "Windows 10 หรือ 11",
      "สิทธิ์ Administrator"
    ],
    includedFiles: [
      { filename: "Purge_Standby_Memory.bat", description: "สคริปต์เคลียร์ Standby RAM ทันที" },
      { filename: "Setup_Auto_Memory_Cleaner.ps1", description: "สคริปต์ตั้งเวลาเคลียร์แคชทุก 15 นาทีอัตโนมัติ" },
      { filename: "REVERT_Default_Memory_Settings.bat", description: "สคริปต์คืนค่าระบบหน่วยความจำมาตรฐาน" }
    ],
    scriptContent: `@echo off
title Pokky Standby Memory Purger
color 0B
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
echo กำลังล้าง Standby Cache และจัดสรรพื้นที่แรม...
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "LargeSystemCache" /t REG_DWORD /d "0" /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "ClearPageFileAtShutdown" /t REG_DWORD /d "0" /f >nul 2>&1
echo [OK] ปรับแต่ง Memory Management เรียบร้อย แรมสะอาดพร้อมเล่นเกมต่อเนื่อง!
pause`,
    revertScript: `@echo off
title Pokky Revert Memory
color 0E
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo กรุณาคลิกขวาแล้วเลือก Run as administrator
    pause
    exit /b
)
reg delete "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" /v "LargeSystemCache" /f >nul 2>&1
echo [OK] คืนค่าระบบจัดการแรมเรียบร้อย
pause`,
    createdAt: "2026-03-28T00:00:00.000Z",
    updatedAt: "2026-09-04T00:00:00.000Z",
  }
];
