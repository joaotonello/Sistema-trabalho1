@echo off
powershell -Command "(Add-Type '[DllImport(\"user32.dll\")]^public static extern int SendMessage(int hWnd, int hMsg, int wParam, int lParam);' -Name User32 -Namespace Win32 -PassThru)::SendMessage(-1, 0x0112, 0xF170, 2)"
