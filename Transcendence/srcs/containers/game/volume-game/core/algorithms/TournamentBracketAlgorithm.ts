// 🔄 CREAR /Users/mac-mini/Transcendence/srcs/containers/game/volume-game/core/algorithms/TournamentBracketAlgorithm.ts

import { Player } from "../entities/Player";

export interface TournamentGroup {
    players: Player[];
    groupId: number;
}

export interface TournamentBracket {
    groups: TournamentGroup[];
    totalRounds: number;
    currentRound: number;
}

export class TournamentBracketAlgorithm 
{
    
    /**
     * Algoritmo principal: distribuye jugadores en brackets balanceados
     * Patrón: divide en cuartos y redistribuye alternadamente
     */
    static createBalancedBracket(players: Player[]): TournamentBracket {
        // 1. Ordenar por ELO descendente (mejores primero)
        const sortedPlayers = [...players].sort((a, b) => b.elo - a.elo);
        
        // 2. Validar que el número sea potencia de 2 (o ajustar)
        const adjustedPlayers = this.adjustToTournamentSize(sortedPlayers);
        
        // 3. Crear grupos iniciales usando el algoritmo de cuartos
        const initialGroups = this.distributeInQuarters(adjustedPlayers);
        
        // 4. Calcular número total de rondas
        const totalRounds = Math.log2(adjustedPlayers.length);
        
        return {
            groups: initialGroups,
            totalRounds,
            currentRound: 1
        };
    }
    
    /**
     * Algoritmo de cuartos: redistribuye jugadores para balance
     */
    private static distributeInQuarters(players: Player[]): TournamentGroup[] {
        const n = players.length;
        
        // Si son 4 o menos, crear parejas directamente
        if (n <= 4) {
            return this.createFinalPairs(players);
        }
        
        // Dividir en 4 cuartos
        const quarterSize = Math.floor(n / 4);
        const q1 = players.slice(0, quarterSize);                    // Top cuarto
        const q2 = players.slice(quarterSize, quarterSize * 2);      // Segundo cuarto  
        const q3 = players.slice(quarterSize * 2, quarterSize * 3);  // Tercer cuarto
        const q4 = players.slice(quarterSize * 3);                   // Último cuarto
        
        // Redistribuir alternadamente (patrón identificado)
        const redistributed = this.alternateDistribution(q1, q2, q3, q4);
        
        // Crear grupos del tamaño apropiado
        const groupSize = this.calculateOptimalGroupSize(n);
        const groups: TournamentGroup[] = [];
        
        for (let i = 0; i < redistributed.length; i += groupSize) {
            const groupPlayers = redistributed.slice(i, i + groupSize);
            groups.push({
                players: groupPlayers,
                groupId: Math.floor(i / groupSize) + 1
            });
        }
        
        return groups;
    }
    
    /**
     * Distribución alternada: el corazón del algoritmo
     * Patrón: Q1[0], Q4[0], Q2[0], Q3[0], Q1[1], Q4[1], Q2[1], Q3[1]...
     */
    private static alternateDistribution(q1: Player[], q2: Player[], q3: Player[], q4: Player[]): Player[] {
        const result: Player[] = [];
        const maxLength = Math.max(q1.length, q2.length, q3.length, q4.length);
        
        for (let i = 0; i < maxLength; i++) {
            if (i < q1.length) result.push(q1[i]);  // Mejor
            if (i < q4.length) result.push(q4[i]);  // Peor  
            if (i < q2.length) result.push(q2[i]);  // Segundo
            if (i < q3.length) result.push(q3[i]);  // Tercero
        }
        
        return result;
    }
    
    /**
     * Calcula el tamaño óptimo de grupo según el número total
     */
    private static calculateOptimalGroupSize(totalPlayers: number): number {
        if (totalPlayers >= 1024) return 256;  // 4 grupos de 256
        if (totalPlayers >= 256) return 64;    // 4 grupos de 64
        if (totalPlayers >= 64) return 16;     // 4 grupos de 16
        if (totalPlayers >= 16) return 4;      // 4 grupos de 4
        return 2;                              // Parejas finales
    }
    
    /**
     * Crea parejas finales cuando quedan 4 o menos jugadores
     */
    private static createFinalPairs(players: Player[]): TournamentGroup[] {
        const groups: TournamentGroup[] = [];
        
        for (let i = 0; i < players.length; i += 2) {
            if (i + 1 < players.length) {
                groups.push({
                    players: [players[i], players[i + 1]],
                    groupId: Math.floor(i / 2) + 1
                });
            } else {
                // Jugador impar pasa automáticamente
                groups.push({
                    players: [players[i]],
                    groupId: Math.floor(i / 2) + 1
                });
            }
        }
        
        return groups;
    }
    
    /**
     * Ajusta el número de jugadores a la potencia de 2 más cercana
     */
    private static adjustToTournamentSize(players: Player[]): Player[] {
        const n = players.length;
        
        // Encontrar la potencia de 2 más cercana (hacia abajo)
        const powerOf2 = Math.pow(2, Math.floor(Math.log2(n)));
        
        // Si ya es potencia de 2, retornar tal como está
        if (n === powerOf2) {
            return players;
        }
        
        // Si no, tomar solo los mejores jugadores
        console.log(`Ajustando de ${n} a ${powerOf2} jugadores para el torneo`);
        return players.slice(0, powerOf2);
    }
    
    /**
     * Procesa la siguiente ronda con los ganadores
     */
    static processNextRound(currentBracket: TournamentBracket, winners: Player[]): TournamentBracket {
        if (winners.length <= 1) {
            // Torneo terminado
            return {
                groups: [{players: winners, groupId: 1}],
                totalRounds: currentBracket.totalRounds,
                currentRound: currentBracket.totalRounds + 1
            };
        }
        
        // Crear nueva ronda con los ganadores
        const nextRoundGroups = this.distributeInQuarters(winners);
        
        return {
            groups: nextRoundGroups,
            totalRounds: currentBracket.totalRounds,
            currentRound: currentBracket.currentRound + 1
        };
    }
    
    /**
     * Función de utilidad: muestra el bracket actual
     */
    static displayBracket(bracket: TournamentBracket): void {
        console.log(`\n=== RONDA ${bracket.currentRound}/${bracket.totalRounds} ===`);
        
        bracket.groups.forEach((group, index) => {
            if (group.players.length === 2) {
                const [p1, p2] = group.players;
                console.log(`Grupo ${group.groupId}: ${p1.nickname}(${p1.elo}) vs ${p2.nickname}(${p2.elo})`);
            } else if (group.players.length === 1) {
                console.log(`Grupo ${group.groupId}: ${group.players[0].nickname} (pasa automáticamente)`);
            } else {
                const names = group.players.map(p => `${p.nickname}(${p.elo})`).join(', ');
                console.log(`Grupo ${group.groupId}: ${names}`);
            }
        });
    }
}