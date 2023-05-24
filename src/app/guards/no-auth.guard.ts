import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  
  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService

  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.firebaseSvc.getAuthState().pipe(map(auth => {
        if(!auth) {
          return true
        } else {
          this.utilsSvc.routerLink('/tabs/home')
          return false
        }
    }))
  }
}