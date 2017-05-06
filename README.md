# ng4-resti
### An eloquent library for sending Angular 4 HTTP requests
#### It's as simple as
```typescript
this.resti.get('/document')
   .query('prefer','simple')
   .callback(result=>console.log(result))
   .send();
````

## Installation

To install this library, run:

```bash
$ npm install ng4-resti --save
```

## Setup

Add the NgResti to the list of imports of your Angular4 Module
```typescript
// Import NgResti
import { NgResti } from 'ng4-resti';

@NgModule({
 ...
 // Specify NgResti as an import
 imports: [NgResti.forRoot()],
 ...
})
export class AppModule { }
```
## Usage

### Using in a service

```typescript
import {RestiService} from 'ng4-resti';
@Injectable()
export class ApiService {
 constructor(private api: RestiService) {
 }
}
```

### Sending a GET, HEAD, OPTIONS, DELETE request
```typescript
getUsers(){
   this.api.get('/users')  // request URL is /users (other available functions are .head, .options, .delete)
   .callback(res=>console.log(res)) // callback that consumes the response
   .send()                 // sends the request
}
```

### Sending a GET, HEAD, OPTIONS, DELETE request (extended example)

```typescript
getUsers(){
   this.api.get('/users')      // request URL is /users (other available functions are .head, .options, .delete)
   .query('name','islam')      // URL becomes /users?name=islam
   .query('gender','male')     // URL becomes /users?name=islam&gender=male
   .segment('/search')         // URL becomes /users/search?name=islam&gender=male
   .header('Authorization','Bearer ...')   // sets a header
   .callback(res=>console.log(res)) // callback that consumes the response
   .send()                     //sends the request
}
```

### Sending a POST, PUT, PATCH request

```typescript
addUser(){
   this.api.post('/users')  // request URL is /users (other available functions are .put, .patch)
   .callback(res=>console.log(res)) // callback that consumes the response
   .send()                 // sends the request
}
```

### Sending a POST, PUT, PATCH request (extended example)

```typescript
addUser(){
   // request URL is /users, the body is set to the provided object
   //(other available functions are .put, .patch)

   this.api.post('/users', {name:'islam',gender:'male'})
   .body({'age':'27'})      // body is now merged with the {age:'27'}
   .segment('/create')         // URL becomes /users/create
   .header('Authorization','Bearer ...')   // sets a header
   .callback(res=>console.log(res)) // callback when the request returns
   .send()                     //sends the request, no need to subscribe to the result cause we specified a callback
}
```
### Using Callbacks
#### Callbacks are the last consumers of a RestiCall if present
#### typically a callback recieves the result (This can be a Response or any if a transform is applied see below).

```typescript
sample(){
  this.api.get('/users')
  .callback((result)=> console.log(result))
  .send();
}
```

### Using Transforms
#### Transforms helps converting you Response instance before passing it to the callback if present, otherwise the result of the transform is returned

```typescript
sample(){
  this.api.get('/users')
  .transform((res: Response)=>{
    return res.json();
  })
  .callback((result)=> console.log(result))
  .send();
}
```
## License

MIT © [Islam Al-Rayan](mailto:iarayan@live.com)
