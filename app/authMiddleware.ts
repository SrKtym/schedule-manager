import { Hono } from "hono";
import { getSession } from "@/lib/fetch";
import { createMiddleware } from "hono/factory";
import { AuthType } from "@/lib/auth";


const isAuthenticated = createMiddleware<{Variables: AuthType}>(async (c, next) => {
   const session = await getSession();
 
  	if (session) {
    	c.set("user", session.user);
    	c.set("session", session.session);
    	return next();
  	} else {
        c.set("user", null);
        c.set("session", null);
        return next();
    }
});


const app = new Hono()
    .use("/", isAuthenticated, async (c) => {
        const user = c.get("user");
        
        if(user) {
            return c.redirect(c.req.raw.url);
        } else {
            return c.redirect('/sign-in');
        }
    });


export default app;