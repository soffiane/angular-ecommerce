import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { CreditCardDate } from '../../services/credit-card-date';
import { Country } from '../../model/country';
import { State } from '../../model/state';

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
  constructor(private formBuilder: FormBuilder, private creditCardDate: CreditCardDate) { }

  ngOnInit(): void {
    //on definit les formulaire avec les champs necessaires avec les champs vides par defaut
    //on va definir plusieurs formulaire dans le formGroup principal checkoutFormGroup
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
  } 

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
