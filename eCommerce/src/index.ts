import './index.sass';
import { router } from './modules/router';
import { Login } from './modules/login/login';

const header = document.createElement('header');
const main = document.createElement('main');
const footer = document.createElement('footer');
document.body.append(header, main, footer);

router.addRoute({
  path: '/yourunb-JSFE2023Q4/ecommerce/login',
  handler: () => {
    main.innerHTML = '';
    main.append(new Login().getPage());
  },
});

window.onload = () => {
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/login') {
    router.route('/yourunb-JSFE2023Q4/ecommerce/login');
    return;
  }
  router.route('/yourunb-JSFE2023Q4/ecommerce/404');
};
