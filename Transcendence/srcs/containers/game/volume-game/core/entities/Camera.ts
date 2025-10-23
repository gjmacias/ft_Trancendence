import { enableCameraControls } from './Utils';
import { 
    CAMERA_DEFAULT_FOV, CAMERA_GAME_FOV, CAMERA_MIN_FOV, CAMERA_MAX_FOV,
    CAMERA_DEFAULT_MIN_ZOOM, CAMERA_DEFAULT_MAX_ZOOM, CAMERA_GAME_MIN_ZOOM, CAMERA_GAME_MAX_ZOOM,
    CAMERA_DEFAULT_DISTANCE, CAMERA_GAME_DISTANCE, CAMERA_TOPDOWN_HEIGHT,
    CAMERA_DEFAULT_ALPHA, CAMERA_DEFAULT_BETA, CAMERA_GAME_BETA,
    CAMERA_ORTHO_DEFAULT_WIDTH, CAMERA_ORTHO_DEFAULT_HEIGHT, CAMERA_ORTHO_LARGE_WIDTH, CAMERA_ORTHO_LARGE_HEIGHT,
    CAMERA_TOPDOWN_WIDTH,
    CAMERA_MIN_BETA, CAMERA_MAX_BETA,
    CAMERA_DEFAULT_ASPECT_RATIO
} from '../Constants/ConstCamera';

export class Camera {
    id: string; // ID única de la cámara
    type: "orthographic" | "perspective"; // Tipo de cámara
    position: {
        x: number;
        y: number;
        z: number;
    }; // Posición de la cámara en el espacio
    target: {
        x: number;
        y: number;
        z: number;
    }; // Punto al que mira la cámara
    fov: number; // Campo de visión (solo para perspectiva)
    orthographicSize: {
        width: number;
        height: number;
    }; // Tamaño visible (solo para ortográfica)
    isActive: boolean; // Si esta cámara está activa
    // Opcionales para control
    minZoom: number;
    maxZoom: number;
    controlsEnabled?: boolean;

    // ===================
    // GETTERS
    // ===================

    get cameraId(): string {
        return this.id;
    }

    get cameraType(): "orthographic" | "perspective" {
        return this.type;
    }

    get currentPosition(): { x: number; y: number; z: number } {
        return { ...this.position }; // Copia defensiva
    }

    get currentTarget(): { x: number; y: number; z: number } {
        return { ...this.target }; // Copia defensiva
    }

    get fieldOfView(): number {
        return this.fov;
    }

    get orthoSize(): { width: number; height: number } {
        return { ...this.orthographicSize }; // Copia defensiva
    }

    get isActiveCamera(): boolean {
        return this.isActive;
    }

    get zoomLimits(): { min: number; max: number } {
        return { min: this.minZoom, max: this.maxZoom };
    }

    get hasControlsEnabled(): boolean {
        return this.controlsEnabled ?? false;
    }

