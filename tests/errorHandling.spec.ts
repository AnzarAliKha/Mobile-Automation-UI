import { test, expect } from '../src/fixtures/testBase';
import { DataReader } from '../src/utils/dataReader';

interface InvalidCustomerScenario {
  scenario: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  expectedError: string;
}

interface CheckoutData {
  invalidCustomers: InvalidCustomerScenario[];
}

const checkoutData = DataReader.readJson<CheckoutData>('checkoutData.json');

test.describe('Checkout Error Handling & Validation Suite', () => {
  test.beforeEach(async ({ loggedInPage: { inventoryPage, cartPage } }) => {
    // Add one item and navigate to checkout step 1
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.header.openCart();
    await cartPage.proceedToCheckout();
  });

  // Data-driven form validation errors
  for (const customer of checkoutData.invalidCustomers) {
    test(`TC-ERR-01: [${customer.scenario}] Should display validation error: "${customer.expectedError}"`, async ({
      checkoutStepOnePage,
    }) => {
      await checkoutStepOnePage.fillInformation(
        customer.firstName,
        customer.lastName,
        customer.postalCode
      );
      await checkoutStepOnePage.continueToStepTwo();

      const errorMsg = await checkoutStepOnePage.getErrorMessage();
      expect(errorMsg).toBe(customer.expectedError);
    });
  }

  test('TC-ERR-02: Should dismiss error message banner when clicking error close button', async ({
    checkoutStepOnePage,
  }) => {
    await checkoutStepOnePage.continueToStepTwo(); // Triggers First Name required
    expect(await checkoutStepOnePage.errorMessage.isVisible()).toBeTruthy();

    await checkoutStepOnePage.closeErrorMessage();
    expect(await checkoutStepOnePage.errorMessage.isVisible()).toBeFalsy();
  });

  test('TC-ERR-03: Should return to cart when clicking cancel on Step One', async ({
    checkoutStepOnePage,
    cartPage,
  }) => {
    await checkoutStepOnePage.cancelCheckout();
    await cartPage.verifyIsOnCartPage();
  });

  test('TC-ERR-04: Should return to inventory when clicking cancel on Step Two', async ({
    checkoutStepOnePage,
    checkoutStepTwoPage,
    inventoryPage,
  }) => {
    await checkoutStepOnePage.fillInformation('John', 'Doe', '12345');
    await checkoutStepOnePage.continueToStepTwo();
    await checkoutStepTwoPage.verifyIsOnStepTwo();

    await checkoutStepTwoPage.cancelCheckout();
    await inventoryPage.verifyIsOnInventoryPage();
  });
});
