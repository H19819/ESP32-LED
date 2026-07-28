const SERVICE_UUID = "12345678-1234-1234-1234-1234567890AB";
const CHARACTERISTIC_UUID = "87654321-4321-4321-4321-BA0987654321";

let characteristic = null;

const status = document.getElementById("status");

if (!navigator.bluetooth) {
    status.innerHTML = "❌ Web Bluetooth nicht verfügbar";
}

document.getElementById("connect").onclick = async () => {

    try {

        const device = await navigator.bluetooth.requestDevice({
            filters: [
                { name: "ESP32 Ambient" }
            ],
            optionalServices: [SERVICE_UUID]
        });

        const server = await device.gatt.connect();

        const service = await server.getPrimaryService(SERVICE_UUID);

        characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        status.innerHTML = "🟢 Verbunden mit " + device.name;

    }
    catch (e) {

        status.innerHTML = "❌ " + e;

    }

};