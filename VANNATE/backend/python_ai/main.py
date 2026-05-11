from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/api/ai/health")
def read_health():
    return {"status": "ok", "service": "Vannate AI Copilot (Python)"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
