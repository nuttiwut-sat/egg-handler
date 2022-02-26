import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { CrudService } from 'src/app/services/crud.service';
import { PageControllerService } from 'src/app/services/page-controller.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.scss'],
})
export class CustomerLoginComponent implements OnInit, OnDestroy {
  private unsubscribeAll: Subject<any> = new Subject();
  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  public lineID: string = localStorage.getItem('lineID') || '';
  public username: string = localStorage.getItem('username') || '';
  public password: string = '';
  public email: string = '';
  public isLoading: boolean = false;
  public isRemember: boolean = false;

  public isBackend: boolean = false;

  constructor(
    private crud: CrudService,
    private auth: AuthorizeService,
    private route: ActivatedRoute,
    private router: Router,
    private pageService: PageControllerService
  ) {}

  ngOnInit(): void {
    this.pageService.isLoading$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res) => {
        this.isLoading = res;
      });
    this.auth.user$.pipe(takeUntil(this.unsubscribeAll)).subscribe((res) => {
      this.pageService.isLoading$.next(false);
      this.router.navigate(['dashboard'], { replaceUrl: true });
      // this.router.navigate(['m/user'], { relativeTo: this.route });
    });
  }

  public loginWithLine(): void {
    if (!this.lineID) {
      Swal.fire({
        icon: 'warning',
        text: 'โปรดกรอกข้อมูลให้ครบ',
      });
      return;
    }
    this.auth
      .loginWithLine(this.lineID)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(
        (res) => {
          this.router.navigate(['dashboard']);
          // this.router.navigate(['m/user'], { relativeTo: this.route });
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

  public login(): void {
    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'warning',
        text: 'โปรดกรอกข้อมูลให้ครบ',
      });
      return;
    }
    this.auth
      .login(this.username, this.password)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(
        (res) => {
          this.router.navigate(['dashboard']);
          // this.router.navigate(['m/user'], { relativeTo: this.route });
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

  setFocus(id: string) {
    const ele = document.getElementById(id);
    ele?.focus();
  }
}
