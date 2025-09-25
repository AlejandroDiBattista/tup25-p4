import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { path: '/alumnos', label: 'Alumnos' },
  { path: '/clases',  label: 'Clases' },
]

function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">TU</span>
          <div className="brand-copy">
            <div>Campus</div>
            <small>React Router</small>
          </div>
        </div>
        <nav className="menu">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'menu-link is-active' : 'menu-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
