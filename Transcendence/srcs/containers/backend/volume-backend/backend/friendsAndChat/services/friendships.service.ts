import { IFriendshipsRepository } from "../../IRepositories/IFriendshipsRepository";

export class FriendshipsService {
	private repository: IFriendshipsRepository;

	constructor(repository: IFriendshipsRepository) {
		this.repository = repository;
	}

	async sendFriendRequest(requesterId: string, addresseeId: string): Promise<number> {
		if (requesterId === addresseeId) {
			throw new Error("No puedes agregarte como amigo.");
		}
		// Aquí podrías validar si ya existe una solicitud o son amigos
		return this.repository.createFriendship(requesterId, addresseeId);
	}

	async respondToFriendRequest(
		currentUserId: string,
		requesterId: string,
		status: "accepted" | "cancelled"
	): Promise<number> {
		if (!["accepted", "cancelled"].includes(status)) {
			throw new Error("Estado inválido para la solicitud.");
		}
		return this.repository.respondToFriendRequest(currentUserId, requesterId, status);
	}

	async blockUser(currentUserId: string, otherUserId: string): Promise<number> {
		if (currentUserId === otherUserId) {
			throw new Error("No puedes bloquearte a ti mismo.");
		}
		return this.repository.blockUser(currentUserId, otherUserId);
	}

	async getFriends(userId: string): Promise<number[]> {
		return this.repository.getFriendsByUserId(userId);
	}

	async deleteUserFriendshipData(userId: string): Promise<void> {
		// Aquí podrías validar si el usuario realmente existe, si es necesario
		await this.repository.deleteAllUserData(userId);
	}
}
