import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {ToasterService} from '../../../core/toaster.service';
import {takeUntil} from 'rxjs/operators';
import {PapaParseService} from 'ngx-papaparse';
import {EmailService} from '../../../core/email.service';

export class InviteRecord {

  constructor(
    public displayName: string,
    public  email: string,
    public isViewer: boolean,
    public isEditor: boolean,
    public isAdmin: boolean) {

  }
}

@Component({
  selector: 'sk-org-admin-users-invite',
  templateUrl: './org-admin-users-invite.component.html',
  styleUrls: ['./org-admin-users-invite.component.scss']
})
export class OrgAdminUsersInviteComponent implements OnInit, OnDestroy {
  displayedColumns = ['displayName', 'email', 'isViewer', 'isEditor', 'isAdmin',  'Actions'];
  dataSource = new MatTableDataSource<InviteRecord>();
  advanced: boolean;

  inviteForm: FormGroup;

  invites: Array<InviteRecord>;
  orgId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private orgService: OrgService,
              private fb: FormBuilder,
              private papa: PapaParseService,
              private emailService: EmailService,
              private toaster: ToasterService) {
    this.initInvites();
    this.advanced = false;
  }


  ngOnInit() {

    this.inviteForm = this.fb.group({
        'displayName': ['', [
        ]
        ],
        'email': ['', [
          Validators.required,
          Validators.email
        ]
        ],
        'isAdmin': [false],
        'isEditor': [false],
        'isViewer': [true],

      }
    );

    this.orgService.getCurrentOrg$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgId => {
        this.orgId = orgId;
      });
  }

  get displayName() {
    return this.inviteForm.get('displayName').value;
  }

  get email() {
    return this.inviteForm.get('email').value;
  }

  get isAdmin() {
    return this.inviteForm.get('isAdmin').value;
  }

  get isEditor() {
    return this.inviteForm.get('isEditor').value;
  }

  get isViewer() {
    return this.inviteForm.get('isViewer').value;
  }

  initNewInvite() {
    this.inviteForm.controls['displayName'].setValue('');
    this.inviteForm.controls['email'].setValue('');

    this.inviteForm.controls['isAdmin'].setValue(false);
    this.inviteForm.controls['isEditor'].setValue(false);
    this.inviteForm.controls['isViewer'].setValue(true);

  }

  initInvites() {
    this.invites = [];
    this.dataSource.data = this.invites;

  }

  addInviteToTable() {
    if (this.addInviteRecord(new InviteRecord(this.displayName, this.email, this.isViewer, this.isEditor, this.isAdmin))) {
      this.dataSource.data = this.invites;

      // TODO - set to this.inviteForm.reset() once the bug is fixed by google
      this.resetForm(this.inviteForm);
      this.inviteForm.controls['isViewer'].setValue(true);
    } else {
      this.toaster.toastError('Errors Occurred');
    }

  }

  deleteInviteFromTable(emailToDelete: string) {
    const index = this.invites.indexOf(this.findInviteInTable(emailToDelete));
    this.invites.splice(index, 1);
    this.dataSource.data = this.invites;
  }

  findInviteInTable(email: string) {
    return this.invites.find( (obj) => {
      return obj.email === email;
    });
  }

  sendInvite(invite: InviteRecord) {
    return this.orgService.setOrgInvites(this.orgId, invite.displayName, invite.email, invite.isViewer, invite.isEditor, invite.isAdmin);
  }

  // manualSend() {
  //   const invite = new InviteRecord(this.displayName, this.email, this.isViewer, this.isEditor, this.isAdmin);
  //   // TODO - set to this.inviteForm.reset() once the bug is fixed by google
  //   this.resetForm(this.inviteForm);
  //   this.inviteForm.controls['isViewer'].setValue(true);
  //
  //   this.sendInvite(invite)
  //     .then(() => {
  //       this.toaster.toastSuccess('Invitation Sent');
  //     })
  //     .catch(() => {
  //       this.toaster.toastError('Invitation Rejected');
  //     });
  // }

  manualAdd() {
    const invite = new InviteRecord(this.displayName, this.email, this.isViewer, this.isEditor, this.isAdmin);
    // TODO - set to this.inviteForm.reset() once the bug is fixed by google
    this.resetForm(this.inviteForm);
    this.inviteForm.controls['isViewer'].setValue(true);

    this.sendInvite(invite)
      .then(() => {
        this.toaster.toastSuccess('Invitation in Process');
      })
      .catch(() => {
        this.toaster.toastError('Invitation Rejected');
      });
  }

   resetForm(formGroup: FormGroup) {
    let control: AbstractControl = null;
    formGroup.reset();
    formGroup.markAsUntouched();
    Object.keys(formGroup.controls).forEach((name) => {
      control = formGroup.controls[name];
      control.setErrors(null);
    });
  }

  tableInvitesSend() {
    const sendInvitesP: Array<any> = [];
    for (const invite of this.invites) {
      sendInvitesP.push(this.sendInvite(invite));
    }
    Promise.all(sendInvitesP)
      .then(() => {
        this.toaster.toastSuccess('Invitations in Process');
        this.initInvites();
        this.dataSource.data = this.invites;
      });
  }

  tableInvitesDelete() {
    this.initInvites();
    this.dataSource.data = this.invites;
  }

  stringToBoolean(string){
    switch (string.toLowerCase().trim()){
      case 'true': case 'yes': case '1': return true;
      case 'false': case 'no': case '0': case null: return false;
      default: return false;
    }
  }

  addInviteRecord(invite: InviteRecord): boolean {
    const newEmail = invite.email;

    const i = this.invites.findIndex(rec => rec.email === newEmail);
    if (i > -1) {
      return false;
    }

    this.invites.push(invite);
    return true;
  }

  processLine(line: string): boolean {
    if (line.length !== 2 && line.length !== 5) {
      return false;
    }
    const displayName = line[0].toLowerCase().trim();
    const email = line[1].toLowerCase().trim();

    if (!this.emailService.isValidEmail(email)) {
      return false;
    }

    if (line.length === 2) {
      return this.addInviteRecord( new InviteRecord(displayName, email, true, false, false));
    } else {
      const isViewer = this.stringToBoolean(line[2]);
      const isEditor = this.stringToBoolean(line[3]);
      const isAdmin = this.stringToBoolean(line[4]);

      return this.addInviteRecord(new InviteRecord(displayName, email, isViewer, isEditor, isAdmin)) ;

    }

  }

  readInvitesFromFile(event) {
    let parseErrors = 0;
    const inFile = event.target.files[0];
    this.papa.parse(inFile, {
      delimiter: ',',
      complete: results => {
        for (const result of results.data) {
          if (!this.processLine(result)) {
            parseErrors += 1;
          }
        }
        console.log(parseErrors);
        this.dataSource.data = this.invites;
        if (parseErrors > 0) {
          this.toaster.toastError('Errors Occurred');
        }
      }
    });
  }

  isViewerClicked(mail: string, event)
  {
    const i = this.invites.findIndex(rec => rec.email === mail);
    this.invites[i].isViewer = event.checked;
  }

  isEditorClicked(mail: string, event)
  {
    const i = this.invites.findIndex(rec => rec.email === mail);
    this.invites[i].isEditor = event.checked;
  }

  isAdminClicked(mail: string, event)
  {
    const i = this.invites.findIndex(rec => rec.email === mail);
    this.invites[i].isAdmin = event.checked;
  }

  advancedClick(event) {
    this.advanced = event.checked;
  }
  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
