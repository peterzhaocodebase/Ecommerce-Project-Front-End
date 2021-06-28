import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private baseUrl = 'http://Shoponaws-env.eba-xgqguzsp.us-east-2.elasticbeanstalk.com/api/products';
  private categoryUrl = 'http://Shoponaws-env.eba-xgqguzsp.us-east-2.elasticbeanstalk.com/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  // getProductList(theCategoryId: number): Observable<Product[]>{

  //   const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

  //   return this.httpClient.get<GetResponse>(searchUrl).pipe(
  //     map(response => response._embedded.products)      // what you get from baseUrl is a big response, but what you actually need is just response._embedded.products
  //   )
  // }

  getProductListPaginate(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {

    // need to build URL based on category id, page and size 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  // searchProducts(theKeyword: string): Observable<Product[]> {

  //   // need to build URL based on the keyword 
  //   const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

  //   return this.getProducts(searchUrl);
  // }

  // private getProducts(searchUrl: string): Observable<Product[]> {
  //   return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
  //     map(response => response._embedded.products)
  //   );
  // }

  SearchProductPaginate(thePage: number,
    thePageSize: number,
    keyword: string): Observable<GetResponseProducts> {

    // need to build URL based on category id, page and size 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

}


interface GetResponse {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

interface GetResponseProducts {
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
