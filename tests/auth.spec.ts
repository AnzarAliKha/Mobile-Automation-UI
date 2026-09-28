import { test, expect } from '../src/fixtures/testBase';
import { DataReader } from '../src/utils/dataReader';

interface ValidUser {
  persona: string;
  username: string;
  password: string;
  description: string;
}

interface InvalidUser {
  persona: string;
  username: string;
  password: string;
  expectedError: string;
}

interface UsersData {
  validUsers: ValidUser[];
  invalidUsers: InvalidUser[];
}

const usersData = DataReader.readJson<UsersData>('users.json');

test.describe('Authentication & Authorization Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC-AUTH-01: Should login successfully with standard user @smoke', async ({
    loginPage,
    inventoryPage,
  }) => {
    const standardUser = usersData.validUsers.find((u) => u.persona === 'standard')!;
    await loginPage.login(standardUser.username, standardUser.password);

    await inventoryPage.verifyIsOnInventoryPage();
    await expect(inventoryPage.header.appLogo).toHaveText('Swag Labs');
  });

  test('TC-AUTH-02: Should logout successfully and redirect to login page', async ({
    loginPage,
    inventoryPage,
  }) => {
    const standardUser = usersData.validUsers.find((u) => u.persona === 'standard')!;
    await loginPage.login(standardUser.username, standardUser.password);
    await inventoryPage.verifyIsOnInventoryPage();

    await inventoryPage.header.logout();
    await loginPage.verifyIsOnLoginPage();
  });

  test('TC-AUTH-03: Should login successfully with performance glitch user', async ({
    loginPage,
    inventoryPage,
  }) => {
    const glitchUser = usersData.validUsers.find((u) => u.persona === 'performance_glitch')!;
    await loginPage.login(glitchUser.username, glitchUser.password);

    await inventoryPage.verifyIsOnInventoryPage();
  });

  // Data-driven negative tests
  for (const user of usersData.invalidUsers) {
    test(`TC-AUTH-NEG: [${user.persona}] should display error: "${user.expectedError}"`, async ({
      loginPage,
    }) => {
      await loginPage.login(user.username, user.password);

      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toBe(user.expectedError);
    });
  }

  test('TC-AUTH-04: Should dismiss error message banner when clicking close button', async ({
    loginPage,
  }) => {
    await loginPage.login('', '');
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();

    await loginPage.closeErrorMessage();
    expect(await loginPage.isErrorMessageVisible()).toBeFalsy();
  });
});
