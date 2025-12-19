import { Builder, By, until } from "selenium-webdriver";

async function loginTest() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // 1️⃣ Mở trang HOME
    await driver.get("http://localhost:5173");

    // 2️⃣ Click nút "Đăng nhập" trên trang chủ
    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Đăng nhập')]")),
      10000
    );
    await driver.findElement(By.xpath("//button[contains(text(),'Đăng nhập')]")).click();

    // 3️⃣ Đợi form login
    await driver.wait(until.elementLocated(By.id("username")), 10000);

    // 4️⃣ Nhập username
    await driver.findElement(By.id("username")).sendKeys("admin");

    // 5️⃣ Nhập password
    await driver.findElement(By.id("password")).sendKeys("admin123");

    // 6️⃣ Click submit
    await driver.findElement(By.css("button[type='submit']")).click();

    // 7️⃣ Đợi login xử lý
    await driver.sleep(4000);


    // 8️⃣ Kiểm tra token
    const token = await driver.executeScript(
      "return window.localStorage.getItem('token');"
    );

    if (!token) {
      throw new Error("❌ Login thất bại – không có token");
    }

    console.log("✅ LOGIN THÀNH CÔNG");
    console.log("TOKEN:", token.substring(0, 30) + "...");

  } catch (err) {
    console.error("❌ TEST FAILED:", err.message);
  } finally {
    await driver.quit();
  }
}

loginTest();
