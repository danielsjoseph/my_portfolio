@echo off
REM Pings the portfolio API so Supabase sees real DB activity and doesn't
REM auto-pause the free-tier project after 7 days of inactivity.
set "LOGFILE=C:\Users\Joe\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\supabase-pinger.log"
for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set "LOGDATE=%%c-%%b-%%a"
set "LOGTIME=%time%"
for /f "delims=" %%s in ('curl -s -o NUL -w "%%{http_code}" https://my-portfolio-merged.onrender.com/api/projects/') do set "STATUS=%%s"
echo [%LOGDATE% %LOGTIME%] portfolio keep-alive ping: %STATUS% >> "%LOGFILE%"
