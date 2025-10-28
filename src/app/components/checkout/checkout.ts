import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreditCardDate } from '../../services/credit-card-date';
import { Country } from '../../model/country';
import { State } from '../../model/state';
import { CustomValidators } from '../../model/custom-validators';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {


  //un formGroup est une collection de formControl ou d'autres formGroup
  checkoutFormGroup: FormGroup = new FormGroup({});
  totalPrice: number = 0;
  totalQuantity: number = 0;

  createCreditCardMonths: number[] = [];
  createCreditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  //formBuilder est un service qui aide à créer des formGroup et des formControl
  constructor(private formBuilder: FormBuilder, private creditCardDate: CreditCardDate, private cartService: CartService) { }

  ngOnInit(): void {
    //on definit les formulaire avec les champs necessaires avec les champs vides par defaut
    //on va definir plusieurs formulaire dans le formGroup principal checkoutFormGroup
    //formControl peut etre défini de deux manières :
    //1. new FormControl('valeur par defaut', validateurs synchrones, validateurs asynchrones)
    //2. ['valeur par defaut', validateurs synchrones, validateurs asynchrones]
    //FormControl permet de gérer la valeur et l'état de validation d'un champ de formulaire individuel
    //Validators.email ne valide pas correctement les emails (le domaine), on utilise donc Validators.pattern avec une regex
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]],
        lastName: ['',[Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]],
        city: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]]
      }),
      billingAddress: this.formBuilder.group({
        street: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]],
        city: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]], 
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]]
      }),
      creditCard: this.formBuilder.group({
        cardType: ['', Validators.required],
        nameOnCard: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]],
        cardNumber: ['', [Validators.required, Validators.pattern('[0-9]{16}')]],
        securityCode: ['', [Validators.required, Validators.pattern('[0-9]{3}')]],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    //on remplit les listes des mois et des années pour la carte de credit
    //on rajoute 1 car les mois commencent à 0 en javascript
    const startMonth: number = new Date().getMonth() + 1;
    //on subscrit aux observables pour recuperer les listes
    this.creditCardDate.getCreditCardExpiryMonths(startMonth).subscribe(months => {
      this.createCreditCardMonths = months;
    });
    this.creditCardDate.getCreditCardExpiryYears().subscribe(years => {
      this.createCreditCardYears = years;
    });
    //populate countries
    this.creditCardDate.getCountries().subscribe(countries => {
      this.countries = countries;
    });

    this.reviewCartDetails();
  } 
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(totalQuantity => this.totalQuantity = totalQuantity);
    this.cartService.totalPrice.subscribe(totalPrice => this.totalPrice = totalPrice);
  }

  //custom getters for form fields to access them easily in the HTML template
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }  
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  // Shipping Address
  get shippingStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  // Billing Address
  get billingStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  // Credit Card
  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get expirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  handleMonthsAndYears() {
    //on lit l'année selectionnée dans le formulaire
    const selectedYear: number = Number(this.checkoutFormGroup.get('creditCard')?.value.expirationYear);
    const currentYear: number = new Date().getFullYear();
    let startMonth: number;
    //si année en cours alors on commence par le mois en cours
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    //sinon on commence par le mois 1
    } else {
      startMonth = 1;
    }
    //on remplit la liste des mois en fonction de l'année selectionnée
    this.creditCardDate.getCreditCardExpiryMonths(startMonth).subscribe(months => {
      this.createCreditCardMonths = months;
    });
}

  onSubmit() {
    console.log("Handling the submit button");
    if(this.checkoutFormGroup.invalid) {
      //touching all the fields to trigger the validation messages
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }

  copyShippingAddressToBillingAddress(event: any) {
    //si on coche la case on copie l'adresse de livraison vers l'adresse de facturation
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        //bug : les états ne sont pas copiés automatiquement
        this.billingAddressStates = this.shippingAddressStates;
    } else {
      //sinon on reset le formulaire de l'adresse de facturation
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }
  getStates(formGroupName: string) {
    const theFormGroup = this.checkoutFormGroup.get(formGroupName);
    const theCountryCode = theFormGroup?.value.country.code;
    this.creditCardDate.getStates(theCountryCode).subscribe(states => {
      if(formGroupName === 'shippingAddress') {
        this.shippingAddressStates = states;
      } else {
        this.billingAddressStates = states;
      }
      if (theFormGroup) {
        theFormGroup.get('state')?.setValue(states[0]);
      }
    });

    
  }
}
