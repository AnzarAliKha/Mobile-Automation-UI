import { test, expect } from '../src/fixtures/testBase';
import { DataReader } from '../src/utils/dataReader';

interface ProductItem {
  name: string;
  price: number;
  slug: string;
  description: string;
}

interface ProductCatalog {
  products: ProductItem[];
}

const catalog = DataReader.readJson<ProductCatalog>('products.json');

test.describe('Shopping Cart Functionality Suite', () => {
  test('TC-CART-01: Should update cart badge count when adding/removing products @smoke', async ({
    loggedInPage: { inventoryPage },
  }) => {
    expect(await inventoryPage.header.getCartCount()).toBe(0);

    // Add first product
    await inventoryPage.addProductToCart(catalog.products[0].name);
    expect(await inventoryPage.header.getCartCount()).toBe(1);

    // Add second product
    await inventoryPage.addProductToCart(catalog.products[1].name);
    expect(await inventoryPage.header.getCartCount()).toBe(2);

    // Remove first product from inventory page
    await inventoryPage.removeProductFromCart(catalog.products[0].name);
    expect(await inventoryPage.header.getCartCount()).toBe(1);
  });

  test('TC-CART-02: Should display added products in the cart page', async ({
    loggedInPage: { inventoryPage, cartPage },
  }) => {
    const item1 = catalog.products[0];
    const item2 = catalog.products[2];

    await inventoryPage.addProductToCart(item1.name);
    await inventoryPage.addProductToCart(item2.name);

    await inventoryPage.header.openCart();
    await cartPage.verifyIsOnCartPage();

    const cartItems = await cartPage.getCartItemNames();
    expect(cartItems).toContain(item1.name);
    expect(cartItems).toContain(item2.name);
    expect(await cartPage.getItemCount()).toBe(2);
  });

  test('TC-CART-03: Should remove product directly inside cart page', async ({
    loggedInPage: { inventoryPage, cartPage },
  }) => {
    const item = catalog.products[0];
    await inventoryPage.addProductToCart(item.name);
    await inventoryPage.header.openCart();

    expect(await cartPage.getItemCount()).toBe(1);
    await cartPage.removeItem(item.name);
    expect(await cartPage.getItemCount()).toBe(0);
    expect(await cartPage.header.getCartCount()).toBe(0);
  });

  test('TC-CART-04: Should navigate back to inventory using Continue Shopping', async ({
    loggedInPage: { inventoryPage, cartPage },
  }) => {
    await inventoryPage.header.openCart();
    await cartPage.verifyIsOnCartPage();

    await cartPage.continueShopping();
    await inventoryPage.verifyIsOnInventoryPage();
  });
});
