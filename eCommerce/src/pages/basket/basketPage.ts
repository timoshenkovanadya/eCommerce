import './basketPage.sass';
import { BaseComponent } from '../../components/baseComponent';
import { Button } from '../../components/basebutton/baseButton';
import { Cart } from '@commercetools/platform-sdk';
import { getCartApi, deleteCartApi } from '../../modules/api/cart';
import { MyCart } from '../../modules/cart/cart';
import { router } from '../../modules/router';

export class PageBasket extends BaseComponent {
  public basketHeader: BaseComponent;
  public basketMain: BaseComponent;
  public basketFooter: BaseComponent;
  public totalPrice: BaseComponent;
  public msgEmptyCart: BaseComponent;
  public msgEmptyCartText: BaseComponent;
  public btnClearBasket: Button;
  public btnOpenCatalog: Button;
  public cartId: string;

  constructor() {
    super({ tagName: 'div', classNames: 'basket-page' });
    this.cartId = '';
    this.basketHeader = new BaseComponent({
      tagName: 'div',
      classNames: 'basket-header',
      parentNode: this.element,
    });

    this.basketMain = new BaseComponent({
      tagName: 'div',
      classNames: 'basket-main',
      parentNode: this.element,
    });

    this.msgEmptyCart = new BaseComponent({
      tagName: 'div',
      classNames: ['msg-empty', 'msg-empty_hide'],
      parentNode: this.element,
    });

    this.msgEmptyCartText = new BaseComponent({
      tagName: 'h3',
      classNames: 'msg-empty__text',
      textContent: 'Empty cart',
      parentNode: this.msgEmptyCart.getElement(),
    });

    this.btnOpenCatalog = new Button({
      textContent: 'Open catalog',
      classNames: 'msg-empty__btn',
      parentNode: this.msgEmptyCart.getElement(),
    });

    this.btnOpenCatalog.getElement().addEventListener('click', () => {
      router.route('/yourunb-JSFE2023Q4/ecommerce/products');
    });

    this.basketFooter = new BaseComponent({
      tagName: 'div',
      classNames: 'basket-footer',
      parentNode: this.element,
    });

    this.btnClearBasket = new Button({
      textContent: 'Clear basket',
      classNames: 'basket-page__btn-clear',
      parentNode: this.basketHeader.getElement(),
    });

    this.totalPrice = new BaseComponent({
      tagName: 'p',
      textContent: 'Total price: - €',
      classNames: 'basket-price',
      parentNode: this.basketFooter.getElement(),
    });

    this.btnClearBasket.getElement().addEventListener('click', () => {
      this.clearCart();
    });

    this.createProductsItems();
  }

  public createProductsItems() {
    const cart = MyCart._cart;
    console.log(cart);
    getCartApi(cart.id).then((cart: Cart | Error) => {
      this.cartId = 'id' in cart ? cart.id : '';
      const productsInCart = 'lineItems' in cart ? cart.lineItems : [];
      console.log(cart);
      productsInCart.forEach((product) => {
        const item = document.createElement('div');
        item.classList.add('product-item');
        item.innerHTML = `
          <img src="${product.variant.images !== undefined && product.variant.images.length > 0 ? product.variant.images[0].url : ''}">
          <p>${product.name['en-GB']}</p>
          <p>${product.price.value.centAmount} eur</p>
        `;
        this.basketMain.getElement().append(item);
      });
      this.totalPrice.getElement().textContent = `Total price: ${'totalPrice' in cart ? cart.totalPrice.centAmount : '-'} €`;
    });
    this.checkEmptyCart();
  }

  public checkEmptyCart() {
    if (MyCart._cart.lineItems.length === 0) {
      this.msgEmptyCart.getElement().classList.remove('msg-empty_hide');
    } else this.msgEmptyCart.getElement().classList.add('msg-empty_hide');
  }

  public clearProductsItems(itemClass: string) {
    const arrItems = document.getElementsByClassName(itemClass) as HTMLCollectionOf<HTMLElement>;
    for (let i = arrItems.length - 1; i >= 0; i -= 1) {
      arrItems[i].remove();
    }
  }

  public clearCart() {
    const cart = new MyCart();
    deleteCartApi(MyCart._cart.id, MyCart._cart.version)
      .then(() => cart.create())
      .then(() => this.updateCart());
  }

  public updateCart() {
    this.clearProductsItems('product-item'); //ввести наименование класса удаляемых элементов
    this.createProductsItems();
  }
}
