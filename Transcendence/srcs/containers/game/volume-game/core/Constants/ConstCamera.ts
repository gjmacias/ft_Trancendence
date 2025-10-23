export const    // ===================
                // CONSTANTES DE CÁMARA
                // ===================

                // Configuración por defecto de cámaras
                CAMERA_DEFAULT_FOV = 60,
                CAMERA_GAME_FOV = 75,
                CAMERA_MIN_FOV = 10,
                CAMERA_MAX_FOV = 170,

                // Límites de zoom
                CAMERA_DEFAULT_MIN_ZOOM = 10,
                CAMERA_DEFAULT_MAX_ZOOM = 100,
                CAMERA_GAME_MIN_ZOOM = 20,
                CAMERA_GAME_MAX_ZOOM = 80,

                // Posiciones por defecto
                CAMERA_DEFAULT_DISTANCE = 40,
                CAMERA_GAME_DISTANCE = 35,
                CAMERA_TOPDOWN_HEIGHT = 50,

                // Ángulos por defecto (en radianes)
                CAMERA_DEFAULT_ALPHA = Math.PI / 2,
                CAMERA_DEFAULT_BETA = Math.PI / 4,
                CAMERA_GAME_BETA = Math.PI / 3,

                // Tamaños ortográficos por defecto
                CAMERA_ORTHO_DEFAULT_WIDTH = 20,
                CAMERA_ORTHO_DEFAULT_HEIGHT = 15,
                CAMERA_ORTHO_LARGE_WIDTH = 50,
                CAMERA_ORTHO_LARGE_HEIGHT = 30,
                CAMERA_TOPDOWN_WIDTH = 60,

                // Límites de seguridad para evitar gimbal lock
                CAMERA_MIN_BETA = 0.01,
                CAMERA_MAX_BETA = Math.PI - 0.01,

                // Aspect ratio por defecto
                CAMERA_DEFAULT_ASPECT_RATIO = 16 / 9,

                // Factores de zoom
                CAMERA_ZOOM_STEP = 1.2,
                CAMERA_ZOOM_SMOOTH_FACTOR = 0.1,

                // ===================
                // CONSTANTES DE CONTROL
                // ===================

                // Sensibilidad de controles de cámara
                CAMERA_ORBIT_SENSITIVITY = 0.005,
                CAMERA_PAN_SENSITIVITY = 0.01,
                CAMERA_ZOOM_SENSITIVITY = 0.1,

                // Velocidades de movimiento suave
                CAMERA_SMOOTH_MOVE_SPEED = 0.05,
                CAMERA_SMOOTH_ROTATION_SPEED = 0.03,

                // ===================
                // CONSTANTES DE RENDERIZADO
                // ===================

                // Planos de clipping
                CAMERA_NEAR_PLANE = 0.1,
                CAMERA_FAR_PLANE = 1000,

                // Configuración de calidad
                CAMERA_ANTIALIASING_SAMPLES = 4,
                CAMERA_SHADOW_MAP_SIZE = 2048
                ;