# Verdant Steps — Shoe Store storefront (test project)

Next.js (App Router) + TypeScript + Tailwind v4 + shadcn-style primitives + TanStack Query + zod.

## Run it

```bash
npm install
cp .env.example .env.local     # defaults to the built-in mock API
npm run dev                    # http://localhost:3000
```

Pages:

| Route      | What it does |
|------------|--------------|
| `/`        | Landing page: full-screen hero shoe photo under the translucent top bar |
| `/catalog` | Fetches `GET {API}/products`. Filter by category / **colour** / brand (kept in the URL), sort, 8 per page. Click a card to reveal the frosted **Buy** button |
| `/catalog/new` | **Add shoe** form: name, brand, category, price, colours, photo. Details go to `POST {API}/products`; the photo stays in the browser |
| `/contact` | Made-up email / phones / address / hours |
| `/cart`    | The bucket: change quantity, **Remove** a line, **Clear bucket**, or **Purchase all** (`POST {API}/orders`) |

The basket icon (top right) shows the item count and links to `/cart`. The cart is kept in
React Context and saved to localStorage (only product IDs, names and prices; no customer data).

## Switching from the mock API to the Spring Boot backend

Set `NEXT_PUBLIC_SHOP_API_URL=http://localhost:8080/api` in `.env.local`, restart `npm run dev`, and enable
CORS for `http://localhost:3000` (see the project guide). Then delete `app/api/mock/` and `mocks/`.

### Contract the backend must implement

`GET /products` → `200`

```json
[{ "id": "p-001", "name": "Midnight Court Low", "brand": "Verdant", "category": "Sneakers",
   "priceMinor": 18900, "compareAtPriceMinor": null, "currency": "EUR",
   "colors": [{ "name": "Black", "hex": "#111111" }], "imageUrl": "https://…/p-001.png", "inStock": true }]
```

`POST /products` with `{ name, brand, category, priceMinor, currency, colors }` → `201` + the created product
(`imageUrl: null`). The browser never sends the image.

`POST /orders` with `{ "lines": [{ "productId": "p-001", "quantity": 2 }] }` →
`201 { "orderId": "VS-123", "status": "pending_payment", "totalMinor": 37800, "currency": "EUR" }`.
Return `409` if an item is out of stock and `400` for invalid input. **The server computes the total**;
the client only sends IDs and quantities.

```java
public record ProductDto(String id, String name, String brand, String category,
                         long priceMinor, Long compareAtPriceMinor, String currency,
                         List<ColorDto> colors, String imageUrl, boolean inStock) {}
public record ColorDto(String name, String hex) {}

public record OrderLineRequest(@NotBlank String productId, @Min(1) @Max(10) int quantity) {}
public record CreateOrderRequest(@NotEmpty List<@Valid OrderLineRequest> lines) {}
public record OrderDto(String orderId, String status, long totalMinor, String currency) {}
```

## Where things live

```
app/(shop)/            routes only: page.tsx, catalog/, contact/, cart/
app/api/mock/          mock Shop API (products, orders), to be deleted later
features/catalog/      useProducts (TanStack Query), ProductGrid, ProductCard, ShoeImage, product.schema
features/cart/         CartContext, CartIcon, CartView, CartLineItem, usePlaceOrder, order.schema
features/contact/      ContactInfo
components/ui/         button, badge, card (shadcn primitives)
components/layouts/    StoreShell, SiteHeader (translucent bar), SiteFooter
lib/                   env (zod), api-client, format (money), cn
config/                routes, query-keys
```

## Browser-only photos

Photos added through **Add shoe** are shrunk to 800px JPEG (`features/catalog/lib/resize-image.ts`) and saved in
localStorage, keyed by the product ID the API returns (`features/catalog/lib/local-image-store.ts`). Cards and the
bucket check that store first. Other browsers and devices show the coloured placeholder instead. localStorage holds
about 5 MB, which is roughly 30–60 photos.

## Notes

- `public/hero-shoe.png` is a branded third-party product photo. That's fine for a local test, but swap it
  for your own photography before publishing anything.
- Next steps from the guide: a size picker on Buy, a server-side cart (cart-ID cookie), and Stripe test-mode checkout.
