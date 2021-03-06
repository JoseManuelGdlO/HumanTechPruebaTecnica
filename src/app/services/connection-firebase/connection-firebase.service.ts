import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { LoginModel } from 'src/app/models/login-model';
import { CanActivate} from '@angular/router';
import { ErrorModel } from 'src/app/models/error-model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ConnectionFirebaseService implements CanActivate {

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,  
    public storage: Storage
  ) { }


  /**
  * 
  * Function for validate if user have permissions and
  * allow enter next page
  */
  async canActivate():Promise<boolean> {
    let response = await this.storage.get('LOGGED');

    if(response == null || !response){
      console.error('No tienes permisos para acceder a esta pantalla');
      response = false
    }

    return response;
  }

  /**
  * 
  * Function for login
  * @param LoginModel
  * @returns Model with code of succes or error
  * 
  */
  async login(loginData: LoginModel): Promise<ErrorModel>{
    try{
      let response:any = await this.ngFireAuth.signInWithEmailAndPassword(loginData.user, loginData.password);
      return {flag: false, code: response.user.xa}
    } catch (error) {
      console.error('ERROR WHEN USER TRY LOGIN', error)
      return {flag: true, code: 'Usario y/o contraseña incorrectas'}
    }
    
  }

  /**
  * 
  * Function for Sign Up in the App
  * @param LoginModel
  * @returns Model with code of succes or error
  * 
  */
  async signUp(signUpData: LoginModel): Promise<ErrorModel>{
    try{
      await this.ngFireAuth.createUserWithEmailAndPassword(signUpData.user, signUpData.password);
      return {flag: false}
    } catch (error) {
      console.error('ERROR TRY INSERT NEW USER', error);
      return {flag:true, code: 'El correo ya se encuentra registrado'};
    }
   
  }

  /**
  * 
  * Function log out of of application
  * 
  */
  SignOut() {
    return this.ngFireAuth.signOut();
  }


}
