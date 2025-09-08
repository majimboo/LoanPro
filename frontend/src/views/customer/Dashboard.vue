<template>
  <div class="container is-fluid">
    <h1 class="title">Customer Dashboard</h1>
    <p>Welcome, Customer! Here's a summary of your pawn tickets.</p>

    <div class="box">
      <h2 class="title is-5">Your Active Tickets</h2>
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Ticket #</th>
            <th>Issue Date</th>
            <th>Maturity Date</th>
            <th>Principal</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CT-001</td>
            <td>2025-08-01</td>
            <td>2025-09-01</td>
            <td>PHP 10,000.00</td>
            <td><span class="tag is-warning">DUE SOON</span></td>
            <td>
              <router-link to="/customer/tickets/1" class="button is-small is-info">View Details</router-link>
            </td>
          </tr>
          <tr>
            <td>CT-002</td>
            <td>2025-09-01</td>
            <td>2025-10-01</td>
            <td>PHP 5,000.00</td>
            <td><span class="tag is-success">ACTIVE</span></td>
            <td>
              <router-link to="/customer/tickets/2" class="button is-small is-info">View Details</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerDashboard'
}
</script>

