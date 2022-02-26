import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CrudService, T } from './crud.service';
import { PageControllerService } from './page-controller.service';
import { catchError, map } from 'rxjs/operators';
import { IUser } from '../models/user.model';
import { ICustomer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  public isLogin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public user$: BehaviorSubject<IUser | ICustomer | null> = new BehaviorSubject<
    IUser | ICustomer | null
  >(null);
  farm$: any;

  constructor(
    private crudService: CrudService,
    private pageService: PageControllerService
  ) {}

  public login(username: string, password: string): Observable<IUser> {
    this.pageService.isLoading$.next(true);
    return this.crudService
      .post<IUser>('/auth/login', {
        username: username,
        password: password,
      })
      .pipe(
        map((res: IUser) => {
          if (res.accessToken) {
            this.setToken(res.accessToken);
          }
          this.user$.next(res);

          this.pageService.isLoading$.next(false);
          return res as IUser;
        }),
        catchError((error) => {
          this.pageService.isLoading$.next(false);
          return throwError(error);
        })
      );
  }

  public loginWithLine(lineID: string): Observable<IUser> {
    this.pageService.isLoading$.next(true);
    return this.crudService
      .post<IUser>('/auth/login', {
        lineID: lineID,
      })
      .pipe(
        map((res: IUser) => {
          if (res.accessToken) {
            this.setToken(res.accessToken);
          }
          this.user$.next(res);

          this.pageService.isLoading$.next(false);
          return res as IUser;
        }),
        catchError((error) => {
          this.pageService.isLoading$.next(false);
          return throwError(error);
        })
      );
  }

  public register(
    name: string,
    email: string,
    lineID: string,
    tel: string,
    role: string
  ): any {
    this.pageService.isLoading$.next(true);
    return this.crudService.post<IUser>('/auth/register', {
      name: name,
      email: email,
      lineID: lineID,
      tel: tel,
      role: role,
    });
  }

  public logout() {
    localStorage.removeItem('token');
    this.isLogin$.next(false);
    this.user$.next(null);
  }

  public getUserByToken(): Observable<IUser> {
    this.pageService.isLoading$.next(true);
    return this.crudService.post<IUser>('/auth/get-user-by-token').pipe(
      map((res: IUser) => {
        if (res.accessToken) {
          this.setToken(res.accessToken);
        }
        this.user$.next(res);
        this.pageService.isLoading$.next(false);
        return res as IUser;
      }),
      catchError((error) => {
        this.pageService.isLoading$.next(false);
        return throwError(error);
      })
    );
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }
}
