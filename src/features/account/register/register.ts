import { Component, inject, output } from '@angular/core';
import { AccountService } from '../../../core/services/accountservices';
import { RegisterCreds } from '../../../types/user';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
   private accountService = inject(AccountService);
  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;

  register() {
    this.accountService.register(this.creds).subscribe({
      next: (response) => {
        console.log(response); // 03.10.2025 - 02 - console.log membersFromHome
         // close the register form
      },
      error: (error) => console.error(error),
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
  }


}
