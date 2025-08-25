import Cliente from "../models/cliente.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res) {
    const { name, lastName, email, gender, telephone, address, online, password } = req.body;

    // Validar los campos requeridos
    if (!name || !lastName || !email || !gender || !telephone || !address || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    const clienteCount = await Cliente.countDocuments();

    const emailExists = await Cliente.findOne({ email });

    if (emailExists) {
        return res.status(409).json({ error: 'El correo ya está registrado' })
    }

    try {
        const newCliente = new Cliente({
            name,
            lastName,
            email,
            gender,
            idNumber: online ? `CV-${clienteCount + 1}` : `CL-${clienteCount + 1}`,
            telephone,
            address,
            photo: `http://tu.foto.url.jpg`,
            online,
            password: bcrypt.hashSync(password, 10)
        });

        await newCliente.save();
        return res.status(201).json({ msg: 'Cliente registrado exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al registrar el cliente' })
    }
}

export async function updatePassword(req, res) {

}

export async function logIn(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    try {
        const cliente = await Cliente.findOne({ email });

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' })
        }

        const isMatch = await bcrypt.compare(password.toString(), cliente.password.toString());
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }

        const token = jwt.sign({ id: cliente._id, online: cliente.online, activeSubscription: cliente.activeSubscription, role: cliente.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return res.status(200).json({ msg: 'login exitoso', token })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Erro al iniciar sesión' }, error)
    }
}

export async function datosCliente(req, res) {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ error: 'El id es necesario' })
    }

    try {
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({ error: 'el recurso solicitado no existe' })
        }
        if (id.toString() !== req.user.id.toString()) {
            return res.status(401).json({error: 'No autorizado'})
        }
        return res.status(200).json({ msg: 'Cliente encontrado éxitosamente', cliente })
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los datos' })
    }
}