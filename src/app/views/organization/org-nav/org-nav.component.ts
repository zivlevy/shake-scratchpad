import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/defer';
import {Org} from '../../../model/org';
import {User} from '../../../model/user';
import {LanguageService} from '../../../core/language.service';
import 'rxjs/add/operator/takeUntil';
@Component({
  selector: 'sk-org-nav',
  templateUrl: './org-nav.component.html',
  styleUrls: ['./org-nav.component.scss']
})
export class OrgNavComponent implements OnInit, OnDestroy {
  orgName: string;
  rtl = false;

  @Input() org: Org;
  @Input() user: User;


  destroy$: Subject<boolean> = new Subject<boolean>();
  returnRoute: string;
  requestName: string;
  requestEmail: string;
  queryParams;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private langService: LanguageService,
              private orgService: OrgService) {
  }

  ngOnInit() {
    this.langService.getLanguadge$()
      .takeUntil(this.destroy$)
      .subscribe(lng => {
        const matButton: HTMLElement = <HTMLElement> document.getElementsByClassName('org-name')[0];
        if (matButton != null) {
          if (lng === 'he') {
            matButton.style.fontFamily = 'Rubik';
          } else {
            matButton.style.fontFamily = 'Roboto';
          }
        }
      });


    this.returnRoute = this.router.routerState.snapshot.url;

    this.route.queryParamMap.subscribe(params => {
      this.returnRoute = params.get('returnUrl');
      if (params.get('name')) {
        this.requestName = params.get('name').replace('+', ' ');
      }
      this.requestEmail = params.get('mail');
      console.log(this.returnRoute, this.requestEmail, this.requestName);

      if (this.returnRoute) {
        if (this.requestEmail) {
          this.queryParams = {
            returnUrl: this.returnRoute,
            name: this.requestName,
            mail: this.requestEmail
          };
        } else {
          this.queryParams = {
            returnUrl: this.returnRoute
          };
        }
      }
    });
  }

  login() {
    this.router.navigate([`org/${this.org.orgId}/login`], {queryParams: this.queryParams})
      .catch(err => console.log(err));

  }

  signup() {
    this.router.navigate([`org/${this.org.orgId}/register`], {queryParams: this.queryParams})
      .catch(err => console.log(err));

  }

  join() {
    this.orgService.joinToOrg();
  }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
