import authMiddleware from "next-auth/middleware";

export default authMiddleware;

export const config = {
  matcher: ["/checkout", "/orders/:path*", "/admin/:path*"],
};

// export { default } from "next-auth/middleware";
// export const config = { matcher: ["/checkout", "/orders/:path*", "/admin/:path*"] };