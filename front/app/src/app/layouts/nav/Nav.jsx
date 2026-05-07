import React from "react";
import { useLocation } from "react-router-dom";
import AdminNav from "./AdminNav";
import HostNav from "./HostNav";
import UserNav from "./UserNav";

function Nav() {
	const location = useLocation();
	const path = location.pathname;

	if (path.startsWith("/admin")) return <AdminNav />;
	if (path.startsWith("/host")) return <HostNav />;
	if (path.startsWith("/user")) return <UserNav />;

	return <UserNav />;
}

export default Nav;
