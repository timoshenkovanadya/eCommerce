import './modules/routingScript';
import './index.sass';
import state from './state/state';
import { router } from './modules/router';
import { mainPage } from './pages/mainPage';
import { Products } from './modules/products/products';
import { notFoundPage, btnBackHome } from './pages/notFoundPage';
import { aboutPage } from './pages/aboutPage';
import { PageBasket } from './pages/basket/basketPage';
import { Login } from './modules/login/login';
import {
  header,
  btnLogIn,
  btnLogOut,
  btnReg,
  logo,
  menu,
  btnBasket,
  btnProfile,
  nav,
  btnMenu,
} from './components/header/header';
import { footer } from './components/footer/footer';
import { PageRegistration } from './pages/registration/pageRegistration';
import { PageProfile } from './pages/profile/pageProfile';
import { background } from './components/background/background';
import { PageProduct } from './pages/product/pageProduct';

const main = document.createElement('main');
main.classList.add('main');
const login = new Login();
const products = new Products();

login
  .createAnonymousCustomer()
  .then(() => login.execute())
  .then(
    () => localStorage.setItem('logged', 'true'),
    () => localStorage.removeItem('logged')
  )
  .catch(() => {});

document.body.append(header, main, footer, background);

function setActivePage() {
  const menuItems = menu.getElementsByClassName('menu__item') as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i < menuItems.length; i += 1) menuItems[i].classList.remove('menu__item_active');
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/') menuItems[0].classList.add('menu__item_active');
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/products') menuItems[1].classList.add('menu__item_active');
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/about') menuItems[2].classList.add('menu__item_active');
}

function checkAuthorization() {
  if (localStorage.logged !== undefined) {
    btnLogOut.classList.remove('header__btn_hide');
    btnProfile.classList.remove('header__btn_hide');
    btnLogIn.classList.add('header__btn_hide');
    btnReg.classList.add('header__btn_hide');
  } else {
    btnLogOut.classList.add('header__btn_hide');
    btnProfile.classList.add('header__btn_hide');
    btnLogIn.classList.remove('header__btn_hide');
    btnReg.classList.remove('header__btn_hide');
  }
}

checkAuthorization();

router.addRoute({
  path: '/yourunb-JSFE2023Q4/ecommerce/',
  handler: () => {
    document.title = 'Plant Store';
    main.innerHTML = '';
    main.append(mainPage);
    setActivePage();
    checkAuthorization();
  },
});
router.addRoute({
  path: state.routes.products,
  handler: () => {
    document.title = 'Products';
    main.innerHTML = '';
    const { hash } = window.location;

    if (hash) {
      const product = new PageProduct({ tagName: 'div' });
      main.append(product.getElement());
    } else {
      main.append(products.getPage());
    }

    setActivePage();
    checkAuthorization();
  },
});
router.addRoute({
  path: '/yourunb-JSFE2023Q4/ecommerce/about',
  handler: () => {
    document.title = 'About Us';
    main.innerHTML = '';
    main.append(aboutPage);
    setActivePage();
    checkAuthorization();
  },
});
router.addRoute({
  path: '/yourunb-JSFE2023Q4/ecommerce/basket',
  handler: () => {
    document.title = 'Basket';
    main.innerHTML = '';
    main.append(new PageBasket().getElement());
    setActivePage();
    checkAuthorization();
  },
});
router.addRoute({
  path: '/yourunb-JSFE2023Q4/ecommerce/profile',
  handler: () => {
    document.title = 'Profile';
    main.innerHTML = '';
    main.append(new PageProfile({}).getElement());
    setActivePage();
    checkAuthorization();
  },
});
router.addRoute({
  path: '/yourunb-JSFE2023Q4/ecommerce/login',
  handler: () => {
    document.title = 'Login';
    main.innerHTML = '';
    main.append(login.getPage());
    setActivePage();
    checkAuthorization();
  },
});
router.addRoute({
  path: '/yourunb-JSFE2023Q4/ecommerce/registration',
  handler: () => {
    document.title = 'Registration';
    main.innerHTML = '';
    main.append(new PageRegistration({}).getElement());
    setActivePage();
    checkAuthorization();
  },
});
router.addRoute({
  path: '/yourunb-JSFE2023Q4/ecommerce/404',
  handler: () => {
    document.title = '404';
    main.innerHTML = '';
    main.append(notFoundPage);
    setActivePage();
    checkAuthorization();
  },
});

