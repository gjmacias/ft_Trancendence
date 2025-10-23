import { Friendships } from "../../backend/models/friendships.model";

export interface IFriendshipsRepository 
{
	createFriendship(requester_id: string, addressee_id: string ): Promise<number>
	respondToFriendRequest (
		currentUserId: string,
		requesterId: string,
		status: 'accepted' | 'cancelled'
		) : Promise<number>;
	blockUser(
		currentUserId: string,
		otherUserId: string
		) : Promise<number>;
	getFriendsByUserId(userId: string): Promise<number[]>;

	//WARNNING
	deleteAllUserData(userId: string): Promise<void>;
}