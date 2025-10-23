import {
    LIGHT_DEFAULT_COLOR, LIGHT_AMBIENT_COLOR, LIGHT_DIRECTIONAL_COLOR,
    LIGHT_AMBIENT_INTENSITY, LIGHT_DIRECTIONAL_INTENSITY,
    LIGHT_AMBIENT_Y, LIGHT_DIRECTIONAL_Y, LIGHT_DIRECTIONAL_Z,
    LIGHT_DOWN_X, LIGHT_DOWN_Y, LIGHT_DOWN_Z
} from '../Constants/ConstLight';

export type LightType = "directional" | "point" | "spot" | "hemispheric";

export class Light {
  id: string;
  type: LightType;
  color: string; // Color base de la luz (hex o RGB)
  intensity: number; // 0 a 1 normalmente
  position: {
    x: number;
    y: number;
    z: number;
  }; // No requerido para hemisférica
  direction: {
    x: number;
    y: number;
    z: number;
  }; // Solo para directional/spot
  targetId: string; // Opcional si apunta a algo (como una entidad)
  angle: number; // Solo para spot (en radianes)
  range: number; // Distancia máxima (point, spot)

// Getters básicos
  get isDirectional(): boolean {
        return this.type === "directional";
    }

    get isPoint(): boolean {
        return this.type === "point";
    }

    get isSpot(): boolean {
        return this.type === "spot";
    }

    get isHemispheric(): boolean {
        return this.type === "hemispheric";
    }
}

// Tu función original, solo con constantes
export function createLighting(): Light[] {
    const lights: Light[] = [];

    // Luz hemisférica
    const ambientLight: Light = {
        id: `light-${Date.now()}`,
        type: "hemispheric",
        color: LIGHT_AMBIENT_COLOR,
        intensity: LIGHT_AMBIENT_INTENSITY,
        position: { x: 0, y: LIGHT_AMBIENT_Y, z: 0 },
        direction: { x: 0, y: 1, z: 0 },
        targetId: "",
        angle: 0,
        range: 0
    };

    // Luz direccional
    const directionalLight: Light = {
        id: `directional-${Date.now()}`,
        type: "directional",
        color: LIGHT_DIRECTIONAL_COLOR,
        intensity: LIGHT_DIRECTIONAL_INTENSITY,
        position: { x: 0, y: LIGHT_DIRECTIONAL_Y, z: LIGHT_DIRECTIONAL_Z },
        direction: { x: LIGHT_DOWN_X, y: LIGHT_DOWN_Y, z: LIGHT_DOWN_Z },
        targetId: "",
        angle: 0,
        range: 0
    };

    lights.push(ambientLight, directionalLight);
    return lights;
}

// Funciones helper simples
export function createAmbientLight(id: string, color: string = LIGHT_DEFAULT_COLOR): Light {
    return {
        id: `ambient-${Date.now()}`,
        type: "hemispheric",
        color: LIGHT_AMBIENT_COLOR,
        intensity: LIGHT_AMBIENT_INTENSITY,
        position: { x: 0, y: LIGHT_AMBIENT_Y, z: 0 },
        direction: { x: 0, y: 1, z: 0 },
        targetId: "",
        angle: 0,
        range: 0
    };
}

export function createDirectionalLight(): Light {
    return {
        id: `directional-${Date.now()}`,
        type: "directional", 
        color: LIGHT_DIRECTIONAL_COLOR,
        intensity: LIGHT_DIRECTIONAL_INTENSITY,
        position: { x: 0, y: LIGHT_DIRECTIONAL_Y, z: LIGHT_DIRECTIONAL_Z },
        direction: { x: LIGHT_DOWN_X, y: LIGHT_DOWN_Y, z: LIGHT_DOWN_Z },
        targetId: "",
        angle: 0,
        range: 0
    };
}
