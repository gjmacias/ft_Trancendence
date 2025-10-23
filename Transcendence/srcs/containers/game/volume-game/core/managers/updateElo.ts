import { Player } from "../entities/Player";

//ELO actual = ELO nuevo + constante  × (resultado(1/0) - probabilidad de ganar)
function updateElo( player: Player, opponent: Player, score: number, opponentScore: number,
  won: boolean, duration: number ): number 
{
  const K = 100;
  const S = won ? 1 : 0;
  const P = probabilityScore(player.elo, opponent.elo);

  // Bonus por paliza
  const scoreDiff = Math.abs(score - opponentScore);
  const scoreBonus = Math.min(scoreDiff, 5) / 10; // máx +0.5

  // Penalización por partida muy rápida (menos skill)
  const timePenalty = duration < 30 ? 0.1 : 0;

  const adjustment = K * (S - P + scoreBonus - timePenalty);
  return Math.round(player.elo + adjustment);
}

function probabilityScore(eloA: number, eloB: number): number
{
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}
