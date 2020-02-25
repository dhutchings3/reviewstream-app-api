# Reviewstream API

Reviewstream API is a RESTful API that was built to control interactions between the front end Reviewstream app and the database.

## Live Site

https://reviewstream-app.now.sh/

## Technology Used

Reviewstream API was built using Node, Express and Knex. The database was built using PostgreSQL

## Client Repo
https://github.com/dhutchings3/reviewstream-app

![image](https://github.com/dhutchings3/reviewstream-app-api/blob/master/app.png)

# Using this API

## Add User
Adds user to database

## URL
```javascript
/api/users
```
* Method
```
POST
```
* Body Params\
  User name\
  First name\
  Password

* Success Response\
  Code: 201

* Error Response\
  Code: 400

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/users`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  ```

***

## Login
Authenticates user login credentials

## URL
```javascript
/api/auth/login
```
* Method
```
POST
```
* Body Params\
  User name\
  Password

* Success Response\
  Code: 200\
  Content:
  ```
  {
    authToken: 'authToken',
    userId: 'userId'
  }
  ```

* Error Response\
  Code: 400

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ user_name, password }),
  })
  ```

***

## URL
```javascript
/api/reviews
```
* Method
```
POST
```
* Body Params
  user_id\
    show_name\
    season\
    streaming_service\
    review\
    rating

* Success Response\
  Code: 201\
  Content:
  ```
  {
    newReview: 'newReview'
  }
  ```

* Error Response\
  Code: 400

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/reviews`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `bearer ${TokenService.getAuthToken()}`
    },
    body: JSON.stringify(newReview)
  })
  ```

***

## URL
```javascript
/api/reviews/user/:user_id
```
* Method
```
GET
```
* Body Params\
  user_id

* Success Response\
  Code: 200

* Error Response\
  Code: 404

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/reviews/user/${user_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res =>
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res.json()
    )
  }
  ```

***

## URL
```javascript
/api/reviews/:review_id
```
* Method
```
GET
```

* URL Params\
  ```
  review_id=[review_id]
  ```

* Body Params\
  review_id

* Success Response\
  Code: 200

* Error Response\
  Code: 404\
  Content:
  ```
  {
    error: `Review does not exist`
  }
  ```

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/reviews/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `bearer ${TokenService.getAuthToken()}`
    }
  })
    .then(res =>
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res.json()
    )
  }
  ```

***

## URL
```javascript
/api/reviews/:review_id
```
* Method
```
PATCH
```

* URL Params\
  ```
  reivew_id=[review_id]
  ```

* Body Params\
    user_id\
    show_name\
    season\
    streaming_service\
    review\
    rating

* Success Response\
  Code: 204

* Error Response\
  Code: 400\
  Content:
  ```
  {
    error: `Body must contain updated content`
  }
  ```

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/reviews/${id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      'Authorization': `bearer ${TokenService.getAuthToken()}`
    },
    body: JSON.stringify(updatedReview)
  })
    .then(res =>
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res
    )
  }
  ```

***

## URL
```javascript
/api/reviews/:review_id
```
* Method
```
DELETE
```

* URL Params\
  ```
  review_id=[review_id]
  ```

* Body Params\
  None

* Success Response\
  Code: 204

* Error Response\
  Code: 404\

* Sample Call
  ```javascript
  fetch(`${config.API_ENDPOINT}/reviews/${id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'Authorization': `bearer ${TokenService.getAuthToken()}`
    }
  })
    .then(res =>
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res
    )
  }
  ```