    // Getters derivados/calculados
    get distanceToTarget(): number {
        const dx = this.position.x - this.target.x;
        const dy = this.position.y - this.target.y;
        const dz = this.position.z - this.target.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    get lookDirection(): { x: number; y: number; z: number } {
        const dx = this.target.x - this.position.x;
        const dy = this.target.y - this.position.y;
        const dz = this.target.z - this.position.z;
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (length === 0) return { x: 0, y: 0, z: -1 };
        
        return {
            x: dx / length,
            y: dy / length,
            z: dz / length
        };
    }

    get isPerspective(): boolean {
        return this.type === "perspective";
    }

    get isOrthographic(): boolean {
        return this.type === "orthographic";
    }

    get aspectRatio(): number {
    if (this.type === "orthographic") {
        return this.orthographicSize.width / this.orthographicSize.height;
    }
    return CAMERA_DEFAULT_ASPECT_RATIO;
    }

    // Coordenadas esféricas (útil para controles de órbita)
    get sphericalCoordinates(): { alpha: number; beta: number; radius: number } {
        const dx = this.position.x - this.target.x;
        const dy = this.position.y - this.target.y;
        const dz = this.position.z - this.target.z;
        
        const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const alpha = Math.atan2(dz, dx);
        const beta = Math.acos(dy / radius);
        
        return { alpha, beta, radius };
    }

    // ===================
    // SETTERS
    // ===================

    set cameraId(id: string) {
        if (!id.trim()) throw new Error("Camera ID cannot be empty");
        this.id = id;
    }

    set cameraType(type: "orthographic" | "perspective") {
        this.type = type;
        
        // Resetear valores apropiados según el tipo
        if (type === "orthographic") {
            this.fov = 0; // No aplica para ortográfica
        } else {
            this.orthographicSize = { width: 0, height: 0 }; // No aplica para perspectiva
        }
    }

    set currentPosition(pos: { x: number; y: number; z: number }) {
        this.position = { ...pos };
    }

    set currentTarget(target: { x: number; y: number; z: number }) {
        this.target = { ...target };
    }

    set fieldOfView(fov: number) {
    if (fov <= CAMERA_MIN_FOV || fov >= CAMERA_MAX_FOV) {
        throw new Error(`Field of view must be between ${CAMERA_MIN_FOV} and ${CAMERA_MAX_FOV} degrees`);
    }
    this.fov = fov;
    }   

    set orthoSize(size: { width: number; height: number }) {
        if (size.width <= 0 || size.height <= 0) {
            throw new Error("Orthographic size must be positive");
        }
        this.orthographicSize = { ...size };
    }

    set isActiveCamera(active: boolean) {
        this.isActive = active;
    }

    set zoomLimits(limits: { min: number; max: number }) {
        if (limits.min <= 0 || limits.max <= limits.min) {
            throw new Error("Invalid zoom limits");
        }
        this.minZoom = limits.min;
        this.maxZoom = limits.max;
    }

    set hasControlsEnabled(enabled: boolean) {
        this.controlsEnabled = enabled;
    }

    // Setters especializados
    setPosition(x: number, y: number, z: number): void {
        this.position = { x, y, z };
    }

    setTarget(x: number, y: number, z: number): void {
        this.target = { x, y, z };
    }

    setSphericalPosition(alpha: number, beta: number, radius: number): void {
    radius = Math.max(this.minZoom, Math.min(this.maxZoom, radius));
    beta = Math.max(CAMERA_MIN_BETA, Math.min(CAMERA_MAX_BETA, beta)); // Evitar gimbal lock
        
        this.position = {
            x: this.target.x + radius * Math.sin(beta) * Math.cos(alpha),
            y: this.target.y + radius * Math.cos(beta),
            z: this.target.z + radius * Math.sin(beta) * Math.sin(alpha)
        };
    }

    // ===================
    // MÉTODOS AUXILIARES
    // ===================

    lookAt(target: { x: number; y: number; z: number }): void {
        this.target = { ...target };
    }

    moveTo(position: { x: number; y: number; z: number }): void {
        this.position = { ...position };
    }

    orbitAroundTarget(deltaAlpha: number, deltaBeta: number): void {
        const spherical = this.sphericalCoordinates;
        this.setSphericalPosition(
            spherical.alpha + deltaAlpha,
            spherical.beta + deltaBeta,
            spherical.radius
        );
    }

    zoomTo(distance: number): void {
        const spherical = this.sphericalCoordinates;
        distance = Math.max(this.minZoom, Math.min(this.maxZoom, distance));
        this.setSphericalPosition(spherical.alpha, spherical.beta, distance);
    }

    zoomBy(factor: number): void {
        const currentDistance = this.distanceToTarget;
        this.zoomTo(currentDistance * factor);
    }

    enableControls(): void {
        this.controlsEnabled = true;
        if (enableCameraControls) {
            enableCameraControls(document.querySelector('canvas') as HTMLCanvasElement, this);
        }
    }

    disableControls(): void {
        this.controlsEnabled = false;
    }

    switchType(): void {
        this.type = this.type === "perspective" ? "orthographic" : "perspective";
    }

    reset(): void {
        this.position = { x: 0, y: 0, z: CAMERA_DEFAULT_DISTANCE };
        this.target = { x: 0, y: 0, z: 0 };
        this.fov = CAMERA_DEFAULT_FOV;
        this.isActive = true;
        this.controlsEnabled = true;
    }
}

// ===================
// FUNCIONES FACTORY MEJORADAS
// ===================

export interface CameraConfig {
    id?: string;
    type?: "orthographic" | "perspective";
    position?: { x: number; y: number; z: number };
    target?: { x: number; y: number; z: number };
    fov?: number;
    orthographicSize?: { width: number; height: number };
    minZoom?: number;
    maxZoom?: number;
    controlsEnabled?: boolean;
    spherical?: { alpha: number; beta: number; radius: number };
}

export function createCamera(config: CameraConfig = {}): Camera {
    const camera = new Camera();
    
    camera.id = config.id || `camera-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    camera.type = config.type || "perspective";
    camera.target = config.target || { x: 0, y: 0, z: 0 };
    camera.fov = config.fov || CAMERA_DEFAULT_FOV;
    camera.orthographicSize = config.orthographicSize || { 
        width: CAMERA_ORTHO_DEFAULT_WIDTH, 
        height: CAMERA_ORTHO_DEFAULT_HEIGHT 
    };
    camera.isActive = true;
    camera.minZoom = config.minZoom || CAMERA_DEFAULT_MIN_ZOOM;
    camera.maxZoom = config.maxZoom || CAMERA_DEFAULT_MAX_ZOOM;
    camera.controlsEnabled = config.controlsEnabled ?? true;

    // Configurar posición
    if (config.position) {
        camera.position = { ...config.position };
    } else if (config.spherical) {
        camera.setSphericalPosition(
            config.spherical.alpha,
            config.spherical.beta,
            config.spherical.radius
        );
    } else {
        camera.setSphericalPosition(CAMERA_DEFAULT_ALPHA, CAMERA_DEFAULT_BETA, CAMERA_DEFAULT_DISTANCE);
    }

    return camera;
}

// Funciones factory especializadas
export function createPerspectiveCamera(config: Omit<CameraConfig, 'type'> = {}): Camera {
    return createCamera({ ...config, type: "perspective" });
}

export function createOrthographicCamera(config: Omit<CameraConfig, 'type'> = {}): Camera {
    return createCamera({ 
        ...config, 
        type: "orthographic",
        orthographicSize: config.orthographicSize || { 
            width: CAMERA_ORTHO_LARGE_WIDTH, 
            height: CAMERA_ORTHO_LARGE_HEIGHT 
        }
    });
}

export function createGameCamera(): Camera {
    return createPerspectiveCamera({
        fov: CAMERA_GAME_FOV,
        spherical: { alpha: 0, beta: CAMERA_GAME_BETA, radius: CAMERA_GAME_DISTANCE },
        minZoom: CAMERA_GAME_MIN_ZOOM,
        maxZoom: CAMERA_GAME_MAX_ZOOM,
        controlsEnabled: true
    });
}

export function createTopDownCamera(): Camera {
    return createOrthographicCamera({
        position: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 },
        orthographicSize: { width: CAMERA_TOPDOWN_WIDTH, height: CAMERA_TOPDOWN_HEIGHT },
        controlsEnabled: false
    });
}