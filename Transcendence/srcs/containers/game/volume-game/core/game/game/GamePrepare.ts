import { Player } from "../../entities/Player";
import { gameStart } from "./GameStart";
import { GameConfiguration, TypeRole } from "../../entities/GameConfiguration";
import { User } from "../../entities/User";
import { getElo } from "../../../services/getStadistics";
import { broadcastStartRemote } from "../../../api/wss/services/socket.service";

export const gamePrepare = async (mode: string, user: User) => 
{
	const configuration = new GameConfiguration(mode, "1v1");
	const elo = (user.id) ? await getElo(user.id) : 1000;
	user.elo = elo;
	const myPlayer = new Player(user, "human");

	if (!configuration.cloudConection)
	{
		let newUser: User = {
			id: "",
			nickname: configuration.hasBots ? "bot" : "Player 2",
			elo : 1000
		};
		const secondPlayer = new Player(newUser, configuration.hasBots ? "ai" : "human");
		secondPlayer.color = "#FF4060";
		await gameStart(configuration, [myPlayer, secondPlayer]);
	}
}

export const gamePrepareRemote = async (mode: TypeRole, users: User[]) => 
{
	const configuration = new GameConfiguration("remote", mode); // "teams" o "1v1"
	const players: Player[] = [];

	let i = 0;
	for (const user of users)
	{
		if(user.id === "")
			continue;
		const elo = (user.id) ? await getElo(user.id) : 1000;
		user.elo = elo;
		const myPlayer = new Player(user, "human");
		if (i % 2 !== 0)
			myPlayer.color = "#d51919";
		darkColor(myPlayer.color, Math.floor(i / 2));
		players.push(myPlayer);

		broadcastStartRemote(user);
		i++;
	}
	await gameStart(configuration, players);
}



function darkColor(color: string, time: number): string {
  // Quita el # si lo tiene

  const amount = 10 * time;

  color = color.replace('#', '');

  // Convierte los componentes hexadecimales a números
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Resta el valor (oscurece)
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // Vuelve a convertir a formato hex con padding
  const darkened =
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0');

  return darkened;
}
