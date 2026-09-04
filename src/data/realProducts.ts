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
    "id": "pokky-1788536637641",
    "name": "ShxrkXinside Latency & FPS Booster",
    "tagline": "ปลดล็อกความแรง ลดดีเลย์ และเพิ่มความนิ่งของเฟรมเรตสำหรับเกมเมอร์สาย Competitive โดยเฉพาะ",
    "description": "ชุดสคริปต์ปรับแต่งระบบ Windows ระดับสูงจาก ShxrkXinside ที่เน้นการลด DPC Latency และเพิ่มความเสถียรของ Frametime โดยการปรับแต่ง Registry ในส่วนของ Network Throttling, System Responsiveness และการจัดการคิวงานของ CPU/GPU (MMCSS) ช่วยให้การตอบสนองของเมาส์และคีย์บอร์ดฉับไวขึ้น ลดอาการ Micro-stuttering ในเกมแนว FPS เช่น Valorant, CS2 และ Apex Legends",
    "category": "os-scripts",
    "fileFormat": ".ZIP",
    "fileSize": "3 KB",
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
        "filename": "pokky-1788536637641.bat",
        "description": "ไฟล์สคริปต์ปรับแต่งหลัก"
      },
      {
        "filename": "REVERT_pokky-1788536637641.bat",
        "description": "สคริปต์กู้คืนค่ามาตรฐานเดิม"
      }
    ],
    "scriptContent": "PK\u0003\u0004\u0014\b\b\b�#3\\\u0012\u001bsetting shxcry.cmdup\u0017\u0001�#�Usetting shxcry.cmd�YmO�H\u0012�\u001e)����.�\u0011���0h­I\u001c&��X�\u0019�.�Ucw\u0012\u000b��m�!ٽ��~�\u001d;8\t\fx\b{_�B@�vW�SoO����\u0001\u001b\u000e�9�\n����\u001az�p'��D��\u0007�1\u000f�ЧNdSh�A$�MF���<ơ��s\u0013�P������V)��s}\u001a�\u000e��|N��e��\u0007�.��a�:�hV��\u0005��k�v����\u001b\u0005�'�\u001b���\u001eS/\bᖱP@�0��\u000e�9\u000e���#��c7,\u0002��@}r�8\"4�\u001b%�\u0018X\u001a�P�`����s����W\u000f\u0018�+�\u000fF[��\u001a��R�T�\u0005&\u0015`�\u0007����\u0010����:\u0013A��|����6��B\\W\n�*5-\b�\u0019\b\tW�����Rw�\u0014�9w\b�\u0016\u0014����B�V�)�N>'-\u0019Ha�p\u0004E'\n<�FI�=�\u0013\n�\u00139�ޖ�E��\u0019\u0016\u000f\u000fO�\"!�r�|0�\u001c~<�Do�+p�G\u001eT�~���\n\u0012[����g�t�g�3h0�\"��oD�[˼�ڠ7�z�2\u0013��\n�\u001b*\u0007�|��4\f\t��77��\u0007�pHm\u0011�Q�fC���2�# �\u0003�/_�\u0003�\r�\u0003�t�qm�B�4�r}�=��z�9��7�C�|�O\u0003\fn�\u0007s�b�\nP��um^��\b�\u001fAI@_���q��7��@\u0015JCe�w��\\����.�\r�\fc\u0001��\u0012��ľ\u001bq\u0016a�\"~K�\u001edC�`C�>j����R\t��xo���n�w\u0019R\u001e\u001f�Y�����vu\u000bE}]ʰ\t��\n߸2P�R���\u001d`f�\u0011��#�1>̆��\n�rS<iA�;ꇵ*8�s'a�?\u000b���b򅝟�!~�(F\u000f���\u0019�7��w\u0012���\u0017�y�\u0003��{\u0017!\u001fXv�\u0006\u0003�p2�\u0002�2h��gH�^��]pX\"��o�|�\u0007*��22���&���o�^��;*R7��A=�\u000e���l�����u����ѭ�\r�\u0004����᎖\u0002���MU����EB�����i�;��xG+�\u0017�X�Y�R���\u0018��u\u0006\u0017 �\u0019��ԒP\u0010.jN\u0012���%�9�\u0007\u0012\u0004Q8�5~~ӵ���\n^�\u0004Ń�\u0005\u0015E<��@mȈ)��\u0001���m��i�^aU���zi�?�?���\\\u0016�+�$[\t�J��G�\u001eg3���\u0019�U\u0001���\u0010�]�D�S��}V��::tz\r=��R���\u000b\fs�H\u0002.�#����焧a��\rƏY\u000b���\"\u0015v�=ğ��*/�i_��؃\u0016\t&�T�~�\u001a+��5�+����.7R��1��M�\u001ei@��k�K#��rݣHǣ\u0004�\u0004�K�8t��w�Ͱ'+���\n���\tK!lK9ۃ\u000f�ybiQ�t�r,\\��z���V_�6i��R<�`>)��HЩ�D��\re�Hc\u0012*v1!Sw\u0012MdW�F�S6$?}?Ӭ;[�\u001at�Uz؉d�E\u001d�\f�\u0019v�\u0013�3ih�1ٲƜ\t�����;t�\u001eX�a|e��\u001fTk�M��\u0001\t\u0012;��h߸g�z�[���O�D��l�\u0015*�\u0017$\u0002v�4\u001d��{peR����R�[��햟a\u0016���)@��EV\u0011���Nɂgwڼ-�h�=�5K�֟\u000e�J%\u0015��`\u0007���_R�\u0019��ҸI��e{d�>��\u001f^I\n�\u0007\u0006w\u0019w�,���\u001f���\\��#xx�'�����G�b�\u001eT�\u001b&\r��+�����D�\u0018'r�\u000e�7��W�}:נ1��-׾����\u0017�%\u0018E�B_[\u001e\b�\u0019r�N��S��݅\u000f��0M�m9��;!\u0001�(�\u0001\u0011��\u0010<>\t;I\u0002A�B\u000e��}1㌦�!ͫ\b��9��n2hZf��\u0018��mC.����\t�B�]��c��S�������\u001f���ȓ�U\u0007\u001b\u0015\u001e��w?�B�:fFZ�fyZ=c\u0004��yp��T��\u0005�(��Sa\u0007���\u0006\"���\u001b-\u000b�n�\u0013Gzӝb��\u001b\\!7�H�M����9E��M�x&��2���\u0001�en���0.\b䋵:������~�k�\u001a��i��:�R�\u00197���\u0017����\u0005TU��q9��D�0�H8���\u0017��B���s~X��|\u0003��W\u001fKW\u001f�]�e�l�>�h�#�������e[\u0016�E�f�\\JդX~�ϩ1^{1�+�U�*�rzЦ�\u0006Զ�\rN��k�*[��]̙\u000e\u001d�>\u001aY�IO�>K�3O��-ys��^j4R���D��\u0005S����Q\u001a@��~�\u0014y�#;�Ğۅ��\u000b�\u0017Ҵ�\u0011�2���*�X\f���4�m\n�4<M�\u001dO��T� 6{ۏ>����ѭ�'��IH�G̟\n��9�F��?}�����\f�_l��ϟ��^�1n���\u0018u\t�����\ne�d\u0001�nڱUnP\u001e��}7���1��`�\"��G�L8\u0012[��z��9Pv�\f�\r��\u0007�I1\u0005�\n���\u0017PK\u0007\b�\u001d:��\u0007)\u001fPK\u0003\u0004\u0014\b\b\b�#3\\\u0012\u001bshark_latency1.regup\u0017\u0001�\u0010/Cshark_latency1.reg}�QK\u0002Q\u0010����� ����\u001e\u0002\u001fb\u0011��\"�\u0010W��\u0012\u000b�+�%���ۻ\u0012b ��̙3�̹��}'#gF��%M�\b|Y[��dc�#��\nq��|)��s�\r\u0017�<\r��\u001d���oFLy慄{㔮1�{�'�ҷ����+J�V�T;wR\u0012���\u0005s��yzTMy5ˢ���戟D7���Ot���S.�9�C\u001c�^��`g۸�z3��\u000eO�Vo뚫�+�\u000b5˨[o��%�;�\u0001PK\u0007\b�xZM��\u0001PK\u0001\u0002\u0014\u0014\b\b\b�#3\\�\u001d:��\u0007)\u001f\u0012\u001bsetting shxcry.cmdup\u0017\u0001�#�Usetting shxcry.cmdPK\u0001\u0002\u0014\u0014\b\b\b�#3\\�xZM��\u0001\u0012\u001b@\bshark_latency1.regup\u0017\u0001�\u0010/Cshark_latency1.regPK\u0005\u0006\u0002\u0002�l\t",
    "revertScript": "@echo off\ntitle Reverting ShxrkXinside Optimizations - Pokky Optimize Shop\necho Restoring Windows Default Settings...\n\n:: Restore Network Throttling Index\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" /v \"NetworkThrottlingIndex\" /t REG_DWORD /d 10 /f\n\n:: Restore System Responsiveness\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\" /v \"SystemResponsiveness\" /t REG_DWORD /d 20 /f\n\n:: Restore Games Task Priority\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"GPU Priority\" /t REG_DWORD /d 8 /f\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"Priority\" /t REG_DWORD /d 2 /f\nreg add \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games\" /v \"Scheduling Category\" /t REG_SZ /d \"Medium\" /f\n\n:: Restore BCD Settings\nbcdedit /deletevalue useplatformclock\nbcdedit /deletevalue disabledynamictick\nbcdedit /deletevalue useplatformtick\n\n:: Restore TCP Settings\nnetsh int tcp set global autotuninglevel=normal\nnetsh int tcp set global chimney=enabled\nnetsh int tcp set global dca=enabled\nnetsh int tcp set global netdma=enabled\nnetsh int tcp set global ecncapability=enabled\n\necho. \necho Revert Complete! Please restart your computer to apply changes.\npause",
    "imageUrl": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80",
    "createdAt": "2026-09-04T15:43:57.642+00:00",
    "updatedAt": "2026-09-04T15:43:57.642+00:00"
  },
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
    "downloadsCount": 3,
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
    "revertScript": "@echo off\nsetlocal\ntitle Pokky Booster - Revert to Defaults\ncolor 0A\n\nnet session >nul 2>&1\nif errorlevel 1 (\n    cls\n    echo ==========================================================\n    echo  ERROR: Please run this file as Administrator.\n    echo ==========================================================\n    echo.\n    pause\n    exit /b 1\n)\n\ncls\necho ==========================================================\necho            REVERTING POKKY LOW LATENCY TWEAKS\necho ==========================================================\necho.\n\nif exist \"%~dp0Pokky_Backup\" (\n    for %%F in (\"%~dp0Pokky_Backup\\Mouse.reg\" \"%~dp0Pokky_Backup\\Keyboard.reg\" \"%~dp0Pokky_Backup\\SystemProfile.reg\" \"%~dp0Pokky_Backup\\PriorityControl.reg\" \"%~dp0Pokky_Backup\\MemoryManagement.reg\" \"%~dp0Pokky_Backup\\GameConfigStore.reg\" \"%~dp0Pokky_Backup\\GameDVR.reg\" \"%~dp0Pokky_Backup\\BackgroundAccessApplications.reg\" \"%~dp0Pokky_Backup\\AppPrivacy.reg\") do if exist \"%%~F\" reg import \"%%~F\" >nul 2>&1\n    echo [OK] Registry backups restored.\n) else (\n    echo [WARNING] Backup folder not found. Skipping registry restore.\n)\n\necho [OK] Resetting TCP/IP stack to default...\nnetsh interface tcp set global rss=default >nul 2>&1\nnetsh interface tcp set global autotuninglevel=normal >nul 2>&1\nnetsh interface tcp set global ecncapability=default >nul 2>&1\nnetsh interface tcp set global timestamps=default >nul 2>&1\nnetsh interface tcp set global rsc=default >nul 2>&1\n\necho.\necho ==========================================================\necho  RESTORE COMPLETE - Please restart Windows.\necho ==========================================================\necho.\npause\nexit /b 0",
    "imageUrl": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80",
    "createdAt": "2026-09-04T13:37:07.101+00:00",
    "updatedAt": "2026-09-04T15:35:52.998+00:00"
  }
];
