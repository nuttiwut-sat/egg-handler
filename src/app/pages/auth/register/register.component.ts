import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { CrudService } from 'src/app/services/crud.service';
import { PageControllerService } from 'src/app/services/page-controller.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private unsubscribeAll: Subject<any> = new Subject();
  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  public name: string = '';
  public email: string = '';
  public lineID: string = '';
  public tel: string = '';
  public role: string = '';

  public isLoading: boolean = false;


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
      // this.router.navigate(['dashboard'], { replaceUrl: true });
      // this.router.navigate(['m/user'], { relativeTo: this.route });
    });
  }

  public Register(): void {
    if (
      !this.name ||
      !this.email ||
      !this.lineID ||
      !this.tel ||
      !this.role
    ) {
      Swal.fire({
        icon: 'warning',
        text: 'โปรดกรอกข้อมูลให้ครบ',
      });
      return;
    }

    this.auth
      .register(this.name, this.email, this.lineID, this.tel, this.role)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(
        () => {
          this.router.navigate(['dashboard']);
          // this.router.navigate(['m/user'], { relativeTo: this.route });
        },
        (error: { error: { message: any } }) => {
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
  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
