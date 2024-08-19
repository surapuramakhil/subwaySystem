import { Request, Response } from 'express';
import { CardService } from '../services/CardService';

export class CardController {
  private cardService = new CardService();

  async createOrUpdateCard(req: Request, res: Response) {
    const { number, amount } = req.body;
    const card = await this.cardService.createOrUpdateCard(number, amount);
    res.status(201).json(card);
  }
}