# Reto Hackaton

Proyecto para la gestión de solicitudes con backend en Django y frontend en React.

---

## Requisitos

- Python 3.13 o superior
- Node.js y npm
- SQLite (integrado por defecto con Django)

---

## Configuración Backend (Django)

1. Clona el repositorio y entra a la carpeta del backend:
   ```bash
   cd reto_hackaton
python -m venv venv
venv\Scripts\activate  # En Windows
# o
source venv/bin/activate  # En Linux/Mac
pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
# Usuario: admin
# Contraseña: 123tamarindo

python manage.py runserver

cd reto_hackaton_front

npm install
npm run dev

Abre el navegador en la dirección que te indique la consola (por defecto http://localhost:5173).

Usuario: admin

Contraseña: 123tamarindo

La autenticación se realiza con JWT. Usa el login para obtener el token y acceder a la API.

Las solicitudes pueden ser aprobadas o rechazadas.

Se pueden agregar procesos solo para solicitudes aprobadas.

El frontend está organizado en módulos con estilos diferenciados para facilitar su uso.

