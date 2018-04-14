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
  
  public updateProfile(updateProfile:any):Observable<HttpResponse<any>> {
    let uri = `/api/UpdateProfile`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(updateProfile));
  }

  public securityOptions(securityOptions:any):Observable<HttpResponse<any>> {
    let uri = `/api/SecurityOptions`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(securityOptions));
  }

  public login(credentials: any): Observable<HttpResponse<any>> {
    let uri = `/api/Login`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(credentials));
  }

  public sendMoney(sendMoney:any):Observable<HttpResponse<any>> {
    let uri = `/api/SendMoney`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(sendMoney));
  }

  public requestMoney(requestMoney:any):Observable<HttpResponse<any>> {
    let uri = `/api/RequestMoney`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(requestMoney));
  }

  public acceptRequest(acceptRequest:any):Observable<HttpResponse<any>> {
    let uri = `/api/AcceptRequest`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(acceptRequest));
  }

  public rejectRequest(rejectRequest:any):Observable<HttpResponse<any>> {
    let uri = `/api/RejectRequest`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(rejectRequest));
  }

  public depositMoney(depositMoney:any):Observable<HttpResponse<any>> {
    let uri = `/api/DepositMoney`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(depositMoney));
  }

  public withdrawMoney(withdrawMoney:any):Observable<HttpResponse<any>> {
    let uri = `/api/WithdrawMoney`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(withdrawMoney));
  }

  public addCreditCard(addCreditCard:any):Observable<HttpResponse<any>> {
    let uri = `/api/AddCreditCard`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(addCreditCard));
  }

  public deleteCreditCard(deleteCreditCard:any):Observable<HttpResponse<any>> {
    let uri = `/api/DeleteCreditCard`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('post', uri, headers, params, JSON.stringify(deleteCreditCard));
  }

  public getUserId(id:string): Observable<HttpResponse<any>> {
    let uri = `/api/queries/GetUserId`;
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.sendRequest<any>('get', uri, headers, params.set('userId',id), null);
  }

  public getUserRequest(id:string): Observable<HttpResponse<any>> {
    let uri = `/api/queries/GetUserRequest`;
    let headers = new HttpHeaders();
    let params = new HttpParams().set('status', 'CREATED').set('destination','resource:org.transfer.tfg.User#'+id);
    return this.sendRequest<any>('get', uri, headers, params, null);
  }

  public getUserOperations(id:string): Observable<HttpResponse<any>> {
    let uri = `/api/queries/GetUserOperations`;
    let headers = new HttpHeaders();
    let params = new HttpParams().set('user','resource:org.transfer.tfg.User#'+id);
    return this.sendRequest<any>('get', uri, headers, params, null);
  }

  public getUserCreditCard(id:string): Observable<HttpResponse<any>> {
    let uri = `/api/queries/GetUserCreditCard`;
    let headers = new HttpHeaders();
    let params = new HttpParams().set('owner','resource:org.transfer.tfg.User#'+id);
    return this.sendRequest<any>('get', uri, headers, params, null);
  }

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