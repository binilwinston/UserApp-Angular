import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, Subject } from 'rxjs';
import {  throwError } from 'rxjs';
import { userdetails } from '../Models/userdetails';
import { roles } from '../Models/roles';
import { apiresponse } from '../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  baseapi :string= 'https://localhost:7286/api/User';

  Getallusers(): Observable<userdetails[]> {
    return this.http.get<userdetails[]>(this.baseapi +'/GetAllusers');
  }


  GetUserbyId(userId: any): Observable<userdetails> {
    return this.http.get<userdetails>(this.baseapi + '/GetusersById/'+userId);
  }

  CreateUser(companydata: any): Observable<apiresponse> {
    return this.http.post<apiresponse>(this.baseapi+'/Insertusers', companydata);
     
  }
  Getallroles(): Observable<roles[]> {
    return this.http.get<roles[]>(this.baseapi +'/GetAllRoles');
  }

  UpdateUser(userId: any, companydata: any): Observable<apiresponse> {
    return this.http.put<apiresponse>(this.baseapi +  '/Updateusers', companydata);
      
  }

 

  DeactivateUser(userId: number) {
    return this.http.delete(this.baseapi + '/DeactivateUsers/'+userId);
  }
}
