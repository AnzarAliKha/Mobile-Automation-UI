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
  sortOptions: Record<string, string>;
}

const catalog = DataReader.readJson<ProductCatalog>('products.json');

test.describe('Inventory & Product Catalogue Suite', () => {
  test('TC-INV-01: Should display all catalogue items with valid details @smoke', async ({
    loggedInPage: { inventoryPage },
  }) => {
    const names = await inventoryPage.getAllProductNames();
    expect(names.length).toBe(6);

    for (const expectedProduct of catalog.products) {
      expect(names).toContain(expectedProduct.name);
    }
  });

  test('TC-INV-02: Should sort products by Price: Low to High', async ({
    loggedInPage: { inventoryPage },
  }) => {
    await inventoryPage.sortBy(catalog.sortOptions.PRICE_LOW_HIGH);
    const prices = await inventoryPage.getAllProductPrices();

    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('TC-INV-03: Should sort products by Price: High to Low', async ({
    loggedInPage: { inventoryPage },
  }) => {
    await inventoryPage.sortBy(catalog.sortOptions.PRICE_HIGH_LOW);
    const prices = await inventoryPage.getAllProductPrices();

    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('TC-INV-04: Should sort products by Name: Z to A', async ({
    loggedInPage: { inventoryPage },
  }) => {
    await inventoryPage.sortBy(catalog.sortOptions.NAME_ZA);
    const names = await inventoryPage.getAllProductNames();

    const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sortedNames);
  });

  test('TC-INV-05: Should navigate to product detail page and verify information', async ({
    loggedInPage: { inventoryPage },
    itemDetailsPage,
  }) => {
    const targetProduct = catalog.products[0]; // Sauce Labs Backpack
    await inventoryPage.openProductDetails(targetProduct.name);

    const details = await itemDetailsPage.getItemDetails();
    expect(details.name).toBe(targetProduct.name);
    expect(details.price).toBe(targetProduct.price);
    expect(details.description).toContain('Sly Pack');

    await itemDetailsPage.backToProducts();
    await inventoryPage.verifyIsOnInventoryPage();
  });
});
