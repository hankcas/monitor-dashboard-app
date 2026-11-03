# Monitor Dashboard

Dashboard de monitoreo industrial en tiempo real para una línea de producción simulada. Muestra cuatro variables de proceso con sus umbrales de operación, la tendencia de cada una, el estado del sistema y un registro de alarmas.

Combina **React** en el frontend con una **API en Node.js/Express** que simula los sensores de la planta.

## Funcionalidades

- **4 sensores**: temperatura (°C), humedad (%), presión (bar) y consumo eléctrico (kW)
- **Umbrales de operación**: cada variable se clasifica como *normal*, *advertencia* o *crítico*, con una barra que muestra dónde está el valor frente al rango normal
- **Gráfica de tendencia** (Chart.js) con líneas de límite; se cambia de variable tocando cada tarjeta
- **Encendido y apagado** del sistema desde el panel: al detenerlo, las variables vuelven a sus valores de reposo
- **Registro de eventos** cuando una variable sale de rango o cambia el estado del sistema
- **Modo demo**: si la API no responde, el frontend usa el mismo simulador en el navegador y sigue intentando reconectarse
- Diseño oscuro y responsive

## Arquitectura

```
┌──────────────┐  GET /api/status cada 2 s   ┌────────────────────┐
│  React + Vite│ ──────────────────────────▶ │  Express (backend) │
│  Chart.js    │  POST /api/system           │  simulator.js      │
└──────────────┘ ◀────────────────────────── └────────────────────┘
        │
        └── si la API no responde → modo demo con el mismo simulator.js
```

El simulador (`backend/simulator.js`) genera señales con un **paseo aleatorio**: cada lectura parte de la anterior, tiende al valor de operación y suma ruido y picos ocasionales. Así las curvas se comportan como un sensor real y no como números al azar.

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/sensors` | Sensores, unidades y umbrales |
| GET | `/api/status?limit=30` | Última lectura, niveles, historial y alarmas |
| POST | `/api/system` | Enciende o apaga el sistema: `{ "running": true }` |

## Tecnologías

- **Frontend:** React 19, Vite, Chart.js (`react-chartjs-2`), CSS Modules
- **Backend:** Node.js, Express 5, CORS

## Estructura

```
backend/
├── server.js        # Rutas de la API
└── simulator.js     # Simulación de sensores, umbrales y alarmas (compartido)
src/
├── components/      # Header, SensorCard, TrendChart, SystemPanel, AlarmLog
├── config/          # Datos visuales de cada sensor
├── hooks/           # useTelemetry: consulta periódica y modo demo
├── services/        # Cliente de la API y fuente demo
└── App.jsx
```

## Cómo ejecutarlo

**1. Backend** (puerto 3000):

```bash
cd backend
npm install
npm start
```

**2. Frontend** (en otra terminal):

```bash
npm install
npm run dev
```

Para usar una API en otra dirección, crea un archivo `.env` con:

```
VITE_API_URL=https://tu-api.com
```

Sin backend, la aplicación arranca en modo demo.

## Autor

**Leonardo Castro** — Ingeniero Mecatrónico y desarrollador Full Stack
[GitHub](https://github.com/hankcas)
