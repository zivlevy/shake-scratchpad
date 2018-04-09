import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {OrgService} from '../org.service';
import {OrgDocService} from '../org-doc.service';
import {FirestoreService} from '../../../core/firestore.service';

@Component({
  selector: 'sk-org-doc-read-create',
  templateUrl: './org-doc-read-create.component.html',
  styleUrls: ['./org-doc-read-create.component.scss']
})
export class OrgDocReadCreateComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  docAckCreateForm: FormGroup;

  docAckName: string;
  docName: string;
  docId: string;
  orgId: string;

  constructor(private fb: FormBuilder,
              private firestoreService: FirestoreService,
              private orgService: OrgService,
              private orgDocService: OrgDocService,
              private router: Router) { }

  ngOnInit() {
    this.docAckCreateForm = this.fb.group({
      'name': ['', [
        Validators.required
      ]],
      'docName': [{
        value: '',
        disabled: true
      }, [
        Validators.required
      ]]
    });

    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(res => {
        this.orgId = res;
      });
  }

  docSelected(doc) {
    this.docAckName = doc.name + ' - ' + new Date().getFullYear();
    this.docName = doc.name;
    this.docId = doc.uid;
  }

  create() {
    this.orgDocService.createNewDocAck(this.orgId, {
      name: this.docAckName,
      docId: this.docId,
      docName: this.docName,
      requiredSignatures: 0,
      actualSignatures: 0,
      isActive: true,
      dateCreated: this.firestoreService.timestamp
    })
      .then(res => {
        this.router.navigate([`org/${this.orgId}/org-doc-read-ack`, res.id])
          .catch(err => console.log(err));
      });
  }

  cancel() {
    this.router.navigate([`org/${this.orgId}/org-doc-read-acks`])
      .catch(err => console.log(err));
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
