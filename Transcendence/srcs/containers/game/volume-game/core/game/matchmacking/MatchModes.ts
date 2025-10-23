import { GameConfigurationParser } from "../../utils/GameConfigurationParser";
import { TournamentBracketAlgorithm } from "../../algorithms/TournamentBracketAlgorithm";
import { Player } from "../../entities/Player";
import { gameStart } from "../game/GameStart";

 //Ordena jugadores por ELO y tiempo de espera para emparejamiento justo

function sortPlayersByEloAndTime(players: Player[]): Player[] {
    return players.sort((a, b) => {
        const timeA = Date.now() - a.timestamp;
        const timeB = Date.now() - b.timestamp;
        
        // Si alguien lleva más de 30 segundos, priorizar
        if (timeA > 30000 || timeB > 30000) {
            return timeB - timeA; // Más tiempo esperando = mayor prioridad
        }
        
        // Sino, ordenar por ELO similar (diferencia menor)
        const avgElo = (a.elo + b.elo) / 2;
        const diffA = Math.abs(a.elo - avgElo);
        const diffB = Math.abs(b.elo - avgElo);
        return diffA - diffB;
    });
}

// Encuentra el mejor oponente para un jugador basado en ELO y tiempo
function findBestOpponent(player: Player, candidates: Player[]): Player | null {
    const waitTime = Date.now() - player.timestamp;
    let maxEloDiff: number;
    
    // Calcular rango de ELO permitido según tiempo de espera
    if (waitTime < 1000) maxEloDiff = 100;        // 1s = ±100 ELO
    else if (waitTime < 5000) maxEloDiff = 500;   // 5s = ±500 ELO  
    else if (waitTime < 10000) maxEloDiff = 1000; // 10s = ±1000 ELO
    else maxEloDiff = Infinity;                   // 30s+ = cualquiera
    
    // Buscar el oponente con ELO más cercano dentro del rango
    let bestOpponent: Player | null = null;
    let smallestEloDiff = Infinity;
    
    for (const candidate of candidates) {
        if (candidate.id === player.id) continue; // No emparejarse consigo mismo
        
        const eloDiff = Math.abs(player.elo - candidate.elo);
        
        if (eloDiff <= maxEloDiff && eloDiff < smallestEloDiff) {
            smallestEloDiff = eloDiff;
            bestOpponent = candidate;
        }
    }
    
    return bestOpponent;
}

//Empareja jugadores de forma balanceada para equipos

function balanceTeams(players: Player[]): [Player[], Player[]] {
    if (players.length !== 4) {
        throw new Error("Se necesitan exactamente 4 jugadores para equipos");
    }
    
    // Ordenar por ELO
    const sorted = players.sort((a, b) => b.elo - a.elo);
    
    // Distribución balanceada: [mejor + peor] vs [segundo + tercero]
    const team1 = [sorted[0], sorted[3]]; // Mejor + Peor
    const team2 = [sorted[1], sorted[2]]; // Segundo + Tercero
    
    return [team1, team2];
}

export interface MatchModeHandler
{
	handle(players: Set<Player>): void;
}

export class OneVOneHandler implements MatchModeHandler
{
	handle(players: Set<Player>): void
	{
		const matched: [Player, Player][] = [];
        const playerArray = sortPlayersByEloAndTime(Array.from(players));

		while (players.size >= 2) {
			const player = playerArray.shift()!;
            const opponent = findBestOpponent(player, playerArray);
            
            if (opponent) {
                // Remover oponente del array y del Set
                const opponentIndex = playerArray.indexOf(opponent);
                playerArray.splice(opponentIndex, 1);
                players.delete(player);
                players.delete(opponent);
                matched.push([player, opponent]);
            } else {
                // Si no encuentra pareja, lo devolvemos al Set para el próximo ciclo
                break;
            }
		}

		for (const [a, b] of matched)
		{
			console.log(`1v1 Match: ${a.nickname} vs ${b.nickname}`);
			const gameConfiguration = GameConfigurationParser.forMatchmaking("1v1");
            gameStart(gameConfiguration, [a, b]);
		}
	}
}