window.onload = () => {
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/') {
    router.route('/yourunb-JSFE2023Q4/ecommerce/');
    return;
  }
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/products') {
    router.route(`/yourunb-JSFE2023Q4/ecommerce/products${location.hash}`);
    return;
  }
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/about') {
    router.route('/yourunb-JSFE2023Q4/ecommerce/about');
    return;
  }
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/basket') {
    router.route('/yourunb-JSFE2023Q4/ecommerce/basket');
    return;
  }
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/profile') {
    if (localStorage.logged === undefined) router.route('/yourunb-JSFE2023Q4/ecommerce/login');
    else router.route('/yourunb-JSFE2023Q4/ecommerce/profile');
    return;
  }
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/login') {
    if (localStorage.logged === undefined) router.route('/yourunb-JSFE2023Q4/ecommerce/login');
    else router.route('/yourunb-JSFE2023Q4/ecommerce/');
    return;
  }
  if (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/registration') {
    if (localStorage.logged === undefined) router.route('/yourunb-JSFE2023Q4/ecommerce/registration');
    else router.route('/yourunb-JSFE2023Q4/ecommerce/');
    return;
  }
  router.route('/yourunb-JSFE2023Q4/ecommerce/404');
};

window.onpopstate = () => {
  if (
    localStorage.logged !== undefined &&
    (location.pathname === '/yourunb-JSFE2023Q4/ecommerce/login' ||
      location.pathname === '/yourunb-JSFE2023Q4/ecommerce/registration')
  ) {
    router.route('/yourunb-JSFE2023Q4/ecommerce/', false);
    window.history.replaceState({}, '', '/yourunb-JSFE2023Q4/ecommerce/');
    setActivePage();
  }

  if (localStorage.logged === undefined && location.pathname === '/yourunb-JSFE2023Q4/ecommerce/profile') {
    router.route('/yourunb-JSFE2023Q4/ecommerce/login', false);
    window.history.replaceState({}, '', '/yourunb-JSFE2023Q4/ecommerce/login');
    setActivePage();
  }
};

logo.addEventListener('click', () => {
  router.route('/yourunb-JSFE2023Q4/ecommerce/');
});
btnBackHome.addEventListener('click', () => {
  router.route('/yourunb-JSFE2023Q4/ecommerce/');
});
btnBasket.addEventListener('click', () => {
  router.route('/yourunb-JSFE2023Q4/ecommerce/basket');
});
btnLogIn.addEventListener('click', () => {
  router.route('/yourunb-JSFE2023Q4/ecommerce/login');
});
btnProfile.addEventListener('click', () => {
  router.route('/yourunb-JSFE2023Q4/ecommerce/profile');
});
btnReg.addEventListener('click', () => {
  router.route('/yourunb-JSFE2023Q4/ecommerce/registration');
});
btnLogOut.addEventListener('click', () => {
  localStorage.clear();
  login.createAnonymousCustomer();
  router.route('/yourunb-JSFE2023Q4/ecommerce/');
});
menu.addEventListener('click', (event) => {
  const currentTarget = event.target as HTMLElement;
  if (currentTarget.textContent === 'Home') {
    hideMenu();
    router.route('/yourunb-JSFE2023Q4/ecommerce/');
    return;
  }
  if (currentTarget.textContent === 'Products') {
    hideMenu();
    router.route('/yourunb-JSFE2023Q4/ecommerce/products');
    return;
  }
  if (currentTarget.textContent === 'About') {
    hideMenu();
    router.route('/yourunb-JSFE2023Q4/ecommerce/about');
    return;
  }
});

function hideMenu() {
  btnMenu.classList.remove('btn-menu_cliked');
  nav.classList.remove('navigation_show');
}
