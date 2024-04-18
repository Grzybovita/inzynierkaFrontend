import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const OPTIMIZE_PATH_API = 'http://localhost:8080/optimizePath';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MapService {

  distanceMatrixService = new google.maps.DistanceMatrixService;

  constructor(private http: HttpClient) {}

  public async optimizePath(addresses: string[]): Promise<any>
  {
    // Remove empty strings or null values from addresses
    const filteredAddresses = addresses.filter(address => address && address.trim() !== '');

    if (filteredAddresses.length === 0)
    {
      throw new Error('No valid addresses provided.');
    }

    const resultMatrix = await this.getDistanceMatrix(filteredAddresses);
    const requestBody = JSON.stringify(resultMatrix);

    return this.http.post(OPTIMIZE_PATH_API, requestBody, httpOptions).toPromise();
  }

  public async getDistanceMatrix(addresses: string[]): Promise<number[][]>
  {
    const request = {
      origins: addresses,
      destinations: addresses,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };

    const response = await this.distanceMatrixService.getDistanceMatrix(request);

    const resultMatrix: number[][] = [];

    for (let i = 0; i < response.rows.length; i++)
    {
      resultMatrix[i] = [];
      for (let j = 0; j < response.rows.length; j++)
      {
        resultMatrix[i][j] = response.rows[i].elements[j].distance.value;
      }
    }

    return resultMatrix;
  }
}
