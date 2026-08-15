# Control-Gastos 

Buenas, este es mi proyecto de control de gastos, apenas voy empezando así que por ahora solo tiene el **login**. Lo demás (gastos, gráficas, todo eso) lo voy a ir agregando después poco a poco, conforme lo vaya pidiendo el profesor.

Está hecho con:
- **Angular** (el frontend, o sea lo que se ve)
- **Node.js + TypeScript** (el backend, la lógica)
- **PostgreSQL** (donde se guardan los usuarios)

La idea es: Angular le pide cosas al backend, el backend habla con la base de datos, y todo funciona junto.

---

## Lo que necesitas tener instalado antes

- Node.js (yo uso la versión 20, con eso ya viene npm)
- pnpm (yo uso pnpm en vez de npm, corre más rápido)
- PostgreSQL instalado y corriendo en tu compu

Si no tiene pnpm instalado, se instala así:
```bash
npm install -g pnpm
```

---

## Paso 1: Crear la base de datos

Necesita crear una base llamada `control_gastos` en PostgreSQL y correrle el archivo que tiene la tabla de usuarios (`backend/sql/schema.sql`). Yo lo hice con pgAdmin porque se me hacía bolas con psql en la terminal, pero si a ti sí te jala psql, también puedes así:

```bash
psql -U postgres -c "CREATE DATABASE control_gastos;"
psql -U postgres -d control_gastos -f backend/sql/schema.sql
```

---

## Paso 2: Correr el backend

Abra una terminal y metete a la carpeta backend:

```bash
cd backend
pnpm install
```

Copie el archivo `.env.example` y pongale de nombre `.env`, y ahí le pones tu usuario y contraseña real de PostgreSQL (el mío es `postgres` con la contraseña que le puse cuando lo instalé).

Ya con eso, cree los usuarios de prueba (esto solo se hace una vez):

```bash
pnpm run seed
```

Y ahora sí, levante el backend:

```bash
pnpm run dev
```

Si todo salió bien le va a decir algo como:
**No cierres esta terminal**, déjala corriendo ahí.

---

## Paso 3: Correr el frontend

Abre OTRA terminal (sin cerrar la del backend) y metete a la carpeta frontend:

```bash
cd frontend
pnpm install
pnpm start
```

Espera a que te salga algo como `Local: http://localhost:4200/` y ya, ábrelo en el navegador.

---

## Cómo probarlo

Ya con las dos terminales corriendo, entra a `http://localhost:4200` y te debería salir la pantalla de login.

Puedes usar estos usuarios que ya vienen creados de prueba:

| Correo | Contraseña |
|---|---|
| diego@email.com | Diego123! |
| juan@email.com | Juan123! |
| maria@email.com | Maria123! |

O le das clic a **Registrarse** y creas tu propio usuario, eso también ya funciona de verdad y se guarda en la base de datos.

Cuando inicias sesión te manda a una pantalla que dice "Estamos trabajando en el control de gastos..." con Luigi saludando (es la que voy a ir cambiando poco a poco conforme le meta más funciones). Ahí también está el botón de **Cerrar sesión**.

---

## Cosas que ya probé que sí funcionan

- Iniciar sesión con usuario que sí existe 
- Si pones mal la contraseña, te marca error y no te deja entrar 
- Si el correo no existe, tampoco te deja 
- Si dejas campos vacíos, no te deja mandar el formulario 
- Puedes crear más de un usuario y todos pueden entrar por separado 
- Cerrar sesión sí te saca y no te deja volver a `/maintenance` con el botón de "atrás" del navegador 
- Si intentas entrar directo a `/maintenance` sin haber iniciado sesión, te manda al login 
- Las contraseñas en la base de datos NO se guardan en texto plano, están todas hasheadas con bcrypt 

---

## Notas para mí mismo (para no se me olvide después)

- La carpeta `modules/expense/` del backend la dejé vacía a propósito, ahí va a ir el módulo de gastos cuando lo empiece a hacer.
- Todavía no hay dashboard ni nada de eso, solo el login. Un paso a la vez.
- Todo el código del backend está en inglés (nombres de archivos, variables, etc.) aunque yo hable español, así es como se acostumbra a programar.

## Problemas que me salieron y cómo los resolví (por si me vuelve a pasar)

### 1. "psql no se reconoce como un cmdlet..."
Esto pasa porque PostgreSQL sí está instalado pero Windows no sabe dónde está el programa `psql`. Dos soluciones:
- Usar la ruta completa: `& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres`
- O de plano usar **pgAdmin** (la app con interfaz gráfica que se instala junto con PostgreSQL), ahí no necesitas terminal para nada, todo es con clics.

### 2. Se me olvidó la contraseña de PostgreSQL
Si no te acuerdas cuál pusiste, se puede resetear:
1. Editas el archivo `pg_hba.conf` (está en la carpeta `data` de PostgreSQL) y cambias temporalmente el método de autenticación a `trust` en las líneas locales.
2. Reinicias el servicio de PostgreSQL desde "Servicios" de Windows.
3. Corres `ALTER USER postgres PASSWORD 'tunuevacontrasena';` desde psql (sin que te pida nada porque quedó en modo `trust`).
4. **Importante:** regresas `pg_hba.conf` a como estaba antes y reinicias el servicio otra vez. Si dejas `trust` puesto, cualquiera se puede meter a tu base de datos sin contraseña, eso no se queda así.
5. Pones la contraseña nueva en tu `.env`.

### 3. Error `SASL: client password must be a string`
Este error salía porque mi archivo `.env` no existía (o el password venía vacío). El backend necesita ese archivo sí o sí para saber cómo conectarse a PostgreSQL. Solución: crear el `.env` de verdad (copiando `.env.example`) y llenarlo con mis datos reales, no dejarlo vacío.

### 4. Pantalla en blanco al abrir el frontend
Era porque en `angular.json` faltaba la línea de polyfills. Se arregla agregando `"polyfills": ["zone.js"]` dentro de las opciones de build. Sin eso, Angular ni siquiera carga.

### 5. `TS2729: Property 'fb' is used before its initialization`
Este error salía en `login.component.ts` y `register.component.ts` porque estaba armando el formulario (`this.fb.group(...)`) antes de que Angular terminara de inyectar el `FormBuilder`. Se arregló usando `inject(FormBuilder)` directo en la declaración del campo, en vez de meterlo como parámetro del constructor.

### 6. `net::ERR_CONNECTION_REFUSED` al hacer login
Esto no es error de código, es que se me olvidó dejar corriendo la terminal del backend (`pnpm run dev`). El frontend por sí solo no hace nada, necesita que el backend esté prendido al mismo tiempo en otra terminal.

### 7. pnpm se quejaba de "Ignored build scripts: esbuild"
Solo hay que correr `pnpm approve-builds`, seleccionar `esbuild` con la barra espaciadora, dar Enter, y confirmar con "Yes". Es un permiso que pnpm pide la primera vez nada más.