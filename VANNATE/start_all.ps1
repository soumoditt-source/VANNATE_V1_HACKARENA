Write-Host "Starting Vannate 2026 Microservices..." -ForegroundColor Cyan

# 1. Start Python
Write-Host "Initializing Python AI Service..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:/VANANATE 1.0/VANNATE/backend/python_ai'; pip install -r requirements.txt; python main.py" -WindowStyle Minimized

# 2. Start Java
Write-Host "Initializing Java Core Service..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:/VANANATE 1.0/VANNATE/backend/java_core'; javac VannateApplication.java; java VannateApplication" -WindowStyle Minimized

# 3. Start C++ (mock if no compiler)
Write-Host "Initializing C++ Telemetry Engine..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:/VANANATE 1.0/VANNATE/backend/cpp_engine'; if (Get-Command g++ -ErrorAction SilentlyContinue) { g++ main.cpp -o engine.exe; ./engine.exe } else { Write-Host 'No C++ compiler found. Simulating C++ engine...'; python -c "import time; print('Vannate C++ Telemetry Engine Simulated'); time.sleep(99999)" }" -WindowStyle Minimized

# 4. Start Next.js Frontend
Write-Host "Starting Next.js Frontend on Port 3000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:/VANANATE 1.0/VANNATE'; npm run dev"

Write-Host "All systems launched! Check separate windows." -ForegroundColor Green
