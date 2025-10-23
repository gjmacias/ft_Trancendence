import { GameConfiguration, TypeRole } from "../entities/GameConfiguration";

export interface GameOptions {
    mode?: string;                    // "local" | "bot" | "remote" | "test"
    type: TypeRole;                   // "1v1" | "teams" | "multi1v1" | "royale" | "tournament"
    // Solo overrides opcionales (si quieres cambiar los defaults)
    havePowerUps?: boolean;           
    maxTime?: number | null;          
    winScore?: number | null;         
}

export class GameConfigurationParser {
    
    /*
    Crea GameConfiguration y opcionalmente sobrescribe valores
     */

	// string: "1v1 0 0 0 34531 12312"

	// stringArray[] = string.split(" ");

	// stringArray != (GameConfiguration.types.length)


	// {
	// 	validateType = (stringArray[0] === TypeRole)
	// 	const type = stringArray[0] 

	// 	validateType = (stringArray[0] === TypeRole)
	// 	validateType = (stringArray[0] === TypeRole)
	// 	validateType = (stringArray[0] === TypeRole)
	// 	validateType = (stringArray[0] === TypeRole)
	// 	validateType = (stringArray[0] === TypeRole)
	// }

    static parse(options: GameOptions): GameConfiguration {
        const mode = options.mode || "local";
        const config = new GameConfiguration(mode, options.type);
        
        // Solo aplicar si quieres cambiar los defaults
        if (options.havePowerUps !== undefined) {
            config.havePowerUps = options.havePowerUps;
        }
        
        if (options.maxTime !== undefined) {
            config.maxTime = options.maxTime;
        }
        
        if (options.winScore !== undefined) {
            config.winScore = options.winScore;
        }
        
        return config;
    }
    
    /**
     * Método ultra simple para matchmaking (usa todos los defaults)
     */
    static forMatchmaking(type: TypeRole): GameConfiguration {
        return new GameConfiguration("local", type);
    }
    
    /**
     * Método simple para bots (usa todos los defaults del mode "bot")
     */
    static withBots(type: TypeRole): GameConfiguration {
        return new GameConfiguration("bot", type);
    }
    
    /**
     * Para casos donde necesitas customizar algo específico
     */
    static custom(options: GameOptions): GameConfiguration {
        return this.parse(options);
    }
}