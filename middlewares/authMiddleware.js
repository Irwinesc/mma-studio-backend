import jwt from 'jsonwebtoken';

export function validarToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado. Inicia sesión para continuar' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
        req.user = {
            id: decoded.id, online: decoded.online,
            activeSubscription: decoded.activeSubscription,
            role: decoded.role
        };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Sesión expirada. Por favor, inicia sesión nuevamente.' });
        }
        return res.status(401).json({ error: 'Acceso no autorizado. Inicia sesión para continuar.' });
    }
}