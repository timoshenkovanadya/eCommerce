import './basketPage.sass';
import { BaseComponent } from '../../components/baseComponent';
import { Button } from '../../components/basebutton/baseButton';
import { deleteCartApi } from '../../modules/api/cart';
import { MyCart } from '../../modules/cart/cart';
import { router } from '../../modules/router';
import { BasketItem } from './basketItem/basketItem';

const myCart = new MyCart();

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
  public basketItems: BaseComponent;

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

    this.basketItems = new BaseComponent({ tagName: 'div', classNames: 'basket-items' });
    this.basketMain.insertChildren([this.basketItems]); // <-- insert a coupon section here

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
    myCart.deleteSubscribe(this.update);
    const items = myCart.cart?.lineItems.map((product) => new BasketItem(product));
    this.basketItems.insertChildren(items);
    myCart.subscribe(this.update);

    this.totalPrice.setTextContent(`Total price: ${this.getTotalPrice()} €`);
    this.checkEmptyCart();
  }

  public update = (): void => {
    this.totalPrice.setTextContent(`Total price: ${this.getTotalPrice()} €`);
  };

  private getTotalPrice(): string {
    return myCart.cart?.totalPrice?.centAmount ? (myCart.cart.totalPrice.centAmount / 100).toFixed(2) : '0';
  }

  public checkEmptyCart() {
    if (myCart.cart.lineItems.length === 0) {
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
    deleteCartApi(myCart.cart.id, myCart.cart.version)
      .then(() => myCart.create())
      .then(() => this.updateCart());
  }

  public updateCart() {
    this.clearProductsItems('basket-item');
    this.createProductsItems();
  }
}