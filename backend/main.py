from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.murabaha_api import router as murabaha_router
from core.takaful_api import router as takaful_router
from core.mudaraba_api import router as mudaraba_router
from core.musharaka_api import router as musharaka_router
from core.ijarah_api import router as ijarah_router
from core.zakat_api import router as zakat_router
from core.ai_api import router as ai_router
from core.risk_api import router as risk_router

app = FastAPI(
    title="Islamic Fintech Infrastructure API",
    description="API Gateway for Sharia-compliant financial products.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(murabaha_router)
app.include_router(takaful_router)
app.include_router(mudaraba_router)
app.include_router(musharaka_router)
app.include_router(ijarah_router)
app.include_router(zakat_router)
app.include_router(ai_router)
app.include_router(risk_router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "sharia_compliance_engine": "online"}
