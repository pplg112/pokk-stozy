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
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_REAL_PRODUCTS: RealProduct[] = [
  {
    "id": "pokky-1788529027101",
    "name": "Pokky Low Latency",
    "tagline": "สคริปต์ปรับแต่ง Windows เพื่อลด Input Lag เพิ่มความลื่นไหล และเสถียรภาพสูงสุดสำหรับเกมเมอร์สายอีสปอร์ต",
    "description": "Pokky Low Latency เป็นชุดสคริปต์ปรับแต่งระบบปฏิบัติการ Windows 10 และ 11 แบบครบวงจรสำหรับเกมเมอร์ระดับแข่งขัน (Esports) สคริปต์นี้ถูกออกแบบมาเพื่อลดความหน่วง (Latency) ของอุปกรณ์อินพุต เช่น เมาส์และคีย์บอร์ด ปรับแต่งระบบ Multimedia Class Scheduler Service (MMCSS) และ Games profile เพื่อจัดสรรทรัพยากร CPU และ GPU ให้กับเกมที่คุณเล่นโดยเฉพาะ พร้อมทั้งปิดการใช้งาน Background Apps และ Game DVR ที่ไม่จำเป็นเพื่อหยุดอาการหน่วงกระตุก (Micro-stuttering) รวมถึงการปรับแต่งเครือข่าย TCP/IP เพื่อลดค่า Ping และเพิ่มความเสถียรในการเชื่อมต่อ มาพร้อมระบบสำรองข้อมูลรีจิสทรีอัตโนมัติ (Backup) และฟังก์ชันเรียกคืนค่าเดิม (Restore) ได้อย่างปลอดภัย",
    "category": "os-scripts",
    "fileFormat": ".CMD",
    "fileSize": "7 KB",
    "version": "v1.0.0",
    "compatibility": "Windows 10 / 11 (64-bit ทุกเวอร์ชัน)",
    "downloadsCount": 16,
    "rating": 5,
    "reviewCount": 1,
    "popular": true,
    "active": true,
    "features": [
      "ปรับแต่ง Mouse Response & ตัด Mouse Acceleration ออก 100% ให้ลากเป้าได้แม่นยำดั่งใจ",
      "ปรับ Keyboard Delay = 0 และ Keyboard Speed = 31 ตอบสนองการกดปุ่มสกิลทันที",
      "ปรับ MMCSS ปิด NetworkThrottlingIndex เพื่อไม่ให้เน็ตกระตุกขณะเล่นเกม",
      "ปรับ Games Profile ให้ GPU Priority = 8 และ Priority = High สำหรับประมวลผลเกม",
      "ปรับ Win32PrioritySeparation = 38 (สูตรลับ eSports เพิ่มความนิ่งของ FPS และลด Stutter)",
      "ปิด Background Apps และ Game DVR/AppCapture ที่แอบสูบสเปกเครื่องเบื้องหลัง",
      "ปรับแต่ง TCP Network เปิด RSS (Receive Side Scaling) ให้ส่ง Packet เกมเร็วขึ้น",
      "ระบบความปลอดภัย Auto-Backup รีจิสทรีอัตโนมัติลงโฟลเดอร์ Pokky_Backup กู้คืนได้ 100%"
    ],
    "requirements": [
      "Windows 10 หรือ Windows 11 (64-bit ทุกรุ่น)",
      "สิทธิ์ Administrator (คลิกขวาเลือก Run as Administrator)",
      "รีสตาร์ตเครื่องคอมพิวเตอร์ 1 ครั้งหลังรันสคริปต์เพื่อใช้งานค่าใหม่"
    ],
    "includedFiles": [
      {
        "filename": "Pokky_Booster_Low_Latency.cmd",
        "description": "สคริปต์ปรับแต่ง Low Latency หลัก (Interactive Command Tool พร้อมเมนูปรับแต่ง 8 ขั้นตอน & ระบบ Auto-Backup)"
      },
      {
        "filename": "Pokky_Booster_Revert.bat",
        "description": "สคริปต์เรียกคืนค่าเดิมของ Windows และกู้คืน Registry ทั้งหมดกลับสู่ค่ามาตรฐาน (Restore Default)"
      }
    ],
    "scriptContent": "@echo off\nsetlocal\ncd /d \"%~dp0\"\n\n:: 1. Check Admin using fsutil (Custom OS friendly)\nfsutil dirty query %systemdrive% >nul 2>&1\nif %errorlevel% equ 0 goto GOTADMIN\n\n:: 2. If not admin, elevate via temporary VBScript (No PowerShell dependency)\necho Requesting Administrative Privileges...\necho Set UAC = CreateObject^(\"Shell.Application\"^) > \"%temp%\\elevate.vbs\"\necho UAC.ShellExecute \"%~s0\", \"\", \"\", \"runas\", 1 >> \"%temp%\\elevate.vbs\"\n\"%temp%\\elevate.vbs\"\ndel \"%temp%\\elevate.vbs\" >nul 2>&1\nexit /b\n\n:GOTADMIN\ntitle Pokky Booster - Windows 11 Low Latency\ncolor 0A\n\n:MENU\ncls\necho ==========================================================\necho              POKKY BOOSTER - LOW LATENCY\necho                    Windows 10 - 11\necho ==========================================================\necho.\necho  [1] Apply Low Latency Tweaks\necho  [2] Restore Backup\necho  [3] Show Current TCP Settings\necho  [4] Exit\necho.\nchoice /c 1234 /n /m \"Select [1-4]: \"\nif errorlevel 4 exit /b 0\nif errorlevel 3 goto SHOWTCP\nif errorlevel 2 goto RESTORE\nif errorlevel 1 goto APPLY\n\n:APPLY\ncls\necho ==========================================================\necho              APPLYING POKKY LOW LATENCY\necho ==========================================================\necho.\n\nif not exist \"%~dp0Pokky_Backup\" mkdir \"%~dp0Pokky_Backup\" >nul 2>&1\n\nreg export \"HKCU\\Control Panel\\Mouse\" \"%~dp0Pokky_Backup\\Mouse.reg\" /y >nul 2>&1\nreg export \"HKCU\\Control Panel\\Keyboard\" \"%~dp0Pokky_Backup\\Keyboard.reg\" /y >nul 2>&1\nreg export \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" \"%~dp0Pokky_Backup\\SystemProfile.reg\" /y >nul 2>&1\nreg export \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" \"%~dp0Pokky_Backup\\PriorityControl.reg\" /y >nul 2>&1\nreg export \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" \"%~dp0Pokky_Backup\\MemoryManagement.reg\" /y >nul 2>&1\nreg export \"HKCU\\System\\GameConfigStore\" \"%~dp0Pokky_Backup\\GameConfigStore.reg\" /y >nul 2>&1\nreg export \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR\" \"%~dp0Pokky_Backup\\GameDVR.reg\" /y >nul 2>&1\nreg export \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications\" \"%~dp0Pokky_Backup\\BackgroundAccessApplications.reg\" /y >nul 2>&1\nreg export \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy\" \"%~dp0Pokky_Backup\\AppPrivacy.reg\" /y >nul 2>&1\n\necho [1/8] Mouse...\nreg add \"HKCU\\Control Panel\\Mouse\" /v MouseSpeed /t REG_SZ /d 0 /f >nul\nreg add \"HKCU\\Control Panel\\Mouse\" /v MouseThreshold1 /t REG_SZ /d 0 /f >nul\nreg add \"HKCU\\Control Panel\\Mouse\" /v MouseThreshold2 /t REG_SZ /d 0 /f >nul\n\necho [2/8] Keyboard...\nreg add \"HKCU\\Control Panel\\Keyboard\" /v KeyboardDelay /t REG_SZ /d 0 /f >nul\nreg add \"HKCU\\Control Panel\\Keyboard\" /v KeyboardSpeed /t REG_SZ /d 31 /f >nul\n\necho [3/8] MMCSS...\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" /v SystemResponsiveness /t REG_DWORD /d 10 /f >nul\n\necho [4/8] Games profile...\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v Affinity /t REG_DWORD /d 0 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"Background Only\" /t REG_SZ /d False /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"Clock Rate\" /t REG_DWORD /d 10000 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"GPU Priority\" /t REG_DWORD /d 8 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v Priority /t REG_DWORD /d 6 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"Scheduling Category\" /t REG_SZ /d High /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"SFIO Priority\" /t REG_SZ /d High /f >nul\n\necho [5/8] CPU and memory...\nreg add \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f >nul\nreg add \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" /v LargeSystemCache /t REG_DWORD /d 0 /f >nul\nreg add \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" /v DisablePagingExecutive /t REG_DWORD /d 0 /f >nul\n\necho [6/8] Background apps and Game DVR...\nreg add \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications\" /v GlobalUserDisabled /t REG_DWORD /d 1 /f >nul\nreg add \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy\" /v LetAppsRunInBackground /t REG_DWORD /d 2 /f >nul\nreg add \"HKCU\\System\\GameConfigStore\" /v GameDVR_Enabled /t REG_DWORD /d 0 /f >nul\nreg add \"HKCU\\System\\GameConfigStore\" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f >nul\nreg add \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR\" /v AppCaptureEnabled /t REG_DWORD /d 0 /f >nul\n\necho [7/8] TCP...\nnetsh interface tcp set global rss=enabled >nul 2>&1\nnetsh interface tcp set global autotuninglevel=normal >nul 2>&1\nnetsh interface tcp set global ecncapability=default >nul 2>&1\nnetsh interface tcp set global timestamps=default >nul 2>&1\nnetsh interface tcp set global rsc=default >nul 2>&1\n\necho [8/8] Finished.\necho.\necho ==========================================================\necho  APPLY COMPLETE - Restart Windows before gaming.\necho ==========================================================\necho.\npause\ngoto MENU\n\n:RESTORE\ncls\necho ==========================================================\necho                    RESTORE BACKUP\necho ==========================================================\necho.\nif not exist \"%~dp0Pokky_Backup\" (\n    echo Backup folder not found.\n    echo.\n    pause\n    goto MENU\n)\n\nfor %%F in (\"%~dp0Pokky_Backup\\Mouse.reg\" \"%~dp0Pokky_Backup\\Keyboard.reg\" \"%~dp0Pokky_Backup\\SystemProfile.reg\" \"%~dp0Pokky_Backup\\PriorityControl.reg\" \"%~dp0Pokky_Backup\\MemoryManagement.reg\" \"%~dp0Pokky_Backup\\GameConfigStore.reg\" \"%~dp0Pokky_Backup\\GameDVR.reg\" \"%~dp0Pokky_Backup\\BackgroundAccessApplications.reg\" \"%~dp0Pokky_Backup\\AppPrivacy.reg\") do if exist \"%%~F\" reg import \"%%~F\" >nul 2>&1\n\nnetsh interface tcp set global rss=default >nul 2>&1\nnetsh interface tcp set global autotuninglevel=normal >nul 2>&1\nnetsh interface tcp set global ecncapability=default >nul 2>&1\nnetsh interface tcp set global timestamps=default >nul 2>&1\nnetsh interface tcp set global rsc=default >nul 2>&1\n\necho.\necho Restore complete. Restart Windows.\necho.\npause\ngoto MENU\n\n:SHOWTCP\ncls\necho ==========================================================\necho                  CURRENT TCP SETTINGS\necho ==========================================================\necho.\nnetsh interface tcp show global\necho.\npause\ngoto MENU",
    "revertScript": "@echo off\nsetlocal\ntitle Pokky Booster - Revert to Defaults\ncolor 0A\n\nnet session >nul 2>&1\nif errorlevel 1 (\n    cls\n    echo ==========================================================\n    echo  ERROR: Please run this file as Administrator.\n    echo ==========================================================\n    echo.\n    pause\n    exit /b 1\n)\n\ncls\necho ==========================================================\necho            REVERTING POKKY LOW LATENCY TWEAKS\necho ==========================================================\necho.\n\nif exist \"%~dp0Pokky_Backup\" (\n    for %%F in (\"%~dp0Pokky_Backup\\Mouse.reg\" \"%~dp0Pokky_Backup\\Keyboard.reg\" \"%~dp0Pokky_Backup\\SystemProfile.reg\" \"%~dp0Pokky_Backup\\PriorityControl.reg\" \"%~dp0Pokky_Backup\\MemoryManagement.reg\" \"%~dp0Pokky_Backup\\GameConfigStore.reg\" \"%~dp0Pokky_Backup\\GameDVR.reg\" \"%~dp0Pokky_Backup\\BackgroundAccessApplications.reg\" \"%~dp0Pokky_Backup\\AppPrivacy.reg\") do if exist \"%%~F\" reg import \"%%~F\" >nul 2>&1\n    echo [OK] Registry backups restored.\n) else (\n    echo [WARNING] Backup folder not found. Skipping registry restore.\n)\n\necho [OK] Resetting TCP/IP stack to default...\nnetsh interface tcp set global rss=default >nul 2>&1\nnetsh interface tcp set global autotuninglevel=normal >nul 2>&1\nnetsh interface tcp set global ecncapability=default >nul 2>&1\nnetsh interface tcp set global timestamps=default >nul 2>&1\nnetsh interface tcp set global rsc=default >nul 2>&1\n\necho.\necho ==========================================================\necho  RESTORE COMPLETE - Please restart Windows.\necho ==========================================================\necho.\npause\nexit /b 0",
    "createdAt": "2026-09-04T13:37:07.101+00:00",
    "updatedAt": "2026-09-05T16:08:56.38+00:00"
  },
  {
    "id": "pokky-1788585249542",
    "name": "Stepha Network Setting Cr.FourtyStore",
    "tagline": "ชุดปรับแต่งอินเทอร์เน็ต คีย์บอร์ด เมาส์ และ Priority ของระบบ ช่วยลดดีเลย์และเพิ่มความเร็วในการตอบสนองสำหรับเกมเมอร์",
    "description": "แพ็กเกจปรับแต่งระบบจาก Pokky Optimize Shop สำหรับสายเกมมิ่งโดยเฉพาะ (เครดิต XSTARSHOP & 44STORE) ประกอบไปด้วยไฟล์รีจิสทรีสำหรับปรับแต่งคิวข้อมูลของคีย์บอร์ดและเมาส์ (Keyboard & Mouse Data Queue) เพื่อลด Input Lag รวมไปถึงการปรับแต่ง Win32PrioritySeparation และ PriorityControl เพื่อเพิ่มประสิทธิภาพการจัดสรรหน่วยประมวลผลให้กับเกม พร้อมทั้งมีเครื่องมือ PowerShell GUI สำหรับปรับแต่ง Network Adapter ช่วยให้การเชื่อมต่ออินเทอร์เน็ตเสถียรและลดอาการปิงแกว่ง (Packet Loss/Jitter) ได้อย่างมีประสิทธิภาพ",
    "category": "network",
    "fileFormat": ".ZIP",
    "fileSize": "5.8 MB",
    "version": "v1.0.0",
    "compatibility": "Windows 10 / 11 (64-bit ทุกเวอร์ชัน)",
    "downloadsCount": 6,
    "rating": 0,
    "reviewCount": 0,
    "popular": false,
    "active": true,
    "features": [
      "ปรับแต่งระบบอัตโนมัติ",
      "ปลอดภัย มีไฟล์ Revert ในตัว"
    ],
    "requirements": [
      "Windows 10 หรือ 11 (64-bit)",
      "สิทธิ์ Administrator"
    ],
    "includedFiles": [
      {
        "filename": "Internet - Stepha/Control Panel Network/image.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image10.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image11.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image12.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image13.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image14.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image15.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image16.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image17.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image18.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image19.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image2.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image20.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image21.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image22.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image23.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image24.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image25.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image26.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image27.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image28.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image29.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image3.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image30.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image4.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image5.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image6.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image7.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image8.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Control Panel Network/image9.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/KeyboardDataQ.reg",
        "description": "ไฟล์ Registry ปรับแต่งระบบ Windows"
      },
      {
        "filename": "Internet - Stepha/MouseDataQ.reg",
        "description": "ไฟล์ Registry ปรับแต่งระบบ Windows"
      },
      {
        "filename": "Internet - Stepha/Network/IMG_2648.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Network/IMG_2649.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Network/IMG_2650.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Network/Network_Tweaker.ps1",
        "description": "สคริปต์ PowerShell"
      },
      {
        "filename": "Internet - Stepha/Readme.txt",
        "description": "คู่มือหรือข้อความอธิบาย"
      },
      {
        "filename": "Internet - Stepha/Tcpoptimizer/image31.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Tcpoptimizer/image32.png",
        "description": "ภาพคู่มือขั้นตอนการตั้งค่า"
      },
      {
        "filename": "Internet - Stepha/Tcpoptimizer/TCPOptimizer.exe",
        "description": "โปรแกรมเครื่องมือปรับแต่ง (Executable Tool)"
      },
      {
        "filename": "Internet - Stepha/win32P7800.reg",
        "description": "ไฟล์ Registry ปรับแต่งระบบ Windows"
      }
    ],
    "scriptContent": "DOWNLOAD_URL:https://drive.google.com/file/d/1Ft5Z0gope-oclL_g_GGyn-2D2zoTyqB5/view?usp=sharing\n---SCRIPT---\n@echo off\ntitle Internet - Stepha.zip\necho [POKKY OPTIMIZE] แพ็กเกจไฟล์ ZIP ขนาดใหญ่ (5.8 MB)\necho กรุณาดาวน์โหลดผ่านลิงก์ตรงภายนอกที่ระบุไว้\npause",
    "revertScript": "@echo off\r\necho Restoring Windows Default Settings...\r\n\r\n:: Reset Keyboard Parameters\r\nreg add \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters\" /v \"KeyboardDataQueueSize\" /t REG_DWORD /d 0x00000064 /f\r\nreg delete \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters\" /v \"ConnectMultiplePorts\" /f\r\nreg delete \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters\" /v \"MaximumPortsServiced\" /f\r\nreg delete \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters\" /v \"SendOutputToAllPorts\" /f\r\nreg delete \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\kbdclass\\Parameters\" /v \"ThreadPriority\" /f\r\n\r\n:: Reset Mouse Parameters\r\nreg add \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\mouclass\\Parameters\" /v \"MouseDataQueueSize\" /t REG_DWORD /d 0x00000064 /f\r\n\r\n:: Reset PriorityControl to Windows Defaults\r\nreg add \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" /v \"Win32PrioritySeparation\" /t REG_DWORD /d 0x00000002 /f\r\nreg delete \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" /v \"AVX2PriorityBoost\" /f\r\nreg delete \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" /v \"Win32TimeSlice\" /f\r\nreg delete \"HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" /v \"ConvertibleSlateMode\" /f\r\n\r\necho Revert complete! Please restart your computer.\r\npause",
    "createdAt": "2026-09-05T05:14:09.542+00:00",
    "updatedAt": "2026-09-05T13:13:19.926+00:00"
  },
  {
    "id": "pokky-1788553424279",
    "name": "Setting Stepha",
    "tagline": "สคริปต์ปรับแต่งระบบ Windows ขั้นสูงสุดเพื่อการเล่นเกม ลด Ping และเร่ง FPS",
    "description": "สคริปต์รวมคำสั่งปรับแต่งระบบ Windows สำหรับนักกีฬาอีสปอร์ตและเกมเมอร์ตัวยง (รองรับทั้ง AMD และ Intel) โดยจะทำการปรับแต่งในส่วนของเครือข่ายเน็ตเวิร์ก (TCP/IP, DNS, ปิด Interrupt Moderation) เพื่อลดค่า Ping และ Latency, ปรับแต่ง Registry สำหรับคีย์บอร์ดและเมาส์ให้ตอบสนองไวขึ้น, ตั้งค่าระบบ Timer และ BCD เพื่อเพิ่มความเสถียรของเฟรมเรต (Frametime) รวมถึงเปิดใช้งาน Hardware-Accelerated GPU Scheduling (HwSchMode) เพื่อรีดประสิทธิภาพการ์ดจอและการจัดลำดับความสำคัญของเกมให้อยู่ในระดับสูงสุด",
    "category": "os-scripts",
    "fileFormat": ".ZIP",
    "fileSize": "3 KB",
    "version": "v1.0.0",
    "compatibility": "Windows 10 / 11 (64-bit ทุกเวอร์ชัน)",
    "downloadsCount": 5,
    "rating": 0,
    "reviewCount": 0,
    "popular": false,
    "active": true,
    "features": [
      "ปรับแต่งระบบอัตโนมัติ",
      "ปลอดภัย มีไฟล์ Revert ในตัว"
    ],
    "requirements": [
      "Windows 10 หรือ 11 (64-bit)",
      "สิทธิ์ Administrator"
    ],
    "includedFiles": [
      {
        "filename": "X3D INTEL V2/t.bat",
        "description": "ไฟล์สคริปต์คำสั่งการทำงานหลัก"
      },
      {
        "filename": "X3D INTEL V2/X3d intel.bat",
        "description": "ไฟล์สคริปต์คำสั่งการทำงานหลัก"
      }
    ],
    "scriptContent": "data:application/zip;base64,UEsDBBQAAAAAAIwaJV0AAAAAAAAAAAAAAAANACAAWDNEIElOVEVMIFYyL3V4CwABBAAAAAAEAAAAAFVUDQAHCSibahQom2qrJ5tqUEsDBBQACAAIAKqWqlwAAAAAAAAAAAAAAAASACAAWDNEIElOVEVMIFYyL3QuYmF0dXgLAAEEAAAAAAQAAAAAVVQNAAewcQBqASibaqsnm2q9VmFr20gQ/W7wf5gTTZwW3Dq54IaASk16Pe5I05AevW+F8e7I3vNqd9lZ2THkx99IcVM7dlxRaCUQaPbNmzej2Vm9JTX14Iui22FK1iu0QA7HljRZXMrzNqBj41234ygBE9cv8MZVFk7eHB7D3R0cNSTXlpAJbioHyDDSpXGGU8Tk429wCAErWT0EujXpebfT0PEUjEuQVBDiBBPrxxIfq+RT5YybWJqTzUUCRVOSS2j3uKmpKR0t85X8PUitsAVKFnTZBkjKKQw4NtakNuGVdxPiJGUM0c+NppgrgezxSJI9JywD59rw9/gjcwsVkVULVIGcfCDXAiqfOxm0Mfn8ZDAY7Kusd4xqFlOKxFI1cmrZJrESb3npIklTOS5N04mcn+zxCKikjaTMhbGUN23+3VQLtHYs8tYUrXuZzaRVGSJpE0ml3R9nE19WNpmpD9aURhyGp7sEMakqSi9BGcLeujwAVxnyhubCR3hVQJb8jKROv7/I4ODACAEc9R64KBaoCHjqF2uvX+6gME7L9oXswjsn2ZHOes9BezjqdkCuxwyrPLVjcFhSnh0c/JcB+yoqyqV5k1GAWsf8+GVzQ6SJzAdp/iCbG+PySVrxekzbEJ29bG4By5Sq22C3/3zYUtjJcDA8P309GNw/zo/laq1SojylU3bD8fnp2XBw/zg/k+ub6GYWBr+gyFOyFvoXvizRacj+pNS/ojTSGCQO3MGnDcNIz9Ep0tdRujZKE/TfGQ4ytK8kPvT+qsXFKiT44GXEYD1veg+Yz2grAb1btUsv+yka3lvpKumfFL391bGvo/HN3jiEz5ejq63wj9bhD/cz1fxdlWM5ImWsUPrVlfgXTYJ6GFwaN9sK/rEofjTude3zAR1OqD6doT+y8sE/WaLw0d2QssYRPJN5yvRUhFXqa6QXU1IzrkrRZT1q6N8n8eJJkdsUl+x/xO2G1Yab/BIpqM+EGoyTf6J8vawxyglemMm6WXAYUw7f5u+Dry4XGELFU6Y4N4o2KbZWt5m6HRNW8FeRmr+sTZOjxbqhsEIng+jribEwjr2aySiTOfjoaNphm5/utA6/WqWe9a/c/1BLBwinJnASLwMAADoKAABQSwMEFAAIAAgAo5aqXAAAAAAAAAAAAAAAABoAIABYM0QgSU5URUwgVjIvWDNkIGludGVsLmJhdHV4CwABBAAAAAAEAAAAAFVUDQAHo3EAagEom2qrJ5tqvVhtb9pIEP6OxH/YRsqpjUQhhL7kpFTHAU2ihsQCmqo9n6pld4xXrHfd3TUE6X78zdpGJYEk5KXlA7LNvO3MPM+M+QtYrImOomrFCSeBvGz3u/XT81HvrH5+edo9bb+qVpiW2pBGu1qx4KRmVBJQdCyBg6QL/L5KqbJCq2qlWlHgiAXrb8kHlUnS/PDHfrUiIrILxmhzBjOQu0TBD9IgL6sVgp88iH9e/Et6g8HF4E8SSKAWiMkUoZa0eSKUsM5Qp82LQiOlmYVS+Uq4auWV921gQijnZOfkU+dz2NHKGS1JQBXI8BMsxpoavkPqM7K86foDkLojg97x9+E3UucYVD16hKVhCsCvWzrYv9dUX+Mxcjv51QYj94dzw8YoNmBjLfn+cxlqPtRQF+zU6TQ39VGjpNGZ4meaTUciAZ25pcHul4tB9+E2+6CyYazn21TvrB8Ovw5HvX7YyYwB5UqzQ3DhEMxMMLDhdMxjwcOAGpqAA2NzN4GWUqjJgDpYC3i/0Xicq0Rnj3VVrYwZBy4wfYhDgiVKJXWRNglDUE5JRKXHxDUhLmwO1IWiiWBOoNgC7IoQQhjDmFGZwarFXHIFvteMOsvsQrFUS8EWSAUxVQz41rkoLzEnBUv0qaITMGEfEm0W5W2COkUDAXWZAVR0mCF7MUMWEXw9TQcPKcezhNCndvo8YQR6DqZsBLxC5GnnfENcRNF6P5TNcMPHxcfRl/agF/YFM9rqyIVfhOJ6bsn5aOn6EvsNjxv2M+kQiVzQcLiwDpLA6EjIAvzn4ObaTH8GcaqQ4dfCaDUPW4dv3zUP32w68bNFUzwZgE01jpgZKKzY/fTxXCGEI6yxDY8RqwVQd46DzyQwQhvhFjtrgbz/bYEsY1gL4e3vy8WQxcAz3yKkg8w1QejsXKfjEzGJHwWI8nTlfe4OIz5oLn8YQooM6jx21xC4sQj3eTw2NI0Fs12DTVay8skcT9jXG8imWWIQlx0bE6GQE1lKPDdOpB7jfkQzp12mMDXS7ztHCjmVyjsUgClGUzoWEk93tKTtOxR8jayjSWq3kTaWbSdmj8rV7g4pFotEwVZRppRhDtKig47yPXNd1mZpKnO69eeCxA8hOEIJMH6bZFpN8KhYa7QzQ+I1RwxVHz57RywV6c3Riw/bbPrRwI8MFFvH09oS9wRXneBcX1tafokXlqKPtl+22PSBXBn4kS7Q8hpRhIH1aC8mhFZ/Y0F6EW4K7kwk4raF7hfN427RdwGdYG/1roBlDkH7tJw+LIIzaiZQsGOHYl5u8R1ZjEySMcR0hrxFVjYySRG8jPlptn+n4Huu3YGXeUzRutTRDu6WwDx88tDbUur5CDzenFlvxE2b+BBNzqmBDQ5uzI6/KZsW2347P1sbgS1YztPL+ZnzwmcLpqwiX5+im96bto/BVxJvEQOeyRdlIYtlAklIuVOFqceccIzO9gq22y4PecHzCYhOIjEZ4gtpsab4Z93LwfetzW1ZwNLuz8qVD24FXOoXSBZNSI1nRe7BAzcBAoe01Rw3mjX+hke1Vus9r1HaaNQaB9F+613rEMZv91f0/aZPWQ6s7TRLXRuDlKTW0UlCFR71GFwNE30VYGtgIcge7rRIXifZeI/8RwYIrxmsCuxsa+dbpuASp4F+op0y1X2a2ida+qozE8Rawa12qhWRsrx1sFwyszFX+DKG72CYbnxC6j/Irh+Au+He673V969cJMqlUMTmjWi0dru4KkEEjsU3NaoV/6/Ka4zd/1XyP1BLBwiQWGnyKQUAAOgRAABQSwECFAMUAAAAAACMGiVdAAAAAAAAAAAAAAAADQAYAAAAAAAAAAAA/0EAAAAAWDNEIElOVEVMIFYyL3V4CwABBAAAAAAEAAAAAFVUBQABCSibalBLAQIUAxQACAAIAKqWqlynJnASLwMAADoKAAASABgAAAAAAAAAAAD/gUsAAABYM0QgSU5URUwgVjIvdC5iYXR1eAsAAQQAAAAABAAAAABVVAUAAbBxAGpQSwECFAMUAAgACACjlqpckFhp8ikFAADoEQAAGgAYAAAAAAAAAAAA/4HaAwAAWDNEIElOVEVMIFYyL1gzZCBpbnRlbC5iYXR1eAsAAQQAAAAABAAAAABVVAUAAaNxAGpQSwUGAAAAAAMAAwALAQAAawkAAAAA",
    "revertScript": "@echo off\r\necho [!] กำลังคืนค่าระบบ Windows สู่ค่าเริ่มต้น...\r\nnetsh int ip reset\r\nnetsh int ipv6 reset\r\nnetsh winsock reset\r\nbcdedit /deletevalue useplatformclock >nul 2>&1\r\nbcdedit /set disabledynamictick no\r\nbcdedit /deletevalue tscsyncpolicy >nul 2>&1\r\nreg delete \"HKCU\\Control Panel\\Keyboard\" /v KeyboardDelay /f >nul 2>&1\r\nreg delete \"HKCU\\Control Panel\\Keyboard\" /v KeyboardSpeed /f >nul 2>&1\r\nreg delete \"HKCU\\Control Panel\\Mouse\" /v MouseSpeed /f >nul 2>&1\r\nreg delete \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" /v FeatureSettingsOverride /f >nul 2>&1\r\nreg delete \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" /v FeatureSettingsOverrideMask /f >nul 2>&1\r\nreg delete \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\" /v PowerThrottlingOff /f >nul 2>&1\r\nreg delete \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" /v NetworkThrottlingIndex /f >nul 2>&1\r\nreg delete \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" /v SystemResponsiveness /f >nul 2>&1\r\nreg delete \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" /v Win32PrioritySeparation /f >nul 2>&1\r\nreg delete \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers\" /v HwSchMode /f >nul 2>&1\r\necho [!] คืนค่าระบบเสร็จสิ้น กรุณารีสตาร์ทเครื่องคอมพิวเตอร์ 1 ครั้ง\r\npause\r\nexit",
    "createdAt": "2026-09-04T20:23:44.28+00:00",
    "updatedAt": "2026-09-05T05:15:57.757+00:00"
  },
  {
    "id": "pokky-1788536637641",
    "name": "Setting ShxrkXinside ไฟล์แท้ 100%",
    "tagline": "ปลดล็อกขีดจำกัดความเร็ว ลด Input Lag และเพิ่ม FPS ให้ลื่นไหลที่สุดสำหรับเกมเมอร์",
    "description": "SHX SharkX คือชุดสคริปต์ปรับแต่ง Windows ระดับสูงที่ออกแบบมาเพื่อลดความหน่วง (Latency) และเพิ่มประสิทธิภาพการประมวลผลของระบบโดยรวม สคริปต์นี้จะทำการปรับแต่ง Power Plan, ปิดการทำงานของ Background Apps ที่ไม่จำเป็น, ปรับจูน Network Stack เพื่อลด Ping, และปรับแต่ง Registry เพื่อเพิ่มความเสถียรของ CPU Priority ช่วยให้การเล่นเกมมีความลื่นไหลและตอบสนองได้รวดเร็วยิ่งขึ้น",
    "category": "os-scripts",
    "fileFormat": ".ZIP",
    "fileSize": "3 KB",
    "version": "v1.0.0",
    "compatibility": "Windows 10 / 11 (64-bit ทุกเวอร์ชัน)",
    "downloadsCount": 2,
    "rating": 0,
    "reviewCount": 0,
    "popular": false,
    "active": true,
    "features": [
      "สูตรปรับแต่ง FPS Booster โดย ShxrkXinside เน้นดันเฟรมเรตและลด Frame Time Spikes",
      "Registry Tweak พิเศษ ลดอาการแกว่งของสัญญาณเน็ตเวิร์กและลด Latency ในเกม FPS",
      "ปรับแต่ง System Responsiveness ให้ซีพียูทุ่มเททรัพยากรให้เกมที่กำลังเปิดอยู่เป็นหลัก",
      "ปิด BCD Platform Clock และ Dynamic Tick เพิ่มความเสถียรของเฟรมเรต",
      "ปรับแต่ง TCP Global Stack เพื่อลดการค้างของ Packet ข้อมูลเกมออนไลน์",
      "มีสคริปต์ Revert คืนค่าเดิมของระบบ Windows ให้ครบถ้วน ปลอดภัย 100%"
    ],
    "requirements": [
      "Windows 10 หรือ Windows 11 (64-bit)",
      "แตกไฟล์ .ZIP ก่อนเรียกใช้งาน",
      "รันสคริปต์ด้วยสิทธิ์ Run as Administrator"
    ],
    "includedFiles": [
      {
        "filename": "setting shxcry.cmd",
        "description": "สคริปต์ปรับแต่งประสิทธิภาพ FPS, CPU Scheduling และ Background Services"
      },
      {
        "filename": "shark_latency1.reg",
        "description": "ไฟล์ Registry ปรับแต่งลดค่า Ping, Network Throttling และ System Responsiveness"
      },
      {
        "filename": "REVERT_ShxrkXinside.bat",
        "description": "สคริปต์กู้คืนค่า Registry และ TCP Stack กลับสู่ค่าเริ่มต้นของ Windows"
      }
    ],
    "scriptContent": "data:application/zip;base64,UEsDBBQACAgIAIwjM1wAAAAAAAAAAAAAAAASABsAc2V0dGluZyBzaHhjcnkuY21kdXAXAAGyI/dVc2V0dGluZyBzaHhjcnkuY21k7VltT+NIEv4eKf+hiMQuzBHywsswaMKtSRwmmrxYsRngLqdVY3cSC8ftbbch2b29337VHTs4CQx4CHtfzkJA4nZX9VNvT5V/ofaYARsO8znhCo+C+eUaeoFwJ+7vRLjMB4sxD4rQp05kU2j5QSSgTUb5nM08xqGs5XMT5lCwmX+Kv7ywVimXwXN9GtYOjvK5fE6JqGW+4geXLqWdYbU6rX9oVqvXBavXa6N295X96hsF7SfyrLEbgpCnHlMvCOGWsVBA0zCB+A7wOQ6uwsEjo8VjNywCm/hAfXKLOCI04Z0bACX2GFga0FDQYP/tyuZzp6eZnlcPGL0rvQ9GW+vGGvyzUqpU/wUmFWCwB8rB8PAQgsGlhzoTQcGgfMj4hPg2zedCXFcK5IEqNS0IvBkICVf6gH+HnZtSd/cU8jl3CKUWFLbl8u1CrVa4KcBOPictGUhh9nAERScKPNdGSaE9phMK9BM5rN6Wq0XnyBkWDw9PnCIh5XKxfDCsHH48/ERvjytw5kceVM9+qqzuhgoSW7j3r9tn/nTsZ8UzaDCfIra7b0T5W8u81NqgN5t63TITpKsK6YYbKgeJfJ/aNAwJn8E3N4yIB/pwSG0RplGuZkO5uoIypyMgjgOFL1/rlwOTDcUD4XTQcW3OQvw0uHJ9hz2Eg3rEOfXFN8pD3HygTwMMbsoHc81ixQpQuo91bV6jxwjXH0FJQF+/+LVx1es3oORAFUpDZZ53wvZcq3+96Pcuuw3QDGMB7sESuOfEvhtxFmHAIn5LiB5kQ/RgQ4g+aqTZ0uxSCen1eG+O64XHbol3GVIeH8JZg7byztB2dQtFfV3KsAm+hwrfuDJQ6FLxwPgdYGaAEZmgI6QxPsyG8eEKxnJTPGlBsDvqh7UqONRzJ2Htjz8LsL3tYvKFnZ+lIX6LKEYPmqLdGZg3pqV3EtjrzBeceeikA5PyexchH1h24AYDg3AyoQLNMmj5+GdI8F7h511wWCJ/xc5v3XzwByr9pzIyrtLsuyanqLlvz16y8DsqUje6rEE98qIOu+/kbI2WqZ23dbD0tt7Rrf4N/ATX573rxOGOlgL6+pZNVf21qIdFQqDZw/jEacc7yuZ4RyuOF9pYnVmAUsnI4hixq3UGFyDPGbqj1JJQEC5qThK0j8gluzmTBxIEUTiONX5+07WVz+6tCl6IBMWDwgUVRTz21EBtyIjChymC9QH+jZxtwu5p+l5hVfbGzXppnj+ZP46X84dcFs4riCRbCa1K0ctHox5nM+rx8xn7VQGEqqkQiV3PRIdThMKMwoD6f31WvtA6OnR6DT2B8qOCUp/zzAsMc+hIAi6jI/aU+bfnhKdh/JgNxo9ZC5+UiSIVduaYPcSf1/AqL+OVaV/N89iDFgkmv1SnfsEaK8bvNa0rra+v7C43UtvPMf3rTYweaUC9rWvdSyOx8omyct2jSMejAASdBIxLsjh0veWkd5LNsCcrhsXiCqXf5AlLIWxLOduDD6t5YmlR/XTBcixcvr564wDp11ZfkzZpmbJSPJVgPim85kjQqeBE2t4NZaVIYxIqdjEhU3cSTWRXl0byUzYkP30/06w7W4wadK1VetiJZLtFHZcMzBl2iBODM2lo5ZYx2bLGnAmBnfWo5Tt0uh5Y02F8ZYyBH1Rr/k2fhgHCigkSO/7wpWjfuGeYev9bq66bT/pEpfxsyxUq5RckAnbwNB3i+ntwZVLC7fHuUrNbztjtlp9hFrGU5ylAsuBFVhGr+fxOyYJnd9q8Lb5o2D20NUvv1p8O0kolFaXmmGAH0cbOX1LhpRnJztK4SfHUZXtknT6sjh9eSQrifwcGdxl3xSz+rNwf/7+nXLiSI3h4iCfL0fPF7kfFYrAeVJMbJg2Q6CvI1vrw6ptEmxgnctsO8ZE38sFXyn0616Ax87Hjsy3XvvuftaoXxiUYRdNCX1seCO60GXLyTpzfU7Or3YUPzucwTcZtOb+QOyEBxSiZARGLyhA8Pgk7SQJBiUIOqpZ9MeOMpvKdIc2rCKp/7znO5G4yaFpmirYYodJtQy74krTYCeZC312mtGOb3lPP5PaasIODH/T178iT7VUHGxUe0+x3P+BCoDpmRlr7ZnlaPWMEq7B5cLH9VIGDBcsow85TYQfy7cAGIr7e1xstC7RuqxNHetOdYub5G1whN8JI3k2/krC9OUX2mE28eCbvyDKCv6cB8WVuk5rIMC4I5Iu1OragroDz2X6ra7Ya+rVp9fo6/FLvGTf91sUXq5CsngVUVaTacTn+rkSgMPRIOK6zyBe1w0Ly2uOtc35Yu558A7KpVx9LVx+bXcplimy6PoJouiOfiIjT/f39ZVsWi0WwZoFcStWkWH6Tz6kxXnsxsSvvVfYq5XJ60KbwtJEG1LakDU7/g2v3KluF+V3MmQ4duj4aWa5JT+c+S9IzT8G1LXlz6/FeajRSrLPJRPbFBVOSoKLpURpAsYN+64YUeZIjO57EntuF9NgLqBfStMwRwzLhoPP/Kp9YDMfw5zT1bQrPNDxN6R1Po9NU6CA2e9uPPrSdhunRrdUn6dpJSO6novNHzJ8K7dc52kak7T99gJXr7OwMlF9swefPn9fmXq8xbvWonBh1Ccrm/6HMCmXlZAHlbtqxVW5QHr2SfTef/6wx8e9gxiLVw0ehTDgSW/mKeuvtOVB2ugzbDayEB/FJMQWqCpLP/RdQSwcItx06suUHAAApHwAAUEsDBBQACAgIAI4jM1wAAAAAAAAAAAAAAAASABsAc2hhcmtfbGF0ZW5jeTEucmVndXAXAAHAEC9Dc2hhcmtfbGF0ZW5jeTEucmVnfZBRSwJREIW/58D/IP2AsKIeAh9iEYrSIsUQV6TwEguyK6sl/vn027sSYiCXy8yZM/fMubP9fScjZ0bBmiVN3gh8WVuyomRjpSObiQpxk6F8KZuJc/ENF7Q8Dc7iHfPAk29GTHnmhYR745SuMZF7pCeb0rejz8C8K0r4VrVUO3dSErWr+QVzu4J5elRNeTXLoqvK3eaIn0Q35/vqT3S9svNTLqg550McnF74v2Bn27iOejPu4p8OT61Wb+uaq3/TK5cLNcuoW2/nlOYlt3872wFQSwcIgXhaTdEAAACGAQAAUEsBAhQAFAAICAgAjCMzXLcdOrLlBwAAKR8AABIAGwAAAAAAAAAAAAAAAAAAAHNldHRpbmcgc2h4Y3J5LmNtZHVwFwABsiP3VXNldHRpbmcgc2h4Y3J5LmNtZFBLAQIUABQACAgIAI4jM1yBeFpN0QAAAIYBAAASABsAAAAAAAAAAAAAAEAIAABzaGFya19sYXRlbmN5MS5yZWd1cBcAAcAQL0NzaGFya19sYXRlbmN5MS5yZWdQSwUGAAAAAAIAAgC2AAAAbAkAAAAA",
    "revertScript": "@echo off\necho Restoring Windows Defaults...\npowercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e\nreg add \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects\" /v VisualFXSetting /t REG_DWORD /d 0 /f\nreg add \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications\" /v GlobalUserDisabled /t REG_DWORD /d 0 /f\nreg delete \"HKLM\\SYSTEM\\CurrentControlSet\\Services\\USB\" /v DisableSelectiveSuspend /f\nreg add \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" /v Win32PrioritySeparation /t REG_DWORD /d 2 /f\nsc config DiagTrack start=auto\nsc config dmwappushservice start=auto\necho Restoration Complete. Please restart your PC.",
    "createdAt": "2026-09-04T15:43:57.642+00:00",
    "updatedAt": "2026-09-05T16:09:01.406+00:00"
  },
  {
    "id": "pokky-1788586545769",
    "name": "PROJECT S V7",
    "tagline": "สคริปต์ปรับแต่ง Windows ระดับโปรเพลเยอร์ ช่วยเพิ่ม FPS และลด Input Delay ขั้นสูงสุดสำหรับเกมเมอร์สายแข่ง",
    "description": "PROJECT S V7 เป็นแพ็กเกจปรับแต่งระบบ Windows สำหรับสาย Esports และ FiveM (CitizenFX) โดยเฉพาะ ช่วยเคลียร์ค่ารีจิสทรี ปรับแต่งระบบเครือข่าย ลดอาการหน่วง (Input Latency) เร่งประสิทธิภาพความเร็วเฟรมเรต (FPS) ให้เสถียรยิ่งขึ้น พร้อมคู่มือและลิงก์วิดีโอแนะนำวิธีใช้งานอย่างละเอียด",
    "category": "os-scripts",
    "fileFormat": ".RAR",
    "fileSize": "5 KB",
    "version": "v1.0.0",
    "compatibility": "Windows 10 / 11 (64-bit ทุกเวอร์ชัน)",
    "downloadsCount": 2,
    "rating": 0,
    "reviewCount": 0,
    "popular": false,
    "active": true,
    "features": [
      "ปรับแต่งระบบอัตโนมัติ",
      "ปลอดภัย มีไฟล์ Revert ในตัว"
    ],
    "requirements": [
      "Windows 10 หรือ 11 (64-bit)",
      "สิทธิ์ Administrator"
    ],
    "includedFiles": [
      {
        "filename": "PROJECT S  V7.rar",
        "description": "ไฟล์สคริปต์คำสั่งหลัก"
      },
      {
        "filename": "REVERT_PROJECT S  V7.bat",
        "description": "สคริปต์กู้คืนค่าเดิมของระบบ"
      }
    ],
    "scriptContent": "Rar!\u001a\u0007\u0001���\u000b\u0001\u0005\u0007\u0006\u0001\u0001����H[1D\u0002\u0003\u000b�\u0010\u0004�3 ���`�\u0003(PROJECT S  V7/PROJECT S  NO password.txt\n\u0003\u0002\bw�\u0015Z��\u0001��b\b0uDC43�vU�O\u0007���\u0013\u001a&\u0012�-ժ\r\u0003O�h�A'uM\t ��$�Xr�fa)\u0016���'L�F �\t�:�\u0010\t:��\u001f��;��̼�+JH���\u001f��Q9�u\\�U]�eݯ\u001b��~�9`]Պ�+�*��\u001b��A�Ղ\u0004d��~3�A�g�\u0011�K��ZOL\u0014��$\u001f��w\u000b�\u001f?H_�\u0015��yX\u001d�`$�T��n�Wr�\u000b`\n�\b�C�z����(����\u0007�Q�p��b#�%g��\u0003\u0017�[\u000e9Ñ�U�{\u0004��\u0002\u001a\b\u0018��\u001d�ڃ���:�i�e\nЙN���:�\u0004M���$�i��؃�H� �O�X�ǕP6\u0010]d1\u0004�ۍ=4o\u0010x>HBx�.�?�9\u001f(;�u�t����iP�K��o!���� ��lӱ\u0004�\u000e�������#7\u0011\u0013�F\u000e]Y�J$�����@�^y�|���\u0013\r�.�m�6#a\u0014\u0010\u0017\u001a:x��;B[!m�/���\u0010\u0001֬Q����\u0019P�͕f��MR�I;\b�\t\u001e��F�\u000f��\rv\u0010��Z�%\u001a�Oܻo�^�`bK\u0010��8�ʥM�r#�Cx�����؋7\u0013\u0003e/�\u0015\\�d>P(5�(mc���ͺ�\u0012��\n2V\u001f�\u0010L9�l��3}Hj�0��E�\u001f����\b\u0012���3�\u0002%����WQ�t/�B�\u0010\\\u0017'p�C?\"@]\u0018��\\�F�ކ�R\u0017���<w����\"u7���\u0004�rP:\u000b�<�\u0018�\t�q�c��\u001a�e�a\"2�\u001b\u0019;���B@��Q���\u0001��§��(���6$�W���!TO�o[j��t�\u0006\u0012�+\n\u0013�!\n\u0013_��D��\u0016\u001f���s!�\u000f�b���\u001c���DR��p$�\u0012���O�n�SW�\u0004\u0001�?,N�F�[�F�\t���4H���\t�ȗ��\u001aUF\t� �� �̥\t�\bi�������.��X�,��\u0013T%\u001a��\u0014�\u0007�Ʋ�8��O=��ِ�^$;t�O]Yo\u0012�R�\f�;ĳ%�%��=cy��������j��e��L��\u0019�9\u0014\u000b\u001b/y��)�֡�d�Re�?\u001d5��X��h̕\u0015+�#*6�wǙ)̪\u0010��<��6\u0014\u0006\u0016-\f�\u0006�O\u0010��_���\u0019��&qRĪ�1����\r�a\u0001\u0019a�$��ql�t��HbwT�q�~=٨�^M��sR�^mɩ\u0015�����+`�˲\u0006]\u0019Dw��u~.�#O������\u001f�|�������ϳD.�������RՑQeb\u0017�b�Le���t�5IoQ�K��\r�q\u0013|0�J[#M�,%��Zл��+e�\u0014�5�L�U���V��5-$�5=D�^�O\u0017�Q&���M-�m�y�E+'y�ֿ\u0002�\u0005P\\��H6�..��9n�V��\u001d�z�t�oswMW(�~\u001e�첏�ְ�^-v�(w�\u001fy����\u0015F�݀\u0001�\u0001Q�6Jẃ�m�3̩'evq�P��b�>j�_�D���`�N\u0007_^�� r\u0012��Z�\u0017�Q�����w���8���\u001bR��Ğ�ׇ�������=߫v�yG�ZM�/f?���\u001fdD���?��0\t?cc�;�W�����8[�*d�[��3ϡ�ZT�Hz'=|�vk��{��D����P7�kya�Ǖ�;W��|�n�\u0006��3�~�\b$Z �\u000eZ�C����bQ1ì��\u0003SEU����\u001b�@�\u0018��\u0016��\u0006�h.�e�E[!X�9�8�#�6��~R���\"��\u0006�\b\u0001cv�a�1_�ͫ?0�<J��n\u001e�\u0007\nw=\u0017��*3�H%4g��\u0005��\u001fh\u001d�M҆�=�[H#èz\u001d�xE\u001aH�6�����e��k�7���镢��A�'���\u0010X\u0016��I}'\u0018\u0003\t��\b\\?yP>�<\u0015\u0018��]���vY\u001c\u0004/���Ɯ8~\u0001!b\u0018��\u0017o\\�O�\u00037�\u0004>�U?\u001c\u001e���s���\u0011�\f�u��F�cd�\u001d\t�1�\u0014���L��v\u0006�+Z\u0002\u001b�f�:e|\u000e\u0003��e\u0010I\u0003s\\[�}��C-�\r�-\u0003\u0003Ǌ���GB�Ӭr\u0005\u0006���\u001b�2c�g{b�G\u001d��F�\f~�c��\u001a��\u0017z�\u001bB��h\"�ÈG\u000bzp�xT�i�;�\u0002��m�LF��\u0019�׹�r������B\tZ�*�\u0007�xƋ�`�\u001bnb��ṅ<�\u0005�^\u0015d�8\u001f�\u0002\u0013�?�-���[՜m�\f\u0019���ev�n\\���r��A�g0\tg�<�\u001d砊�\u0013\r���2��*ж9�\u000f+\u000f���U\f�<���#$\u001aW�����I�>H}@]����K���\"0p!���A]/\b�3j=&��y/w4���f\u0012�\u001b/�����&;���ۆ�ϨO��~<�v�s\u001d���d�\u001f��\u0001���aN'�(����>9�\u0016���wE��Z�L{���}@�ߨ]��g+�\u000fe0��h��w��}�e��_о\u0014_�o�΅.���j��\u0001��>�f����cg\u0019�_�.�o\u0014|�a��:�l�\u0007��\u0011�� *Hb\u001c��8��@�2�+a�)1�7�\u0016�fn�w�B��_�G�C�:s���[�\u0001]A ��\u0006��S��\\��%��N\u0017g�+@Z`\u0006�Y�\u0014�˙-��\u001d���\u000e,!\u000b0%m�E8\u0002\u0003\u000b�\u0011\u0004�8 �P�;�\u0003\u001cPROJECT S  V7/PROJECT S .txt\n\u0003\u0002�\u0017��W��\u0001�0�\b0eD344�fe��\u001b��\u000e��R4�$��q��1\"�cr5�\t\u0017�p6ą\u0013i#\u0019D�$�ڒgC4\r\u0003z�t�X�V}6�$�Rd�N�OБ���s�n�����'��\u0006���\u0015�����4V���F�\u0010\u001f.\u0016�\\_)̓D\u0010��]-8˽�R�:�X?���\u001f,��pƛ��Aњ\u0002g#���uR���Z\u0014����u�\u0003���\u000f\u0001;=�\u000e\u000f��mq(1\u0011V'g���\u0003\u0017��-�͕�S�z�1�\u0002\u0019\f\u0014��\u001d��B@�%�~�\u001apك�&D����ɧY�\u0013L��\u0011�\u0004k\u000e�T\u0014\nu�\u001f�z�� [`@\u0006�ב��8\b4\u001e� <�Ue��$O�3�u�r�|g�4�Uu�]7��t�hO�j8i��\\+���@e�{�\u0005�g�K,\u0007V�K�\u0013~�NH�v���x���*��L7�\u0002�9����Z\u00051\u0001\\?w8\u0012?�K`=��Ϊ\u0013��;\u0012��B�\u0019N�JMS��)\\�B�dy!�7p���\\�/����i*;z�߮ҫ\b\u0005%�\u0010lÐ��T�+>S��\"\u001f�>�_�W��\r\u0015<@R��;�\u0006�&\r��\u001d�mY��:K�%���\u0004à-\u00101�k���(\u0011�0�������qM��3]�\u000f2m׭��\rӡ2\u001b\u0007����ė��\u00014b�ν���=\r�]\u000f�w6�]�8�����\rb4��\u0001�|�\u000e�����\u001e�]o4,s>�Dд��\u0016\u0011�F\rCi[`$�<�\u0012�/E������\u0017^¥��T�>�R\u0015<���F����a��XdC<�('=+�:]�+�\u0015���w�_F�]ö�\u000fȠ���p� ���\f�Mn\nh��@\u001b\u0013�h���B�q3s��MD���\u001cvD�8Ό�\u0013�\u0005��\u0006Xd8OP&\u001a]�8*����ۢ�E�\u0011\"fd�V�Ҹ�WЎÜ��3�Y$��\u0013\u001a�Үz��'d\r��\u000e�LI�Z_�`�����{M�̤��\u0018����v��H8�w�kR��h\u0018�S46��֧NF\u0011R��z{��\t�C!h�\f\f�ͅwǘ��!+\u0001F���4�3)la�;�_\u001eq㼽��h5��$�ʸ�D\u0017�8\u000f�$\f\u0018!� e\trY\u0012-�\u000e��ʝ�ޛ8�\u001fUd�I�\r^*i��>>$�n8�\u0007� 6u��ɐ.���֏ŨY2t]{x�4�r�2�ŭ_5uU��\u0001��fҚ���2\u0012��\\�+I0�ǥI�U��M�\u001e�{�$@�'��Щ'���ǽ4�I?��&�[�35�4��\u000f,J�E�T�\u0014NӢ\u0003�E�A��g�W��\u0005N8�S^o]���2\tF=�D��\\�*����\u0001������[��]d]\u0016kMj�3X뇧K3Mz�3i��WU���v�١?_M%\n��ũ�p���c$׍�&J?�O]����V�y)\u0007���>�Hx|V\u001b��\u0007�.4~k���e�\u000b�x�\u0015n\u0006�\u0003��M9&��:��q�\tam�\u0018���B,��F֞��x7Hh7\u0003o����Z�.\n�]\u0017\u000ee1:v��V�>>*�I��Sղ�\f{6�\u0014��Xy�a�h`4�Gf��\t�O��~�k\u0005s�R�Qh2sD��)����?ΟG��mm\u0002\u001bt��6��=KOG���ZY|8�b�n����\u000f�\u0011?�����\u00017���\u000e�~\rGa�8�\u0016˃��X\u0011����|�5\u0006��C�I�л��:���\u0017���VT�o��sCF�f��gw��ڿ�\u001c\u0002M���6A\"�� rَ&\f\u000f��\t\u0004�א�&�4�Q����\u000b�b�D[�9Zda�3-�(�:�A�b�H��\u0001�Fa���Ӝ*F�0\u001c\u0005�\u000eL㈡^[V�}�]�:���>J\u001c9��[Q�\u001fF\u0017A)��'�,���t\u00077\t7\u0019��Ӡ�\u000e��t��-\bc�H\u0015���c2����ruǖё���Q�'��)IXY\u0016��&�����j>\u001f��>�8j)�лn���`8X?�\u0017\u0007˸�|�11�.�\u0019~��\u0006V���\t�٩�`�];y��/4���g\u0019\u0018�ht4S��w\u0010�$U�g��y��\u001by��\bmkV��3�p\u001d�=��T7]�%Rů\u0018o�-��yx��V��\u0011��g�k#�M��1&:�7�,�.ZZ%���'ųs\u0001�\u001b�$W{�#C��r\u0011i��K��]?�$L�r\u000f? Y\f�^\u0019b5� ̲���/\u001e��Қ\u001c< ��2��Ň�2�4\\��\\m��'�\u001d����\u000f\u0003>\u0014`�4?�\u0004'��[��5�&�dk(����vݷ�z��Q\u001c�~��_>��t�lxb]砋�ܮ�x9v���ȴ-��D���g.\f1����\b�\u0006����]�~�\u0012c�\u0002��\u0004G\"}���O���\u0015�\u0005]x.\u001dO1�x@W�H�'�\u0001\u001e����\u0013�\u001bO�����\n\n��-�\u0016�<a��\u0015�I&�\u0011\u001e\\\u001aR߇�RFG��P7\u0015�\f2�|�'\u0007�\b�㨑i�H\u000e��\u001a�ǁ8Ms� \u001b��\u001d�\u0016Lf|\u0001�\u001dܭ\u001e���'\\��ki�:/ٻr֙6����������%�\u0011� ������}W�`\u0014\u0010\u0016R\u0018��$e�ʻ9D0�8���m�H���5���0:3�`��_K\u0013��\u0019��\u0001]a ԷUA�e�Hτ��e�m\u0012\u0017'�20-0\u0003P,�\bt���L�Gb�k#�� \u0005����\u0001O\u0002\u0003\u000b�\u0004� p��ۀ3PROJECT S  V7/คลิปปรับมือ.txt\n\u0003\u0002Ҏ�1�<�\u0001https://drive.google.com/file/d/1ndWMUCqumzdDBjQSSYPjyXX0x5oCAjYd/view?usp=sharingj���C\u0002\u0003\u000b�\u0001\u0004�\u0001 1����\u0003'PROJECT S  V7/วิธีใช้.txt\n\u0003\u0002��\u0005�X��\u0001�\u000b�%T33�D�B�u�!\u000bB��\u0015��`�\u001e��Сm\u000b��%�)\bM�D\t\b�\u001b|V5\u0004ۓD�\u000b\u0010$��K�%�H�њ=��\u001cb�1_��I{\t\u00111�O#\u001c�WR+0��\u000e��!Q\u0002�\u001a�>$ޔ̉O��{5{�\u000e(77�qE�f�A��2\u0005���EG��)/��_�]�\u001e��a�}��\u000b�@H|��F\u0002\u0003\u000b�\u0004\u0004�\u0007 zb\u001d��\u0003*PROJECT S  V7/ใส่ในCitizenFX.txt\n\u0003\u0002\u001f�\u001d7�<�\u0001ʢ0\u00027\u0004C24�pe�ԯ��\u0002�\u0016�*�)�\nqx\\\n�C��BrFH�#q8݁}����v\u0015^�PRG��71��-�{���߼�ȵ\u001bofc�Y)7��e\u001b\rZT��x���~P��-�%��<�\u001a�\u0006en\u0016\u001bx\u0005\u001c�1�����I�J,j�M��1�ţ7�\u0006\"�����,���F�i��,\u000e�@�1���|X\t�FOpV��H\r\u0001F��v�I+�\rc��!�]\u0007�֝�\bI�j���V5eq`l\u000f��=�\u001eX\u001b�\u0006\u001cx;��2\u000b�\r(����\u001f�a�G��`YD��\u0016��m�g�#\u001f!�Sg���\u0003��TJk����B�C}��h�����\u0010j\u0012\u0003��E�3\t�_���!|$|\u001a9J\u0016H�L;�\u0002��'zǝB�ŀp��&Dp����\n=T8���֐n�-)�ZX�\u001fպ\u0011XI������=]ũ Њ�y+��\u0011\f2\bBF�G³\u000e��\u001aL�4��O�mO�<#ֺ�¾Vq�\u000e�pg\u0018�}+�kZ���\u0012-�Q$\u0011N�F���$IU0�\u001e�9��w�\r\u000e�\u001f�����\t�\\�P/p�(k��\u00109^;K_�\u0005\u000e���\u0007��m}>�Vu\fy�Y[�x>*mQ�\u001en}@\b\\A��`\u001b�ܴ�.촕\u001c�`2�`j>1\u0003�/��g���1�4���í���@_�q4#\u0002\u0003\u000b\u0001\u0010�\rPROJECT S  V7\n\u0003\u0002D6�/�<�\u0001\u001dwVQ\u0003\u0005\u0004",
    "revertScript": "@echo off\r\ntitle Pokky Optimize Shop - Revert PROJECT S V7\r\necho Restoring Windows Default Settings...\r\nnetsh int ip reset\r\nnetsh winsock reset\r\nPowercfg -s 381b4222-f694-41f0-9685-ff5bb260df2e\r\necho Default settings restored successfully. Please restart your PC.\r\npause\r\nexit",
    "createdAt": "2026-09-05T05:35:45.77+00:00",
    "updatedAt": "2026-09-05T05:35:45.77+00:00"
  },
  {
    "id": "pokky-1788538939543",
    "name": "Timer Resolution",
    "tagline": "ปลดล็อกความหน่วงของระบบให้เหลือ 0.5ms เพื่อการตอบสนองที่รวดเร็วที่สุดในเกมแนว FPS",
    "description": "เครื่องมือปรับแต่ง System Timer Resolution ให้ทำงานที่ค่าต่ำสุด (0.5ms) แทนค่าเริ่มต้นของ Windows (15.6ms) ช่วยลด Input Lag ของเมาส์และคีย์บอร์ดอย่างเห็นได้ชัด ทำให้การลากเป้าและการตอบสนองในเกมราบรื่นขึ้น ลดอาการ Micro-stutter และช่วยให้ Frametime นิ่งขึ้นอย่างมีประสิทธิภาพ เหมาะสำหรับนักแข่ง Esports ที่ต้องการความได้เปรียบในเสี้ยววินาที",
    "category": "os-scripts",
    "fileFormat": ".ZIP",
    "fileSize": "7 KB",
    "version": "v1.0.0",
    "compatibility": "Windows 10 / 11 (64-bit ทุกเวอร์ชัน)",
    "downloadsCount": 1,
    "rating": 0,
    "reviewCount": 0,
    "popular": false,
    "active": true,
    "features": [
      "ปรับแต่งระบบอัตโนมัติ",
      "ปลอดภัย มีไฟล์ Revert ในตัว"
    ],
    "requirements": [
      "Windows 10 หรือ 11 (64-bit)",
      "สิทธิ์ Administrator"
    ],
    "includedFiles": [
      {
        "filename": "TimerResolution.exe",
        "description": "ไฟล์ส่วนประกอบในแพ็กเกจ"
      }
    ],
    "scriptContent": "data:application/zip;base64,UEsDBBQAAgAIACyeRze+HAbReBkAAACAAAATAAAAVGltZXJSZXNvbHV0aW9uLmV4ZexcDXBUVZa+nTRJJyTQaICAURvosBlhQkhAAQFfhk4bxgQ6P4aAMd0h3aHTm3TazgsTXXTbCVhpHpnNKuMwFlLhR1cZa5ZxWY2OpdFQCSpidmCUqnEcdpd1Xg9Zt/1PCdr73fNe0p2fdtytma3drXeqznffPfece84997777nuELt3WzRIZY3pwJMJYL1NIYH+cDDrGZtz44gx2MuWtBb26krcWVLobW00+f8sOf12zqb7O620RTdtdJn+b19ToNVk2V5iaW5yu3PT0VLPaR/P7Xx39ziuPhEf53MG94SXq9U3gO3oC4QUojx99PJyD0trz0/BCKn9CerZDB0jPdugnVH7nlYfD/4jy/oNHwt9F+eELPya78sZ6N+8z3lhsRYyV6PTs2M8Mt4/KLrKZuum6JMZMXEGRXVoAMILz1CwZlbpetRktWUDVAyUQGtW6cUxujPF/Zg1jJ/mFA6az2J+OEOf+hPjNuaKrXeSxzFEDMk0ITBE5cv3OOrGOsaHRsZtGcxAlZEPIVdSQSzVnxmjuYvT6cv2t/nqmjtWh9ueY3B/TSCONNNJII4000kgjjTTS6E9Cnog7xSww52F6CXYGs3lZVnFnlfTRlqBoNsq/nsnYYJJhhcC6HhAKfiO9HawxZ8kvQNrltQxYzFk66S35OKrB2pJBa3G4QGDuapvApLfQaEocTMqDRO6Agk16W25DKa3blQ8l9teMVXTWbuusre6s3Rp5VxEErTWRd6USc0bQ6pAG7LV33+UMpvOYOk4Z+7u7uxGXnInq5xazQSemVMm3zuRtemmg9jU96+7GeKyTxtMxbFDHY1DiGbSYeScYUnFwlzltMPk9jE96GxFnJspXZqBhk2Uw+TSEXKSTnyWRwCtMfgIV6SzvIgKSD/Jqidlorx2LNINHqtDhoTyBRavdvTkF4+pKoIi6GlGPxttlMRs7XrXY4CON1+X13D98QGAgpwsUp2zMZRqNnvKz17ptd1/bNLksgXpKk87a5M9wvbtPnCttsnh0HuZhZW4TJsnDIrNLMBnSWXk6eqx9LY11j6ex+Npj4usYruT53GutJkfteNevQnhp8iVE02UtxrWBB++m4F+H0KPj7dKI/BwqEEcY6R9BTdopSJVmA7eRrCO2Kh5dpNy5hRS60mngBnTmpIF70mngNTHZdsSkk9aHkxttKq4NLcfFhPFUeXRuhng9DIq3U7gCT9DNuBywbkMmakOnp0fNpELHQOFWZovMbkeeCvpeM4zvsWPYSCnfikyskKwmBKsv49PEv3sELTRlafz7S2Q2y+OJHrBu1cmHMK21WNHItzJbyZgBnumuSnOWdLZcLtLRfE2TrDWXEyWrQ/UPrfqoqeJ/LfzDMTTc0LDJu6EgFZt4Gj3LyyKzRZK6Id3TJ+ZKgh4+9OWetTAwICIeMNb1PB1UjajbkDl5RRrPRrUOjtb2T70eDoxbD1lj666FVoXo3sJXRIackDa6Iox8RdAXI/l5JFgakawCQjFIxSPlZTbJYjYjojSeI74SKs1pwU02vggyglWV8p7pyg2AKdKhm6W0FnogtEPbFF0LOf0T5ntvId0M+X24P9CpXkrY07fr+irpHtutA7X3Z0jf06Oefmth5f2GXv7JCmoFfeq9RPYWsx5je0o3mMS3A77jvJ4as+MM6rg46nWi/0n7lZQ6cb/qnbz/wgqblX4wie9LGC99kJO3p9LaNyih1I7fGOP5u26Svwvf1t/HKX/cX0yq1PsFKw8T6cxXssLrupg6j8+TEhPfX6WMi++wcfn4/dK0cly9im7cvFT+UMpBE+z6vzHf143vP3QlZdyeIGMNsRD/+KnUX3BgWww9iuWl1N15c/H4OgJ/W/uj7c+NtSOfc7In5vPBYf71Vwn1qOr/rPxICt92+G4mz1G2Zj2/+QZ3m/epD+Og1STvSKGV3qSK+bd5ucBAMveAIkuQFyoCpyrQybMUwWhndHvM5dO3z7wb9YK+0dl78BRvj6YM8a/Pjrceuja5+WLg25f898l8U3ViqzDq5CNUcfAKk3+crD4PjcpdaVBWzdTrBf7qs6d6Pm+RPsKG5aQzx/N8NA84Rp/SODfc+UUkUqacNs4EnWajOwfTMJjUeTM/WxhI5dmRSIQ/h3FqUD3XjnsSx1kfV5Im3h/t35APx9jN8Qgiihn18eSpR419Td/xqqPM/SFm0ib/azJtMTHrWx6/vuH/hcn+0UsGzmTIkc3TgEgy5f3JoynKUlO0GAPpqnUqSXpTnsurXjevJuCEZkBVOZe9rZ7LHLcgd5enjYrflH83dv2WfG4aXzRBqy9oFeU18OXmK9ozgwp5EQS4px35tFnjqNY+8ag2Nkae7wNfRSLR/W/auHzzc4SEI1gXnnHuPyBHW+R3k2illblDVD3Nq1XucrdM1Rf4fA34qtyXqXoMVXttNKWHT0zYPwI3T8zvhSnmF5mljOFBSttXgB6aW7lkZE9ErKW79pQeKXDxc8noypSXJynTLhWO4Om6WNqir5Cu9+Xzk5UH5xyszPLIOYkfwjbrbR4jzl2Rc3epB5oMWjhb0KlU1Q7H0jr+qC7HAYUn2YZj8KZ2qcpU5lGSXw7BWfmqjhym2elpNfkeG3s+Jy3GCODZqI4xOxzhG9Mprj1ibKtBEEz2Xo1E+AW2jTPqHiR/oKetxKHKuBv5yU/H6VHgvXraXniHY3vLEH+CGpj8cmLctgn3Y8ewc+z8Uo3h7+mbuXsPNCvo/GCSH06k8ZqQCCTP8xflyoFGWlfJkzw98q4nTbrAU2WSRvhh14ZjTA1XwAzRblDVvuTVJYPlwk+XvIbnv/GfRnhSspa8tqSfi5TqUjhvyqezUJZsgEf7Xdg7nP3I96cJtI84+8eeb+394+NPw5ESq2c10vFbq++9dGGVQHu7zaOTd+n5TT9DWST60eN8EPOPLe93TWZjV5XjvfRVsPhtltldjHuvXOY3AeZTOuth8qVE8p7WH+MvA/niI91Cp2ycoIxl5fIvcFfxZVYQwZkzA+80meg9A06whY93UCYHeUorzZnQyglWms0dp3goWV1W53hNm2xXk0+aJVHNyUGvTCT/Sp8WrmnkAWyRzqqatT55Lk/sxD2Z54/Gox9Lng0D30C75a/1/5XE/SIhmrifJaiJi2R/ig0hkj1MKBNeIrxI+B7hBcLzhFfzOJoJcwiXEuYRriBcRbiWUCC0EBYTlhDaCCsJqwlrCB2ETkI3YROhj1AkbCfcRRgg3E3YSbiPsJtwP+EBwoOEPYTHCJ8ifIbwBOFJwl7Clwj7CE8RniY8Q3ie8ALhe4QXCS8RyoTDhGHCTwlHFAllkhHqCQ2EaYQZhJmEWYQmQjNhDuFSwjzCFYSrCNcSCoQWwmLCEkIbYSVhNWENoYPQSegmbCL0EYqE7YS7CAOEuwk7CfcRdhPuJzxAeJCwh/AY4VOEzxCeJOwlfImwj/AU4WnCM4RDyqixCZ0ZRx3risvQ0pYWwfkjMnsVFLb2uy2QualBxEvyfTr6AtDPVeQ3sTd/ceG6vq1fXCjG6s+DwZ3SMB4IxbhZ3J5Fk89e7oqqLUGXXPCb4N1XPQl4C+Q+OtK5j0hHOnnBixnfU9NXoRI04MWRaiuodljPK+yogJo8B6Gsvt6G+7Etzd0AZ3jt5d3JMly5MyB3GwHyOVQP53H7ov1dRfttkZVLUekqOmjrKuoG92BHzuJfidK4CeMmPfScMx82cXd5wbZ9gfUL29ZYcbE3aU2/qF+7sO1jLtLHiEw7Pw7ePdRVdIx3h5X5edGQTpw18/mi85dnBNabdl7gupc/86RW26oqKiKzM/kLsOzhW03RAdiYua+iYckgpQRLO21l8mw0bd3aL7nkSFtnZPbafFqfhAKhhT5t4dju5o9OOV3RL+jrx1xkkEYmYSfhvnyaQmMsyxv4gxLn6v6v6ECr519H9rzeWZwR7BZw9mxL8XwVmZ3Ds+rRVeOJGuLT6GZJ/O1CHsD0H1mLXMLfCNaUVBoOfXkFHZWGO14VQqHRS0vo/dHL4tDvP4pEekWsj9C98Dlu/Umlw6EXSXOY2z89emkJHVLsQ1+GYXyCG6+FcVepPrQbLb3nueSmid2d6SrtCT3J20d4e+oU7RdDp3l71mq0/+HqxHbusZN7FHj7G1O2u3m7k7cfn9Te1SUiQ6FpnyBU5TJ8hUd9PnT2S15eCA2g7O3h1k1XlRGeHc2UI/T0l+qlM3SI653nepYYLzxfh0aT5Ag1X4YSWwOlGxUl3t8DfHxmLkydMv7aqL/VUX+5o5fu0CLu2sE7eP3KhA66YK/nzbt58/Erk8efxwc9m8ZPl2GufYJr77rC/wJMI4000kgjjTTSSKP/z9QgKOV8lDlgvVrPvI2xpbcp10syWOCDTBbQzWKB47h+ZwYL/Ns1LLAV9epUFkg2sICM9icgf/1aFngliQW6oPejFBYoQduT01ngjjQW+CX4HtgIKF8GPw15CsoelJ/D9gvwR+BkyMIzWeBa+CiGfhAyUyILXAfeBq4BZyWwwC3g1bi+Ce2bwV74+wcjfKH8BG1ZiOmTOSzwOPgdHQusnMcCC9HvS9BpRIxl0MuDbxd0F6C9EP6eRdvvYfcQ/H6J9iFwPezLYVeohx+Mqwaya9JZ4CSunwM/gRz8B9q3wf6XqD8NLofNDNQfQ1zL0f8yxPkgyl/Bdh30vejrb6GXCT+fQe8h5K0B5bG56Aux9aBtI9rSYT8PdhbE9zVyuRfx3QfbbvBt6Ot7YLwVBpZhHAnglxH7vbC9BbZh9PMh4vo79LkI/XwfMS+FzuNoz0mi/6HAjqxn7DnwAPgd8CXw5+BUzP1DKHeBRfAprIsbUOaDreBKcC24AfzoemWdfF9dOxdgOww+DX4Y/EPwTvBL4EPgBvA2cAn4GXWNdcK2R4iuS92E/7OwHDw0S2AzJ6xf/l3QdI3AEqaQD0HOpuhHuFZgRyfIU3k/1wpx7xMHfB/AO/c7NwrshFFgwhyB2WYr5RBkb4BPgV8G94KfBT8D9sHuSZQ94MfA+8E/AneCfwjeBd4JDiNWH0oP2AmuBVeDy8ElYCtYAK8BrwDn3qjGAHaAc1BfCM4CzwEbwalgPfjrGwQ2Av4YPAwemj0+fk58XL45335cH9zw7cZ18Yb/mXGlmQRmmjCuJMgcE2SzdMp8Wv9ZYb5Omkzx570bNuEVArsEnaEp8vO+aer89Mz5dvkR5grsAvr4FfgMeADcB34RfBL8c/BT4CPgg+BHwd3gveDd4AfA7WD/N4yB0xA2+KGVArtGN15+DW+7bur7KpAlsFsmyBeB866P5nE4UWGuL8TI/z1RYernBuEb4wojLssClJnj87t+Qfz1F5j351t/jnnR9bdqQfz1l79AWX9LUV5F/hejNIHngzPAMxYo43LM//bjujj/zzeuwPz/3rjC8yeP67sbsi7/y83zld27s1/g/yS4cJHAbubffEEXFylzLqPkS+KTRcoe/TVK07RH5vH/J1e5avK64LYmsyLPMSu2BWbFdr05atsdx9am6nC7M3F0fDE64Tg63TE6Gaun1jkRo7Mqjs5QjE5NHJ2wWcnZFXW8SdnKeGdkR8cbiGNrylZzla3mSrXhfzfyUhwbm2pTrepyX+E4ur7saPxZa+LkSu3vgBrDUTX+n8fEL8SxHYrpf1ccnXC2mp+YeHum0D12a/Q6A2cS/tdmgXVR2Rp+TslHnDF667GCM6F3PkZvBLJK6HXG6AlwZ4DemRi9bZCVQC8Qo3cfDwt6hvVR2YuQdeZr52/t/P1/4/xdat2wIj/XUlLCNjK7fUN7u9Vf1+wqrvM6m1x+9hGzN4gtTay0ompDeWWus6mJsTuhh4sWr6u9UWQP6ezq1Tlmp7KY2avrfaK1sUlEDxsTSMj+htnr6pudTV5WDfsdLrG5rtFb59/Rymbq7I3eRhHKzawDba0usa0VlTrR7fL7GXsclk5PW6tob3A27uT/8GW3++z2+pZm/v/LGWtR6g1K7UGlB3udz2cX7/VB8gaPq97lE+1uZVQFjD3PYO8V/S1NDT7GFutud4mlLc62JnXghYzZuKxCrPOLbb6N3oaWQnZHUfmmopKCfCULj+lKWuqcG9r8rS3+QrY4ocIlKhWWgWuvs9TV2lq3g/e0kvdkq/O7vCL8Fnnrtje5tjR6nS0/wAxRLxsRSyFLZoU+H1l62wpZEfm/t1V0NXMBe5pZ/HU/4JrYvxnaNjQ1osdyV73IrLG6or+xvpWxfbqNrVy7sR4zVlFUPhr3LWyD31UnuqwY/kavs9GPDgrZZt7D5u0eqjAvr1W62sWidhE+bC2NXrEgv5DdbtmoduNnFW5XU1NRu6u+TcQgK4qLSkZTU8rslf66+r8sbcE0Fu3kw2YbNpduqBzLnUW3SUS+KhubXf5yV2tLU5vYyMf1NdsklrW5/PdOavGKMCTj4zo+vc3b633a9xyNNNJII4000kgjjTTSSCONNIpH/fxb/VxhyrYWn8vLS7co+tYsW8a/wrTmir4dufUtzbl1bcua2urrWt3LWHZuQQPX02np1EgjjTTSSCONNNJII4000kij/+WURL83JDAWmMaUn6JPYvRT9oEZKA+g5D9+cwIl//mT08qv3MdQAr3/X4Sc/43WyBTtTqBRxwL8Y0GObmK7jiVz/1PIuaB6Cjn354sj75xCnpLGWM+kjxSK/MRUcj1jfXHkQ3HkF+P0H46jP+mP11V9/sNLNg9jckz7qmbK2xiZtjN2MKbeV89YVmJM+z2M1cT07PAytjCmfhET0RSj34n2R2P89bHTlMNpVLtMfz/PWCHbzlpYGxPZf7Z3fb1xE0F8kouUEiiOVJBAQtQcCAXU3OVCGto0fxouLQ1taNT8USUekOPzXUzP9snrS3JPXPsBEB+DFwTiHZRnxCfgE5T/99iHCjMzu/bZd5fkioR48Wzs9ezs/nZ2ZnZtK/ZZh22wwQELfChjmQtV5GtY5xxswBbKt8DAUsFHVMsG8n1OfRVgAl6ElzDR832PcN/meBtl2RRKDxFHyqh1uj8d7mEusNc662Jz/zrsslTEfAkK0H38LsJ+OYFNmjegxdrVYJ/7mcLSdzCfhRlM78eeyXH77zBSZ1H3Edb5Ltzuw9fhC8T/M0f4hBhgDwtQxHTIqcBam2gdgXIDOQvLTNTEwTpBPEp/wBiLiUiJ3tkeQ1/9+CX/2A48hs84H9Zm5C0CO81jqdm1+Q3sqPEDW+BttFYdsQS2SNKjc7C5g7Z+FV4A+gGnMHzYJ/9ByX85Qb4D11j+6wA52VvD9h8oX5K1N1Bjl0fcxO2kEacxjhBjNYVhwNEzYmio540ERhnrSv+57IWzMNrw8PrXGGlvol1/GzjWkc1xZfffc5Hd05r21v9E1f8jrr+GWlSxTRP1CFK16Ve9xnH/M7yhxtAeYrbd42ip9fhdYl1KYfXaI4m9ziuHh8cO4g22sPTTNZyVXRs7WLOOyebIM7lVBY8jqufmcL+Lkfwp7m+gtlvY1134GPl13N/EY6Lvx/76myJ7VJ07olw9Hsnfdeldvn8apbIt1NbniKshms3zOBoNwFdcZwbmcLvK+R5/NuUVxivzbHeURUhrPVHeYMu2UEuD6xDdgkmUR/2ssUdM7r+RslrXtoOjbh6eT+CkV0yiEvqO1j7az/BervzXuf911pfauLxydTU8q9+P4AK2v4OyGrfsX3lh6NV4im3VxdrGFgZ63+IY8uGBioNNPL+MoJ8lnq10jsbuDql7AcuOuJ700SbjHXC0Wrj+NBmPrm/uw2tK7iFPa3yQ8uHp/ei4DjUwUUybqbmwwD5L4/Z67iS/SZ23EJdmic0WSOq8xvJdtlt/FAO8xTNAWpjODfWeWfrc2LdjkU90eQ2JePJrSO0Tvz/UlleI7bbMKOHB8fEx5lQS8h+d4jijFPI7Af/2AjfdMgw7WqJEk3wnZjV++yAqCGNK85rktY5kOwqhK5YVwlgcJnktzXeiDjTJqgx56PIwiO+pD0kehuE7ES/11bryTjzejpYef5LvtVevPfvs3eePZ3KkoqcrYXiMF1ntkRAX8M+f4pKN9x0XaSOr4L3IeHI7xkvP5NYrpzZRe8IiTMLmPqgvRRTnk/G8GlPXyv9lnGuJuIrdo7wQSlaT/ugou5+2xb7gNhwvndjvia+kPbmI9y0a6pqTW/uUf/CSLKpHbaitPKfq+iRb6TGfDScnJUf3MdHSsLhy5NT1A8sXtucu5UuFmbxuuaZXsd3aUn5n++b0lbwuAsOtGPSawVK+ZYn8yrJ+fuL8xKIhhOXs1Vs6YrhiKd/03QVh7luOIaYd2/Q94VWDadNzFgzhFA5Ked0xXLtqiWA32SGh6THYesVyAztoUWFKMUp5Lm34nmkJetrfN/ftwDKDpo+q3b8yL+Wu4SB758Nba5awa64o7AR2XRT4Ufay51btmqxHLyUs5Q9t973ZPPJFVoR0qVjC9O0GPfC+vNpo1G3ToGM98HRhBXqwb+kBgel+/GC87lV1+SqBWCwm20s8epsA7driLroFwaoatSw/wQppTVWRHORGZOaC6rxQppcx3OmyfKdCRNVjS84nLXm2LbFGcw8NcNtqbXsPLAK4fPXy3vxcaW7ONKulSjWqVzfcWtOoYeN3VVFxmQdbHDzabrk0y2IxGvxyMrpfx2vn5H3vsPdWBU4ZZZRRRhlllFFGGWWUUUYZZfR/0j9QSwECFAAUAAIACAAsnkc3vhwG0XgZAAAAgAAAEwAAAAAAAAAAACAAAAAAAAAAVGltZXJSZXNvbHV0aW9uLmV4ZVBLBQYAAAAAAQABAEEAAACpGQAAAAA=",
    "revertScript": "@echo off\ntitle Revert Timer Resolution Settings - Pokky Optimize Shop\necho Restoring Windows Default Timer Settings...\n\n:: Reset BCD settings to Windows defaults\nbcdedit /deletevalue useplatformclock\nbcdedit /set disabledynamictick no\nbcdedit /deletevalue useplatformtick\n\necho.\necho [SUCCESS] Settings have been restored to Windows defaults.\necho Please restart your computer to apply changes.\npause\nexit",
    "createdAt": "2026-09-04T16:22:19.543+00:00",
    "updatedAt": "2026-09-04T16:22:19.543+00:00"
  }
];
