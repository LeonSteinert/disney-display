import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {
  async getWifiList(): Promise<string> {
    const res = await fetch('/wifi-list');
    return await res.text();
  }

  connectToNetwork(ssid: string, password: string) {
    return fetch(`/wifi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ssid, password }),
    });
  }

  resetNetwork() {
    return fetch(`/reset-wifi-connection`, {
      method: 'POST',
    });
  }
}
