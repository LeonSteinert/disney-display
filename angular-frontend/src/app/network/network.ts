import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api/api';

@Component({
  selector: 'app-network',
  imports: [RouterLink],
  templateUrl: './network.html',
  styleUrl: './network.scss',
})
export class Network {
  private readonly apiService = inject(Api);

  protected async resetNetwork() {
    await this.apiService.resetNetwork();
  }
}
