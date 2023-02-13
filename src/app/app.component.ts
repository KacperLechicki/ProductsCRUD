import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogComponent } from './components/dialog/dialog.component';
import { APIService } from './services/api.service';

import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ProductsCRUD';
  getAllProductsSubscription!: Subscription;

  displayedColumns: string[] = [
    'productName',
    'category',
    'price',
    'comment',
    'date',
    'condition',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private apiService: APIService) {}

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        panelClass: 'dialog-panel',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'save') {
          this.getAllProducts();
        }
      });
  }

  getAllProducts() {
    this.getAllProductsSubscription = this.apiService.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error while fetching data!');
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(row: any): void {
    this.dialog
      .open(DialogComponent, {
        disableClose: true,
        data: row,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'update') {
          this.getAllProducts();
        }
      });
  }

  deleteProduct(id: number): void {
    this.apiService.deleteProduct(id).subscribe({
      next: (res) => {
        alert('Product deleted successfully');
        this.getAllProducts();
      },
      error: () => {
        alert('Error while deleting product...');
      },
    });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.getAllProductsSubscription.unsubscribe();
  }
}
