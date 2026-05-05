import { Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';

let driver: WebDriver;

type DriverConfig = {
  browser: string;
  headless?: boolean;
  insecureCerts?: boolean;
  pageLoadStrategy?: 'normal' | 'eager' | 'none';
  customOptions?: string[]; // Additional custom options for the browser
};

/**
 * Helper function to build a WebDriver instance with specified options
 * @param {string} browser - The name of the browser to use (e.g., 'chrome')
 * @returns {Promise<WebDriver>} A promise that resolves with the WebDriver instance
 */
export async function buildDriver({
    browser,
    headless = true,
    insecureCerts = true,
    pageLoadStrategy = 'eager',
    customOptions 
}: DriverConfig): Promise<WebDriver> {
    const options = new Options();
    options.setPageLoadStrategy(pageLoadStrategy ?? 'eager');
    options.setAcceptInsecureCerts(insecureCerts ?? true);
    if (headless) {
        options.addArguments('--headless=new');
    }
    if (customOptions) {
        options.addArguments(...customOptions);
    }
    
    driver = await new Builder()    
        .forBrowser(browser)
        .setChromeOptions(options)
        .build();
    return driver;
}

/**
 * Helper function to quit the WebDriver instance
 * @returns {Promise<void>} A promise that resolves when the WebDriver is quit
 */
export async function quitDriver(): Promise<void> {  
    if (driver) {
        await driver.quit();
    }
}