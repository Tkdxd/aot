import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-core';
import { genSelector } from '../../shared/utils/selector';
import { scroll } from '../../shared/utils/nodeFunction';
import {
  CLOSE_BTN_DIALOG_SELECTORS,
  DIALOG_SELECTORS,
} from '../../shared/constants/constants';
import chromium from 'chrome-aws-lambda';

@Injectable()
export class TestService {
  constructor() {}

  async test(req, { nodes, edges }) {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: process.env.CHROME_PATH,
    });

    // const browser = await chromium.puppeteer.launch({
    //   executablePath: await chromium.executablePath,
    //   args: chromium.args,
    //   headless: chromium.headless,
    // });
    // console.log(browser);
    // let browserWSEndpoint = browser.wsEndpoint();
    // console.log(browserWSEndpoint);
    let page = (await browser.pages())[0];
    await page.setViewport({ width: 1580, height: 1024 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0',
    );
    page.setDefaultTimeout(15000);
    // browser.wsEndpoint();
    // console.log(browserWSEndpoint);
    let node = nodes.find(({ type }) => type === 'startNode');
    if (node) {
      while (node) {
        const data = node.data;

        try {
          const selector = genSelector(data?.selector);
          const scrollContainerSelector = genSelector(
            data?.scrollContainerSelector,
          );

          switch (node.type) {
            case 'startNode':
              break;
            case 'openURLNode':
              if (data?.url) {
                await page.goto(data.url);
                console.log(data.url);
                await page.screenshot({
                  path: 'public/tmp.jpg',
                });
                // this.appGateway.handleEvent({
                //   data: `${req.protocol}://${req.get('Host')}/public/tmp.jpg`,
                // });
              }
              break;
            case 'stopNode':
              await browser.close();
              break;
            case 'clickNode':
              await page.waitForSelector(selector);

              if (!data?.exceptList) {
                data.exceptList = [];
              }
              const elList = await page.$$(selector);
              const arrIdx = Array.from(Array(elList.length).keys()).filter(
                (itm) => !data.exceptList.includes(itm),
              );
              const randomIdx = Math.floor(
                Math.random() * (elList.length - data.exceptList.length ?? 0),
              );
              const elIdx = data?.randomClick ? arrIdx?.[randomIdx] : 0;
              if (data?.randomClick) {
                data.exceptList = [...data.exceptList, elIdx];
              }

              const href = (
                await page.$$eval(selector, (els) => els.map((el) => el.href))
              )[elIdx];
              const target = (
                await page.$$eval(selector, (els) => els.map((el) => el.target))
              )[elIdx];

              await page
                .$$eval(
                  selector,
                  (els: HTMLElement[], selector: string, elIdx) => {
                    console.log(
                      'Found %d element from selector %s.',
                      els.length,
                      selector,
                    );
                    els[elIdx]?.click();
                  },
                  selector,
                  elIdx,
                )
                .then(() => console.log('Click on selector %s.', selector))
                .catch((e) => console.log(e));

              if (target === '_blank') {
                console.log('Open new window %s...', href);
                await browser.waitForTarget((target) => target.url() === href);
                page = (await browser.pages()).at(-1);
              } else if (href) {
                console.log('Navigating %s...', href);
                await page.waitForNavigation();
              }
              break;
            case 'typeNode':
              await page
                .waitForSelector(selector)
                .then(
                  async () =>
                    await page.type(selector, data?.content || '', {
                      delay: data?.delay || 0,
                    }),
                )
                .catch((e) => console.log(e));
              break;
            case 'scrollNode':
              await scroll(
                { ...data, selector, scrollContainerSelector },
                page,
              );
              break;
            case 'closeDialogNode':
              Promise.race(
                DIALOG_SELECTORS.map((dialogSelector) => {
                  return new Promise(async (resolve, reject) => {
                    const dialog = await page.waitForSelector(
                      `::-p-xpath(//${dialogSelector})`,
                      {
                        visible: true,
                      },
                    );
                    if (dialog) {
                      resolve(dialogSelector);
                    } else {
                      reject(null);
                    }
                  });
                }),
              ).then(async (dialogSelector: string) => {
                if (dialogSelector) {
                  console.log('Dialog found.', selector);

                  Promise.race(
                    CLOSE_BTN_DIALOG_SELECTORS.map((closeBtnSelector) => {
                      return new Promise(async (resolve, reject) => {
                        const closeBtn = await page.waitForSelector(
                          `::-p-xpath(//${dialogSelector}//${closeBtnSelector})`,
                          {
                            visible: true,
                          },
                        );
                        if (closeBtn) {
                          console.log(
                            'Found element from selector %s.',
                            `::-p-xpath(//${dialogSelector}//${closeBtnSelector})`,
                          );
                          resolve(
                            `::-p-xpath(//${dialogSelector}//${closeBtnSelector})`,
                          );
                        } else {
                          reject(null);
                        }
                      });
                    }),
                  ).then(async (selector: string) => {
                    await page
                      .$$eval(
                        selector,
                        (els: HTMLElement[]) => {
                          els[0]?.click();
                        },
                        selector,
                      )
                      .then(() =>
                        console.log('Click on selector %s.', selector),
                      )
                      .catch((e) => console.log(e));
                  });
                }
              });
              break;
            default:
              break;
          }
          const target = edges.find(
            ({ source, sourceHandle }) =>
              source === node.id && sourceHandle === 'success',
          )?.target;

          node = nodes.find(({ id }) => id === target);
        } catch (e) {
          console.log(e);
          const target = edges.find(
            ({ source, sourceHandle }) =>
              source === node.id && sourceHandle === 'fail',
          )?.target;

          if (target) {
            node = nodes.find(({ id }) => id === target);
          } else {
            node = null;
          }
          continue;
        }
      }
    }
    console.log(browser.wsEndpoint());
    return browser.wsEndpoint();
  }

  async test1() {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: process.env.CHROME_PATH,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });
    try {
      await page.goto(
        'https://www.google.com/search?q=Tuy%E1%BB%83n%20d%E1%BB%A5ng%20marketing%20TopCV',
      );
      const selector =
        '::-p-xpath((//a[div//span[contains(text(), "TopCV")]])[1])';
      await page.waitForSelector(selector);

      await Promise.all([page.waitForNavigation(), page.click(selector)]);

      // selector =
      //   '::-p-xpath(//div[@role="dialog"]//button[@aria-label="Close"])';
      // await page.waitForSelector(selector);
      // await page
      //   .$$eval(selector, (els: HTMLElement[]) => els[1].click())
      //   .catch((e) => console.log(e));

      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight - window.innerHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });

      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          const distance = 100;
          const timer = setInterval(() => {
            let scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, -distance);
            scrollHeight -= distance;

            if (scrollHeight <= 0) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
      // await page.click(selector);
    } catch (e) {
      console.log(e);
    }

    return browser;
  }

  async test2() {
    const browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      headless: chromium.headless,
    });
    return browser;
  }

  async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
}
