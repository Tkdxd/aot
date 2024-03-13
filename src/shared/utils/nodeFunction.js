export const scrollIntoView = async (
  { type, option, distancePerIntervalTime, intervalTime, selector, distance },
  page,
) => {
  intervalTime = intervalTime * 1000;
  switch (type) {
    case 'page':
      if (option === 'top') {
        await page.evaluate(
          (distancePerIntervalTime, intervalTime) => {
            return new Promise((resolve) => {
              var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, -distancePerIntervalTime);
                scrollHeight -= distancePerIntervalTime;

                if (scrollHeight <= 0) {
                  clearInterval(timer);
                  resolve();
                }
              }, intervalTime);
            });
          },
          distancePerIntervalTime,
          intervalTime,
        );
      } else if (option === 'bottom') {
        await page.evaluate(
          (distancePerIntervalTime, intervalTime) => {
            return new Promise((resolve) => {
              var totalHeight = 0;
              var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distancePerIntervalTime);
                totalHeight += distancePerIntervalTime;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                  clearInterval(timer);
                  resolve();
                }
              }, intervalTime);
            });
          },
          distancePerIntervalTime,
          intervalTime,
        );
      }
      break;
    case 'selector':
      let el = await page.waitForSelector(selector, { timeout: 5000 });
      do {
        if (el) {
          console.log('Found element with selector %s', selector);

          const overflowY = await page.evaluate((el) => {
            return window.getComputedStyle(el).overflowY;
          }, el);

          if (!['scroll', 'auto'].includes(overflowY)) {
            console.log("Element with selector %s isn't scrollable", selector);
            return false;
          }

          console.log('Element with selector %s is scrollable', selector);

          const scrollHeightSelector = await page.evaluate((el) => {
            const { y } = el.getBoundingClientRect();
            return y;
          }, el);
          await page.evaluate(
            (distancePerIntervalTime, intervalTime, scrollHeightSelector) => {
              return new Promise((resolve) => {
                var totalHeight = 0;

                var timer = setInterval(() => {
                  var scrollHeight = document.body.scrollHeight;

                  window.scrollBy(0, distancePerIntervalTime);
                  totalHeight += distancePerIntervalTime;

                  if (
                    totalHeight >= scrollHeight - window.innerHeight ||
                    window.scrollY >= scrollHeightSelector - 300
                  ) {
                    clearInterval(timer);
                    resolve();
                  }
                }, intervalTime);
              });
            },
            distancePerIntervalTime,
            intervalTime,
            scrollHeightSelector,
          );
        } else {
          await page.evaluate(
            (distancePerIntervalTime, intervalTime) => {
              return new Promise((resolve) => {
                var totalHeight = 0;
                var timer = setInterval(() => {
                  window.scrollBy(0, distancePerIntervalTime);
                  totalHeight += distancePerIntervalTime;

                  if (totalHeight >= 1000) {
                    clearInterval(timer);
                    resolve();
                  }
                }, intervalTime);
              });
            },
            distancePerIntervalTime,
            intervalTime,
          );
          el = await page.waitForSelector(selector, { timeout: 5000 });
        }
      } while (!el);
      return !!el;
    case 'pixel':
      if (option === 'top') {
        await page.evaluate(
          (distancePerIntervalTime, intervalTime, distance) => {
            return new Promise((resolve) => {
              const baseScrollHeight = document.body.scrollHeight;
              var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, -distancePerIntervalTime);
                scrollHeight -= distancePerIntervalTime;

                if (
                  scrollHeight <= 0 ||
                  baseScrollHeight - scrollHeight >= distance
                ) {
                  clearInterval(timer);
                  resolve();
                }
              }, intervalTime);
            });
          },
          distancePerIntervalTime,
          intervalTime,
          distance,
        );
      } else if (option === 'bottom') {
        await page.evaluate(
          (distancePerIntervalTime, intervalTime, distance) => {
            return new Promise((resolve) => {
              var totalHeight = 0;
              var timer = setInterval(() => {
                window.scrollBy(0, distancePerIntervalTime);
                totalHeight += distancePerIntervalTime;

                if (totalHeight >= distance) {
                  clearInterval(timer);
                  resolve();
                }
              }, intervalTime);
            });
          },
          distancePerIntervalTime,
          intervalTime,
          distance,
        );
      }
      break;
    default:
      break;
  }
};

export const scroll = async (
  {
    type,
    option,
    distancePerIntervalTime,
    intervalTime,
    distance,
    selector,
    scrollContainerSelector,
  },
  page,
) => {
  if (
    !scrollContainerSelector ||
    scrollContainerSelector.trim().length === 0 ||
    scrollContainerSelector === '::-p-xpath(//body)' ||
    scrollContainerSelector === 'body'
  ) {
    await scrollIntoView(
      {
        type,
        option,
        distancePerIntervalTime,
        intervalTime,
        selector,
        distance,
      },
      page,
    );
  } else {
    const el = await scrollIntoView(
      {
        type: 'selector',
        distancePerIntervalTime,
        intervalTime,
        selector: scrollContainerSelector,
      },
      page,
    );

    if (!el) {
      return;
    }

    await page.waitForSelector(scrollContainerSelector, {
      timeout: 5000,
    });

    const scrollContainer = await page.$(scrollContainerSelector);
    scrollContainer.scrollIntoView();
    const scrollHeightContainer = await page.evaluate((scrollContainer) => {
      return scrollContainer.scrollHeight;
    }, scrollContainer);

    intervalTime = intervalTime * 1000;
    switch (type) {
      case 'page':
        if (option === 'top') {
          await page.evaluate(
            (distancePerIntervalTime, intervalTime, scrollHeightContainer) => {
              return new Promise((resolve) => {
                var timer = setInterval(() => {
                  var scrollHeight = scrollHeightContainer;
                  window.scrollBy(0, -distancePerIntervalTime);
                  scrollHeight -= distancePerIntervalTime;

                  if (scrollHeight <= 0) {
                    clearInterval(timer);
                    resolve();
                  }
                }, intervalTime);
              });
            },
            distancePerIntervalTime,
            intervalTime,
            scrollHeightContainer,
          );
        } else if (option === 'bottom') {
          await page.evaluate(
            (
              distancePerIntervalTime,
              intervalTime,
              scrollContainer,
              scrollHeightContainer,
            ) => {
              return new Promise((resolve) => {
                var totalHeight = 0;
                var timer = setInterval(() => {
                  var scrollHeight = scrollHeightContainer;

                  totalHeight += distancePerIntervalTime;
                  scrollContainer.scrollTop = totalHeight;

                  if (
                    totalHeight >=
                    scrollHeight - scrollContainer.offsetHeight
                  ) {
                    clearInterval(timer);
                    resolve();
                  }
                }, intervalTime);
              });
            },
            distancePerIntervalTime,
            intervalTime,
            scrollContainer,
            scrollHeightContainer,
          );
        }
        break;
      case 'selector':
        break;
      case 'pixel':
        break;
    }
  }
};

export const takeScreenshot = async (page, server, folder, fidx) => {
  const file = `${folder}/f_${fidx++}.jpg`;
  await page.screenshot({
    path: file,
  });
  server.emit('receive_info', {
    data: `${process.env.DOMAIN}/${file}`,
  });
  return fidx;
};
