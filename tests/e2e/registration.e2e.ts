/// <reference types="mocha" />

import { By, until, WebDriver, WebElement } from 'selenium-webdriver';
import assert from "assert";
import {randomFirstName, randomLastName, randomEmail, randomPasswordPair} from '../support/random-testing-utils.ts';
import { buildDriver, quitDriver } from '../support/driver.ts';
import { openRegistrationPage, loadFormElements, fillFormElements, clickSubmitButton} from '../actions/registration.action.ts';
import type { RegistrationFormLocators, RegistrationFormValues } from '../actions/registration.action.ts';

const REGISTRATION_URL = process.env['REGISTRATION_URL'];
const LOGIN_URL = process.env['LOGIN_URL'];
const E2E_EXISTING_EMAIL = process.env['E2E_EXISTING_EMAIL'];
const E2E_INVALID_EMAIL = process.env['E2E_INVALID_EMAIL'];
let driver: WebDriver;
let registrationFormLocators: RegistrationFormLocators;
let registrationFormElements: RegistrationFormValues;

let elements : Record<string, WebElement> = {};
/**
 * Helper function to set up the WebDriver and environment variables
 * @returns {Promise<void>} A promise that resolves when the setup is complete
 * @throws {Error} If REGISTRATION_URL or LOGIN_URL is not defined
 */
async function setUp(): Promise<void> {
  if (!REGISTRATION_URL || !LOGIN_URL) {
      throw new Error('REGISTRATION_URL or LOGIN_URL is not defined');
  }
}

/**
 * Helper function to check if an element is displayed
 * @param element The WebElement to check
 * @returns A promise that resolves to true if the element is displayed, false otherwise
 */
async function isElementDisplayed(element: WebElement): Promise<boolean> {
  const isDisplayed = await element.isDisplayed();
  return isDisplayed;
}

/**
 * Helper function to load the error message element
 * @param time The maximum time to wait for the element to be located
 * @returns A promise that resolves to the located WebElement
 */
async function loadErrorMessage(time: number): Promise<WebElement> {
  return await driver.wait(until.elementLocated(By.css('.invalid-feedback')), time);
}

describe('registration with success', function() {

  // Arrangement
  before(async () => {
    await setUp();
    registrationFormLocators = {
      email: By.id('email'),
      plainPassword: By.id('plainPassword'),
      confirmationPassword: By.id('confirmationPassword'),
      firstName: By.id('firstName'),
      lastName: By.id('lastName'),
      button: By.css('button[type="submit"]')
    };

    const { plainPassword, confirmationPassword } = randomPasswordPair();
    registrationFormElements = {
      email: randomEmail(),
      plainPassword: plainPassword,
      confirmationPassword: confirmationPassword,
      firstName: randomFirstName(),
      lastName: randomLastName(),
     };
  });

  beforeEach(async () => {
    driver = await buildDriver({browser: 'chrome', headless: false});
    await openRegistrationPage(driver, REGISTRATION_URL!);
    elements = await loadFormElements(driver, registrationFormLocators, 20000);    
  });

  afterEach(async () => {
    await driver.wait(async () => {
      const readyState = await driver.executeScript("return document.readyState");
      return readyState === "complete";
    }, 20000);

    await quitDriver();
  });

  it('should register a new user successfully', async () => {

    // Act
    await fillFormElements(elements, registrationFormElements);
    await clickSubmitButton(elements["button"]!);

    // Assert: Verify that the user is redirected to the login page and the email input is visible
    await driver.wait(until.urlIs(LOGIN_URL!), 20000);
    const emailInputLogin = await driver.findElement(By.id('email'));
    const isVisible = await isElementDisplayed(emailInputLogin);
    assert.strictEqual(isVisible, true);
  });

  it('should not register a new user successfully because email already exists', async () => {
    const existingEmail = E2E_EXISTING_EMAIL;
    registrationFormElements.email = existingEmail;
    await fillFormElements(elements, registrationFormElements);
    await clickSubmitButton(elements["button"]!);

    // Assert: Verify that the user is not redirected to the login page and an error message is displayed
    await driver.wait(until.urlContains('/registration'), 20000);
    const errorMessage = await loadErrorMessage(10000);
    const isDisplayed = await isElementDisplayed(errorMessage);
    assert.strictEqual(isDisplayed, true);

  });

  it('should not register a new user successfully because invalid email', async () => {

    // Act
    const invalidEmail = E2E_INVALID_EMAIL;
    registrationFormElements.email = invalidEmail;
    await fillFormElements(elements, registrationFormElements);
    await clickSubmitButton(elements["button"]!);

    // Assert: Verify that the user is not redirected to the login page and an error message is displayed
    await driver.wait(until.urlContains('/registration'), 20000);
    const errorMessage = await loadErrorMessage(10000);
    const isDisplayed = await isElementDisplayed(errorMessage);
    assert.strictEqual(isDisplayed, true);

  });

});