export class TeamsHandler implements MatchModeHandler 
{
    handle(players: Set<Player>): void 
	{
        const matched: Player[][] = [];
        const playerArray = sortPlayersByEloAndTime(Array.from(players));

        while (players.size >= 4) 
		{
			const group = playerArray.splice(0, 4);
            
            // Balancear equipos por ELO
            const [team1, team2] = balanceTeams(group);
            const balancedGroup = [...team1, ...team2];
            
            for (const p of balancedGroup) players.delete(p);
            matched.push(balancedGroup);
        }

        for (const group of matched) 
		{
            const team1 = group.slice(0, 2);
            const team2 = group.slice(2, 4);
            const teamA = team1.map(p => `${p.nickname}(${p.elo})`).join(' & ');
            const teamB = team2.map(p => `${p.nickname}(${p.elo})`).join(' & ');
            console.log(`Teams Match: ${teamA} vs ${teamB}`);

            const gameConfiguration = GameConfigurationParser.forMatchmaking("teams");
            gameStart(gameConfiguration, group);
        }
    }
}

export class Multi1v1Handler implements MatchModeHandler 
{
    handle(players: Set<Player>): void 
	{
        const matched: Player[][] = [];
        const playerArray = sortPlayersByEloAndTime(Array.from(players));

        while (playerArray.length >= 2 && matched.length * 2 < players.size) {
            const player = playerArray.shift()!;
            const opponent = findBestOpponent(player, playerArray);
            
            if (opponent) {
                const opponentIndex = playerArray.indexOf(opponent);
                playerArray.splice(opponentIndex, 1);
                players.delete(player);
                players.delete(opponent);
                matched.push([player, opponent]);
            } else {
                break;
            }
        }

        for (const pair of matched) {
            const names = pair.map(p => `${p.nickname}(${p.elo})`).join(' vs ');
            console.log(`Multi1v1 Match: ${names}`);

            const gameConfiguration = GameConfigurationParser.forMatchmaking("multi1v1");
            gameStart(gameConfiguration, pair);
        }
    }
}

export class TournamentHandler implements MatchModeHandler 
{
    handle(players: Set<Player>): void 
    {
        const playerArray = Array.from(players);
        
        // Verificar que hay suficientes jugadores (mínimo 4)
        if (playerArray.length < 4) {
            console.log(`Torneo cancelado: se necesitan mínimo 4 jugadores, hay ${playerArray.length}`);
            return;
        }
        
        // Usar el algoritmo de bracket balanceado
        const bracket = TournamentBracketAlgorithm.createBalancedBracket(playerArray);
        
        // Limpiar la cola original (todos los jugadores entran al torneo)
        players.clear();
        
        // Mostrar el bracket inicial
        TournamentBracketAlgorithm.displayBracket(bracket);
        
        // Crear configuración del torneo
        const gameConfiguration = GameConfigurationParser.forMatchmaking("tournament");
        
        // Iniciar el torneo con todos los jugadores del bracket
        const adjustedPlayers = bracket.groups.flatMap(group => group.players);
        gameStart(gameConfiguration, adjustedPlayers);
        
        console.log(`Torneo iniciado con ${adjustedPlayers.length} jugadores en ${bracket.totalRounds} rondas`);
    }
}

export class RoyaleHandler implements MatchModeHandler 
{
    handle(players: Set<Player>): void 
	{
        const matched: Player[][] = [];
        const playerArray = sortPlayersByEloAndTime(Array.from(players));

        while (playerArray.length >= 8) 
		{
			const maxInThisMatch = Math.min(playerArray.length, 84);
            const group = playerArray.splice(0, maxInThisMatch); // se meten todos los players hasta un maximo de 84 
            for (const p of group) players.delete(p);
            matched.push(group);
        }

        for (const group of matched) 
		{
            const avgElo = Math.round(group.reduce((sum, p) => sum + p.elo, 0) / group.length);
            const names = group.map(p => p.nickname).join(', ');
            console.log(`Royale Match: ${names}`);

			const gameConfiguration = GameConfigurationParser.forMatchmaking("royale");
            gameStart(gameConfiguration, group);
        }
    }
}
