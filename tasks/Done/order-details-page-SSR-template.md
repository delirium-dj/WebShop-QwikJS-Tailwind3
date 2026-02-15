# Order Details Page - SSR Template (Reference)

**Status:** Implemented in `src/routes/account/orders/[id]/index.tsx`

The route uses a client-side implementation with `getOrderById` from the orders service,
which integrates with the existing order.types and OrderStatusBadge components.

This template (original `tasks/order-details-page.tsx`) showed an alternative SSR approach
using `routeLoader$` + `getSupabaseServerClient` with the STEP8 DB schema (snake_case, total_amount).
It was archived as the production route uses the orders.service pattern for consistency.
