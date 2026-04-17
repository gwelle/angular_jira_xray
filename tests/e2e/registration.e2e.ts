/// <reference types="mocha" />

console.log('Running registration.e2e.ts tests...');

import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import assert from "assert";
import {randomFirstName, randomLastName, randomEmail, randomPasswordPair} from '../support/random-testing-utils.ts';

describe('registration with success', function() {

  let driver: WebDriver;
  let options: Options;
  const REGISTRATION_URL = process.env['REGISTRATION_URL'];
  const LOGIN_URL = process.env['LOGIN_URL'];

  // Arrangement: Set up the WebDriver and environment variables
  before(async () => {
    if (!REGISTRATION_URL || !LOGIN_URL) {
      throw new Error('REGISTRATION_URL or LOGIN_URL is not defined');
    }

    options = new Options();
    options.setPageLoadStrategy('eager');
    options.setAcceptInsecureCerts(true);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  it('should register a new user successfully', async () => {
    
    // ACTION: Fill out the registration form and submit
    await driver.get(REGISTRATION_URL!);
   
    const emailInput = await driver.wait(until.elementLocated(By.id('email')), 5000);
    const passwordInput = await driver.wait(until.elementLocated(By.id('plainPassword')), 5000);
    const confirmationPasswordInput = await driver.wait(until.elementLocated(By.id('confirmationPassword')), 5000);
    const firstNameInput = await driver.wait(until.elementLocated(By.id('firstName')), 5000);
    const lastNameInput = await driver.wait(until.elementLocated(By.id('lastName')), 5000);
    const submitButton = await driver.wait(until.elementLocated(By.css('button[type="submit"]')), 5000);

    const { plainPassword, confirmationPassword } = randomPasswordPair();

    await emailInput.sendKeys(randomEmail());
    await passwordInput.sendKeys(plainPassword);
    await confirmationPasswordInput.sendKeys(confirmationPassword);
    await firstNameInput.sendKeys(randomFirstName());
    await lastNameInput.sendKeys(randomLastName());

    await submitButton.click();

    // IMPLICIT ASSERT: Verify that the user is redirected to the login page
    await driver.wait(until.urlIs(LOGIN_URL!), 10000);
    const emailInputLogin = await driver.findElement(By.id('email'));
    const isVisible = await emailInputLogin.isDisplayed();
    assert.strictEqual(isVisible, true);
  });

  after(async () => {
    /*if (driver) {
      await driver.quit();
    }*/

  });
});