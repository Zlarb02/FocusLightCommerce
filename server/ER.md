 ```mermaid
erDiagram
products ||--o{ product_variations : "1-n"
customers ||--o{ orders : "1-n"
orders ||--o{ order_items : "1-n"
product_variations ||--o{ order_items : "1-n (via variation)"
media {
int id PK
text filename
text path
text type
int size
timestamp created_at
}
products {
int id PK
text name
text description
real price
}
product_variations {
int id PK
int product_id FK
text variation_type
text variation_value
real price
int stock
text image_url
}
customers {
int id PK
text first_name
text last_name
text email
text phone
text address
text city
text postal_code
text country
}
orders {
int id PK
int customer_id FK
real total_amount
text status
timestamp created_at
}
order_items {
int id PK
int order_id FK
int product_id FK
int quantity
real price
}
users {
int id PK
text username
text password
boolean is_admin
}
site_settings {
int id PK
text key
text value
timestamp updated_at
}
site_versions {
int id PK
text shop_mode
text theme_decoration
boolean is_active
timestamp created_at
timestamp updated_at
}
``` 
