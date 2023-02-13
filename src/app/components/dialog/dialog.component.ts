import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  conditionList: string[] = ['New', 'Second Hand', 'Refurbished'];
  addProductSubscription!: Subscription;

  productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  addProduct(): void {
    if (this.productForm.valid) {
      this.addProductSubscription = this.apiService
        .postProduct(this.productForm.value)
        .subscribe({
          next: () => {
            alert('Product added succesfully!');
            this.productForm.reset();
            this.dialogRef.close();
          },
          error: () => {
            alert('Error while adding the product...');
          },
        });
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.addProductSubscription.unsubscribe();
  }
}
