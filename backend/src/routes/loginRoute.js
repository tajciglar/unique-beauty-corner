import express from 'express';

const router = express.Router();

const CODES = {
  user: 'unique2025',
  admin: 'admiN',
};

router.post('/', (req, res) => {
  const { code } = req.body;

  if (code === CODES.user) {
    return res.json({ success: true, role: 'user' });
  }

  if (code === CODES.admin) {
    return res.json({ success: true, role: 'admin' });
  }

  return res.status(401).json({ success: false, message: 'Invalid code' });
});

export default router;