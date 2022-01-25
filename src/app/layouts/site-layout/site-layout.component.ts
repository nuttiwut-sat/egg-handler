import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthorizeService } from 'src/app/services/authorize.service';
import { CrudService } from 'src/app/services/crud.service';
import { PageControllerService } from 'src/app/services/page-controller.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface MenuNode {
  name: string;
  link?: string;
  children?: MenuNode[];
}

const TREE_DATA: MenuNode[] = [
  {
    name: 'สรุปยอด',
    link: '/dashboard',
  },
  {
    name: 'ไข่ในร้าน',
    link: '/product/egg',
    children: [
      {
        name: 'ไข่ไก่',
        link: '/product/egg',
      },
      {
        name: 'ไข่อื่นๆ',
        link: '/product/egg-other',
      },
    ],
  },
  {
    name: 'แผงไข่',
    link: '/product/panel',
  },
  {
    name: 'ฟาร์ม',
    link: '/farm',
  },
  {
    name: 'ตัวแทนจำหน่าย',
    link: '/dealer',
  },
];

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss'],
})
export class SiteLayoutComponent implements OnInit, OnDestroy {
  private unsubscribeAll: Subject<any> = new Subject();

  treeControl = new NestedTreeControl<MenuNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<MenuNode>();

  constructor(
    private router: Router,
    private auth: AuthorizeService,
    private crud: CrudService,
    private location: Location,
    public pageService: PageControllerService
  ) {
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: MenuNode) =>
    !!node.children && node.children.length > 0;

  showFiller = false;
  public isMenu = false;
  public isMainPage = true;
  public isManager = false;
  public isPendingBox = false;
  public localUserId: string = '';
  public isLoading: boolean = false;

  ngOnInit(): void {
    this.pageService.isLoading$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((isLoading) => {
        setTimeout(() => {
          this.isLoading = isLoading;
        }, 10);
      });
    this.auth.user$.pipe(takeUntil(this.unsubscribeAll)).subscribe((user) => {
      this.localUserId = user?.id || '';
      // this.isManager = user?.role?.name === (role.ADMIN || role.MANAGER);
    });
    this.pageService.isMainpage$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((isMain) => {
        setTimeout(() => {
          this.isMainPage = isMain;
        }, 10);
      });
  }

  openMenu(): void {
    this.isMenu = !this.isMenu;
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['login']);
  }

  gotoback(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
