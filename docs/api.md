## Rejestracja

#### POST /auth/register
```
{
  "username": "jank",
  "password": "haslo",
  "role": "user" 
}
```
Wynik: 201 Created
```
{
    "message": "Użytkownik zarejestrowany"
}
```

## Logowanie

#### POST /auth/login
```
{
  "username": "jank",
  "password": "haslo",
}
```
Wynik: token został wygenerowany

## Dodawanie nowych obiektów

#### POST /admin/courts
```
{
  "name": "hala sportowa",
  "status": "available",
  "type": "sports hall "
}
```
Wynik: 201 Created
```
{
    "name": "hala sportowa",
    "status": "available",
    "_id": "69f0c4af2e4253a48b087f2e",
    "__v": 0
}
```

