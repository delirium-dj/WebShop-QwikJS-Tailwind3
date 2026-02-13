## Summary of Tasks for you to complete Step 7:

- [ ] Step 7.1: UI Polish - Add the Review section to the Checkout page so users can see their address and items one last time.
- [ ] Step 7.2: Logic - Implement the handlePlaceOrder function. Ensure it calls cart.actions.clearCart()! If you don't clear the cart, the user will still see items in their bag after buying them.
- [ ] Step 7.3: Database (Optional but Recommended) - If you have a orders table in Supabase, try to insert a new row containing the user_id, total_amount, and shipping_address.
- [ ] Step 7.4: Redirect - Create the Success page to give the user that "I'm done" feeling.

## Sample code for updated checkout page

```typescript
// Inside src/routes/checkout/index.tsx

// --- JUNIOR DEV EXPLANATION ---
// We added 'isSubmitting' to the state.
// When the user clicks "Place Order", we set this to true to show a loader
// and prevent them from clicking the button twice!
// -----------------------------
const state = useStore({
step: 1,
isSubmitting: false, // New: track if we are talking to the database
shipping: {
firstName: '',
lastName: '',
address: '',
city: '',
zipCode: '',
} as ShippingAddress,
});

// --- JUNIOR DEV EXPLANATION ---
// A simple helper to check if the address is filled out.
// We use this to disable the "Continue" button.
// -----------------------------
const isAddressValid = useComputed$(() => {
const s = state.shipping;
return s.firstName && s.lastName && s.address && s.city && s.zipCode;
});

const handlePlaceOrder = $(async () => {
state.isSubmitting = true;

try {
// 1. SIMULATE API CALL: In a real app, you'd send 'state.shipping'
// and 'cart.state.items' to your Supabase 'orders' table here.
await new Promise((res) => setTimeout(res, 2000));

    // 2. CLEAR CART: Very important! Use the action from your context.
    cart.actions.clearCart();

    // 3. SUCCESS: Move to a dedicated success page
    nav('/checkout/success');

} catch (error) {
console.error("Order failed", error);
state.isSubmitting = false;
}
});

// ... inside your return (JSX) ...

{/_ PHASE 1: SHIPPING FORM (Updated with validation) _/}
{state.step === 1 && (

  <div class="bg-white p-6 rounded-lg border shadow-sm">
    <h2 class="text-xl font-semibold mb-4">Shipping Address</h2>
    {/* ... your input fields ... */}
    <button
      type="button"
      onClick$={nextStep}
      disabled={!isAddressValid.value}
      class={`w-full py-3 rounded-md font-semibold text-white transition mt-4 ${
        isAddressValid.value ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
      }`}
    >
      {isAddressValid.value ? 'Continue to Payment' : 'Please fill all fields'}
    </button>
  </div>
)}

{/_ PHASE 3: PLACE ORDER (Updated with Loading state) _/}
{state.step === 2 && (

  <div class="bg-white p-6 rounded-lg border shadow-sm">
    <h2 class="text-xl font-semibold mb-4">Final Review</h2>
    <div class="mb-6 p-4 bg-gray-50 rounded text-sm">
      <p class="font-bold">Shipping to:</p>
      <p>{state.shipping.firstName} {state.shipping.lastName}</p>
      <p>{state.shipping.address}, {state.shipping.city}</p>
    </div>

    <button
      type="button"
      onClick$={handlePlaceOrder}
      disabled={state.isSubmitting}
      class="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50"
    >
      {state.isSubmitting ? 'Processing...' : `Pay & Place Order ($${subtotal.value.toFixed(2)})`}
    </button>
    {/* ... back button ... */}

  </div>
)}
```
