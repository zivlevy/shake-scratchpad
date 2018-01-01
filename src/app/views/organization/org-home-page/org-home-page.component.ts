import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../org.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import {OrgUser} from '../../../model/org-user';
import {LanguageService} from '../../../core/language.service';
import {AlgoliaService} from "../../../core/algolia.service";

@Component({
  selector: 'sk-org-home-page',
  templateUrl: './org-home-page.component.html',
  styleUrls: ['./org-home-page.component.scss']
})
export class OrgHomePageComponent implements OnInit, OnDestroy {
  orgName: string;
  rtl = false;
  isLoadingOrgUser = true;
  isAuthenticated = false;
  currentOrgUser: OrgUser = null;
  currentAuthenticatedUser;
  currentOrg: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  searchResults = new Array<string>();
  orgSearchKey: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orgService: OrgService,
              private lngService: LanguageService,
              private authService: AuthService,
              private algoliaService: AlgoliaService) {

  }

  ngOnInit() {

    // get current authenticatedUser
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        // console.log(user);
        this.currentAuthenticatedUser = user;
        this.isAuthenticated = user ? user.emailVerified : null;
      });

    // get user info
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe((orgUser: OrgUser) => {
        this.isLoadingOrgUser = false;
        this.currentOrgUser = orgUser;
      });

    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        this.currentOrg = org;
      });

    // get org public data
    this.orgService.getOrgPublicData$()
      .takeUntil(this.destroy$)
      .subscribe(orgData => {
        if (orgData) {
          this.orgName = orgData.orgName;
        }
      });

    // get org private data
    this.orgService.getOrgPrivateData$()
      .takeUntil(this.destroy$)
      .subscribe(orgData => {
        if (orgData) {
          this.orgSearchKey = orgData.searchKey;
        }
      });

  }

  searchClicked(searchString: string){
    // get Algolia search results
    this.algoliaService.getSearchResults(this.currentOrg, this.orgSearchKey, searchString)
      .then((res) => {
        this.searchResults = res;
        console.log('result ==', res);
      })
      .catch((err) => {
        console.log('some problem with search results', err);
      });
  }

  setLang(lng) {
    this.lngService.setLanguadge(lng);
    this.rtl = lng === 'he' ? true : false;
  }

  login() {
    const orgId = this.route.snapshot.params['id'];
    this.router.navigate([`login`], {queryParams: {returnUrl: 'org/' + orgId}});
  }

  logout() {
    const orgId = this.route.snapshot.params['id'];
    this.authService.logout();
    this.router.navigate([`org/${this.currentOrg}`]);
  }

  join() {
    this.orgService.joinToOrg();
  }

  gotoAdmin() {
    // this.router.navigate([`org/${this.currentOrg}/admin`]);
    this.router.navigate([`org/${this.currentOrg}/admin`]);
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

  uploadClicked(docName, docText, docFormattedText) {
    this.orgService.uploadDocument(docName, docText, docFormattedText);
  }
}
