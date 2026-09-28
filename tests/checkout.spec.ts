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

interface CheckoutData {
  validCustomer: {
    firstName: string;
    lastName: string;
    postalCode: string;
  };
  alternativeCustomer: {
    firstName: string;
    lastName: string;
    postalCode: string;
  };
}

const catalog = DataReader.readJson<ProductCatalog>('products.json');
const checkoutData = DataReader.readJson<CheckoutData>('checkoutData.json');

test.describe('End-to-End Checkout Suite', () => {
  test('TC-E2E-01: Complete checkout purchase journey with price & tax verification @smoke', async ({
    loggedInPage: {
      inventoryPage,
      cartPage,
      checkoutStepOnePage,
      checkoutStepTwoPage,
      checkoutCompletePage,
    },
  }) => {
    const item1 = catalog.products[0]; // $29.99
    const item2 = catalog.products[1]; // $9.99
    const expectedSubtotal = parseFloat((item1.price + item2.price).toFixed(2));

    // 1. Add items to cart
    await inventoryPage.addProductToCart(item1.name);
    await inventoryPage.addProductToCart(item2.name);
    expect(await inventoryPage.header.getCartCount()).toBe(2);

    // 2. Open Cart
    await inventoryPage.header.openCart();
    await cartPage.verifyIsOnCartPage();
    await cartPage.proceedToCheckout();

    // 3. Step One: Information
    await checkoutStepOnePage.verifyIsOnStepOne();
    await checkoutStepOnePage.fillInformation(
      checkoutData.validCustomer.firstName,
      checkoutData.validCustomer.lastName,
      checkoutData.validCustomer.postalCode
    );
    await checkoutStepOnePage.continueToStepTwo();

    // 4. Step Two: Overview & Price Calculations
    await checkoutStepTwoPage.verifyIsOnStepTwo();
    const overviewItems = await checkoutStepTwoPage.getItemNames();
    expect(overviewItems).toContain(item1.name);
    expect(overviewItems).toContain(item2.name);

    const actualSubtotal = await checkoutStepTwoPage.getItemSubtotal();
    expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);

    const actualTax = await checkoutStepTwoPage.getTax();
    // 8% tax calculation check
    const expectedTax = parseFloat((expectedSubtotal * 0.08).toFixed(2));
    expect(actualTax).toBeCloseTo(expectedTax, 1);

    const actualTotal = await checkoutStepTwoPage.getTotal();
    const expectedTotal = parseFloat((actualSubtotal + actualTax).toFixed(2));
    expect(actualTotal).toBeCloseTo(expectedTotal, 2);

    // 5. Complete Purchase
    await checkoutStepTwoPage.finishCheckout();
    await checkoutCompletePage.verifyIsOnCompletePage();

    const confirmation = await checkoutCompletePage.getCompletionHeader();
    expect(confirmation).toBe('Thank you for your order!');

    // 6. Navigate Back Home and verify empty cart
    await checkoutCompletePage.backToHome();
    await inventoryPage.verifyIsOnInventoryPage();
    expect(await inventoryPage.header.getCartCount()).toBe(0);
  });
});
