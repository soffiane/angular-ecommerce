import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditCardDate } from '../../services/credit-card-date';
import { Country } from '../../model/country';
import { State } from '../../model/state';
import { CustomValidators } from '../../model/custom-validators';
import { CartService } from '../../services/cart-service';
import { Router } from '@angular/router';
import { Order } from '../../model/order';
import { OrderItem } from '../../model/order-item';
import { Purchase } from '../../model/purchase';
import { CheckoutService } from '../../services/checkout';
import { environment } from '../../../environments/environment.development';
import { PaymentInfo } from '../../model/payment-info';

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

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = '';

  isDisabled: boolean = false;

  //formBuilder est un service qui aide à créer des formGroup et des formControl
  constructor(private formBuilder: FormBuilder, private creditCardDate: CreditCardDate, private cartService: CartService, private checkoutService: CheckoutService, private route: Router) { }

  ngOnInit(): void {
    //setup Stripe payment form
    this.setupStripePaymentForm();
    //on definit les formulaire avec les champs necessaires avec les champs vides par defaut
    //on va definir plusieurs formulaire dans le formGroup principal checkoutFormGroup
    //formControl peut etre défini de deux manières :
    //1. new FormControl('valeur par defaut', validateurs synchrones, validateurs asynchrones)
    //2. ['valeur par defaut', validateurs synchrones, validateurs asynchrones]
    //FormControl permet de gérer la valeur et l'état de validation d'un champ de formulaire individuel
    //Validators.email ne valide pas correctement les emails (le domaine), on utilise donc Validators.pattern avec une regex
    const theEmail = JSON.parse(sessionStorage.getItem('userEmail')!);
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]],
        lastName: ['', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]],
        email: [theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
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
      })
    });
    //populate countries
    this.creditCardDate.getCountries().subscribe(countries => {
      this.countries = countries;
    });

    this.reviewCartDetails();
  }

  setupStripePaymentForm() {
    //get a handle to stripe element
    var elements = this.stripe.elements();
    //create a card element... and hide the zipcode field
    this.cardElement = elements.create('card', { hidePostalCode: true });
    //add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');//<div id ="card-element"></div> in checkout.html
    //add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      //get a handle to the display error div
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    }); 
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


  onSubmit() {
    console.log("Handling the submit button");
    if (this.checkoutFormGroup.invalid) {
      //touching all the fields to trigger the validation messages
      this.checkoutFormGroup.markAllAsTouched();
      return;
    } else {
      //si le formulaire est valide on passe à la suite (traitement du paiement)
      //setup order
      let order = new Order(this.totalPrice, this.totalQuantity);
      //get cart items
      const cartItems = this.cartService.cartItems;
      //create orderitem from caritems
      let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
      //setup purchase and populate purchase - customer, shipping address, billing address, order and order items
      let purchase = new Purchase();
      //controls permet d'accéder aux formGroup enfants
      purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
      //on doit convertir les objets state et country en string (leur nom) avant de les envoyer au backend
      const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
      const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
      purchase.shippingAddress.state = shippingState.name;
      purchase.shippingAddress.country = shippingCountry.name;

      purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
      const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
      const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
      purchase.billingAddress.state = billingState.name;
      purchase.billingAddress.country = billingCountry.name;

      purchase.customer = this.checkoutFormGroup.controls['customer'].value;
      purchase.order = order;
      purchase.orderItems = orderItems;

      //en Javascript les nombres à virgule flottante ne sont pas précis à 100%
      //pour éviter les erreurs d'arrondis on convertit le montant en centimes
      //number represente un float,il n'y a pas de type int en javascript
      //sans le math.round on peut avoir des erreurs du type 5000.00000001 ou 4999.9999999
      this.paymentInfo.amount = Math.round(this.totalPrice * 100);
      this.paymentInfo.currency = "USD";
      this.paymentInfo.receiptEmail = purchase.customer.email;
      this.isDisabled = true;

      //if valid form then
      //- create payment intent
      // - confirm card payment
      // - place order
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse: any) => { 
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                email: purchase.customer.email,
                name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                address : {
                  line1: purchase.billingAddress.street,
                  city: purchase.billingAddress.city,
                  state: purchase.billingAddress.state,
                  postal_code: purchase.billingAddress.zipCode,
                  country: billingCountry.code
                }
              }
            } , 
          },{handleActions: false}).then((result: any) => {
            if (result.error) {
              //payment failed
              alert(`There was an error: ${result.error.message}`);
              this.isDisabled = false;
            } else {
              //payment succeeded
              this.checkoutService.placeOrder(purchase).subscribe({
                //next est la fonction qui sera appelée en cas de succès
                next: (response: any) => {  
                  alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                  //reset cart
                  this.cartService.resetCart();
                  //redirect to products page
                  this.route.navigateByUrl("/products");
                  this.isDisabled = false;
                },
                error: (err: any) => {
                  alert(`There was an error: ${err.message}`);  
                  this.isDisabled = false;
                } 
              })
            }
          });
        }    
      );    
    }
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
      if (formGroupName === 'shippingAddress') {
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
