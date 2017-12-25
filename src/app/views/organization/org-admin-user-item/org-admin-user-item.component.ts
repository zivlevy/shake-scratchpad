import {Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {OrgUser} from '../../../model/org-user';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'sk-org-admin-user-item',
  templateUrl: './org-admin-user-item.component.html',
  styleUrls: ['./org-admin-user-item.component.scss']
})
export class OrgAdminUserItemComponent implements OnInit {
  @Input() user: OrgUser;
  @Input() currentSkUser;
  @Input() index: number;
  @Output() userChanged: EventEmitter<OrgUser> = new EventEmitter();
  @Output() userDelete: EventEmitter<string> = new EventEmitter();

  modalRef: BsModalRef;
  @ViewChild('cancel') cancelButton: ElementRef;


  constructor(private modalService: BsModalService) {
  }

  ngOnInit() {
  }

  delete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    console.log(this.cancelButton);
    this.cancelButton.nativeElement.blur();


  }
  confirm(): void {
    this.userDelete.emit(this.user.uid);
    this.modalRef.hide();
  }

  decline(): void {

    this.modalRef.hide();
  }
  isPendingSave() {
    this.userChanged.emit({...this.user, isPending: !this.user.isPending});
  }

  adminSave() {
    this.userChanged.emit({...this.user, roles: {...this.user.roles, admin: ! this.user.roles.admin}});
  }

  editorSave() {
    this.userChanged.emit({...this.user, roles: {...this.user.roles, editor: ! this.user.roles.editor}});
  }

  viewerSave() {
    this.userChanged.emit({...this.user, roles: {...this.user.roles, viewer: ! this.user.roles.viewer}});
  }

}
