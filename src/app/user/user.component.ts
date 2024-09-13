import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../Shared/api.service';
import { userdetails } from '../Models/userdetails';
import { PopupComponent } from '../popup/popup.component';
import * as alertify from 'alertifyjs';
import { apiresponse } from '../Models/apiresponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  constructor(private dialog: MatDialog,private api: ApiService) { }

  userdetails!: userdetails[];
  finaldata:any;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  ngOnInit(): void {
    this.LoadCompanys();
  }
  displayColums: string[] = ["userId", "name", "email", "roles","status","action"]


  Openpopup(userId: any) {
    const _popup = this.dialog.open(PopupComponent, {
      width: '500px',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: {
        userId: userId
      }

    })
    _popup.afterClosed().subscribe(r => {
      this.LoadCompanys();
    });
  }
  
  LoadCompanys() {
    this.api.Getallusers().subscribe(response => {
      this.userdetails = response;
      this.finaldata=new MatTableDataSource<userdetails>(this.userdetails);
      this.finaldata.paginator = this.paginatior;
      this.finaldata.sort = this.sort;
    });
  }

  onSearch(searchTerm: string) {
    searchTerm = searchTerm.trim().toLowerCase();
    this.finaldata.filter = searchTerm;
    if (this.finaldata.paginator) {
      this.finaldata.paginator.firstPage();
    }
  }

 
  Filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.finaldata.filter = value;
  }


  EditCompany(userId: number) {
    this.Openpopup(userId);
  }
  
  RemoveUser(customerCode: any) {
   
    alertify.confirm("Deactivating  User", "do you want to deactivate this User?", () => {
      this.api.DeactivateUser(customerCode).subscribe(r => {
        this.LoadCompanys();
      });
    }, function () {

    })


  }
}


