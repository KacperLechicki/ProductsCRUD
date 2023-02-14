import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  actionButton: string = 'Save';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: APIService,
    @Inject(MAT_DIALOG_DATA)
    public editData: any,
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

    if (this.editData) {
      this.actionButton = 'Update';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['condition'].setValue(this.editData.condition);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }

  addProduct(): void {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.addProductSubscription = this.apiService
          .postProduct(this.productForm.value)
          .subscribe({
            next: () => {
              alert('Product added succesfully!');
              this.productForm.reset();
              this.dialogRef.close('save');
            },
            error: () => {
              alert('Error while adding the product...');
            },
          });
      } else {
        if (this.productForm.controls['productName'].value === '') {
          this.productForm.controls['productName'].markAsTouched();
        } else if (this.productForm.controls['category'].value == '') {
          this.productForm.controls['category'].markAsTouched();
        } else if (this.productForm.controls['date'].value == '') {
          this.productForm.controls['date'].markAsTouched();
        } else if (this.productForm.controls['condition'].value == '') {
          this.productForm.controls['condition'].markAsTouched();
        } else if (this.productForm.controls['price'].value == '') {
          this.productForm.controls['price'].markAsTouched();
        } else if (this.productForm.controls['comment'].value == '') {
          this.productForm.controls['comment'].markAsTouched();
        }
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      this.apiService
        .putProduct(this.productForm.value, this.editData.id)
        .subscribe({
          next: (res) => {
            alert('Product updated successfully');
            this.productForm.reset();
            this.dialogRef.close('update');
          },
          error: () => {
            alert('Error while updating...');
          },
        });
    }
  }
}
