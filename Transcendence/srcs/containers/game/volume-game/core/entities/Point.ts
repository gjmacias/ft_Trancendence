import { Vector3 } from "./Vector3";

export class Point
{
	id: number;
	position: Vector3;
	constructor()
	{
		this.position = new Vector3();
	}
}