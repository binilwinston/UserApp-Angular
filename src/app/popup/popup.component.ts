import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ApiService } from '../Shared/api.service';
import { roles } from '../Models/roles';
import { apiresponse } from '../Models/apiresponse';

export const hasNumberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const hasNumber = /\d/.test(control.value); // Checks if any digit is present
  return hasNumber ? { hasNumber: true } : null;
};

function nameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value || '';
    const hasNumber = /\d/.test(value);
    const isOnlySpaces = value.trim().length === 0;

    console.log('Value:', value, 'Has Number:', hasNumber, 'Only Spaces:', isOnlySpaces);

    if (hasNumber) {
      return { hasNumber: true };
    } else if (isOnlySpaces) {
      return { onlySpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent implements OnInit {

  editdata: any;
  addressOptions: string[] = [];  // Array to hold address options
  customerform!: FormGroup;
  

  constructor(private builder: FormBuilder, private dialog: MatDialog, private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
      //console.log('Popup Component Data:', this.data); // Debugging line
      this.customerform = this.builder.group({
        userId: [{ value: '', disabled: true }],
        name: ['', [Validators.required, nameValidator()]], // Apply custom validator here
        role: this.builder.control('', Validators.required),
        email: ['', [Validators.required, Validators.email]], // Built-in email validation
        status: ['', Validators.required]
      });

      this.loadAddressOptions();
      console.log('Popup Component Data:', this.data); // Debugging line

      if (this.data.userId != '' && this.data.userId != null) {

        this.api.GetUserbyId(this.data.userId).subscribe(response => {
          this.editdata = response;
          this.customerform.setValue({
            userId: this.editdata.userId, name: this.editdata.name,
            role: this.editdata.role,email: this.editdata.email,
            status: this.editdata.status || 'Active' 
          });
        });
      } else {
        // Set default to 'Active' if creating new
        this.customerform.controls['status'].setValue('Active');
      }
     
    }

    

    loadAddressOptions() {
      this.api.Getallroles().subscribe((roles: roles[]) => {
        this.addressOptions = roles.map(role => role.roleName);
        // Optionally, you can set a default value for the address field if needed
        if (this.editdata) {
          this.customerform.controls['role'].setValue(this.editdata.roles);
        }
      });
    }

    SaveCompany() {
      console.log('Form Values before submission:', this.customerform.value);
      if (this.customerform.valid) {
        const Editid = this.customerform.getRawValue().userId;
        if (Editid !== '' && Editid !== null) {
          this.api.UpdateUser(Editid, this.customerform.getRawValue()).subscribe((response: apiresponse) => {
            this.closepopup();
            alert(response.status); // Display status from API response
          });
        } else {
          this.api.CreateUser(this.customerform.value).subscribe((response: apiresponse) => {
            this.closepopup();
            alert(response.status); // Display status from API response
          });
        }
      }
    }
  
    closepopup() {
      this.dialog.closeAll();
    }
    

}
