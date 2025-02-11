
import {Link, useLocation} from "react-router-dom";


interface AppNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    fuzzyMatchActivePath?: string
  }[]
}

export default function AppNav({items, ...props}: AppNavProps) {
  const location = useLocation();
  return (
    <ul className="menu bg-base-100 p-2 rounded-box">
    {items.map((item) => (
      <li key={item.href}>
        <Link
          key={item.href}
          to={item.href}
          className={item.fuzzyMatchActivePath ? (
            location.pathname.startsWith(item.fuzzyMatchActivePath) ? "active" : ""
          ) : (
            location.pathname === item.href ? "active" : ""
          )
           }
        >
          {item.title}
        </Link>
      </li>
    ))}
    </ul>
  );
}
