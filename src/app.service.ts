import { Injectable } from '@nestjs/common';
import shell from 'shelljs';
import * as wifi from 'node-wifi';
import * as os from 'os';
import { filter } from 'rxjs';

@Injectable()
class AppService {
  private readonly wifiFunctionReady: boolean = false;

  constructor() {
    try {
      wifi.init({ iface: 'wlan0' });
      this.wifiFunctionReady = true;
    } catch (e) {
      console.log(e);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Displays the appropriate wait time on the display by executing a Python script
   * based on the number of digits in the given wait time.
   *
   * @param {number} current - The current wait time to display. The value determines
   *                           which Python script is executed based on its number of digits.
   * @return {Promise<void>} A promise that resolves after the appropriate Python script
   *                         is executed.
   */
  async showWaitTime(current: number) {
    const currentStringLength = current.toString().length;

    if (currentStringLength > 3) {
      await shell.exec(
        `python3 /var/disney-display/python/examples/show-wait-time-four-digits.py ${current}`,
        { async: true },
      );
    } else if (currentStringLength > 2) {
      await shell.exec(
        `python3 /var/disney-display/python/examples/show-wait-time-three-digits.py ${current}`,
        { async: true },
      );
    } else if (currentStringLength > 1) {
      await shell.exec(
        `python3 /var/disney-display/python/examples/show-wait-time-two-digits.py ${current}`,
        { async: true },
      );
    } else {
      if (current === 1) {
        await shell.exec(
          `python3 /var/disney-display/python/examples/show-wait-time-single.py ${current}`,
          { async: true },
        );
      } else {
        await shell.exec(
          `python3 /var/disney-display/python/examples/show-wait-time-one-digit.py ${current}`,
          { async: true },
        );
      }
    }
  }

  /**
   *
   * @param remaining
   */
  async showRemainingDays(remaining: number) {
    const currentStringLength = remaining.toString().length;

    if (currentStringLength > 3) {
      await shell.exec(
        `python3 /var/disney-display/python/examples/show-remaining-days-four-digits.py ${remaining}`,
        { async: true },
      );
    } else if (currentStringLength > 2) {
      await shell.exec(
        `python3 /var/disney-display/python/examples/show-remaining-days-three-digits.py ${remaining}`,
        { async: true },
      );
    } else if (currentStringLength > 1) {
      await shell.exec(
        `python3 /var/disney-display/python/examples/show-remaining-days-two-digits.py ${remaining}`,
        { async: true },
      );
    } else {
      if (remaining === 1) {
        await shell.exec(
          `python3 /var/disney-display/python/examples/show-remaining-days-single.py ${remaining}`,
          { async: true },
        );
      } else {
        await shell.exec(
          `python3 /var/disney-display/python/examples/show-remaining-days-one-digit.py ${remaining}`,
          { async: true },
        );
      }
    }
  }

  /**
   * Displays the Disney logo on the screen by executing a Python script.
   *
   * This method asynchronously runs the `show-disney-logo.py` script located in the specified directory.
   * It uses the `shell.exec` function to call the Python script with the required arguments.
   *
   * @return {Promise<void>} A promise that resolves when the script execution is initiated successfully.
   */
  async showDisneyLogo(): Promise<void> {
    await shell.exec(
      `python3 /var/disney-display/python/examples/show-disney-logo.py`,
      { async: true },
    );
  }

  /**
   * Retrieves a list of available WiFi networks by performing a scan.
   *
   * @return {Promise<Array<Object>>} A promise that resolves to an array of objects representing available WiFi networks. Each object typically contains information such as the SSID, BSSID, signal strength, and other network details.
   */
  async getWifiList() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await wifi.scan();
  }

  async connectToWifi(ssid: string, password: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    try {
      await wifi.connect({ ssid: ssid, password: password });

      // wifi connection successful, getting local ip address
      const networkInterfaces = os.networkInterfaces();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const localIp = (networkInterfaces['wlan0'] ?? []).find(
        (details) => details.family === 'IPv4',
      ).address;
      console.log(localIp);

      await shell.exec(
        `python3 /var/disney-display/python/examples/show-wifi-connection-successful.py ${localIp}`,
        { async: true },
      );

      return {
        status: 200,
        message: 'Wifi connection successful.',
      };
    } catch {
      await shell.exec(
        `python3 /var/disney-display/python/examples/show-wifi-connection-failed.py`,
        { async: true },
      );

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(async () => {
        await this.resetWifi();
      }, 5000);

      return {
        status: 400,
        message: 'Wifi connection failed.',
      };
    }
  }

  async resetWifi() {
    await shell.exec(
      `python3 /var/disney-display/python/examples/show-wifi-hotspot.py`,
      { async: true },
    );

    await shell.exec(`bash /var/disney-display/wifi-hotspot-2.sh`, {
      async: true,
    });
  }

  async isWifiConnected() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const currentConnections = await wifi.getCurrentConnections();

      console.log(currentConnections);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const filteredConnections = currentConnections.filter(
        (connection) => connection.iface === 'wlan0',
      );

      console.log('filtered', filteredConnections);

      return filteredConnections.length > 0;
    } catch {
      return false;
    }
  }
}

export default AppService;
