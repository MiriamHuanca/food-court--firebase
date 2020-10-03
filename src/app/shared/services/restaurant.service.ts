import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {createRequestOption} from "../utils/request-util";

import {FileItem} from "../models/file-Item";
import {AngularFireStorage} from "@angular/fire/storage";
import {finalize} from "rxjs/operators";
import {AuthResponseData} from "./auth.service";

@Injectable({providedIn: 'root'})
export class RestaurantService {

  url = environment.endPoint + 'evaluation/api/restaurantes';
  //Firebase
  private MEDIA_STORE_PATH = 'dominioimage';

  constructor(private http: HttpClient,
              private readonly storage: AngularFireStorage) {
  }

  public getRestaurantsList(req?: any): Observable<HttpResponse<any>> {
    const params = createRequestOption(req);
    return this.http.get<HttpResponse<any>>(`${this.url}`, {
      params: params,
      observe: 'response'
    });
  }

  public getRestaurantId(id: any): Observable<HttpResponse<any>> {
    return this.http.get(`${this.url}/${id}`, {observe: 'response'});
  }

  public getRstaurantStatus(status: any): Observable<HttpResponse<any>> {
    return this.http.get(`${this.url}/list?estado=${status}`, {observe: 'response'});
  }

  public getRestaurantCount(): Observable<HttpResponse<any>> {
    return this.http.get(`${this.url}/count`, {observe: 'response'});
  }

  public createRestaurant(body: any): Observable<HttpResponse<any>> {
    return this.http.post(`${this.url}/save`, body, {observe: 'response'});
  }

  public updateRestaurant(id: any, body: any): Observable<HttpResponse<any>> {
    body.id = id;
    return this.http.post(`${this.url}/save`, body, {observe: 'response'});
  }

  public deleteRestaurant(id: any): Observable<HttpResponse<any>> {
    return this.http.delete(`${this.url}/delete/${id}`, {observe: 'response'});
  }

  public restaurantActivate(id: any): Observable<HttpResponse<any>> {
    return this.http.put(`${this.url}/save`, id, {observe: 'response'});
  }

  public restaurantDeactivate(id: any): Observable<HttpResponse<any>> {
    return this.http.put(`${this.url}/save`, id, {observe: 'response'});
  }

  /*uploadImage(images: FileItem[]) {
    for (const item of images) {
      item.uploading = true;

      const filePath = this.generateFileName(item.name);
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, item.file);

      item.uploadPercent = task.percentageChanges();
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            item.downloadURL = fileRef.getDownloadURL();
            item.uploading = false;
          })
        )
        .subscribe();
    }
  }

  private generateFileName(name: string): string {
    return `${this.MEDIA_STORE_PATH}/${new Date().getTime()}_${name}`;
  }*/


  preAddAndUpdatePost(image) {
    //this.uploadImage(image);
  }
}
