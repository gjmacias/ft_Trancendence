import { matchRepository } from '../../../database/repositories-sqlite/match.repository';
import { Match } from '../../models/match.model';

export class MatchService {
  private repository: matchRepository;

  constructor() {
    this.repository = new matchRepository();
  }

  async getLastMatchesByPlayerId(playerId: string): Promise<Match[]>
  {
    return this.repository.getLastMatchesByPlayerId(playerId);
  }

  async save(match: Match): Promise<number>
  {
    return this.repository.save(match);
  }
}
