from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
from influx_manager import SensorManager

api_router = APIRouter()

sensor_manager = SensorManager()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

@api_router.websocket("/ws/notify")
async def websocket_endpoint(websocket: WebSocket):
    """
    Point d'entrée du websocket permettant de notifier l'app centrale
    """
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Garde la connexion ouverte
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Un appareil s'est déconnecté du WebSocket.")



@api_router.get("/update-sensor-types")
async def update_sensor_types():
    """
    Met à jour les types de capteurs en appelant fetch_sensor_types.
    """
    try:
        sensor_manager.SENSOR_TYPES = sensor_manager.fetch_sensor_types()
        sensor_manager.all_fields = sensor_manager.collect_all_fields()
        return {"message": "Sensor types updated successfully", "sensor_types": sensor_manager.SENSOR_TYPES}
    except Exception as e:
        return {"error": str(e)}
