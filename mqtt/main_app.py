from api_manager import api_router
from mqtt_manager import start_mqtt


# Lancer le client MQTT dans un thread séparé
if __name__ == "__main__":
    import threading

    mqtt_thread = threading.Thread(target=start_mqtt, daemon=True)
    mqtt_thread.start()
