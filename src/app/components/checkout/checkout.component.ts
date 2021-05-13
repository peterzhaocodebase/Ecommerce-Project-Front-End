import { CheckoutFormService } from '../../services/checkoutform.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

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
  startMonth: number = new Date().getMonth() + 1;

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuilder: FormBuilder,
    private checkoutFormService: CheckoutFormService
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

    this.checkoutFormService.getMonthsArray(this.startMonth).subscribe(
      data => {
        this.months = data;
      }
    );

    this.checkoutFormService.getYearsArray().subscribe(
      data => {
        this.years = data;
      }
    );

    window.scrollTo(0, 0);

    this.listCountries();



  }

  handleSelectedYear() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    const currentYear: number = new Date().getFullYear();


    if (selectedYear !== currentYear) {
      this.startMonth = 1;
    } else {
      this.startMonth = new Date().getMonth() + 1;
    }

    this.checkoutFormService.getMonthsArray(this.startMonth).subscribe(
      data => {
        this.months = data;
      }
    );

  }

  getState(formGroup: string) {
    const FormGroup = this.checkoutFormGroup.get(formGroup);
    const selectedCountry: string = String(FormGroup.value.country.code);
    this.checkoutFormService.getStatesArray(selectedCountry).subscribe(
      data => {
        if (formGroup == "shippingAddress") {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }
      }
    );

  }

  // ngAfterViewChecked() {

  // }

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
        this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }

  }

  listCountries() {
    this.checkoutFormService.getCountryArray().subscribe(
      data => {
        this.countries = data;
      }
    );

  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);
  }

}
