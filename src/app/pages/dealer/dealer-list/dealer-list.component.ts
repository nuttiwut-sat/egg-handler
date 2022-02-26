import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUser } from 'src/app/models/user.model';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { CrudService } from 'src/app/services/crud.service';
import { PageControllerService } from 'src/app/services/page-controller.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dealer-list',
  templateUrl: './dealer-list.component.html',
  styleUrls: ['./dealer-list.component.scss']
})
export class DealerListComponent implements OnInit, OnDestroy {
  private unsubscribeAll: Subject<any> = new Subject();
  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  constructor(
    private auth: AuthorizeService,
    private router: Router,
    private crud: CrudService,
    private pageService: PageControllerService
  ) {}

  public searchText: string = '';
  public users: IUser[] = [];
  public filterFarms: IUser[] = [];
  public displayedColumns: string[] = ['name', 'createdAt'];
  public isAdmin: boolean = false;

  ngOnInit(): void {
    this.pageService.isMainpage$.next(true);
    this.crud
      .get<IUser[]>(`/customer/role/DEALER`)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(
        async (res: any) => {
          const resUser: IUser[] = res;

          this.users = resUser.map((user) => {
            const createdAt = moment(user.createdAt).format('YYYY/MM/DD');
            return {
              ID: user.ID,
              name: user.name,
              username: user.username,
              role: user.role,
              createdAt: createdAt,
            };
          });
          // this.isAdmin = role?.name.toUpperCase() === 'ADMIN';
          // this.users = this.isAdmin
          //   ? resUser
          //   : resUser.filter((u) => u.isEnable);
          this.filterUser();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            text: error.error.message,
          });
        },
        () => {
          this.pageService.isLoading$.next(false);
        }
      );
  }

  filterUser(): void {
    if (this.users.length > 0) {
      this.filterFarms = this.users
        .filter((user) => {
          const search = this.searchText.toLowerCase();
          return (
            // user.addressContract?.toLowerCase().includes(search) ||
            // user.email?.toLowerCase().includes(search) ||
            user.name?.toLowerCase().includes(search)
          );
        })
        .map((user) => {
          return user;
        });
    }
    console.log(this.filterFarms);
  }

  getRecord(id: string): void {
    // this.router.navigate([`user/profile/${id}`]);
  }
}
