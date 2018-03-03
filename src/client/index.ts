import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiClientService {

  private domain = 'http://159.122.175.14:31090';

  constructor(private http: HttpClient, @Optional() @Inject('domain') domain: string) {
    if (domain) {
      this.domain = domain;
    }
  }

  public createUser(user: any): Observable<HttpResponse<any>> {
    let uri = `/api/CreateUser`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(user));
  }

  public getUsers(): Observable<HttpResponse<any>> {
    let uri = `/api/User`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('get', uri, headers, params, null);
  }

  public getUserId(id:string): Observable<HttpResponse<any>> {
    let uri = `/api/User/` +id;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('get', uri, headers, params, null);
  }

  public login(credentials: any): Observable<HttpResponse<any>> {
    let uri = `/api/Login`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(credentials));
  }

  public addProfileFoto(credentials: any): Observable<HttpResponse<any>> {
    let uri = `/api/AddProfileFoto`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(credentials));
  }

 /* public deleteContract(id:string): Observable<HttpResponse<any>> {
    let uri = `/api/Contract/` + id;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('delete', uri, headers, params, null);
  }*/

  private sendRequest<T>(method: string, uri: string, headers: HttpHeaders, params: HttpParams, body: any): Observable<HttpResponse<T>> {
    if (method === 'post') {
      return this.http.post<T>(this.domain + uri, body, { headers: headers.set('Content-Type', 'application/json'), params: params, observe: 'response' });
    } else if (method === 'get') {
      return this.http.get<T>(this.domain + uri, { headers: headers.set('Accept', 'application/json'), params: params, observe: 'response' });
    } else if(method === 'delete'){
      return this.http.delete<T>(this.domain + uri, { headers: headers.set('Content-Type', 'application/json'), params: params, observe: 'response' });
    }
  }
}