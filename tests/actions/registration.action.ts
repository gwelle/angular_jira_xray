import { By, until, WebDriver, WebElement } from 'selenium-webdriver';

export type RegistrationFormLocators = {
  [key: string]: By | undefined;
  email?: By;
  plainPassword?: By;
  confirmationPassword?: By;
  firstName?: By;
  lastName?: By;
  button?: By;
};

export type RegistrationFormValues = {
  [key: string]: string | undefined;
  email?: string;
  plainPassword?: string;
  confirmationPassword?: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Helper function to navigate to the registration page
 * @param driver - The WebDriver instance
 * @param url - The URL of the registration page
 * @return {Promise<void>} A promise that resolves when the registration page has been loaded
 */
export async function openRegistrationPage(driver: WebDriver, url: string): Promise<void> {
  await driver.get(url);
}

/**
 * Helper function to load the elements of the registration form
 * @param driver - The WebDriver instance
 * @param locator - The locator for the element to wait for
 * @param time - The maximum time to wait for the element to be located (in milliseconds)
 * @return {Promise<void>} A promise that resolves when the elements of the registration form have been loaded
 */
export async function waitForElement(driver: WebDriver, locator: By, time: number) : Promise<WebElement> {
  const element = await driver.wait(until.elementLocated(locator), time);
  await driver.wait(until.elementIsVisible(element), time);
  return element;
}

/**
 * Helper function to fill out an input element with a given value
 * @param element - The WebElement instance representing the input element
 * @param value - The value to be entered into the input element
 * @returns {Promise<WebElement>} A promise that resolves to the WebElement instance after the value has been entered
 */
export async function fillElement(element: WebElement, value: string): Promise<WebElement> {
  await element.sendKeys(value);
  return element;
}


/**
 * Helper function to load multiple elements of the registration form
 * @param driver - The WebDriver instance
 * @param locators - An object containing the locators for the elements to wait for
 * @param time - The maximum time to wait for each element to be located (in milliseconds)
 * @return {Promise<Record<string, WebElement>>} A promise that resolves to an object containing the located WebElements  
 */
export async function loadFormElements(driver: WebDriver, locators: RegistrationFormLocators, time: number) : Promise<Record<string, WebElement>> {

  const elements: Record<string, WebElement> = {};

  for (const key in locators) {
    const locator = locators[key];
    if (locator) {
      elements[key] = await waitForElement(driver, locator, time);
    }
  }

  return elements;
}

export async function fillFormElements(elements: Record<string, WebElement>, values: RegistrationFormValues) : Promise<Record<string, string>> {

  const data: Record<string, string> = {};

  for(const key in values){
    const value = values[key];
    if(typeof value === 'string' && elements[key]){
      await fillElement(elements[key], value);
      data[key] = value;
    }
  }
  return data;
}


/**
 * Helper function to click on the submit button
 * @param element - The WebElement instance representing the submit button
 * @returns {Promise<void>} A promise that resolves when the submit button has been clicked
 */
export async function clickSubmitButton(element: WebElement): Promise<void> {
  await element.click();
}
