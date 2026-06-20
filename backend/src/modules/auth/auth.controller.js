import * as authService from './auth.service.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;
    await authService.logout(token);
    res.json({ success: true, message: 'Logout efetuado com sucesso.' });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
}
