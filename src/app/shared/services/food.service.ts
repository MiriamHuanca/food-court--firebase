import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {createRequestOption} from "../utils/request-util";

@Injectable({providedIn: 'root'})
export class FoodService {

  url = environment.endPoint + `evaluation/api/tipoComida`;

  constructor(private http: HttpClient) {
  }

  public getFootList(req?: any): Observable<HttpResponse<any>> {
    const params = createRequestOption(req);
    return this.http.get<HttpResponse<any>>(`${this.url}`, {
      params: params,
      observe: 'response' ,
    });
  }

  public getFoodId(id: any): Observable<HttpResponse<any>> {
    return this.http.get(`${this.url}/${id}`,{observe: 'response'});
  }

  public createFood(body: any): Observable<HttpResponse<any>> {
    return this.http.post(`${this.url}/save`, body, {observe: 'response'});
  }

  public updateFood(id: any, body: any): Observable<HttpResponse<any>> {
    body.id = id;
    return this.http.post(`${this.url}/save`, body, {observe: 'response'});
  }

  public deleteFood(id: any): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.url}/restaurants/${id}.json`,{observe: 'response'});
  }

  /*public allFood(req?: any): Observable<HttpResponse<any>> {
    const params = createRequestOption(req);
    return this.http.get<HttpResponse<any>>(`${this.url}`, {
      params: params,
      observe: 'response'
    });
  }*/

}
