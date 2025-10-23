import MyHtml from '@utils/MyHtml3';
import { API_ROUTES } from '@utils/api.routes';
import langTools from '@utils/LanguageTools';
import Logger from '@utils/Logger';
import Screen from './Screen';

import createRegistryBox from './TournamentRegistration.registryBox';
import createRegisteredPlayersDisplay from './TournamentRegistration.registeredDisplay';
import createScrollContainer from './TournamentRegistration.scrollContainer';

export default class TournamentRegistration extends Screen {
  private registryBox: HTMLElement;
  
  constructor() {
    super();
    this.createTournamentRegistrationScreen();
    this.hide();
  }

  private createTournamentRegistrationScreen() {
    const tournamentRegistrationScreen = MyHtml.div({
      class: `tournament-registration-screen
      flex
      flex-col
      w-full h-full
      items-center
      text-black
      overflow-hidden`,
      id: 'tournament-registration-screen'
    });
    this.element = tournamentRegistrationScreen;
    const tournamentRegistrationContainer = MyHtml.div({
      class: `tournament-registration-container
      flex flex-col
      items-center`,
      id: 'tournament-registration-container'
    });
    tournamentRegistrationScreen.appendChild(tournamentRegistrationContainer);
    const tournamentHeader = MyHtml.div({
      text: langTools.getText('tournament.tournament-text'),
      class: `tournament-text
      text-3xl
      font-semibold
      text-center
      justify-center
      max-w-4xl
      min-w-4xl
      flex-shrink-0
      my-2`,
      id: 'tournament-header'
    });
    tournamentRegistrationContainer.appendChild(tournamentHeader);
    this.registryBox = createRegistryBox();
    tournamentRegistrationContainer.appendChild(this.registryBox);
    const registeredPlayersDisplay = createRegisteredPlayersDisplay();
    tournamentRegistrationContainer.appendChild(registeredPlayersDisplay);
    const scrollContainer = createScrollContainer();
    tournamentRegistrationContainer.appendChild(scrollContainer);
  }
}
