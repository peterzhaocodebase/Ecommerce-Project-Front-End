import { OrderItem } from './../../common/order-item';
import { CartItem } from './../../common/cart-item';
import { Router } from '@angular/router';
import { CheckoutService } from './../../services/checkout.service';
import { CheckoutFormService } from '../../services/checkoutform.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FieldValidators } from 'src/app/validators/field-validators';
import { CartService } from 'src/app/services/cart.service';
import { Order } from 'src/app/common/order';
import { Purchase } from 'src/app/common/purchase';

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

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
    private cartService: CartService,
    private checkoutFormService: CheckoutFormService,
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit(): void {

    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));
    const firstName = JSON.parse(this.storage.getItem('userFirstName'));
    const lastName = JSON.parse(this.storage.getItem('userLastName'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl(firstName, [Validators.required, Validators.minLength(2), FieldValidators.notOnlyWhitespace]),
        lastName: new FormControl(lastName, [Validators.required, Validators.minLength(2), FieldValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), FieldValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), FieldValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FieldValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), FieldValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), FieldValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FieldValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), FieldValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
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

    this.updateCartStatus();

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

    const selectedCountryCode = FormGroup.value.country.code;
    const selectedcountryName = FormGroup.value.country.name;
    console.log(`${formGroup} country code: ${selectedCountryCode}`);
    console.log(`${formGroup} country name: ${selectedcountryName}`);

    this.checkoutFormService.getStatesArray(selectedCountryCode).subscribe(
      data => {
        if (formGroup == "shippingAddress") {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }
        // select the first item by default
        FormGroup.get('state').setValue(data[0]);
      }
    );
  }

  // getter method to access form control
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }

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

  updateCartStatus() {

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }



  onSubmit() {
    
     if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return
    }

    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);
    console.log(this.checkoutFormGroup.get('shippingAddress').value);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);

  
    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    
    // get cartItem
    const cartItems = this.cartService.cartItems;
    
    // create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(temItem =>new OrderItem(temItem));
  
    // set up purchase
    let purchase = new Purchase();

    // populate purchase -- customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase -- shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
   
    // way 1
    purchase.shippingAddress.state = this.checkoutFormGroup.controls['shippingAddress'].value.state.name;
    purchase.shippingAddress.country = this.checkoutFormGroup.controls['shippingAddress'].value.country.name;
   
    // way 2
    // purchase.shippingAddress.state = this.checkoutFormGroup.get('shippingAddress').value.state.name;
    // purchase.shippingAddress.country = this.checkoutFormGroup.get('shippingAddress').value.country.name;
   
    // way 3
    // const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    // const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    // purchase.shippingAddress.state = shippingState.name;
    // purchase.shippingAddress.country = shippingCountry.name;


    // populate purchase -- billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase  -- order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService;
    this.checkoutService.placeOrder(purchase).subscribe({
        next:response =>{
          alert(`Your order has been received. \nYour order tracking number: ${response.orderTrackingNumber}`)
        
          // reset cart
          this.resetCart();
        },

        error:err =>{
          alert(`There was an error${err.message}`);
        }
      }
    )
    
  }

  resetCart(){
    // reset cart data
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
     
    //reset the form
    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");
  }


}
