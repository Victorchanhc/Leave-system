import express from 'express'
// import expressSession from 'express-session'



declare module 'express-session' {
	interface SessionData {
		counter?: number
		user?: string
        admin?: string
        username: string
        name?: string
	}
}

export const AdminIsLoggedIn = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    if (req.session?.admin) {
        next()
    } else {
        res.redirect('/')
    }
}

export const isLoggedIn = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.user || req.session?.admin) {
        next()
	
	} else {
		res.redirect('/')
	}
}