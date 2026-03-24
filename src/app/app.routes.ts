import { Routes } from '@angular/router';
import {Products} from './pages/products/products';
import {Login} from './pages/login/login';
import {Create} from './pages/create/create';
import { MyProducts } from './pages/my-products/my-products';
import { ProductDetail } from './pages/product-detail/product-detail';
import {Register} from './pages/register/register'

export const routes: Routes = [
    {path: 'products', component: Products},
    {path: 'products/:id', component: ProductDetail},
    {path: 'login', component: Login},
    {path: 'my-products', component: MyProducts},
    {path: 'create', component: Create},
    { path: 'register', component: Register },
    {path: '', redirectTo: 'products', pathMatch : 'full'},
    { path: '**', redirectTo: 'products' }

];
