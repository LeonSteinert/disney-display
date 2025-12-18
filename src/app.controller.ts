import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import AppService from './app.service';
import sqlite3 from 'sqlite3';

export class ConnectWifiDto {
  ssid: string;
  password: string;
}

@Controller()
class AppController {
  private readonly database = new sqlite3.Database('database.sql');

  constructor(private readonly appService: AppService) {
    // currently in initial setup
    //this.appService.showDisneyLogo();

    // checking if wifi is working
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      if (await this.appService.isWifiConnected()) {
        console.log('wifi already connected');

        //await this.startInOperatingMode();
      } else {
        await this.resetWifi();
      }
    }, 200);
  }

  @Get('/set-remaining-days')
  async setRemainingDays(): Promise<string> {
    try {
      await this.appService.showRemainingDays(109);
      return 'OK';
    } catch {
      return 'ERROR';
    }
  }

  @Get('/set-wait-time')
  async setWaitTime(): Promise<string> {
    try {
      await this.appService.showWaitTime(7653);
      return 'OK';
    } catch {
      return 'ERROR';
    }
  }

  @Get('/show-disney-logo')
  async showDisneyLogo(): Promise<string> {
    try {
      await this.appService.showDisneyLogo();
      return 'OK';
    } catch {
      return 'ERROR';
    }
  }

  @Get('/wifi-list')
  async showWifiList(): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.appService.getWifiList();
    } catch {
      return 'ERROR';
    }
  }

  @Post('/wifi')
  async connectToWifi(@Body() data: ConnectWifiDto): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body = data;
      console.log(data);

      console.log(
        'connection to network requested: ',
        body.ssid,
        ' -',
        body.password,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.appService.connectToWifi(data.ssid, data.password);
    } catch (e) {
      console.log(e);
      console.log(data);
      return 'ERROR';
    }
  }

  @Post('/reset-wifi-connection')
  async resetWifi(): Promise<string> {
    try {
      console.log(await this.appService.resetWifi());
      return 'OK';
    } catch {
      return 'ERROR';
    }
  }

  startInOperatingMode() {
    this.initDatabase();

    this.database.get(
      'SELECT * FROM settings WHERE key = ?',
      ['operatingMode'],
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (err: any, row: any) => {
        if (err) {
          console.error(err);
          return;
        }

        if (!row) {
          console.log('Kein Eintrag gefunden');
          return;
        }

        if (row.value === 'remaingDays') {
          await this.appService.showRemainingDays(109);
        } else {
          await this.appService.showWaitTime(7653);
        }
      },
    );
  }

  initDatabase() {
    this.database.serialize(() => {
      this.database.run('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)');
      this.database.run(
        'INSERT INTO settings (key, value) VALUES ("operatingMode", "remaingDays")',
      );
      this.database.run(
        'INSERT INTO settings (key, value) VALUES ("remainingDays", "109")',
      );
    });
  }
}

export default AppController;
