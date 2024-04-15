import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  distanceMatrixService = new google.maps.DistanceMatrixService;

  constructor(private http: HttpClient) {}

  public async optimizePath(addresses: string[]): Promise<any>
  {
    const resultMatrix = await this.getDistanceMatrix(addresses);
    const requestBody = JSON.stringify(resultMatrix);

    return this.http.post('http://localhost:8080/optimizePath', requestBody, {
      headers: { 'Content-Type': 'application/json' }
    }).toPromise();
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
