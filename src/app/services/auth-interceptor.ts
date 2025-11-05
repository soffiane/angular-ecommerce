import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    //on va generer un token pour ce endpoint securisé
    const securedEndpoints = ['http://localhost:8080/api/orders'];

    if (securedEndpoints.some((url) => request.urlWithParams.includes(url))) {
      //on genere le token et on l'ajoute dans le header
      await this.auth.getAccessTokenSilently().forEach((token) => {
        console.log('Access Token: ', token);
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      });
    }
    //return awaits permet de convertir un Observable en un Promise
    //c'est asynchrone donc on utilise await
    //await permet d'attendre la resolution de la promesse
    return await lastValueFrom(next.handle(request));
  }
  
}
