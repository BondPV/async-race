import { main } from 'components/App/App';
import { IWinner } from 'types/interfaces';
import createElement from 'components/helpers/createElement';
import { twoFlagImage } from 'components/Pages/header/twoFlagsImage';

export const winnerNotificationModal = createElement('div', 'notaice');

export function showWinnerNotification(winner: IWinner) {
  winnerNotificationModal.innerHTML = `
  <div class='notaice__wrap'>
    <div class="header__image">${twoFlagImage}</div>
    <div>Winners: ${winner?.name}</div>
    <div>Time: ${winner.time}</div>
  </div>`;

  main.append(winnerNotificationModal);
}
