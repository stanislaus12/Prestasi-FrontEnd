import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {
  apiNode = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  getPrestasi(vData: any) {
    return this.httpClient.post(this.apiNode + '/prestasi/get', vData, {
      responseType: 'json',
    });
  }

  addPrestasi(vData: any) {
    return this.httpClient.post(this.apiNode + '/prestasi/add', vData, {
      responseType: 'json',
    });
  }

  editPrestasi(vData: any) {
    return this.httpClient.post(this.apiNode + '/prestasi/edit', vData, {
      responseType: 'json',
    });
  }

  deletePrestasi(vData: any) {
    return this.httpClient.post(this.apiNode + '/prestasi/delete', vData, {
      responseType: 'json',
    });
  }

  searchPrestasi(vData: any) {
    return this.httpClient.post(this.apiNode + '/prestasi/search', vData, {
      responseType: 'json',
    });
  }
}
