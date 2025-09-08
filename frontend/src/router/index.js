import { createRouter, createWebHistory } from 'vue-router'
import ModernLayout from '../components/layout/ModernLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    component: ModernLayout,
    children: [
      // Redirect root to dashboard
      {
        path: '',
        redirect: to => {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user) {
            return user.role === 'ADMIN' ? '/dashboard' : '/customer/dashboard';
          }
          return '/login';
        }
      },
      
      // Modern Dashboard Routes
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/admin/ModernDashboard.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Dashboard' }
      },
      
      // Legacy route redirects
      {
        path: 'admin/dashboard',
        redirect: '/dashboard'
      },
      
      // Customer Dashboard (unchanged for now)
      {
        path: 'customer/dashboard',
        name: 'CustomerDashboard',
        component: () => import('../views/customer/Dashboard.vue'),
        meta: { requiresAuth: true, role: 'CUSTOMER', title: 'Dashboard' }
      },

      // Modern Loan Management Routes
      {
        path: 'loans',
        name: 'Loans',
        component: () => import('../views/admin/loans/ModernLoanList.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Loans' }
      },
      {
        path: 'loans/active',
        name: 'ActiveLoans',
        component: () => import('../views/admin/loans/ModernLoanList.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Active Loans', filter: 'active' }
      },
      {
        path: 'loans/overdue',
        name: 'OverdueLoans',
        component: () => import('../views/admin/loans/ModernLoanList.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Overdue Loans', filter: 'overdue' }
      },
      {
        path: 'loans/completed',
        name: 'CompletedLoans',
        component: () => import('../views/admin/loans/ModernLoanList.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Completed Loans', filter: 'completed' }
      },
      {
        path: 'loans/new',
        name: 'NewLoan',
        component: () => import('../views/admin/loans/ModernLoanForm.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'New Loan' }
      },
      {
        path: 'loans/:id',
        name: 'LoanDetail',
        component: () => import('../views/admin/loans/ModernLoanForm.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Loan Details', isView: true }
      },
      {
        path: 'loans/:id/edit',
        name: 'EditLoan',
        component: () => import('../views/admin/loans/ModernLoanForm.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Edit Loan' }
      },
      {
        path: 'loans/:id/payment',
        name: 'LoanPayment',
        component: () => import('../views/admin/loans/ModernLoanForm.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Make Payment', isPayment: true }
      },

      // Modern Customer Management Routes
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('../views/admin/customers/ModernCustomerList.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Customers' }
      },
      {
        path: 'customers/new',
        name: 'NewCustomer',
        component: () => import('../views/admin/customers/ModernCustomerForm.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'New Customer' }
      },
      {
        path: 'customers/:id',
        name: 'CustomerDetail',
        component: () => import('../views/admin/customers/ModernCustomerDetail.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Customer Details' }
      },
      {
        path: 'customers/:id/edit',
        name: 'EditCustomer',
        component: () => import('../views/admin/customers/ModernCustomerForm.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Edit Customer' }
      },

      // Reports and Analytics
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('../views/admin/Reports.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Reports' }
      },
      {
        path: 'reports/financial',
        name: 'FinancialReports',
        component: () => import('../views/admin/reports/FinancialReports.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Financial Reports' }
      },
      {
        path: 'reports/performance',
        name: 'PerformanceReports',
        component: () => import('../views/admin/reports/PerformanceReports.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Performance Reports' }
      },

      // Settings
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/admin/Settings.vue'),
        meta: { requiresAuth: true, role: 'ADMIN', title: 'Settings' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true, title: 'Profile' }
      },

      // Legacy route redirects for backward compatibility
      {
        path: 'admin/customers',
        redirect: '/customers'
      },
      {
        path: 'admin/customers/:id',
        redirect: to => `/customers/${to.params.id}`
      },
      {
        path: 'admin/customers/:id/edit',
        redirect: to => `/customers/${to.params.id}/edit`
      },
      {
        path: 'admin/customers/new',
        redirect: '/customers/new'
      },

      // Legacy Pawn Ticket Routes (redirect to new loan routes)
      {
        path: 'admin/customers/:customerId/pawn-tickets/new',
        redirect: '/loans/new'
      },
      {
        path: 'admin/customers/:customerId/pawn-tickets/:ticketId',
        redirect: to => `/loans/${to.params.ticketId}`
      },
      {
        path: 'admin/customers/:customerId/pawn-tickets/:ticketId/edit',
        redirect: to => `/loans/${to.params.ticketId}/edit`
      },

      // Pawned Items → Collaterals redirect
      {
        path: 'admin/customers/:customerId/pawn-tickets/:loanId/pawned-items/new',
        redirect: to => `/loans/${to.params.loanId}?tab=collateral&action=new`
      },
      {
        path: 'admin/customers/:customerId/pawn-tickets/:loanId/pawned-items/:itemId/edit',
        redirect: to => `/loans/${to.params.loanId}?tab=collateral&action=edit&itemId=${to.params.itemId}`
      }
    ]
  },
  
  // Catch-all route for 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const isAuthenticated = !!token && !!user;

  // Handle login page
  if (to.path === '/login') {
    if (isAuthenticated) {
      if (user.role === 'ADMIN') {
        next('/dashboard');
      } else if (user.role === 'CUSTOMER') {
        next('/customer/dashboard');
      } else {
        next('/');
      }
    } else {
      next();
    }
    return;
  }

  // Handle authentication requirement
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // Handle role-based access
  if (to.meta.role && user && to.meta.role !== user.role) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'ADMIN') {
      next('/dashboard');
    } else if (user.role === 'CUSTOMER') {
      next('/customer/dashboard');
    } else {
      next('/login');
    }
    return;
  }

  next();
});

export default router