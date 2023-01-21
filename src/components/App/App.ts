import Router from 'components/Router/Router';
import Header from 'components/Pages/header/header';
import Footer from 'components/Pages/footer/footer';

const body = document.querySelector('body') as HTMLElement;
export const main = document.createElement('main');

class App {
  public start() {
    new Header(body);
    body.append(main);
    new Router(main);
    new Footer(body);
  }
}

export default App;
