import Cliente from '../models/cliente.js';

export async function verifySubscription(req, res) {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ msg: 'El id de usuario es necesario' })
    }

    try {
        const cliente = await Cliente.findById(userId);
        if (!cliente) {
            return res.status(404).json({ msg: 'El cliente no existe' })
        }

        const { activeSubscription } = cliente;

        return res.status(200).json({ msg: 'Cliente encontrado', activeSubscription })

    } catch (error) {
        console.log(error)
    }

}

export async function createSubscription(req, res) {
    const { userId } = req.params;
    const { subscription, period } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'Falta el ID del cliente' })
    }

    if (!subscription) {
        return res.status(400).json({ error: 'Falta el tipo de suscripción' })
    }

    if (![1, 3, 6, 12].includes(period)) {  // Verifica que el periodo sea uno de los valores válidos
        return res.status(400).json({ error: 'El período de suscripción debe ser 1, 3, 6 o 12 meses' });
    }

    try {
        const cliente = await Cliente.findById(userId);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' })
        }

        cliente.subscription = subscription;
        cliente.activeSubscription = true;
        cliente.subscriptionStartDate = new Date();

        // Calcula la fecha de finalización de la suscripción
        const subscriptionEndDate = new Date(cliente.subscriptionStartDate);
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + period);

        // Verifica si el cálculo de fecha causa un desbordamiento de mes
        if (subscriptionEndDate.getDate() !== cliente.subscriptionStartDate.getDate()) {
            // Si la fecha de fin no tiene el mismo día que la de inicio, ajusta
            subscriptionEndDate.setDate(0); // Esto establece el último día del mes
        }

        cliente.subscriptionEndDate = subscriptionEndDate;

        await cliente.save();
        return res.status(200).json({ msg: 'Suscripción activada exitosamente' })

    } catch (error) {
        return res.status(500).json({ error: 'Error al activar la suscripción' })
    }

}

export async function cleanExpiredSubscriptions(req, res) {
    const {role} = req.user;
    if(role.toString() != 'admin') {
        return res.status(403).json({msg: 'No tienes permiso para acceder a este recurso' })
    }
    
    try {
        const today = new Date();
        const clientes = await Cliente.updateMany(
            { subscriptionEndDate: { $lt: today } },
            {
                $set: {
                    activeSubscription: false,
                    subscription: null,
                    subscriptionStartDate: null,
                    subscriptionEndDate: null
                }
            }
        );

        if (clientes.modifiedCount === 0) {
            return res.status(200).json({ msg: 'No hay suscripciones vencidas por limpiar' });
        }

        return res.status(200).json({
            msg: `Se cancelaron ${clientes.modifiedCount} suscripciones vencidas`
        });

    } catch (error) {
        return res.status(500).json({ msg: 'Error al cancelar suscripciones vencidas' })
    }
}