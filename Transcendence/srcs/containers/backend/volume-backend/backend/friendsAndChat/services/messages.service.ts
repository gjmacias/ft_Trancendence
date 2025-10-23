import { IMessagesRepository } from "../../IRepositories/IMessagesRepository";

export class MessagesService {
	private repository: IMessagesRepository;

	constructor(repository: IMessagesRepository) {
		this.repository = repository;
	}

	async sendMessage(senderId: string, receiverId: string, content: string): Promise<number> {
		if (!content || content.trim() === '') {
			throw new Error('El mensaje no puede estar vacío.');
		}
		if (senderId === receiverId) {
			throw new Error('No puedes enviarte mensajes a ti mismo.');
		}
		return this.repository.sendMessages(senderId, receiverId, content.trim());
	}

	async getConversation(user1Id: string, user2Id: string, limitNum: number, offsetNum: number) {
		if (user1Id === user2Id) {
			throw new Error('Conversación inválida.');
		}
		return this.repository.getMessagesBetweenUsers(user1Id, user2Id, limitNum, offsetNum);
	}

	async markAsRead(senderId: string, receiverId: string) : Promise<{read :boolean}> {
		return await this.repository.markMessagesAsRead(senderId, receiverId);
	}
}
