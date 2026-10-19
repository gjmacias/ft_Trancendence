# ft_transcendence - [Integrantes del equipo]

## **1. Introducción**

**Lleva el clásico Pong al mundo de las aplicaciones web**

`ft_transcendence` es un proyecto de 42 cuyo objetivo es desarrollar una aplicación web completa alrededor del clásico juego Pong. El proyecto combina desarrollo frontend y backend, comunicación en tiempo real, gestión de usuarios y sistemas de competición, ofreciendo una plataforma donde los jugadores pueden disfrutar de partidas y consultar su actividad.

A lo largo del desarrollo hemos trabajado en la integración de diferentes tecnologías y servicios para construir una aplicación funcional, interactiva y segura.

### Imágenes de ejemplo

Aquí puedes ver algunas capturas del funcionamiento de la aplicación:

| Pantalla principal | Juego Pong |
|:---:|:---:|
| ![Inicio]() | ![Pong]() |

| Perfil de usuario | Torneos y clasificación |
|:---:|:---:|
| ![Perfil]() | ![Torneos]() |

### **¿Qué es ft_transcendence?**

Es una aplicación web que permite a los usuarios jugar al Pong, gestionar sus perfiles y participar en un entorno competitivo.

El proyecto nos ha permitido trabajar en diferentes áreas del desarrollo web:

- **Juego multijugador:** implementación de la lógica del Pong y de las partidas entre jugadores.
- **Gestión de usuarios:** perfiles y funcionalidades relacionadas con las cuentas.
- **Sistema competitivo:** partidas, torneos y clasificación de jugadores.
- **Interfaz web:** diseño de una experiencia de usuario intuitiva y responsive.
- **Backend y persistencia:** gestión de la lógica de negocio y almacenamiento de datos.
- **Seguridad:** autenticación y protección de las funcionalidades de la aplicación.

El proyecto incluye prácticamente todas las funcionalidades planteadas, con la excepción del chat online, que no se ha implementado.

---

## **Índice**

