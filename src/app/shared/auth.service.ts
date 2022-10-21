import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private fireauth: AngularFireAuth, private router: Router) { }

  // login method
  login(email: string, password: string){
    this.fireauth.signInWithEmailAndPassword(email, password).then((res)=>{
      localStorage.setItem('token','true');


      if(res.user?.emailVerified == true){
        this.router.navigate(['dashboard']);
      }else{
        this.router.navigate(['verify-email']);
      }
    }, err => {
      alert('ERROR: '+err.message);
      this.router.navigate(['/login']);
    })
  }

  // register method
  register(email: string, password: string){
    this.fireauth.createUserWithEmailAndPassword(email, password).then((res)=>{
      alert('Registration Success!');
      this.sendEmailForVerification(res.user);
      this.router.navigate(['/login']);
    }, err => {
      alert('ERROR: '+err.message);
      this.router.navigate(['/register']);
    })
  }

  // Sign out
  logout(){
    this.fireauth.signOut().then(()=>{
      localStorage.removeItem('token');
      alert('Log Out Success!');
      this.router.navigate(['/login']);
    }, err => {
      alert('ERROR: '+err.message);
      this.router.navigate(['/login']);
    })
  }

  // forgot password
  forgotPassword(email:string){
    this.fireauth.sendPasswordResetEmail(email).then(()=>{
      alert('Link sent to '+ email);
      this.router.navigate(['/verify-email']);
    }, err =>{
      alert('ERROR: '+err.message);
    })
  }

  // send verification email
  sendEmailForVerification(user : any){
    user.sendEmailVerification().then((res:any) => {
      this.router.navigate(['/verify-email']);
    }, (err: any) => {
      alert('Something went wrong. Not able to send mail to your email')
    })
  }
}
