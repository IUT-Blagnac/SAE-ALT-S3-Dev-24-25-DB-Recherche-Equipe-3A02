from fastapi import FastAPI
from api_manager import api_router
from mqtt_manager import start_mqtt

app = FastAPI()

# Inclure les routes WebSocket
app.include_router(api_router)

# Lancer le client MQTT dans un thread séparé
if __name__ == "__main__":
    start_mqtt()

    # Lancer le serveur FastAPI
    uvicorn.run(app, host="0.0.0.0", port=8001)