1. [Introducción](#1-introducción)
2. [Arquitectura de la aplicación](#2-arquitectura-de-la-aplicación)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Base de datos](#base-de-datos)
   - [Comunicación en tiempo real](#comunicación-en-tiempo-real)
3. [Funcionalidades](#3-funcionalidades)
4. [Tecnologías utilizadas](#4-tecnologías-utilizadas)
5. [Instalación y ejecución](#5-instalación-y-ejecución)
6. [Demostración](#6-demostración)
7. [Qué hemos aprendido](#7-qué-hemos-aprendido)
8. [Cómo contribuir](#8-cómo-contribuir)
---

## **2. Arquitectura de la aplicación**

La aplicación se organiza en diferentes componentes que colaboran para ofrecer una experiencia completa. El frontend se encarga de la interacción con el usuario, el backend procesa las operaciones y la base de datos permite persistir la información necesaria para el funcionamiento de la plataforma.

### **Frontend**

El frontend proporciona la interfaz desde la que los usuarios acceden a las diferentes funcionalidades de la aplicación.

Sus responsabilidades principales incluyen:

- Mostrar las diferentes vistas y secciones de la plataforma.
- Gestionar la navegación entre páginas.
- Permitir el acceso a perfiles y funcionalidades del juego.
- Mostrar el estado de las partidas y los resultados.
- Adaptar la interfaz a distintos tamaños de pantalla.

### **Backend**

El backend concentra la lógica de negocio y permite gestionar las operaciones de la aplicación.

Entre sus responsabilidades se encuentran:

- Procesar las peticiones de los usuarios.
- Gestionar la autenticación y los permisos.
- Administrar los datos relacionados con las partidas.
- Gestionar los torneos y los resultados.
- Comunicar el frontend con la base de datos.
- Validar los datos recibidos y gestionar los errores.

### **Base de datos**

La base de datos permite mantener la información necesaria para el funcionamiento de la aplicación.

Dependiendo de las entidades implementadas, puede incluir información relacionada con:

- Usuarios y perfiles.
- Historial de partidas.
- Resultados y estadísticas.
- Torneos y clasificaciones.
- Relaciones entre jugadores.

### **Comunicación en tiempo real**

La comunicación en tiempo real es una parte fundamental del juego. Permite coordinar las acciones de los jugadores y actualizar el estado de una partida sin depender de peticiones HTTP constantes.

Esta comunicación permite ofrecer una experiencia de juego más fluida y mantener sincronizada la información necesaria durante las partidas.

---

## **3. Funcionalidades**

La aplicación incorpora las principales funcionalidades del proyecto, con especial atención al juego, la gestión de usuarios y el entorno competitivo.

### **Juego Pong**

- Implementación del juego clásico Pong.
- Gestión de las acciones de los jugadores.
- Actualización del estado de la partida.
- Gestión de los resultados.
- Interfaz de juego integrada en la aplicación web.

### **Usuarios y perfiles**

- Gestión de las cuentas de usuario.
- Acceso a las funcionalidades personales.
- Visualización y gestión de información del perfil.
- Consulta de información relacionada con la actividad del jugador.

### **Torneos y competición**

- Organización de partidas dentro del sistema competitivo.
- Gestión de resultados.
- Seguimiento del progreso de los jugadores.
- Clasificación y estadísticas, según las funcionalidades implementadas.

### **Autenticación y seguridad**

La aplicación contempla mecanismos de autenticación y control de acceso para proteger las funcionalidades disponibles y la información de los usuarios.

### **Interfaz y experiencia de usuario**

- Navegación entre las diferentes secciones.
- Presentación de la información de forma clara.
- Integración de los componentes del juego en la plataforma.
- Diseño adaptado a las necesidades de la aplicación.

### **Funcionalidad pendiente**

El chat online no se ha implementado. El resto del proyecto se ha desarrollado cubriendo prácticamente todos los puntos previstos en el enunciado.

---

## **4. Tecnologías utilizadas**

El proyecto integra diferentes tecnologías para desarrollar la aplicación web, gestionar los datos y permitir el funcionamiento del juego.

Completa esta sección con las tecnologías que hayáis utilizado realmente:

- **Frontend:** [HTML, CSS, JavaScript, TypeScript, React, etc.]
- **Backend:** [Node.js, Django, Fastify, etc.]
- **Base de datos:** [SQLite, PostgreSQL, etc.]
- **Comunicación en tiempo real:** [WebSockets, Socket.IO, etc.]
- **Contenedores:** [Docker y Docker Compose, si procede]
- **Control de versiones:** Git y GitHub.

Cada tecnología cumple una función dentro de la arquitectura y permite separar las responsabilidades de la aplicación.

---

## **5. Instalación y ejecución**

Para ejecutar el proyecto, es necesario disponer de las dependencias y herramientas utilizadas durante el desarrollo.

### **1. Clonar el repositorio**

```bash
git clone <URL_DEL_REPOSITORIO>
cd ft_transcendence
```

### **2. Configurar las variables de entorno**

Crea y configura los archivos de entorno necesarios para el proyecto.

```bash
cp .env.example .env
```

Este comando es orientativo: ejecútalo únicamente si el repositorio contiene un archivo `.env.example`. Configura las credenciales y los parámetros requeridos por vuestra aplicación.

### **3. Iniciar la aplicación**

Si el proyecto utiliza Docker Compose:

```bash
docker compose up --build
```

Si utilizáis otro sistema de ejecución, sustituye este paso por los comandos definidos en el repositorio.

### **4. Acceder a la aplicación**

Una vez iniciados los servicios, abre en el navegador la dirección local configurada para el frontend.

Por ejemplo:

```text
http://localhost:3000
```

*El puerto y los comandos definitivos dependen de vuestra configuración.*

---

## **6. Demostración**

En esta sección se pueden incluir capturas o vídeos que muestren las principales funcionalidades desarrolladas.

La demostración puede cubrir:

- Navegación por la aplicación.
- Registro y acceso de usuarios.
- Gestión de perfiles.
- Desarrollo de una partida de Pong.
- Finalización y resultados de una partida.
- Funcionamiento de torneos y clasificaciones.
- Otras funcionalidades implementadas.

Estas demostraciones permiten apreciar tanto el resultado visual como la integración de los distintos componentes de la aplicación.

---

## **7. Qué hemos aprendido**

El desarrollo de `ft_transcendence` nos ha permitido profundizar en diferentes áreas de la ingeniería de software:

- Diseño e implementación de aplicaciones web completas.
- Integración entre frontend, backend y base de datos.
- Comunicación en tiempo real.
- Gestión de usuarios, sesiones y permisos.
- Desarrollo de lógica de juego.
- Organización y persistencia de datos.
- Uso de herramientas de desarrollo y despliegue.
- Resolución de problemas y trabajo en equipo.

Además, el proyecto nos ha permitido enfrentarnos a los retos de integrar múltiples funcionalidades en una única aplicación coherente.

---

## **8. Cómo contribuir**

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio.
2. Crea una rama para tus cambios.
3. Implementa y prueba las modificaciones.
4. Envía un Pull Request describiendo los cambios realizados.

---

# Quizás pueda interesarte!

### - Perfil de GitHub apresas-
[AQUÍ](https://github.com/apresas-97)

### - Perfil de GitHub Oseivane
[AQUÍ](https://github.com/faltrum)

### - Perfil de GitHub gmacias-
[AQUÍ](https://github.com/gjmacias)

# Contactos 📥

◦ Email apresas: apresas-@student.42barcelona.com

◦ Email Oseivane: oseivane@student.42barcelona.com

◦ Email gmacias-: gmacias-@student.42barcelona.com
