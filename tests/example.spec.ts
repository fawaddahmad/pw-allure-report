import { test, expect } from "@playwright/test";

const products = ["100824-0000", "970281-0000", "970282-0000"];

for (let index = 0; index < 500; index++) {
  test(`Placing order number: ${index + 1}`, async ({ page }) => {
    const rand_index = Math.floor(Math.random() * 3);
    let product = products[rand_index];
    console.log(`Product SKU: ${product}`);

    await page.goto(`https://dev.aerogarden.com/${product}.html/`);
    await page
      .locator(".c-product-detail__action__add-to-cart__btn-text")
      .click();
    await page.getByLabel("Cart 1 Items").hover();
    await page.getByRole("button", { name: "Checkout" }).click();
    // await page.goto(
    //   "https://staging.aerogarden.com/checkout/?stage=shipping#shipping"
    // );

    /**
     * Address Details
     */
    await page.waitForLoadState();
    await page
      .getByRole("textbox", { name: "* Email *" })
      .fill(`fawad${index + 1}@gmail.com`);
    await page
      .getByRole("textbox", { name: "* Phone Number *" })
      .fill("(954) 718-7803");
    await page.getByRole("textbox", { name: "* First Name *" }).fill("fawad");
    await page.getByRole("textbox", { name: "* Last Name *" }).fill("ahmad");
    await page
      .getByRole("textbox", { name: "* Address *" })
      .fill("7801 Colony Cir S");
    await page.getByRole("link", { name: "+ Apt, Suite, Etc." }).click();
    await page
      .getByRole("textbox", { name: "+ Apt, Suite, Etc." })
      .fill("Apt 101");
    await page.getByRole("textbox", { name: "* City *" }).fill("Tamarac");
    await page.locator("#shippingStatedefault").selectOption("FL");
    await page
      .getByRole("textbox", { name: "* ZIP Code *" })
      .fill("33321-3970");
    await page.getByRole("button", { name: "Continue to Payment" }).click();

    /**
     * Payment Details
     */
    await page.waitForLoadState();
    await page
      .frameLocator('iframe[name*="__privateStripeFrame"]')
      .first()
      .getByPlaceholder("1234 1234 1234")
      .fill("4111 1111 1111 1111");
    await page
      .frameLocator('iframe[name*="__privateStripeFrame"]')
      .first()
      .getByPlaceholder("MM / YY")
      .fill("03 / 30");
    await page
      .frameLocator('iframe[name*="__privateStripeFrame"]')
      .first()
      .getByPlaceholder("CVC")
      .fill("123");
    await page
      .getByRole("button", { name: "Continue to Review Order" })
      .click();
    await page.getByRole("button", { name: "Place Order" }).click();
    // await page.goto('https://staging.aerogarden.com/on/demandware.store/Sites-Aerogarden-Site/en_US/Stripe-PaymentElementOrderPlaced');
    // await page.goto('https://staging.aerogarden.com/order-confirmation/?ID=STG_AG_00037089&token=FFkfdkWRoApM8ImTvJAqzdkzHy1aFahwpAj5K7ih0jc');
    await page.waitForURL(/order-confirmation/);
    console.log(
      `Order Number: ${await page
        .locator(".summary-details.order-number")
        .innerText()}`
    );

    await expect(
      page.getByRole("heading", { name: "Thank You", exact: true })
    ).toBeVisible();
  });
}
