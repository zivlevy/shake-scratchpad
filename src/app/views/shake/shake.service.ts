import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection , AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Organization} from '../../model/organization';

@Injectable()

export class ShakeService {
    organiztionCollection: AngularFirestoreCollection<Organization>;
    organizations$: Observable<Organization[]>;

    constructor(private afs: AngularFirestore) {
    }

    getOrganizations$() {
        this.organiztionCollection = this.afs.collection('org');
        return this.organizations$ = this.organiztionCollection.valueChanges();
    }

    addOrganization() {

    }

    removeOrganization() {

    }

    updateOrganization() {

    }

}
