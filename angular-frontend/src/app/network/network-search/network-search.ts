import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../../../services/api/api';
import { FormsModule } from '@angular/forms';

export type Network = {
  ssid: string;
  bssid: string;
  mac: string;
  mode: string;
  channel: number;
  frequency: number;
  signal_level: number;
  quality: number;
  security: string;
};

@Component({
  selector: 'app-network-search',
  imports: [RouterLink, FormsModule],
  templateUrl: './network-search.html',
  styleUrl: './network-search.scss',
})
export class NetworkSearch implements OnInit {
  private readonly apiService = inject(Api);
  private readonly router = inject(Router);
  public loading: boolean = true;
  public networks: Network[] = [];
  protected showPopUp: boolean = false;
  protected selectedNetwork: Network | undefined;
  protected password: string = '';

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async ngOnInit() {
    await this.apiService.getWifiList().then((data) => {
      this.networks = JSON.parse(data) as Network[];
      this.loading = false;
    });
  }

  selectNetwork(network: Network) {
    this.selectedNetwork = network;
    this.showPopUp = true;
  }

  async connectNetwork() {
    await this.apiService
      .connectToNetwork(this.selectedNetwork?.ssid ?? '', this.password ?? '')
      .then(async () => {
        await this.router.navigate(['/network']);
      })
      .catch();
  }

  protected closePopUp() {
    this.showPopUp = false;
  }
}
