import { PopulateDateService } from './../../services/populate-date.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  months: number[] = [];
  years: number[] = [];

  startMonth: number =new Date().getMonth()+1;

  constructor(private formBuilder: FormBuilder,
    private PopulateDateService: PopulateDateService
  ) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    this.PopulateDateService.getMonthsArray(this.startMonth).subscribe(
      data => {
        this.months = data;
      }
    );

    this.PopulateDateService.getYearsArray().subscribe(
      data => {
        this.years = data;
      }
    );

    window.scrollTo(0, 0);


  }

  handleSelectedYear() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    const currentYear: number = new Date().getFullYear();


    if (selectedYear !== currentYear){
      this.startMonth = 1;
    }else{
      this.startMonth = new Date().getMonth()+1;
    }

    this.PopulateDateService.getMonthsArray(this.startMonth).subscribe(
      data => {
        this.months = data;
      }
    );

  }


  // ngAfterViewChecked() {

  // }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }

  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);
  }

}
