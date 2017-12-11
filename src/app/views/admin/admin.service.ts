import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AuthService} from '../../core/auth.service';

@Injectable()
export class AdminService {

  constructor(private authService: AuthService,
              private afs: AngularFirestore,
              private  afAuth: AngularFireAuth,
              private router: Router) { }

}
