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
    "id": "pokky-1788529027101",
    "name": "Pokky Low Latency",
    "tagline": "สคริปต์ปรับแต่งประสิทธิภาพระบบ ปิด Service แฝง และลด Latency เพื่อความนิ่งของเกม",
    "description": "สคริปต์ Pokky Low Latency.bat ออกแบบมาเพื่อปรับแต่งระบบ Windows สำหรับการเล่นเกมระดับ Esports โดยเฉพาะ ช่วยลดการทำงานของ Process แฝงใน Background, จัดสรรทรัพยากรฮาร์ดแวร์ให้ตัวเกมมีความสำคัญสูงสุด และเพิ่มความนิ่งของ Frametime (1% Low FPS)",
    "category": "gpu-profiles",
    "fileFormat": ".CMD",
    "fileSize": "7 KB",
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
        "filename": "pokky-1788529027101.bat",
        "description": "ไฟล์สคริปต์ปรับแต่งหลัก"
      },
      {
        "filename": "REVERT_pokky-1788529027101.bat",
        "description": "สคริปต์กู้คืนค่ามาตรฐานเดิม"
      }
    ],
    "scriptContent": "@echo off\nsetlocal\ntitle Pokky Booster - Windows 11 Low Latency\ncolor 0A\n\nnet session >nul 2>&1\nif errorlevel 1 (\n    cls\n    echo ==========================================================\n    echo  ERROR: Please run this file as Administrator.\n    echo ==========================================================\n    echo.\n    pause\n    exit /b 1\n)\n\n:MENU\ncls\necho ==========================================================\necho              POKKY BOOSTER - LOW LATENCY\necho                    Windows 10 - 11\necho ==========================================================\necho.\necho  [1] Apply Low Latency Tweaks\necho  [2] Restore Backup\necho  [3] Show Current TCP Settings\necho  [4] Exit\necho.\nchoice /c 1234 /n /m \"Select [1-4]: \"\nif errorlevel 4 exit /b 0\nif errorlevel 3 goto SHOWTCP\nif errorlevel 2 goto RESTORE\nif errorlevel 1 goto APPLY\n\n:APPLY\ncls\necho ==========================================================\necho              APPLYING POKKY LOW LATENCY\necho ==========================================================\necho.\n\nif not exist \"%~dp0Pokky_Backup\" mkdir \"%~dp0Pokky_Backup\" >nul 2>&1\n\nreg export \"HKCU\\Control Panel\\Mouse\" \"%~dp0Pokky_Backup\\Mouse.reg\" /y >nul 2>&1\nreg export \"HKCU\\Control Panel\\Keyboard\" \"%~dp0Pokky_Backup\\Keyboard.reg\" /y >nul 2>&1\nreg export \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" \"%~dp0Pokky_Backup\\SystemProfile.reg\" /y >nul 2>&1\nreg export \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" \"%~dp0Pokky_Backup\\PriorityControl.reg\" /y >nul 2>&1\nreg export \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" \"%~dp0Pokky_Backup\\MemoryManagement.reg\" /y >nul 2>&1\nreg export \"HKCU\\System\\GameConfigStore\" \"%~dp0Pokky_Backup\\GameConfigStore.reg\" /y >nul 2>&1\nreg export \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR\" \"%~dp0Pokky_Backup\\GameDVR.reg\" /y >nul 2>&1\nreg export \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications\" \"%~dp0Pokky_Backup\\BackgroundAccessApplications.reg\" /y >nul 2>&1\nreg export \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy\" \"%~dp0Pokky_Backup\\AppPrivacy.reg\" /y >nul 2>&1\n\necho [1/8] Mouse...\nreg add \"HKCU\\Control Panel\\Mouse\" /v MouseSpeed /t REG_SZ /d 0 /f >nul\nreg add \"HKCU\\Control Panel\\Mouse\" /v MouseThreshold1 /t REG_SZ /d 0 /f >nul\nreg add \"HKCU\\Control Panel\\Mouse\" /v MouseThreshold2 /t REG_SZ /d 0 /f >nul\n\necho [2/8] Keyboard...\nreg add \"HKCU\\Control Panel\\Keyboard\" /v KeyboardDelay /t REG_SZ /d 0 /f >nul\nreg add \"HKCU\\Control Panel\\Keyboard\" /v KeyboardSpeed /t REG_SZ /d 31 /f >nul\n\necho [3/8] MMCSS...\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" /v NetworkThrottlingIndex /t REG_DWORD /d 4294967295 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" /v SystemResponsiveness /t REG_DWORD /d 10 /f >nul\n\necho [4/8] Games profile...\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v Affinity /t REG_DWORD /d 0 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"Background Only\" /t REG_SZ /d False /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"Clock Rate\" /t REG_DWORD /d 10000 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"GPU Priority\" /t REG_DWORD /d 8 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v Priority /t REG_DWORD /d 6 /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"Scheduling Category\" /t REG_SZ /d High /f >nul\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"SFIO Priority\" /t REG_SZ /d High /f >nul\n\necho [5/8] CPU and memory...\nreg add \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl\" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f >nul\nreg add \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" /v LargeSystemCache /t REG_DWORD /d 0 /f >nul\nreg add \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" /v DisablePagingExecutive /t REG_DWORD /d 0 /f >nul\n\necho [6/8] Background apps and Game DVR...\nreg add \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications\" /v GlobalUserDisabled /t REG_DWORD /d 1 /f >nul\nreg add \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy\" /v LetAppsRunInBackground /t REG_DWORD /d 2 /f >nul\nreg add \"HKCU\\System\\GameConfigStore\" /v GameDVR_Enabled /t REG_DWORD /d 0 /f >nul\nreg add \"HKCU\\System\\GameConfigStore\" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f >nul\nreg add \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR\" /v AppCaptureEnabled /t REG_DWORD /d 0 /f >nul\n\necho [7/8] TCP...\nnetsh interface tcp set global rss=enabled >nul 2>&1\nnetsh interface tcp set global autotuninglevel=normal >nul 2>&1\nnetsh interface tcp set global ecncapability=default >nul 2>&1\nnetsh interface tcp set global timestamps=default >nul 2>&1\nnetsh interface tcp set global rsc=default >nul 2>&1\n\necho [8/8] Finished.\necho.\necho ==========================================================\necho  APPLY COMPLETE - Restart Windows before gaming.\necho ==========================================================\necho.\npause\ngoto MENU\n\n:RESTORE\ncls\necho ==========================================================\necho                    RESTORE BACKUP\necho ==========================================================\necho.\nif not exist \"%~dp0Pokky_Backup\" (\n    echo Backup folder not found.\n    echo.\n    pause\n    goto MENU\n)\n\nfor %%F in (\"%~dp0Pokky_Backup\\Mouse.reg\" \"%~dp0Pokky_Backup\\Keyboard.reg\" \"%~dp0Pokky_Backup\\SystemProfile.reg\" \"%~dp0Pokky_Backup\\PriorityControl.reg\" \"%~dp0Pokky_Backup\\MemoryManagement.reg\" \"%~dp0Pokky_Backup\\GameConfigStore.reg\" \"%~dp0Pokky_Backup\\GameDVR.reg\" \"%~dp0Pokky_Backup\\BackgroundAccessApplications.reg\" \"%~dp0Pokky_Backup\\AppPrivacy.reg\") do if exist \"%%~F\" reg import \"%%~F\" >nul 2>&1\n\nnetsh interface tcp set global rss=default >nul 2>&1\nnetsh interface tcp set global autotuninglevel=normal >nul 2>&1\nnetsh interface tcp set global ecncapability=default >nul 2>&1\nnetsh interface tcp set global timestamps=default >nul 2>&1\nnetsh interface tcp set global rsc=default >nul 2>&1\n\necho.\necho Restore complete. Restart Windows.\necho.\npause\ngoto MENU\n\n:SHOWTCP\ncls\necho ==========================================================\necho                  CURRENT TCP SETTINGS\necho ==========================================================\necho.\nnetsh interface tcp show global\necho.\npause\ngoto MENU\n",
    "revertScript": "@echo off\ntitle Pokky Optimize - Revert Script\necho [POKKY OPTIMIZE] กำลังคืนค่าระบบ Windows กลับสู่ค่าเริ่มต้น...\necho.\necho [POKKY OPTIMIZE] คืนค่าเริ่มต้นเรียบร้อยแล้ว กรุณารีสตาร์ทเครื่อง\npause",
    "imageUrl": "/pokky-low-latency.png",
    "createdAt": "2026-09-04T13:37:07.101+00:00",
    "updatedAt": "2026-09-04T13:50:03.594+00:00"
  }
];
