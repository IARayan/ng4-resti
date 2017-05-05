# ng4-resti

## Installation

To install this library, run:

```bash
$ npm install ng4-resti --save
```

## Setup

Add the RestiService to the list of the providers of your AngularModule
```typescript
// Import RestiService
import { RestiService } from 'ng4-resti';

@NgModule({
  ...
  // Specify RestiService as a provider
  providers: [RestiService],
  ...
})
export class AppModule { }
```
## Usage

Using in a service

```typescript
import {RestiService} from 'ng4-resti';
@Injectable()
export class ApiService {
  constructor(private api: RestiService) {
  }
 }
```

Sending a GET request
```typescript
getUsers(){
    this.api.get('/users')  // request URL is /users
    .send()                 // sends the request
    .subscribe(res=>console.log(res)); // subscribe to the result
}
```
Sending a GET request (extended example)
```typescript
getUsers(){
    this.api.get('/users')      // request URL is /users
    .query('name','islam')      // URL becomes /users?name=islam
    .query('gender','male')     // URL becomes /users?name=islam&gender=male
    .segment('/search')         // URL becomes /users/search?name=islam&gender=male
    .header('Authorization','Bearer ...')   // sets a header
    .callback(res=>console.log(res)) // callback when the request returns
    .send()                     //sends the request, no need to subscribe to the result cause we specified a callback
}
```

Sending a POST request
```typescript
getUsers(){
    this.api.post('/users')  // request URL is /users
    .send()                 // sends the request
    .subscribe(res=>console.log(res)); // subscribe to the result
}
```
Sending a POST request (extended example)
```typescript
getUsers(){
    // request URL is /users, the body is set to the provided object
    this.api.post('/users', {name:'islam',gender:'male'})
    .body({'age':'27'})      // body is now merged with the {age:'27'}
    .segment('/create')         // URL becomes /users/create
    .header('Authorization','Bearer ...')   // sets a header
    .callback(res=>console.log(res)) // callback when the request returns
    .send()                     //sends the request, no need to subscribe to the result cause we specified a callback
}
```

## License

MIT © [Islam Al-Rayan](mailto:iarayan@live.com)
