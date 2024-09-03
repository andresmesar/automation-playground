import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import { breakpoints } from '../../utils/breakpoints';

// Función para emular dispositivos
const emulateDevice = async (browser, deviceName) => {
    const devices = {
        'iPhone XR': {
            deviceMetrics: { width: 414, height: 896, pixelRatio: 2 },
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
        }
        // Add other devices to test 
    };

    const device = devices[deviceName];
    if (!device) {
        throw new Error(`Device ${deviceName} is not defined`);
    }

    await browser.execute('window.navigator.__defineGetter__("userAgent", function(){ return "' + device.userAgent + '"; })');
    await browser.setWindowSize(device.deviceMetrics.width, device.deviceMetrics.height);
};

// Select the breakpoints to test 
const selectedBreakpoints = ['desktop','laptop','tablet','tablet-portrait','mobile']; 

breakpoints
    .filter(({ name }) => selectedBreakpoints.includes(name))
    .forEach(({ name, width, height, device }) => {
        describe(`Responsive Test for ${name} (${width}x${height})`, () => {
           
            it(`should render correctly at ${name}`, async () => {
                const browsername = await browser.capabilities.browserName;
                try {
                    if (device) {
                        allureReporter.addStep(`Emulating device ${device}`);
                        await emulateDevice(browser, device);
                    } else {
                        allureReporter.addStep(`Setting viewport to ${width}x${height}`);
                        await browser.setWindowSize(width, height);
                    }

                    allureReporter.addStep('Navigating to fifa.com/en/preview');
                    await browser.url('https://www.exito.com');
                    await expect(browser).toHaveUrl(expect.stringContaining('exito'));

                    // allureReporter.addStep('Checking search bar');
                    // const searchBar = $(`[class*='search-input_fs-search-input']`);
                    // await searchBar.waitForDisplayed({ timeout: 5000 });
                    // await expect(searchBar).toExist();
                    await browser.pause(1000)
                    allureReporter.addStep('Taking screenshot');
                    const screenshot = await browser.saveScreenshot(`test/Web/screenshots/${name}-${browsername}-${width}.png`);
                    allureReporter.addAttachment(`Screenshot-${name}-${width}x${height}`, screenshot, 'image/png');
                    await browser.refresh()
                    await browser.pause(100)


                } catch (error) {
                    allureReporter.addStep(`Error at resolution ${name} (${width}x${height}): ${error.message}`, {}, 'failed');
                }
            });
        });
    });