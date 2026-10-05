import React, { useEffect, useState } from 'react'

const API = 'http://localhost:8080/api'

export default function App() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [customization, setCustomization] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const [p, o] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/orders`)
      ])
      if (!p.ok || !o.ok) throw new Error('Backend is not available')
      setProducts(await p.json())
      setOrders(await o.json())
      setError('')
    } catch (e) {
      setError('Could not connect to Spring Boot. Start the backend on port 8080.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function placeOrder(e) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!selected || !customerName || !phone || !address || !deliveryDate) {
      setError('Please complete all required fields and select a product.')
      return
    }

    try {
      const response = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          customerName,
          phone,
          deliveryAddress: address,
          deliveryDate,
          items: [{
            productId: selected.id,
            quantity: Number(quantity),
            customization
          }]
        })
      })
      if (!response.ok) throw new Error('Order failed')
      const order = await response.json()
      setMessage(`Order #${order.id} confirmed! Total: ₹${order.totalAmount}`)
      setSelected(null)
      setCustomization('')
      setCustomerName('')
      setPhone('')
      setAddress('')
      setDeliveryDate('')
      setQuantity(1)
      load()
    } catch {
      setError('Unable to place order. Please try again.')
    }
  }

  async function updateStatus(id, status) {
    await fetch(`${API}/orders/${id}/status?status=${status}`, {method: 'PUT'})
    load()
  }

  return (
    <div>
      <header>
        <h1>🍰 Sweet Home Bakery</h1>
        <p>Freshly baked. Carefully customized. Delivered with love.</p>
      </header>

      <main>
        {message && <div className="success">✅ {message}</div>}
        {error && <div className="error">⚠️ {error}</div>}

        <section>
          <h2>Our Products</h2>
          {loading ? <p>⏳ Loading products...</p> :
          <div className="grid">
            {products.map(p => (
              <article className="card" key={p.id}>
                <div className="cake">🍰</div>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <strong>₹{p.price}</strong>
                <button onClick={() => setSelected(p)}>Order Now</button>
              </article>
            ))}
          </div>}
        </section>

        <section className="order">
          <h2>🛒 Place Your Order</h2>
          <form onSubmit={placeOrder}>
            <select value={selected?.id || ''} onChange={e => setSelected(products.find(p => p.id === Number(e.target.value)) || null)}>
              <option value="">Select product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>)}
            </select>

            <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" />
            <input value={customization} onChange={e => setCustomization(e.target.value)} placeholder="Customization (e.g. Happy Birthday)" />
            <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Customer name *" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone *" />
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Delivery address *" />
            <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
            <button type="submit">Confirm Order</button>
          </form>

          {selected && (
            <div className="summary">
              <h3>Customization Summary</h3>
              <p><b>{selected.name}</b> × {quantity}</p>
              <p>{customization || 'No customization'}</p>
              <p className="total">Estimated Total: ₹{selected.price * Number(quantity)}</p>
            </div>
          )}
        </section>

        <section>
          <h2>👩‍🍳 Baker Order Management</h2>
          {orders.length === 0 ? <p>No orders yet.</p> :
          <div className="orders">
            {orders.map(o => (
              <div className="orderRow" key={o.id}>
                <div>
                  <b>Order #{o.id}</b> — {o.customerName}
                  <br />Total: ₹{o.totalAmount}
                  <br />Delivery: {o.deliveryDate}
                  <br />Address: {o.deliveryAddress}
                  <br />Customization: {o.items?.map(i => i.customization || 'None').join(', ')}
                </div>
                <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                  {['CONFIRMED','BAKING','READY','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'].map(s =>
                    <option key={s}>{s}</option>
                  )}
                </select>
              </div>
            ))}
          </div>}
        </section>
      </main>
    </div>
  )
}
