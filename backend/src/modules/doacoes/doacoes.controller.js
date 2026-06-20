import * as doacoesService from './doacoes.service.js';

export async function getDonations(req, res, next) {
  try {
    const { status, dateFrom, dateTo, page, pageSize } = req.query;
    const result = await doacoesService.getDonations({ status, dateFrom, dateTo, page, pageSize });
    res.json({ success: true, data: result.data, count: result.count });
  } catch (error) {
    next(error);
  }
}

export async function getDonationsTotalByPeriod(req, res, next) {
  try {
    const { dateFrom, dateTo } = req.query;
    const total = await doacoesService.getDonationsTotalByPeriod(dateFrom, dateTo);
    res.json({ success: true, total });
  } catch (error) {
    next(error);
  }
}

export async function deleteDonation(req, res, next) {
  try {
    const { id } = req.params;
    await doacoesService.deleteDonation(id);
    res.json({ success: true, message: 'Doação eliminada com sucesso.' });
  } catch (error) {
    next(error);
  }
}

export async function updateDonationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await doacoesService.updateDonationStatus(id, status);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function submitDonation(req, res, next) {
  try {
    const data = await doacoesService.submitDonation(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
