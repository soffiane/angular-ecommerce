import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../model/product';
import { ProductCategory } from '../model/product-category';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl =  environment.luv2shopApiUrl+'/products';
  private categoryUrl =  environment.luv2shopApiUrl+'/product-category';

  constructor(private httpClient: HttpClient) { }

  /**
   * RxJS for Reactive Extensions for JavaScript
   * https://rxjs.dev/guide/overview
   * RxJS is a library for composing asynchronous and event-based programs by using observable sequences.
   * It provides one core type, the Observable, satellite types (Observer, Schedulers, Subjects, etc.)
   * and operators inspired by Array.prototype methods (map, filter, reduce, etc.) to allow handling
   * asynchronous events as collections.
   * @returns an observable of product array
   */
  getProductListPaginate(theCategoryId: number,
    thePage: number,
    thePageSize: number): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }


  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl)
  }

  searchProductsPaginate(keyword: string,
    thePage: number,
    thePageSize: number): Observable<GetResponseProduct> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    console.log('Environment URL: ', environment.luv2shopApiUrl);
    return this.httpClient.get<GetResponseCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseCategories {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
