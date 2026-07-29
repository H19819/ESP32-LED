const SERVICE_UUID = "12345678-1234-1234-1234-1234567890AB";
const CHARACTERISTIC_UUID = "87654321-4321-4321-4321-BA0987654321";

let characteristic = null;
let connected = false;

let currentEffect = 0;

const connectButton = document.getElementById("connect");
const statusText = document.getElementById("status");

const colorPicker = document.getElementById("colorPicker");
const brightnessSlider = document.getElementById("brightness");
const brightnessValue = document.getElementById("brightnessValue");
const stripSelect = document.getElementById("strip");


const seat1 = document.getElementById("vorne_links");
const seat2 = document.getElementById("vorne_rechts");
const seat3 = document.getElementById("hinten_rechts");
const seat4 = document.getElementById("hinten_links");


brightnessValue.innerText = brightnessSlider.value;

connectButton.onclick = connectBLE;

colorPicker.oninput = () => {
    changeColor();
    sendCurrentSettings();
};

brightnessSlider.oninput = () => {

    brightnessValue.innerText = brightnessSlider.value;
    sendCurrentSettings();

};

stripSelect.onchange = sendCurrentSettings;

document.querySelectorAll(".effect").forEach(button => {

    button.onclick = () => {

        currentEffect = Number(button.dataset.effect);

        document.querySelectorAll(".effect").forEach(b => {

            b.style.background = "#374151";

        });

        button.style.background = "#0A84FF";

        sendCurrentSettings();

    };

});

async function connectBLE()
{

    try
    {

        const device = await navigator.bluetooth.requestDevice({

            filters: [

                { name: "ESP32 Ambient" }

            ],

            optionalServices: [

                SERVICE_UUID

            ]

        });

        const server = await device.gatt.connect();

        const service = await server.getPrimaryService(SERVICE_UUID);

        characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        connected = true;

        statusText.innerHTML = "🟢 Verbunden";

        sendCurrentSettings();

    }
    catch(e)
    {

        console.error(e);

        statusText.innerHTML = "❌ " + e.message;

    }

}

async function sendCurrentSettings()
{

    if(!connected)
        return;

    const hex = colorPicker.value;

    const r = parseInt(hex.substring(1,3),16);
    const g = parseInt(hex.substring(3,5),16);
    const b = parseInt(hex.substring(5,7),16);

    const w = 0;

    const brightness = Number(brightnessSlider.value);

    const strip = Number(stripSelect.value);

    const data = new Uint8Array([
        strip,
        r,
        g,
        b,
        w,
        brightness,
        currentEffect
    ]);

    try{

        await characteristic.writeValue(data);

    }
    catch(e){

        console.error(e);

    }

}

async function changeColor(){
    switch(Number(stripSelect.value)){
        case 0:
            seat1.style.background=colorPicker.value;
            seat2.style.background=colorPicker.value;
            seat3.style.background=colorPicker.value;
            seat4.style.background=colorPicker.value;
        break;

        case 1:
            seat1.style.background=colorPicker.value;
        break;

        case 2:
            seat2.style.background=colorPicker.value;
        break;

        case 3:
            seat4.style.background=colorPicker.value;
        break;

        case 4:
            seat3.style.background=colorPicker.value;
        break;
    }


}
