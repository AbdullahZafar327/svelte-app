<script>
  import { onMount } from 'svelte';

  let menu = [];
  let reservations = [];
  let orderForm = { name: '', items: 'Margherita', quantity: 1, notes: '' };
  let reservationForm = { name: '', date: '2026-06-10', time: '19:00', guests: 2 };
  let contactForm = { name: '', email: '', message: '' };
  let status = { order: '', reservation: '', contact: '' };

  onMount(async () => {
    await loadMenu();
    await loadReservations();
  });

  async function loadMenu() {
    const response = await fetch('/api/menu');
    menu = await response.json();
  }

  async function loadReservations() {
    const response = await fetch('/api/reservations');
    reservations = await response.json();
  }

  async function submitOrder() {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderForm),
    });
    const result = await response.json();
    status.order = result.success ? `Order received for ${result.order.name}.` : 'Unable to place order.';
    await loadMenu();
  }

  async function submitReservation() {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationForm),
    });
    const result = await response.json();
    status.reservation = result.success ? `Reservation booked for ${result.reservation.name}.` : 'Unable to book reservation.';
    await loadReservations();
  }

  async function submitContact() {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm),
    });
    const result = await response.json();
    status.contact = result.message || 'Thanks for reaching out.';
    contactForm = { name: '', email: '', message: '' };
  }
</script>

<svelte:head>
  <title>Slice & Spark Pizza</title>
  <meta name="description" content="A testing pizza ordering and reservation app with a real API backend." />
</svelte:head>

<main class="app-shell">
  <section class="hero-card">
    <div>
      <p class="eyebrow">Testing app for the product build</p>
      <h1>Slice & Spark Pizza</h1>
      <p class="lead">Order fresh pizzas, reserve your table, and share feedback from one sleek front end.</p>
      <div class="chip-row">
        <span>Fast ordering</span>
        <span>Easy reservations</span>
        <span>Hardcoded demo API</span>
      </div>
    </div>
    <aside class="summary-card">
      <h2>Tonight's specials</h2>
      <ul>
        <li>Margherita — classic tomato & basil</li>
        <li>Pepperoni Blaze — extra spice, extra joy</li>
        <li>Garden Glow — fresh veggie favorite</li>
      </ul>
    </aside>
  </section>

  <section class="grid two-up">
    <article class="panel">
      <h2>Menu</h2>
      <p class="muted">Built with hardcoded menu data from the backend.</p>
      <div class="menu-grid">
        {#each menu as item}
          <article class="menu-card">
            <div class="menu-top">
              <strong>{item.name}</strong>
              <span class="tag">{item.tag}</span>
            </div>
            <p>{item.description}</p>
            <strong class="price">${item.price}</strong>
          </article>
        {/each}
      </div>
    </article>

    <article class="panel">
      <h2>Place an order</h2>
      <form on:submit|preventDefault={submitOrder} class="stack">
        <label>
          Name
          <input bind:value={orderForm.name} required placeholder="Alex" />
        </label>
        <label>
          Pizza
          <select bind:value={orderForm.items}>
            {#each menu as item}
              <option value={item.name}>{item.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Quantity
          <input type="number" min="1" bind:value={orderForm.quantity} />
        </label>
        <label>
          Notes
          <textarea bind:value={orderForm.notes} rows="3" placeholder="Extra cheese, no onions..."></textarea>
        </label>
        <button type="submit">Create order</button>
      </form>
      {#if status.order}<p class="status">{status.order}</p>{/if}
    </article>
  </section>

  <section class="grid two-up">
    <article class="panel">
      <h2>Reservations</h2>
      <form on:submit|preventDefault={submitReservation} class="stack">
        <label>
          Guest name
          <input bind:value={reservationForm.name} required placeholder="Jordan" />
        </label>
        <label>
          Date
          <input type="date" bind:value={reservationForm.date} />
        </label>
        <label>
          Time
          <input type="time" bind:value={reservationForm.time} />
        </label>
        <label>
          Guests
          <input type="number" min="1" bind:value={reservationForm.guests} />
        </label>
        <button type="submit">Book reservation</button>
      </form>
      {#if status.reservation}<p class="status">{status.reservation}</p>{/if}
    </article>

    <article class="panel">
      <h2>Current reservations</h2>
      <p class="muted">Demo data returned from the backend.</p>
      <ul class="reservation-list">
        {#each reservations as item}
          <li>
            <strong>{item.name}</strong>
            <span>{item.date} • {item.time}</span>
            <small>{item.guests} guests • {item.status}</small>
          </li>
        {/each}
      </ul>
    </article>
  </section>

  <section class="panel contact-card">
    <h2>Contact us</h2>
    <p class="muted">Share feature requests or testing notes for the product team.</p>
    <form on:submit|preventDefault={submitContact} class="stack contact-grid">
      <label>
        Name
        <input bind:value={contactForm.name} required placeholder="Taylor" />
      </label>
      <label>
        Email
        <input type="email" bind:value={contactForm.email} required placeholder="taylor@example.com" />
      </label>
      <label class="full-width">
        Message
        <textarea bind:value={contactForm.message} rows="4" placeholder="Tell us how the app feels for testing."></textarea>
      </label>
      <button type="submit" class="full-width">Send message</button>
    </form>
    {#if status.contact}<p class="status">{status.contact}</p>{/if}
  </section>
</main>
